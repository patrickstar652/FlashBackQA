# ingest_min.py
import re, json, hashlib, datetime
from typing import List, Tuple, Dict
from pinecone import Pinecone as PC
from embedding import get_embeddings
from pinecone_init import pinecone_init

# 定義 INDEX_NAME
INDEX_NAME = "flashbackqa"

# --- 多筆 front-matter 解析（同你資料格式） ---
FM_BLOCK = re.compile(r"---\s*\n(.*?)\n---\s*\n(.*?)(?=\n---\s*\n|$)", re.DOTALL)

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
SPLIT = re.compile(r"[。！？!?]\s*|\n+")
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

def ingest_blob(blob: str):
    notes = parse_multi_notes(blob)
    if not notes: raise ValueError("沒有解析到任何筆記")
    pinecone_init()
    pc = PC(); index = pc.Index(INDEX_NAME)
    embed = get_embeddings()

    total = 0
    for meta, body in notes:
        note_id   = str(meta.get("id") or "")
        title     = meta.get("title")
        people    = meta.get("people") or []
        scenario  = meta.get("scenario") or None
        keywords  = meta.get("keywords") or []
        date_str  = norm_date(meta.get("date"))
        time_str  = meta.get("time") or None

        chunks = chunk_zh(body, 240, 60)
        # 一次性做 embeddings（省 API）
        vectors = embed.embed_documents(chunks)

        payload = []
        for i, (text, vec) in enumerate(zip(chunks, vectors)):
            vec_id = f"{note_id}#c{i:03d}" if note_id else f"note#{hashlib.md5((title or '').encode()).hexdigest()[:8]}#c{i:03d}"
            meta_out = {
                "source": note_id or title,
                "title": title,
                "people": people,           # 只是描述性欄位（非權限）
                "scenario": scenario,
                "keywords": keywords,
                "date": date_str,
                "time": time_str,
                "chunk_index": i,
                "lang": "zh-TW"
            }
            payload.append((vec_id, vec, meta_out))

        if payload:
            index.upsert(payload)
            total += len(payload)

    return {"notes": len(notes), "chunks": total}
