import { Box, Button, Flex, Text } from "@chakra-ui/react";
import { useState } from "react";
import TextareaAutosize from "react-textarea-autosize";
import { TbArrowUp, TbTrash } from "react-icons/tb";
import "./Input.css";

const Input = ({ onSend, onClear, loading = false }) => {
  const [query, setQuery] = useState("");

  const handleSend = () => {
    const text = query.trim();
    if (!text) return;
    onSend?.(text);
    setQuery("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleForm = (e) => {
    e.preventDefault();
    handleSend();
  };

  const handleClear = () => {
    setQuery("");
    onClear?.();
  };

  return (
    <form onSubmit={handleForm}>
      <Box
        border={{ base: "1.5px solid #3c3934", md: "2px solid #3c3934" }}
        borderRadius={{ base: "24px", md: "32px" }}
        bg="#f9f6ef"
        px={{ base: 3, md: 4 }}
        py={{ base: 2, md: 3 }}
        boxShadow="0 10px 26px rgba(60, 57, 52, 0.08)"
      >
        <TextareaAutosize
          className="chat-input__textarea"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={loading}
          placeholder="問問一段班級回憶..."
          minRows={1}
          maxRows={4}
        />

        <Flex mt={{ base: 1, md: 2 }} align="center" justify="space-between" gap={2}>
          <Text display={{ base: "none", md: "block" }} color="#6f6556" fontSize="md">
            介面、回憶內容與來源脈絡，都會整理在同一段對話中。
          </Text>

          <Flex w={{ base: "100%", md: "auto" }} justify="space-between" gap={{ base: 2, md: 3 }}>
            <Button
              type="button"
              onClick={handleClear}
              disabled={loading}
              aria-label="清除目前對話"
              borderRadius="full"
              h={{ base: "40px", md: "42px" }}
              minW={{ base: "40px", md: "auto" }}
              px={{ base: 0, md: 5 }}
              bg="transparent"
              border={{ base: "1px solid #d7cebf", md: "2px solid #3c3934" }}
              color="#1f1e1c"
              fontSize={{ base: "sm", md: "md" }}
              fontWeight="600"
              gap={2}
              _hover={{ bg: "#ece5d7" }}
              _active={{ transform: "scale(0.97)" }}
              transition="background 180ms ease, transform 180ms ease"
            >
              <TbTrash size={18} aria-hidden="true" />
              <Text display={{ base: "none", md: "inline" }}>清除</Text>
            </Button>
            <Button
              type="submit"
              loading={loading}
              loadingText="送出中"
              disabled={loading || !query.trim()}
              aria-label="送出問題"
              borderRadius="full"
              h={{ base: "40px", md: "42px" }}
              minW={{ base: "40px", md: "auto" }}
              px={{ base: 0, md: 5 }}
              bg="#2f78dc"
              color="white"
              fontSize={{ base: "sm", md: "md" }}
              fontWeight="700"
              gap={2}
              boxShadow="inset 0 -2px 0 rgba(0, 0, 0, 0.18)"
              _hover={{ bg: "#1f67ca" }}
              _active={{ bg: "#185db8", transform: "scale(0.97)" }}
              transition="background 180ms ease, transform 180ms ease"
            >
              <TbArrowUp size={20} strokeWidth={2.4} aria-hidden="true" />
              <Text display={{ base: "none", md: "inline" }}>送出</Text>
            </Button>
          </Flex>
        </Flex>
      </Box>
    </form>
  );
};

export default Input;
