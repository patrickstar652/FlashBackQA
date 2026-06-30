import os
from types import SimpleNamespace

from dotenv import load_dotenv
from embedding import EMBEDDING_MODEL, get_embeddings
from langchain_groq import ChatGroq
from pinecone_init import pinecone_init

load_dotenv()

PROMPT = """你是一個熟悉使用者過往經歷、能以自然語氣回憶的 AI 助手。
僅根據最相關的回憶回答，若內容明顯無關，請忽略。

請依以下結構輸出：

## 回答
[用 1-2 句話直接回答使用者的問題，要精準有力]

## 相關回憶

### 回憶 1：[標題]
**時間**：[日期或時間]
**人物**：[相關人物]

[回憶內容詳述]

---

### 回憶 2：[標題]
...（依此類推，有幾個回憶就列幾個）

---

## 碎碎念
[用一句話輕鬆吐槽或幽默評論，讓語氣更自然親切]

---
相關回憶資料：
{context}

使用者問題：{query}

注意事項：
1. 使用 Markdown 格式排版。
2. 語氣自然、少贅字，但要保留回憶本身的荒謬感與畫面感。
3. 不要說「根據回憶內容」或「根據提供的資料」這種制式開場。
4. 如果回憶片段有標題、日期、人物等資訊，要完整呈現。
5. 回憶內容要詳細，不要省略關鍵笑點或情緒。
6. 每個部分之間要有明確分隔（用 --- 分隔線）。
7. 碎碎念要有趣、有梗，不要太正經。
"""


def _metadata_text(metadata):
    return (
        metadata.get("text")
        or metadata.get("content")
        or metadata.get("page_content")
        or ""
    )


def _query_pinecone(query, top_k):
    index = pinecone_init()
    embeddings = get_embeddings()
    query_vector = embeddings.embed_query(query)
    results = index.query(
        vector=query_vector,
        top_k=top_k,
        include_metadata=True,
        filter={"embedding_model": {"$eq": EMBEDDING_MODEL}},
    )

    matches = getattr(results, "matches", None)
    if matches is None and isinstance(results, dict):
        matches = results.get("matches", [])

    docs = []
    for match in matches or []:
        metadata = getattr(match, "metadata", None)
        if metadata is None and isinstance(match, dict):
            metadata = match.get("metadata", {})
        metadata = metadata or {}
        docs.append(
            SimpleNamespace(
                page_content=_metadata_text(metadata),
                metadata=metadata,
            )
        )
    return docs[:top_k]


def _format_context(docs):
    context_parts = []
    for index, doc in enumerate(docs, start=1):
        metadata = doc.metadata or {}
        meta_parts = []

        if metadata.get("title"):
            meta_parts.append(f"標題：{metadata['title']}")
        if metadata.get("date"):
            meta_parts.append(f"日期：{metadata['date']}")
        if metadata.get("time"):
            meta_parts.append(f"時間：{metadata['time']}")
        if metadata.get("people"):
            people = metadata["people"]
            if isinstance(people, list):
                people = "、".join(str(person) for person in people)
            meta_parts.append(f"人物：{people}")
        if metadata.get("scenario"):
            meta_parts.append(f"場景：{metadata['scenario']}")

        section = [f"【回憶片段 {index}】"]
        if meta_parts:
            section.append("\n".join(meta_parts))
        section.append(f"內容：{doc.page_content}")
        context_parts.append("\n\n".join(section))

    return "\n\n---\n\n".join(context_parts) or "目前沒有檢索到相關資料。"


def answer_query(query: str, top_k: int = 4):
    docs = _query_pinecone(query, top_k)

    groq_api_key = os.getenv("GROQ_API_KEY")
    if not groq_api_key:
        raise RuntimeError("Missing GROQ_API_KEY in .env")

    llm = ChatGroq(
        model="llama-3.3-70b-versatile",
        groq_api_key=groq_api_key,
        temperature=0.35,
        max_tokens=1000,
    )

    full_prompt = PROMPT.format(context=_format_context(docs), query=query)
    answer = llm.invoke(full_prompt).content

    return answer, docs
