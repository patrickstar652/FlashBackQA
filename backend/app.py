from flask import Flask, jsonify, request
from flask_cors import CORS
from retrieval import answer_query
from ingest_docs import ingest_blob
import traceback

app = Flask(__name__)
CORS(app)

# 預熱模型（在啟動時載入）
print("[app] 預熱模型...")
try:
    from embedding import get_embeddings
    from rerank import get_reranker
    
    # 預先載入 embedding 模型
    get_embeddings()
    print("[app] ✓ Embedding 模型已載入")
    
    # 預先載入 rerank 模型（可選）
    try:
        get_reranker()
        print("[app] ✓ Rerank 模型已載入")
    except Exception as e:
        print(f"[app] ⚠️ Rerank 模型載入失敗，將在不使用 rerank 的情況下運行: {e}")
        
except Exception as e:
    print(f"[app] ⚠️ 模型預熱失敗: {e}")

@app.route('/api/query', methods=['POST'])
def query():
    """處理查詢請求（使用 LangChain + 重排序）"""
    try:
        data = request.get_json()
        query_text = data.get('query')
        top_k = data.get('top_k', 4)
        use_rerank = data.get('rerank', False)  # 預設不使用重排序
        
        if not query_text:
            return jsonify({'error': '查詢內容不能為空'}), 400
        
        print(f"[app] 收到查詢: '{query_text}' (top_k={top_k}, rerank={use_rerank})")
        
        # 使用 langchain 檢索功能
        answer, docs = answer_query(query_text, top_k, use_rerank)
        
        print(f"[app] 查詢完成，返回 {len(docs)} 個文檔")
        
        # 格式化回傳結果
        results = {
            'answer': answer,
            'sources': [
                {
                    'content': doc.page_content,
                    'metadata': doc.metadata
                } for doc in docs
            ]
        }
        
        return jsonify(results), 200
        
    except Exception as e:
        error_msg = str(e)
        print(f"[app] 錯誤: {error_msg}")
        traceback.print_exc()
        
        return jsonify({
            'error': '查詢處理失敗',
            'details': error_msg
        }), 500

@app.route('/api/ingest', methods=['POST'])
def ingest():
    """上傳新的回憶資料"""
    try:
        data = request.get_json()
        blob = data.get('blob', '')
        
        if not blob:
            return jsonify({'error': '資料內容不能為空'}), 400
        
        result = ingest_blob(blob)
        return jsonify(result), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/suggestions', methods=['GET'])
def get_suggestions():
    """從向量資料庫隨機獲取快速提問建議"""
    import random
    from pinecone_init import pinecone_init
    
    try:
        # 連接 Pinecone
        index = pinecone_init()
        
        # 查詢所有向量的 metadata（取樣）
        # 使用隨機向量來獲取一些結果
        random_vector = [random.uniform(-1, 1) for _ in range(768)]
        results = index.query(vector=random_vector, top_k=20, include_metadata=True)
        
        suggestions = []
        seen_titles = set()
        
        for match in results.get('matches', []):
            metadata = match.get('metadata', {})
            title = metadata.get('title', '')
            people = metadata.get('people', '')
            keywords = metadata.get('keywords', '')
            scenario = metadata.get('scenario', '')
            
            if title and title not in seen_titles:
                seen_titles.add(title)
                
                # 根據 metadata 生成不同類型的提問
                question_templates = []
                
                # 基於標題的問題
                if title:
                    question_templates.append(f"說說{title}的事")
                    question_templates.append(f"{title}是怎麼回事")
                
                # 基於人物的問題
                if people:
                    people_list = people.split(',') if isinstance(people, str) else people
                    if people_list and people_list[0]:
                        person = people_list[0].strip()
                        if person and person != "大家":
                            question_templates.append(f"{person}做過什麼好笑的事")
                
                # 基於場景的問題
                if scenario and scenario != "無":
                    question_templates.append(f"還記得{scenario}嗎")
                
                # 隨機選一個問題模板
                if question_templates:
                    suggestions.append(random.choice(question_templates))
        
        # 加入一些通用問題
        general_questions = [
            "最近有什麼有趣的回憶",
            "說一個好笑的故事",
            "大家一起做過什麼瘋狂的事",
            "有什麼難忘的旅行回憶",
        ]
        
        # 混合並隨機選取 4-6 個
        all_suggestions = list(set(suggestions))  # 去重
        random.shuffle(all_suggestions)
        
        # 確保至少有一些通用問題
        final_suggestions = all_suggestions[:4]
        if len(final_suggestions) < 4:
            remaining = 4 - len(final_suggestions)
            final_suggestions.extend(random.sample(general_questions, min(remaining, len(general_questions))))
        
        random.shuffle(final_suggestions)
        
        print(f"[app] 生成 {len(final_suggestions)} 個快速提問建議")
        
        return jsonify({'suggestions': final_suggestions[:5]}), 200
        
    except Exception as e:
        print(f"[app] 獲取建議失敗: {e}")
        # 返回預設建議
        return jsonify({
            'suggestions': ["最近的回憶", "說一個趣事", "有什麼好笑的事", "大家做過什麼瘋狂的事"]
        }), 200

@app.route('/api/health', methods=['GET'])
def health():
    """健康檢查"""
    return jsonify({'status': 'ok'}), 200

if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0', port=5000)
