import os
from dotenv import load_dotenv
from embedding import get_embeddings
from pinecone_init import pinecone_init
from langchain_pinecone import PineconeVectorStore
from langchain.chains import RetrievalQA
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

請以溫暖、親切的口吻回答，幫助使用者喚起美好的回憶。如果相關資訊不足，請誠實告知。
"""


def answer_query(query: str, top_k: int = 4):
    # 初始化 Pinecone
    index = pinecone_init()
    embeddings = get_embeddings()
    
    # 初始化 Pinecone 客戶端
    pc = Pinecone(api_key=os.getenv("PINECONE_API_KEY"))
    pinecone_index = pc.Index(INDEX_NAME)
    
    vectorstore = PineconeVectorStore(index=pinecone_index, embedding=embeddings)
    retriever = vectorstore.as_retriever(search_kwargs={"k": top_k})

    # 用 Groq 的 LLM 模型
    groq_api_key = os.getenv("GROQ_API_KEY")
    if not groq_api_key:
        raise RuntimeError("Missing GROQ_API_KEY in .env")
    
    llm = ChatGroq(
        model="llama-3.3-70b-versatile",  # 使用穩定的模型
        groq_api_key=groq_api_key,
        temperature=0.0,
        max_tokens=512
    )

    qa_chain = RetrievalQA.from_chain_type(
        llm=llm,
        chain_type="stuff",
        retriever=retriever,
        return_source_documents=True
    )

    result = qa_chain({"query": query})
    answer = result.get("result") or result.get("answer") or ""
    source_docs = result.get("source_documents", [])
    return answer, source_docs

def retrieve_memories(query: str, top_k: int = 4):
    """檢索相關的回憶片段"""
    # 初始化 Pinecone
    index = pinecone_init()
    embeddings = get_embeddings()
    
    # 初始化 Pinecone 客戶端
    pc = Pinecone(api_key=os.getenv("PINECONE_API_KEY"))
    pinecone_index = pc.Index(INDEX_NAME)
    
    vectorstore = PineconeVectorStore(index=pinecone_index, embedding=embeddings)
    retriever = vectorstore.as_retriever(search_kwargs={"k": top_k})

    # 用 Groq 的 LLM 模型
    groq_api_key = os.getenv("GROQ_API_KEY")
    if not groq_api_key:
        raise RuntimeError("Missing GROQ_API_KEY in .env")
    
    llm = ChatGroq(
        model="llama-3.3-70b-versatile",
        groq_api_key=groq_api_key,
        temperature=0.1,
        max_tokens=800
    )

    # 獲取相關文檔
    docs = retriever.get_relevant_documents(query)
    
    # 構建上下文
    context = "\n\n".join([f"回憶片段 {i+1}：\n{doc.page_content}" for i, doc in enumerate(docs)])
    
    # 構建完整的提示
    full_prompt = PROMPT.format(
        context=context,
        query=query
    )
    
    # 直接使用 LLM
    answer = llm.predict(full_prompt)
    
    return answer, docs
