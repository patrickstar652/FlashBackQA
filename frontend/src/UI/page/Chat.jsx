// ==================== 匯入依賴 ====================
import { Box, Flex } from "@chakra-ui/react";       // Chakra UI 佈局元件
import Input from "../component/Input";             // 文字輸入框元件
import MessageBoxMarkdown from "../component/MessageBoxMarkdown"; // 訊息顯示元件（支援Markdown）
import QuickReplyButtons from "../component/QuickReplyButtons";   // 快速回覆按鈕元件
import Navbar from "../component/Navbar";           // 頂部導航列元件
import { useEffect, useRef, useState } from "react"; // React Hooks
import axios from "axios";                          // HTTP 請求庫

// ==================== 輔助函數 ====================
/**
 * 格式化時間戳為台灣時區的時間字符串
 * @param {Date} d - 要格式化的日期物件，預設為當前時間
 * @returns {string} 格式化後的時間字符串，例如 "下午 3:45"
 */
const formatTs = (d = new Date()) =>
  d.toLocaleTimeString("zh-TW", { hour12: true, hour: "numeric", minute: "2-digit" });

/**
 * Chat 聊天主元件
 * 負責管理聊天介面的狀態、訊息流程、和 UI 渲染
 */
const Chat = () => {
  // ==================== 狀態管理 ====================
  
  /**
   * 訊息陣列 - 儲存所有聊天紀錄
   * 結構: { role: 'user'|'assistant', content: string, timestamp: Date }
   * - role: 訊息發送者（'user' 使用者 或 'assistant' AI）
   * - content: 訊息內容（支援 Markdown 格式）
   * - timestamp: 訊息時間戳
   */
  const [messages, setMessages] = useState([]);
  
  /**
   * 載入狀態 - 控制是否正在等待 AI 回應
   * - true: 正在載入，禁用發送按鈕、顯示載入提示
   * - false: 載入完成，可以發送新訊息
   */
  const [loading, setLoading] = useState(false);
  
  /**
   * DOM 參考 - 指向聊天底部的空 div
   * 用於實現自動滾動到最新訊息的功能
   */
  const bottomRef = useRef(null);

  // ==================== 核心事件處理函數 ====================
  
  /**
   * 處理發送訊息
   * 流程：驗證 → 顯示使用者訊息 → 向後端查詢 → 顯示 AI 回覆 → 錯誤處理
   * @param {string} text - 使用者輸入的文字
   */
  const handleSend = async (text) => {
    // 去除前後空白，檢查是否為空
    const content = text?.trim();
    if (!content) return;

    // === 步驟 1: 立即顯示使用者訊息到聊天畫面 ===
    const userMsg = { role: "user", content, timestamp: new Date() };
    setMessages((prev) => [...prev, userMsg]);
    
    // 設定載入狀態為 true，禁用發送按鈕
    setLoading(true);

    try {
      // === 步驟 2: 向後端 API 發送查詢請求 ===
      // 發送 POST 請求到 /api/query 端點，傳遞使用者的查詢文字
      const res = await axios.post("http://localhost:5000/api/query", { query: content });
      
      // === 步驟 3: 提取 AI 回覆文字 ===
      // 使用可選鏈 ?. 安全地取得 res.data.answer
      // 如果回應為 null/undefined，則使用預設的錯誤訊息
      const aiText = res?.data?.answer ?? "抱歉，目前沒有可用的回應。";
      
      // === 步驟 4: 建構 AI 訊息物件 ===
      const aiMsg = { role: "assistant", content: aiText, timestamp: new Date() };
      
      // === 步驟 5: 將 AI 回覆添加到訊息陣列 ===
      setMessages((prev) => [...prev, aiMsg]);
      
    } catch (err) {
      // === 錯誤處理: 如果請求失敗，顯示錯誤訊息 ===
      const aiErr = { role: "assistant", content: `發生錯誤：${err.message}`, timestamp: new Date() };
      setMessages((prev) => [...prev, aiErr]);
      
      // 在瀏覽器控制台輸出完整錯誤信息供開發者調試
      console.error(err);
      
    } finally {
      // === 步驟 6: 無論成功或失敗，關閉載入狀態 ===
      // finally 塊確保即使發生異常也會執行
      setLoading(false);
    }
  };

  // ==================== 副作用 Hook ====================
  
  /**
   * 自動滾動到聊天底部
   * 監聽 messages 和 loading 狀態的變化
   * 當訊息陣列更新或載入狀態改變時，平滑滾動到最新訊息
   */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // ==================== 渲染 UI ====================
  
  return (
    <>
      {/* 頂部導航列 */}
      <Navbar />
      
      {/* 主容器 - 全高度 Flex 佈局 */}
      <Flex direction="column" h="100vh" bg="#FFFCF7">
        {/* 內層容器 - 限制最大寬度，居中對齊 */}
        <Flex direction="column" flex="1" w="100%" maxW="1200px" mx="auto">
          
          {/* ========== 聊天內容區 ========== */}
          <Box flex="1" overflowY="auto" p={{ base: 4, md: 6 }}>
            
            {/* 訊息列表 - 遍歷所有訊息並渲染 */}
            {messages.map((m, i) => (
              <MessageBoxMarkdown
                key={i}                              // React 列表渲染所需的唯一 key
                message={m.content}                  // 訊息內容（支援 Markdown）
                isUser={m.role === "user"}           // 判斷是否為使用者訊息（用於樣式區分）
                timestamp={formatTs(m.timestamp)}    // 格式化後的時間戳
              />
            ))}

            {/* 載入提示 - 當 loading 為 true 時顯示 */}
            {loading && (
              <MessageBoxMarkdown 
                message="## 🔍 回憶中...正在尋找相關回憶..." // 載入提示文本（Markdown 格式）
                isUser={false}                               // AI 訊息樣式
                timestamp={formatTs(new Date())}             // 當前時間
              />
            )}

            {/* 自動滾動錨點 - useEffect 會滾動到這個元素 */}
            <div ref={bottomRef} />
          </Box>

          {/* ========== 底部輸入區 ========== */}
          <Box
            position="sticky"                     // 粘性定位，滑動時保持在底部
            bottom="0"                            // 固定在底部
            px={{ base: 4, md: 6 }}              // 水平內距（響應式）
            pb={`calc(env(safe-area-inset-bottom) + 12px)`} // 下邊距（考慮手機安全區域）
            zIndex={10}                           // 層級，確保在聊天內容上方
            bg="#FFFCF7"                          // 背景色與主體相同
          >
            {/* 快速回覆按鈕區 - 點擊時直接發送訊息 */}
            <Box mb={3}>
              <QuickReplyButtons onSelect={handleSend} />
            </Box>
            
            {/* 文字輸入框和發送按鈕 */}
            <Input 
              onSend={handleSend}   // 傳遞發送事件處理函數
              loading={loading}     // 傳遞載入狀態
            />
          </Box>
        </Flex>
      </Flex>
    </>
  );
};

// ==================== 導出元件 ====================
// 導出 Chat 元件作為預設導出，供其他檔案引入使用
export default Chat;
