import os
from dotenv import load_dotenv
from pinecone import Pinecone, ServerlessSpec

def pinecone_init():
    load_dotenv()
    api_key = os.getenv("PINECONE_API_KEY")  # 建議用大寫名稱
    if not api_key:
        raise RuntimeError("Missing PINECONE_API_KEY in .env")

    pc = Pinecone(api_key=api_key)

    index_name = "flashbackqa"
    dimension = 1536  # ⬅️ 確認和你的 embedding 維度一致
    metric = "cosine"

    # 檢查是否已存在
    exists = any(ix.name == index_name for ix in pc.list_indexes().indexes)
    if not exists:
        pc.create_index(
            name=index_name,
            dimension=dimension,
            metric=metric,
            spec=ServerlessSpec(cloud="aws", region="us-east-1"),
        )

    index = pc.Index(index_name)
    return index
