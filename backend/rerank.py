# rerank.py
import os
from sentence_transformers import CrossEncoder

# 使用較小的中文 rerank 模型，避免記憶體問題
# 可選模型：
# - "BAAI/bge-reranker-base"（較小，約 278MB）
# - "BAAI/bge-reranker-large"（較大，約 2.24GB）
# - "maidalun1020/bce-reranker-base_v1"（中文專用，較小）

MODEL_NAME = os.getenv("RERANK_MODEL", "BAAI/bge-reranker-base")
print(f"[rerank] 載入重排序模型: {MODEL_NAME}")

# 全域初始化模型（避免每次請求都重新載入）
reranker = None

def get_reranker():
    """延遲載入 reranker 模型"""
    global reranker
    if reranker is None:
        print(f"[rerank] 正在載入模型 {MODEL_NAME}...")
        # 強制使用 CPU（因為我們安裝的是 CPU 版 PyTorch）
        reranker = CrossEncoder(MODEL_NAME, device='cpu')
        print(f"[rerank] 模型載入完成")
    return reranker

def rerank_results(query, retrieved_docs):
    """
    根據 query 對 retrieved_docs 重新排序
    retrieved_docs: list of { 'content': str, 'metadata': dict, ... }
    回傳排序後的同結構列表
    """
    if not retrieved_docs:
        return []
    
    try:
        model = get_reranker()
        pairs = [(query, doc["content"]) for doc in retrieved_docs]
        
        print(f"[rerank] 重排序 {len(pairs)} 個文檔...")
        scores = model.predict(pairs)
        
        # 將分數加入原結果並排序
        for doc, score in zip(retrieved_docs, scores):
            doc["score"] = float(score)
        reranked = sorted(retrieved_docs, key=lambda x: x["score"], reverse=True)
        
        print(f"[rerank] 重排序完成，最高分: {reranked[0]['score']:.4f}")
        return reranked
        
    except Exception as e:
        print(f"[rerank] 重排序失敗: {e}")
        # 如果重排序失敗，返回原始順序
        return retrieved_docs
