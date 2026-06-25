import os
from dotenv import load_dotenv
from embedding import get_embeddings
from pinecone_init import pinecone_init
from langchain_pinecone import PineconeVectorStore
from langchain_groq import ChatGroq

# 載入環境變數
load_dotenv()

# 回憶檢索的提示詞模板
PROMPT = """你是一個熟悉使用者過往經歷、能以自然語氣回憶的 AI 助手。
僅根據最相關的回憶回答，若內容明顯無關，請忽略。

請依以下結構輸出：

## 💭 回答
[用 1-2 句話直接回答使用者的問題，要精準有力]

## 📝 相關回憶

### 回憶 1：[標題]
**時間**：[日期或時間]  
**人物**：[相關人物]

[回憶內容詳述]

---

### 回憶 2：[標題]
...（依此類推，有幾個回憶就列幾個）

---

## 💬 碎碎念
[用一句話輕鬆吐槽或幽默評論，讓語氣更自然親切]

---
相關回憶資料：
{context}

使用者問題：{query}

注意事項：
1. 使用 Markdown 格式排版
2. 語氣自然、少贅字
3. 不要說「根據回憶內容」這種廢話
4. 如果回憶片段有標題、日期、人物等資訊，要完整呈現
5. 回憶內容要詳細，不要省略
6. 每個部分之間要有明確分隔（用 --- 分隔線）
7. 碎碎念要有趣、有梗，不要太正經
"""


def answer_query(query: str, top_k: int = 4):
    """
    使用 LangChain 進行問答
    
    Args:
        query: 使用者查詢
        top_k: 檢索的文檔數量
    
    Returns:
        answer: AI 回答
        source_docs: 來源文檔列表
    """
    # 初始化 Pinecone（此函式已回傳 pc.Index 物件）
    index = pinecone_init()
    embeddings = get_embeddings()

    # 直接使用已取得的 index 建立向量庫
    vectorstore = PineconeVectorStore(index=index, embedding=embeddings)
    
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

    # 先檢索文檔（使用新的 invoke 方法代替已棄用的 get_relevant_documents）
    try:
        retrieved_docs = retriever.invoke(query)
    except Exception as e:
        print(f"[retrieval] 檢索失敗: {e}")
        # 降級使用舊方法
        retrieved_docs = retriever.get_relevant_documents(query)
    
    # 只保留需要回傳與組 prompt 的文檔數量
    retrieved_docs = retrieved_docs[:top_k]

    context_parts = []
    for i, doc in enumerate(retrieved_docs[:top_k]):
        meta = doc.metadata
        
        # 構建元數據字串
        meta_parts = []
        if meta.get('title'):
            meta_parts.append(f"標題：{meta['title']}")
        if meta.get('date'):
            meta_parts.append(f"日期：{meta['date']}")
        if meta.get('time'):
            meta_parts.append(f"時間：{meta['time']}")
        if meta.get('people'):
            people = meta['people']
            if isinstance(people, list):
                people = '、'.join(people)
            meta_parts.append(f"人物：{people}")
        if meta.get('scenario'):
            meta_parts.append(f"場景：{meta['scenario']}")
        
        # 組合片段
        context_part = f"【回憶片段 {i+1}】\n"
        if meta_parts:
            context_part += "\n".join(meta_parts) + "\n\n"
        context_part += f"內容：{doc.page_content}"
        
        context_parts.append(context_part)
    
    context = "\n\n---\n\n".join(context_parts)
    
    # 構建完整的提示
    full_prompt = PROMPT.format(
        context=context,
        query=query
    )
    
    # 使用 LLM 生成回答（使用新的 invoke 方法）
    
    answer = llm.invoke(full_prompt).content
   
    return answer, retrieved_docs[:top_k]
