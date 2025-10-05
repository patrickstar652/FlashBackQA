# rerank.py
from sentence_transformers import CrossEncoder

# 初始化模型（可選用 ms-marco、bge-reranker 等）
reranker = CrossEncoder("BAAI/bge-reranker-large")

def rerank_results(query, retrieved_docs):
    """
    根據 query 對 retrieved_docs 重新排序
    retrieved_docs: list of { 'content': str, 'metadata': dict, ... }
    回傳排序後的同結構列表
    """
    pairs = [(query, doc["content"]) for doc in retrieved_docs]
    scores = reranker.predict(pairs)

    # 將分數加入原結果並排序
    for doc, score in zip(retrieved_docs, scores):
        doc["score"] = float(score)
    reranked = sorted(retrieved_docs, key=lambda x: x["score"], reverse=True)

    return reranked
