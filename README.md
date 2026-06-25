# FlashBackQA

FlashBackQA 是一個用來查詢回憶資料的 RAG 問答專案。前端提供聊天介面，後端會把問題轉成向量查詢 Pinecone，取回相關回憶片段後交給 Groq LLM 產生 Markdown 回答。

## 功能

- 聊天式問答：使用者在 `/chat` 輸入問題，前端呼叫 Flask API 取得回答。
- 快速提問：前端載入 `/api/suggestions`，用 Pinecone metadata 產生建議問題。
- 回憶匯入：後端可讀取 Markdown front matter 格式資料，切 chunk、產生 embedding，寫入 Pinecone。
- RAG 回答：`retrieval.py` 取回相關文件，組成 prompt，呼叫 Groq 模型回答。

## 技術棧

### Frontend

- React 19
- Vite
- Chakra UI
- React Router
- Axios
- React Markdown

### Backend

- Flask
- Flask-CORS
- LangChain
- Pinecone
- Hugging Face embedding model: `shibing624/text2vec-base-chinese`
- Groq Chat model: `llama-3.3-70b-versatile`

## 專案結構

```txt
FlashBackQA/
├─ frontend/
│  ├─ src/App.jsx
│  ├─ src/main.jsx
│  └─ src/UI/
│     ├─ page/
│     │  ├─ Home.jsx
│     │  └─ Chat.jsx
│     └─ component/
│        ├─ Input.jsx
│        ├─ MessageBoxMarkdown.jsx
│        ├─ Navbar.jsx
│        └─ QuickReplyButtons.jsx
├─ backend/
│  ├─ app.py
│  ├─ retrieval.py
│  ├─ embedding.py
│  ├─ ingest_docs.py
│  ├─ pinecone_init.py
│  ├─ rerank.py
│  ├─ requirements.txt
│  └─ data/
└─ docs/
   └─ backend-architecture.md
```

## 環境變數

在 `backend/.env` 建立：

```env
PINECONE_API_KEY=your_pinecone_api_key
GROQ_API_KEY=your_groq_api_key
RERANK_MODEL=BAAI/bge-reranker-base
```

`RERANK_MODEL` 是選用設定；目前主要查詢流程尚未接入 rerank。

## 後端啟動

在 `backend/` 執行：

```powershell
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
python app.py
```

後端預設在 `http://localhost:5000`。

健康檢查：

```powershell
Invoke-RestMethod http://localhost:5000/api/health
```

## 匯入資料

Markdown 回憶資料放在 `backend/data/*.md`，格式大致如下：

```md
---
id: 1
title: "某段回憶"
people: ["小明", "小美"]
time: "下午"
date: "2025-02-05"
scenario: "畢旅"
keywords: ["畢旅", "聊天"]
---

這裡放回憶正文。
```

匯入到 Pinecone：

```powershell
cd backend
python ingest_docs.py
```

也可以透過 API 匯入：

```powershell
Invoke-RestMethod `
  -Method Post `
  -ContentType "application/json" `
  -Body '{"blob":"---\nid: 1\n---\n回憶內容"}' `
  http://localhost:5000/api/ingest
```

## 前端啟動

在 `frontend/` 執行：

```powershell
npm ci
npm run dev
```

Vite 會輸出本機網址，通常是 `http://localhost:5173`。

## API

### `GET /api/health`

確認後端是否啟動。

```json
{ "status": "ok" }
```

### `POST /api/query`

送出使用者問題，取得 AI 回答與來源文件。

Request:

```json
{
  "query": "畢旅發生什麼有趣的事？",
  "top_k": 4
}
```

Response:

```json
{
  "answer": "Markdown 格式回答",
  "sources": [
    {
      "content": "來源 chunk 內容",
      "metadata": {
        "title": "某段回憶",
        "people": ["小明"],
        "date": "2025-02-05"
      }
    }
  ]
}
```

### `GET /api/suggestions`

回傳快速提問按鈕要顯示的問題。

```json
{
  "suggestions": ["畢旅發生什麼事？", "誰最常遲到？"]
}
```

### `POST /api/ingest`

把 Markdown blob 匯入 Pinecone。

## 開發檢查

前端：

```powershell
cd frontend
npm run lint
npm run build
```

後端：

```powershell
cd backend
python app.py
Invoke-RestMethod http://localhost:5000/api/health
```

## 目前值得優先整理的地方

- 多個 Python 檔案與資料檔出現中文 mojibake，會讓 prompt、metadata、UI 文案與錯誤訊息難以維護。
- `rerank.py` 已存在，但 `retrieval.py` 的主要查詢流程目前沒有使用它。
- `app.py` 啟動時會先載入 embedding model，啟動成本較高，可以改成 lazy loading 或集中在 service 層管理。
- 前端 API URL 目前硬編碼 `http://localhost:5000`，之後可改成 Vite env。
- 尚未設定自動化測試，至少可先補 `/api/health`、`/api/query` mock 測試與前端聊天流程測試。

後端的詳細流程與重構方向請看 [docs/backend-architecture.md](docs/backend-architecture.md)。
