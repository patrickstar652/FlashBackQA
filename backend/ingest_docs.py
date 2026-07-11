# ingest_min.py
import re, json, hashlib, datetime
from typing import List, Tuple, Dict
from pinecone import Pinecone as PC
from embedding import EMBEDDING_MODEL, get_embeddings
from pinecone_init import pinecone_init

# 定義 INDEX_NAME
INDEX_NAME = "flashbackqa"

# --- 多筆 front-matter 解析（同你資料格式） ---
# 支援 Windows CRLF
FM_BLOCK = re.compile(r"---\s*\r?\n(.*?)\r?\n---\s*\r?\n(.*?)(?=\r?\n---\s*\r?\n|$)", re.DOTALL)

#轉成物件
def parse_yaml_like(s: str) -> Dict:
    import yaml
    return yaml.safe_load(s) or {}

# 回傳list
def parse_multi_notes(blob: str) -> List[Tuple[Dict, str]]:
    out = []
    for m in FM_BLOCK.finditer(blob.strip()):
        meta = parse_yaml_like(m.group(1).strip())
        body = m.group(2).strip()
        out.append((meta, body))
    return out

# --- 簡單中文切塊 ---
# 支援 CRLF
SPLIT = re.compile(r"[。！？!?]\s*|\r?\n+")
def chunk_zh(text: str, target_len=240, overlap=60):
    # 先分句
    sents = [s.strip() for s in SPLIT.split(text) if s.strip()]
    # 合併成 chunk
    chunks, buf = [], ""
    for s in sents:
        if len(buf) + len(s) <= target_len:
            buf = (buf + " " + s).strip()
        else:
            if buf: chunks.append(buf)
            tail = buf[-overlap:] if overlap and buf else ""
            buf = (tail + " " + s).strip()
    if buf: chunks.append(buf)
    return chunks

# 日期標準化
def norm_date(s: str | None):
    if not s or s.lower() == "none": return None
    try:
        y, m, d = [int(p) for p in s.split("-")]
        return datetime.date(y, m, d).strftime("%Y-%m-%d")
    except Exception:
        return None

def _to_float_list(vec):
    # 確保為 list[float]
    try:
        import numpy as np
        if isinstance(vec, np.ndarray):
            return vec.astype(float).tolist()
    except Exception:
        pass
    return [float(x) for x in vec]


def _note_hash(meta: Dict, body: str) -> str:
    return hashlib.md5(
        json.dumps(meta, ensure_ascii=False, sort_keys=True).encode("utf-8")
        + body.encode("utf-8")
    ).hexdigest()[:10]


def _source_id(meta: Dict) -> str:
    return str(meta.get("id") or meta.get("title") or "note")


def _stable_vector_id(source_id: str, chunk_index: int) -> str:
    source_key = hashlib.md5(source_id.encode("utf-8")).hexdigest()[:16]
    return f"{source_key}#c{chunk_index:03d}"


def _delete_existing_note_chunks(index, source_id: str):
    # Re-imports should replace a note's current chunk set instead of leaving stale
    # higher-numbered chunks behind when the edited note becomes shorter.
    return index.delete(filter={"source_id": {"$eq": source_id}})

