from flask import Flask, jsonify, request
from flask_cors import CORS
from retrieval import answer_query
from ingest_docs import ingest_blob

app = Flask(__name__)
CORS(app)

@app.route('/api/query', methods=['POST'])
def query():
    """處理查詢請求（使用 LangChain + 重排序）"""
    try:
        data = request.get_json()
        query_text = data.get('query', '')
        top_k = data.get('top_k', 4)
        use_rerank = data.get('rerank', True)  # 預設使用重排序
        
        if not query_text:
            return jsonify({'error': '查詢內容不能為空'}), 400
        
        # 使用 langchain 檢索功能
        answer, docs = answer_query(query_text, top_k, use_rerank)
        
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
        return jsonify({'error': str(e)}), 500

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

@app.route('/api/health', methods=['GET'])
def health():
    """健康檢查"""
    return jsonify({'status': 'ok'}), 200

if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0', port=5000)
