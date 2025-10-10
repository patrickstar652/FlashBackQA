# 設置環境變數供 langchain_community 使用
import os
# from sdgact.pinecone_client import PINECONE_API_KEY
os.environ['PINECONE_API_KEY'] = PINECONE_API_KEY

# from embeddings import get_embeddings  # 如果你改名叫 get_embeddings
# from pinecone_client import init_pinecone, INDEX_NAME, get_pinecone_index
from langchain_pinecone import PineconeVectorStore
from langchain.chains import RetrievalQA

# 引入 Groq 的 LLM wrapper（LangChain 裡對 Groq 的整合可能要額外套件）
from langchain_groq import ChatGroq  # 假設你有安裝 langchain-groq

# 永續活動分析的提示詞模板
PROMPT = """
"""


def answer_query(query: str, top_k: int = 4):
    # init pinecone
    init_pinecone()
    embeddings = get_embeddings()
    pinecone_index = get_pinecone_index()
    vectorstore = PineconeVectorStore(index=pinecone_index, embedding=embeddings)

    retriever = vectorstore.as_retriever(search_kwargs={"k": top_k})

    # 用 Groq 的 Llama 4 Maverick 模型
    llm = ChatGroq(
        model="meta-llama/llama-4-maverick-17b-128e-instruct",
        groq_api_key="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",
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

def analyze_sustainability(activity_description: str, top_k: int = 4):
    # init pinecone
    init_pinecone()
    embeddings = get_embeddings()
    pinecone_index = get_pinecone_index()
    vectorstore = PineconeVectorStore(index=pinecone_index, embedding=embeddings)

    retriever = vectorstore.as_retriever(search_kwargs={"k": top_k})

    # 用 Groq 的 Llama 4 Maverick 模型
    llm = ChatGroq(
        model="meta-llama/llama-4-maverick-17b-128e-instruct",
        groq_api_key="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",
        temperature=0.1,  # 稍微提高一點創造性，但仍保持準確性
        max_tokens=800    # 增加 token 數量以容納更詳細的分析
    )

    # 構建查詢，將活動描述納入檢索查詢中
    search_query = activity_description

   
    # 由於 RetrievalQA 的限制，我們先獲取相關文檔，然後手動構建提示
    docs = retriever.get_relevant_documents(search_query)
    
    # 構建上下文
    context = "\n".join([doc.page_content for doc in docs])
    
    # 構建完整的提示
    full_prompt = PROMPT.format(
        context=context,
        query=activity_description
    )
    
    # 直接使用 LLM
    analysis_result = llm.predict(full_prompt)
    
    return analysis_result, docs
