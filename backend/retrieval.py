import os
from types import SimpleNamespace

from dotenv import load_dotenv
from embedding import EMBEDDING_MODEL, get_embeddings
from langchain_groq import ChatGroq
from pinecone_init import pinecone_init

load_dotenv()

PROMPT = """你是一位繁體中文知識整理助理。請根據下方資料回答使用者問題。

回答規則：
1. 使用繁體中文與 Markdown。
2. 只根據提供的資料回答，不要編造不存在的內容。
3. 如果資料不足，請清楚說明「目前資料不足以判斷」。
4. 回答要具體、條理清楚，必要時列出相關來源摘要。

參考資料：
{context}

使用者問題：
{query}
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
            meta_parts.append(f"情境：{metadata['scenario']}")

        section = [f"資料 {index}"]
        if meta_parts:
            section.append("\n".join(meta_parts))
        section.append(doc.page_content)
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
        temperature=0.1,
        max_tokens=800,
    )

    full_prompt = PROMPT.format(context=_format_context(docs), query=query)
    answer = llm.invoke(full_prompt).content

    return answer, docs
