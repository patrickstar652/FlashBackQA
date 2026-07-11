import os
import time
from dotenv import load_dotenv
from pinecone import Pinecone, ServerlessSpec

def pinecone_init():
    load_dotenv(os.path.join(os.path.dirname(__file__), ".env"))
    api_key = os.getenv("PINECONE_API_KEY")
    if not api_key:
        raise RuntimeError("Missing PINECONE_API_KEY in .env")

    pc = Pinecone(api_key=api_key)

    index_name = "flashbackqa"
    dimension = 768  # text2vec-base-chinese 的維度
    metric = "cosine"

    # 檢查是否已存在
    existing_indexes = [ix.name for ix in pc.list_indexes().indexes]
    print(f"[pinecone_init] 現有索引: {existing_indexes}")
    
    if index_name not in existing_indexes:
        print(f"[pinecone_init] 創建新索引: {index_name}")
        pc.create_index(
            name=index_name,
            dimension=dimension,
            metric=metric,
            spec=ServerlessSpec(cloud="aws", region="us-east-1"),
        )
        
        # 等待索引準備完成
        print("[pinecone_init] 等待索引準備完成...")
        max_wait = 60  # 最多等待 60 秒
        waited = 0
        while waited < max_wait:
            try:
                index = pc.Index(index_name)
                stats = index.describe_index_stats()
                print(f"[pinecone_init] 索引已準備完成！統計: {stats}")
                break
            except Exception as e:
                print(f"[pinecone_init] 等待中... ({waited}s)")
                time.sleep(5)
                waited += 5
        
        if waited >= max_wait:
            print("[pinecone_init] 警告：索引可能尚未完全準備好")
    else:
        print(f"[pinecone_init] 使用現有索引: {index_name}")

    index = pc.Index(index_name)
    return index
