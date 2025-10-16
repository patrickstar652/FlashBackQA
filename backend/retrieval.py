import os
from dotenv import load_dotenv
from embedding import get_embeddings
from pinecone_init import pinecone_init
from langchain_pinecone import PineconeVectorStore
from langchain_groq import ChatGroq
from pinecone import Pinecone

# 載入環境變數
load_dotenv()

INDEX_NAME = "flashbackqa"

# 回憶檢索的提示詞模板
PROMPT = """你是一個專門幫助使用者回憶過往經歷的 AI 助手。
根據以下相關的回憶片段，回答使用者的問題：

相關回憶：
{context}

問題：{query}

請以搞笑、幽默的口吻回答，幫助使用者喚起美好的回憶。如果相關資訊不足，請誠實告知。
"""

def answer_query(query: str, top_k: int = 4, use_rerank: bool = True):
    """
    使用 LangChain 進行問答，可選擇是否使用重排序
    
    Args:
        query: 使用者查詢
        top_k: 檢索的文檔數量
        use_rerank: 是否使用重排序（預設為 True）
    
    Returns:
        answer: AI 回答
        source_docs: 來源文檔列表
    """
    # 初始化 Pinecone
    index = pinecone_init()
    embeddings = get_embeddings()
    
    # 初始化 Pinecone 客戶端
    pc = Pinecone(api_key=os.getenv("PINECONE_API_KEY"))
    pinecone_index = pc.Index(INDEX_NAME)
    
    vectorstore = PineconeVectorStore(index=pinecone_index, embedding=embeddings)
    
    # 如果使用重排序，先檢索更多文檔
    retrieve_k = top_k * 3 if use_rerank else top_k
    retriever = vectorstore.as_retriever(search_kwargs={"k": retrieve_k})

    # 用 Groq 的 LLM 模型
    groq_api_key = os.getenv("GROQ_API_KEY")
    if not groq_api_key:
        raise RuntimeError("Missing GROQ_API_KEY in .env")
    
    llm = ChatGroq(
        model="meta-llama/llama-4-maverick-17b-128e-instruct",
        groq_api_key=groq_api_key,
        temperature=0.1,
        max_tokens=800
    )

    # 先檢索文檔
    retrieved_docs = retriever.get_relevant_documents(query)
    
    # 如果啟用重排序
    if use_rerank and retrieved_docs:
        from rerank import rerank_results
        
        # 格式化文檔以供重排序
        docs_for_rerank = [
            {
                'content': doc.page_content,
                'metadata': doc.metadata
            } for doc in retrieved_docs
        ]
        
        # 重排序
        reranked_docs = rerank_results(query, docs_for_rerank)
        
        # 取前 top_k 個
        reranked_docs = reranked_docs[:top_k]
        
        # 轉回 LangChain Document 格式
        from langchain.schema import Document
        retrieved_docs = [
            Document(page_content=doc['content'], metadata=doc['metadata'])
            for doc in reranked_docs
        ]
    
    # 構建上下文
    context = "\n\n".join([
        f"回憶片段 {i+1}：\n{doc.page_content}" 
        for i, doc in enumerate(retrieved_docs[:top_k])
    ])
    
    # 構建完整的提示
    full_prompt = PROMPT.format(
        context=context,
        query=query
    )
    
    # 使用 LLM 生成回答
    answer = llm.predict(full_prompt)
    
    return answer, retrieved_docs[:top_k]