def ingest_blob(blob: str):
    notes = parse_multi_notes(blob)
    if not notes: 
        print("[ingest_blob] ⚠️ 沒有解析到任何筆記（可能是空文件或格式不符）")
        return {"notes": 0, "upserted": 0, "stats": {}}

    print(f"[ingest_blob] 解析到 {len(notes)} 筆記")
    
    # 初始化 Pinecone
    index = pinecone_init()
    print(f"[ingest_blob] Pinecone index 已連接")
    
    # 初始化 embedding 模型
    print("[ingest_blob] 載入 embedding 模型...")
    embed = get_embeddings()
    print("[ingest_blob] Embedding 模型已準備完成")

    total_upserted = 0
    for meta, body in notes:
        note_id   = str(meta.get("id") or "")
        title     = meta.get("title")
        source_id = _source_id(meta)
        note_hash = _note_hash(meta, body)
        people    = meta.get("people") or []
        scenario  = meta.get("scenario") or None
        keywords  = meta.get("keywords") or []
        date_str  = norm_date(meta.get("date"))
        time_str  = meta.get("time") or None

        chunks = chunk_zh(body, 240, 60)
        if not chunks:
            print(f"[ingest_blob] 筆記 {note_id or title} 沒有產生任何 chunks，跳過")
            continue

        print(f"[ingest_blob] 筆記 {note_id or title}: {len(chunks)} chunks")
        
        # 一次性做 embeddings（省 API）
        print(f"[ingest_blob] 生成 {len(chunks)} 個 embeddings...")
        vectors = embed.embed_documents(chunks)
        print(f"[ingest_blob] Embeddings 完成，維度: {len(vectors[0]) if vectors else 0}")

        # 構建 Pinecone 建議格式：dict，並確保 values 為 list[float]
        upsert_vectors = []
        for i, (text, vec) in enumerate(zip(chunks, vectors)):
            vec_id = _stable_vector_id(source_id, i)
            
            # 構建 metadata，過濾掉 None 值（Pinecone 不接受 null）
            meta_out = {
                "source": source_id,
                "source_id": source_id,
                "note_hash": note_hash,
                "chunk_index": i,
                "embedding_model": EMBEDDING_MODEL,
                "lang": "zh-TW",
                "text": text
            }
            
            # 只添加非 None 的欄位
            if title:
                meta_out["title"] = title
            if people:
                meta_out["people"] = people
            if scenario:
                meta_out["scenario"] = scenario
            if keywords:
                meta_out["keywords"] = keywords
            if date_str:  # 只有當 date_str 不是 None 時才添加
                meta_out["date"] = date_str
            if time_str:  # 只有當 time_str 不是 None 時才添加
                meta_out["time"] = time_str
            
            upsert_vectors.append({
                "id": vec_id,
                "values": _to_float_list(vec),
                "metadata": meta_out
            })

        if upsert_vectors:
            print(f"[ingest_blob] 清除筆記 {source_id} 的舊 chunks...")
            _delete_existing_note_chunks(index, source_id)
            print(f"[ingest_blob] 準備 upsert {len(upsert_vectors)} 個向量...")
            try:
                # 回傳 upserted_count，便於確認實際寫入數量
                res = index.upsert(vectors=upsert_vectors)
                # Pinecone 新版回傳可能是 dict 或物件，兩種都試
                upserted = getattr(res, "upserted_count", None)
                if upserted is None and isinstance(res, dict):
                    upserted = res.get("upserted_count", 0)
                total_upserted += (upserted or 0)
                print(f"[ingest_blob] Upsert 成功: {upserted} 個向量")
            except Exception as e:
                print(f"[ingest_blob] Upsert 失敗: {e}")
                raise

    # 取 stats 便於驗證 index 狀態
    try:
        stats = index.describe_index_stats()
    except Exception as e:
        stats = {"error": str(e)}

    return {"notes": len(notes), "upserted": total_upserted, "stats": stats}


if __name__ == "__main__":
    # 讓腳本可直接執行：讀取 backend/data 下的所有 .md 檔並寫入 Pinecone
    import os, glob

    base_dir = os.path.dirname(__file__)
    data_dir = os.path.join(base_dir, "data")
    files = sorted(glob.glob(os.path.join(data_dir, "*.md")))
    if not files:
        print("[ingest] 沒有找到任何 .md 檔案於 backend/data")
    else:
        print(f"[ingest] 找到 {len(files)} 個檔案：")
        for f in files:
            print(" -", os.path.basename(f))

    # 初始化並列出索引供確認
    print("\n[ingest] 初始化 Pinecone...")
    index = pinecone_init()
    print("[ingest] Pinecone 初始化完成\n")

    # 逐檔 ingest
    total_upserted = 0
    for path in files:
        print(f"\n{'='*60}")
        print(f"處理檔案: {os.path.basename(path)}")
        print('='*60)
        with open(path, "r", encoding="utf-8") as fh:
            blob = fh.read()
        try:
            res = ingest_blob(blob)
            total_upserted += res.get("upserted", 0)
            print(f"\n✓ {os.path.basename(path)} -> upserted: {res.get('upserted')}")
        except Exception as e:
            print(f"\n✗ {os.path.basename(path)} 處理失敗: {e}")
            import traceback
            traceback.print_exc()

    # 顯示最終統計
    print(f"\n{'='*60}")
    print("最終統計")
    print('='*60)
    try:
        stats = index.describe_index_stats()
        print(f"Index 統計: {stats}")
    except Exception as e:
        print(f"讀取 Index 統計失敗: {e}")
    print(f"總 upserted: {total_upserted}")
    print("完成！")
