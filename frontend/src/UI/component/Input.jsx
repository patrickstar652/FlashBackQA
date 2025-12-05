// ==================== 匯入依賴 ====================
import { Textarea, Box, IconButton } from "@chakra-ui/react"; // Chakra UI 元件（改用 Box 取代 Flex）
import { TbSend2 } from "react-icons/tb";                       // Tabler Icons 中的發送圖示
import { useState } from "react";                               // React 狀態管理 Hook

// ==================== 輸入框元件 ====================
/**
 * Input 文字輸入框元件
 * 功能：提供文字輸入和發送訊息的介面
 * 包含自動擴展的文字區域和發送按鈕（按鈕內嵌於輸入框）
 * 
 * @param {Function} onSend - 發送訊息的回調函數，接收使用者輸入的文字
 * @param {boolean} loading - 載入狀態（預設 false），true 時禁用輸入和發送
 */
const Input = ({ onSend, loading = false }) => {
  // ==================== 狀態管理 ====================
  
  /**
   * 查詢文字狀態
   * 儲存使用者在文字區域中輸入的內容
   */
  const [query, setQuery] = useState("");

  // ==================== 事件處理函數 ====================
  
  /**
   * 處理發送訊息
   * 流程：驗證文字 → 調用回調 → 清空輸入框
   */
  const handleSend = () => {
    // 去除前後空白並保存
    const text = query.trim();
    
    // 如果文字為空，不執行任何操作
    if (!text) return;
    
    // 調用父元件傳入的 onSend 回調函數，傳遞文字內容
    // 使用可選鏈 ?. 確保 onSend 存在才呼叫
    onSend?.(text);
    
    // 清空輸入框的文字
    setQuery("");
  };

  /**
   * 處理鍵盤事件
   * - Enter: 發送訊息
   * - Shift + Enter: 換行（預設行為）
   * @param {KeyboardEvent} e - 鍵盤事件
   */
  const handleKeyDown = (e) => {
    // 檢查是否按下 Enter 且沒有按住 Shift
    if (e.key === "Enter" && !e.shiftKey) {
      // 阻止預設的換行行為
      e.preventDefault();
      // 發送訊息
      handleSend();
    }
  };

  /**
   * 處理表單提交事件（備用，例如行動裝置的虛擬鍵盤提交）
   * @param {Event} e - HTML 表單提交事件
   */
  const handleForm = (e) => {
    // 阻止表單預設提交行為（重新整理頁面）
    e.preventDefault();
    handleSend();
  };

  // ==================== 渲染 UI ====================
  
  return (
    <form onSubmit={handleForm}>
      {/* 外層容器 - 使用相對定位來放置內部按鈕 */}
      <Box position="relative">
        
        {/* 文字輸入區域 */}
        <Textarea
          placeholder="探索回憶...🔙"           // 佔位符文本
          variant="outline"                    // Chakra UI 樣式變體
          size="xs"                            // 尺寸（超小）
          resize="none"                        // 禁用使用者手動調整大小
          rounded="full"                       // 完全圓角（膠囊形）
          pt={5}                               // 上內距（Padding Top）
          pb={2}                               // 下內距（Padding Bottom）
          pr={14}                              // 右內距（給發送按鈕預留空間）
          focusRingColor="yellow.600"          // 獲得焦點時的環形色（黃色）
          border="1px solid"                   // 邊框樣式（實線 1px）
          value={query}                        // 受控元件：綁定狀態值
          onChange={(e) => setQuery(e.target.value)} // 輸入時更新狀態
          onKeyDown={handleKeyDown}            // 監聽鍵盤事件（Enter 發送）
          disabled={loading}                   // 載入中時禁用輸入
        />
        
        {/* 發送按鈕 - 絕對定位在輸入框內部右側 */}
        <IconButton
          position="absolute"                  // 絕對定位
          right={2}                            // 距離右邊 8px
          top="50%"                            // 垂直置中
          transform="translateY(-50%)"         // 精確垂直置中
          rounded="full"                       // 圓形按鈕
          size="sm"                            // 按鈕尺寸（小）
          type="submit"                        // 提交表單類型按鈕
          isDisabled={loading || !query.trim()} // 禁用條件：載入中或輸入框為空
          aria-label="send"                    // 無障礙標籤（螢幕讀取器用）
          colorScheme="yellow"                 // 按鈕配色（黃色主題）
          variant="ghost"                      // 幽靈樣式（透明背景）
        >
          {/* 發送圖示 */}
          <TbSend2 />
        </IconButton>
      </Box>
    </form>
  );
};

// ==================== 導出元件 ====================
// 導出 Input 元件作為預設導出
export default Input;
