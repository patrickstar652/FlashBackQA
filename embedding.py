# 本地模型
from langchain_community.embeddings import HuggingFaceEmbeddings

def get_embeddings():
    """
    使用 Hugging Face 的 shibing624/text2vec-base-chinese 來生成向量
    """
    model_name = "shibing624/text2vec-base-chinese"
    embeddings = HuggingFaceEmbeddings(
        model_name=model_name,
        model_kwargs={'device': 'cuda'}  # 如果有 GPU 可以改成 'cuda'
    )
    return embeddings