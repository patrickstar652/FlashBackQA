# 本地模型
import torch
from langchain_community.embeddings import HuggingFaceEmbeddings

def get_embeddings():
    """
    使用 Hugging Face 的 shibing624/text2vec-base-chinese 來生成向量
    """
    model_name = "shibing624/text2vec-base-chinese"
    # 自動偵測是否有 GPU
    # device = 'cuda' if torch.cuda.is_available() else 'cpu'
    
    embeddings = HuggingFaceEmbeddings(
        model_name=model_name,
        model_kwargs={'device': 'cpu'}
        # model_kwargs={'device': device}
    )
    return embeddings