import re, json, hashlib, datetime
from typing import List, Tuple, Optional, Dict
from pathlib import Path

# 你專案內既有的工具
from embedding import get_embeddings
from pinecone_init import pinecone_init
from pinecone import Pinecone as PC

# -----------------------
# 1) 解析多筆 front-matter
# -----------------------
FM_BLOCK = re.compile(r"---\s*\n(.*?)\n---\s*\n(.*?)(?=\n---\s*\n|$)", re.DOTALL)

def parse_yaml_like(s: str) -> Dict:
    """優先用 PyYAML；若沒裝則用簡易解析 fallback。"""
    try:
        import yaml
        return yaml.safe_load(s) or {}
    except Exception:
        meta = {}
        for line in s.splitlines():
            if ":" not in line:
                continue
            k, v = line.split(":", 1)
            k = k.strip()
            v = v.strip()
            if v.startswith("[") and v.endswith("]"):
                try:
                    meta[k] = json.loads(v)  # 假設是 JSON 風格的 list
                except Exception:
                    meta[k] = [x.strip().strip('"') for x in v[1:-1].split(",") if x.strip()]
            else:
                meta[k] = v.strip().strip('"')
        return meta

def parse_multi_notes(blob: str) -> List[Tuple[Dict, str]]:
    """回傳 [(meta, body), ...]"""
    notes = []
    for m in FM_BLOCK.finditer(blob.strip()):
        fm_raw, body = m.group(1).strip(), m.group(2).strip()
        meta = parse_yaml_like(fm_raw)
        notes.append((meta, body))
    return notes

# -----------------------
# 2) 正規化與標準欄位
# -----------------------
def norm_date(s: Optional[str]) -> Optional[str]:
    if not s or s.lower() == "none":
        return None
    s = s.strip()
    try:
        # 支援 "2025-2-3" -> 2025-02-03
        parts = [int(p) for p in s.split("-")]
        if len(parts) == 3:
            y, m, d = parts
            return datetime.date(y, m, d).strftime("%Y-%m-%d")
    except Exception:
        pass
    # 失敗就返回 None（避免髒資料）
    return None

def person_id_for(name: str) -> str:
    # 這裡可以改成連資料庫的人名簿；預設 hash 產生穩定 ID
    h = hashlib.md5(name.encode("utf-8")).hexdigest()[:10]
    return f"u_{h}"

def build_tags_and_people(people: List[str]) -> Dict:
    tags = []
    pids = []
    groups = []
    for p in (people or []):
        if p in ("大家", "全體", "所有人"):
            groups.append("all")
            continue
        pid = person_id_for(p)
        pids.append(pid)
        tags.append(f"p:{pid}")
    for g in groups:
        tags.append(f"g:{g}")
    return {"tags": tags, "people_ids": pids, "groups": groups}

# -----------------------
# 3) 中文切片（簡單分句 + overlap）
# -----------------------
ZH_SENT_SPLIT = re.compile(r"[。！？!?]\s*|\n+")

def chunk_zh(text: str, target_len: int = 220, overlap: int = 50) -> List[str]:
    sents = [s.strip() for s in ZH_SENT_SPLIT.split(text) if s and s.strip()]
    out, buf = [], ""
    for s in sents:
        if len(buf) + len(s) <= target_len:
            buf = (buf + " " + s).strip()
        else:
            if buf:
                out.append(buf)
            tail = buf[-overlap:] if overlap and buf else ""
            buf = (tail + " " + s).strip()
    if buf:
        out.append(buf)
    return out

# -----------------------
# 4) 簡易敏感字偵測（可自行擴充）
# -----------------------
SENSITIVE_TERMS = [
    "嫖妓", "無套", "後門", "性交易", "毒品", "勒索"
]

def detect_sensitive(text: str) -> bool:
    t = "".join(text.split()).lower()
    for kw in SENSITIVE_TERMS:
        if kw.lower() in t:
            return True
    return False

# -----------------------
# 5) 主流程：上傳一整個 blob
# -----------------------
def ingest_blob(blob: str, audience_default: str = "RESTRICTED", lang_default: str = "zh-TW"):
    notes = parse_multi_notes(blob)
    if not notes:
        raise ValueError("未解析到任何 front-matter 區塊")

    init_pinecone()
    pc = PC()
    index = pc.Index(INDEX_NAME)
    embeddings = get_embeddings()

    total_chunks = 0
    results = []

    for meta, body in notes:
        note_id = str(meta.get("id") or "")
        title = meta.get("title")
        date_str = norm_date(meta.get("date"))
        time_str = meta.get("time") or None
        scenario = meta.get("scenario") or None
        keywords = meta.get("keywords") or []
        people = meta.get("people") or []
        
        # tags & people_ids
        ppl = build_tags_and_people(people)
        tags = ppl["tags"]
        people_ids = ppl["people_ids"]
        groups = ppl["groups"]

        # audience/lang 預設
        audience = audience_default
        lang = lang_default

        # 產生 chunk
        chunks = chunk_zh(body, target_len=220, overlap=50)

        vectors = []
        for i, text in enumerate(chunks):
            vec_id = f"{note_id}#c{i:03d}" if note_id else f"note#{hashlib.md5((title or '').encode()).hexdigest()[:6]}#c{i:03d}"
            vec = embeddings.embed_query(text)  # 也可換成 embed_documents 批次

            meta_out = {
                "audience": audience,
                "lang": lang,
                "source": note_id or title,
                "title": title,
                "date": date_str,
                "time": time_str,
                "scenario": scenario,
                "note_keywords": keywords,   # 避免跟 tags 混淆
                "people_ids": people_ids,
                "people_count": len(people_ids),
                "groups": groups,
                "tags": tags,                # 用來做 $in 過濾（p:/g:）
                "chunk_index": i,
            }

            # 敏感內容加註記（你也可選擇直接跳過不上傳）
            if detect_sensitive(text) or detect_sensitive(" ".join(keywords)):
                meta_out["moderation"] = "sensitive"

            vectors.append((vec_id, vec, meta_out))

        if vectors:
            index.upsert(vectors)
            total_chunks += len(vectors)

        results.append({
            "id": note_id,
            "title": title,
            "chunks": len(vectors),
            "people_ids": people_ids,
            "tags": tags
        })

    return {"notes": len(notes), "chunks": total_chunks, "items": results}

# -----------------------
# 6) 查詢端過濾（示意）
# -----------------------
def build_filter_for_user(user_name: str, extra_groups: Optional[List[str]] = None):
    uid = person_id_for(user_name)
    allow = [f"p:{uid}"]
    for g in (extra_groups or []):
        allow.append(f"g:{g}")
    # 允許看到公開 或 被標記到的人/群組
    return {
        "$or": [
            {"audience": {"$eq": "ALL"}},
            {"tags": {"$in": allow}}
        ]
    }
