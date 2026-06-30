import hmac
import os
import random
import traceback

from dotenv import load_dotenv
from flask import Flask, jsonify, request
from flask_cors import CORS

from ingest_docs import ingest_blob
from pinecone_init import pinecone_init
from retrieval import answer_query

load_dotenv()


def get_cors_origins():
    raw_origins = os.getenv(
        "FRONTEND_ORIGIN",
        "http://localhost:5173,http://127.0.0.1:5173",
    )
    return [origin.strip() for origin in raw_origins.split(",") if origin.strip()]


app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": get_cors_origins()}})


@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({"status": "ok"}), 200


@app.route("/api/query", methods=["POST"])
def query():
    try:
        data = request.get_json(silent=True) or {}
        query_text = data.get("query")
        top_k = 4

        if not query_text:
            return jsonify({"error": "query is required"}), 400

        print(f"[app] query received: {query_text!r} (top_k={top_k})")
        answer, docs = answer_query(query_text, top_k)
        print(f"[app] query completed with {len(docs)} source docs")

        return jsonify(
            {
                "answer": answer,
                "sources": [
                    {
                        "content": doc.page_content,
                        "metadata": doc.metadata,
                    }
                    for doc in docs
                ],
            }
        ), 200

    except Exception as exc:
        error_msg = str(exc)
        print(f"[app] query failed: {error_msg}")
        traceback.print_exc()
        return jsonify({"error": "query failed", "details": error_msg}), 500


@app.route("/api/ingest", methods=["POST"])
def ingest():
    admin_key = os.getenv("INGEST_API_KEY")
    if not admin_key:
        return jsonify({"error": "ingest endpoint is disabled"}), 403

    provided_key = request.headers.get("X-Admin-API-Key", "")
    if not hmac.compare_digest(provided_key, admin_key):
        return jsonify({"error": "invalid admin api key"}), 401

    try:
        data = request.get_json(silent=True) or {}
        blob = data.get("blob", "")

        if not blob:
            return jsonify({"error": "blob is required"}), 400

        return jsonify(ingest_blob(blob)), 200
    except Exception as exc:
        print(f"[app] ingest failed: {exc}")
        traceback.print_exc()
        return jsonify({"error": str(exc)}), 500


@app.route("/api/suggestions", methods=["GET"])
def get_suggestions():
    try:
        index = pinecone_init()
        random_vector = [random.uniform(-1, 1) for _ in range(768)]
        results = index.query(vector=random_vector, top_k=20, include_metadata=True)

        suggestions = []
        seen_titles = set()

        for match in results.get("matches", []):
            metadata = match.get("metadata", {})
            title = metadata.get("title", "")
            people = metadata.get("people", "")
            scenario = metadata.get("scenario", "")

            if not title or title in seen_titles:
                continue

            seen_titles.add(title)
            question_templates = [
                f"{title} 發生了什麼事？",
                f"可以整理 {title} 的重點嗎？",
            ]

            if people:
                people_list = people.split(",") if isinstance(people, str) else people
                person = people_list[0].strip() if people_list else ""
                if person and person != "未知":
                    question_templates.append(f"{person} 在這段回憶裡做了什麼？")

            if scenario and scenario != "未知":
                question_templates.append(f"在 {scenario} 這個情境裡有哪些回憶？")

            suggestions.append(random.choice(question_templates))

        general_questions = [
            "有哪些值得回顧的班級回憶？",
            "請整理一段有趣的聊天紀錄",
            "誰最常出現在回憶裡？",
            "有哪些老師講過的笑話？",
        ]

        random.shuffle(suggestions)
        final_suggestions = list(dict.fromkeys(suggestions))[:4]

        if len(final_suggestions) < 4:
            remaining = 4 - len(final_suggestions)
            final_suggestions.extend(random.sample(general_questions, remaining))

        random.shuffle(final_suggestions)
        print(f"[app] generated {len(final_suggestions)} suggestions")

        return jsonify({"suggestions": final_suggestions[:5]}), 200

    except Exception as exc:
        print(f"[app] suggestions fallback used: {exc}")
        return jsonify(
            {
                "suggestions": [
                    "有哪些值得回顧的班級回憶？",
                    "請整理一段有趣的聊天紀錄",
                    "誰最常出現在回憶裡？",
                    "有哪些老師講過的笑話？",
                ]
            }
        ), 200


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)
