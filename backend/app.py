from flask import Flask, jsonify, request
from flask_cors import CORS
from retrieval import answer_query, retrieve_memories
from ingest_docs import ingest_blob
from rerank import rerank_results

app = Flask(__name__)
CORS(app)

@app.route('/api/query', methods=['POST'])
def query():
    """處理查詢請求"""
    try:
        data = request.get_json()
        query_text = data.get('query', '')
        top_k = data.get('top_k', 4)
        
        if not query_text:
            return jsonify({'error': '查詢內容不能為空'}), 400
        
        # 使用檢索功能
        answer, docs = answer_query(query_text, top_k)
        
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

@app.route('/api/memories', methods=['POST'])
def memories():
    """檢索回憶片段"""
    try:
        data = request.get_json()
        query_text = data.get('query', '')
        top_k = data.get('top_k', 4)
        use_rerank = data.get('rerank', False)
        
        if not query_text:
            return jsonify({'error': '查詢內容不能為空'}), 400
        
        answer, docs = retrieve_memories(query_text, top_k)
        
        # 格式化文檔
        retrieved_docs = [
            {
                'content': doc.page_content,
                'metadata': doc.metadata
            } for doc in docs
        ]
        
        # 如果需要重排序
        if use_rerank and retrieved_docs:
            retrieved_docs = rerank_results(query_text, retrieved_docs)
        
        results = {
            'answer': answer,
            'memories': retrieved_docs
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
