import { Box, Button, Flex, Text, Textarea } from "@chakra-ui/react";
import { useState } from "react";

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
        border="2px solid #3c3934"
        borderRadius={{ base: "28px", md: "32px" }}
        bg="#f9f6ef"
        px={{ base: 4, md: 4 }}
        py={{ base: 2.5, md: 3 }}
        boxShadow="0 10px 26px rgba(60, 57, 52, 0.08)"
      >
        <Textarea
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={loading}
          placeholder="問問一段班級回憶..."
          variant="unstyled"
          resize="vertical"
          minH={{ base: "64px", md: "72px" }}
          fontSize={{ base: "md", md: "lg" }}
          lineHeight="1.45"
          color="#3f3a34"
          bg="transparent"
          p={0}
          _placeholder={{ color: "#857969" }}
          _disabled={{ opacity: 1, cursor: "not-allowed" }}
        />

        <Flex
          mt={2}
          direction={{ base: "column", md: "row" }}
          align={{ base: "stretch", md: "center" }}
          justify="space-between"
          gap={3}
        >
          <Text color="#6f6556" fontSize={{ base: "sm", md: "md" }}>
            介面、回憶內容與來源脈絡，都會整理在同一段對話中。
          </Text>

          <Flex justify={{ base: "flex-end", md: "flex-end" }} gap={3}>
            <Button
              type="button"
              onClick={handleClear}
              isDisabled={loading && !query.trim()}
              borderRadius="full"
              h="42px"
              px={5}
              bg="transparent"
              border="2px solid #3c3934"
              color="#1f1e1c"
              fontSize="md"
              fontWeight="600"
              _hover={{ bg: "#ece5d7" }}
            >
              清除
            </Button>
            <Button
              type="submit"
              isLoading={loading}
              loadingText="送出中"
              isDisabled={loading || !query.trim()}
              borderRadius="full"
              h="42px"
              px={5}
              bg="#2f78dc"
              color="white"
              fontSize="md"
              fontWeight="700"
              boxShadow="inset 0 -2px 0 rgba(0, 0, 0, 0.18)"
              _hover={{ bg: "#1f67ca" }}
              _active={{ bg: "#185db8" }}
            >
              送出
            </Button>
          </Flex>
        </Flex>
      </Box>
    </form>
  );
};

export default Input;
