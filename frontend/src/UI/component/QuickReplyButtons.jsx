import { Wrap, WrapItem, Button, Skeleton } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import axios from "axios";
import { TbRefresh } from "react-icons/tb";

const QuickReplyButtons = ({ onSelect }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);

  // 從後端獲取隨機建議
  const fetchSuggestions = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:5000/api/suggestions");
      setSuggestions(res.data.suggestions || []);
    } catch (err) {
      console.error("獲取建議失敗:", err);
      // 使用預設建議
      setSuggestions(["最近的回憶", "說一個趣事", "有什麼好笑的事", "大家做過什麼"]);
    } finally {
      setLoading(false);
    }
  };

  // 元件載入時獲取建議
  useEffect(() => {
    fetchSuggestions();
  }, []);

  // 載入中顯示骨架屏
  if (loading) {
    return (
      <Wrap spacing="3" px={4} py={2}>
        {[1, 2, 3, 4].map((i) => (
          <WrapItem key={i}>
            <Skeleton height="32px" width="100px" rounded="full" />
          </WrapItem>
        ))}
      </Wrap>
    );
  }

  return (
    <Wrap spacing="3" px={4} py={2} align="center">
      {suggestions.map((text, i) => (
        <WrapItem key={i}>
          <Button
            size="sm"
            rounded="full"
            px={4}
            h="32px"
            bg="linear-gradient(135deg, #ffe8ec, #ffd5d5)"
            color="#5a3a3a"
            border="1px solid rgba(255,255,255,0.7)"
            shadow="sm"
            _hover={{
              bg: "linear-gradient(135deg, #ffdadf, #ffc6c6)",
              shadow: "md",
            }}
            _active={{ transform: "translateY(1px)", shadow: "base" }}
            transition="all .2s ease"
            onClick={() => onSelect?.(text)}
          >
            {text}
          </Button>
        </WrapItem>
      ))}
      
      {/* 刷新按鈕 */}
      <WrapItem>
        <Button
          size="sm"
          rounded="full"
          w="32px"
          h="32px"
          p={0}
          variant="ghost"
          color="gray.400"
          _hover={{ color: "gray.600", bg: "gray.100" }}
          onClick={fetchSuggestions}
          title="換一批問題"
        >
          <TbRefresh />
        </Button>
      </WrapItem>
    </Wrap>
  );
};

export default QuickReplyButtons;
