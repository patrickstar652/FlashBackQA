import { Box, Flex, Text, Avatar } from "@chakra-ui/react";
import UserIcon from "./UserIcon";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const MessageBoxMarkdown = ({ message, isUser, timestamp }) => {
  // Markdown 組件樣式配置
  const markdownComponents = {
    // 標題樣式
    h2: ({ children }) => (
      <Text fontSize="xl" fontWeight="bold" mt={4} mb={2} color={isUser ? "white" : "gray.800"}>
        {children}
      </Text>
    ),
    h3: ({ children }) => (
      <Text fontSize="lg" fontWeight="semibold" mt={3} mb={1.5} color={isUser ? "white" : "gray.700"}>
        {children}
      </Text>
    ),
    
    // 段落
    p: ({ children }) => (
      <Text mb={2} lineHeight="tall">
        {children}
      </Text>
    ),
    
    // 強調文字
    strong: ({ children }) => (
      <Text as="span" fontWeight="600" color={isUser ? "white" : "gray.700"}>
        {children}
      </Text>
    ),
    
    // 分隔線
    hr: () => (
      <Box
        as="hr"
        my={3}
        borderWidth="1px"
        borderColor={isUser ? "whiteAlpha.400" : "gray.300"}
        borderStyle="solid"
      />
    ),
    
    // 列表
    ul: ({ children }) => (
      <Box as="ul" pl={4} my={2}>
        {children}
      </Box>
    ),
    li: ({ children }) => (
      <Text as="li" mb={1}>
        {children}
      </Text>
    ),
    
    // 程式碼區塊
    code: ({ inline, children }) =>
      inline ? (
        <Text
          as="code"
          px={1}
          py={0.5}
          bg={isUser ? "whiteAlpha.300" : "gray.100"}
          borderRadius="sm"
          fontSize="sm"
          fontFamily="mono"
        >
          {children}
        </Text>
      ) : (
        <Box
          as="pre"
          p={3}
          bg={isUser ? "whiteAlpha.200" : "gray.100"}
          borderRadius="md"
          overflowX="auto"
          my={2}
        >
          <Text as="code" fontSize="sm" fontFamily="mono">
            {children}
          </Text>
        </Box>
      ),
    
    // 引用
    blockquote: ({ children }) => (
      <Box
        pl={4}
        py={2}
        my={2}
        borderLeft="4px solid"
        borderColor={isUser ? "whiteAlpha.500" : "gray.400"}
        bg={isUser ? "whiteAlpha.200" : "gray.50"}
        borderRadius="md"
      >
        {children}
      </Box>
    ),
  };

  return (
    <Flex
      justify={isUser ? "flex-end" : "flex-start"}
      w="100%"
      mb="4"
      gap="3"
      align="flex-start"
    >
      {/* AI 頭像（左側） */}
      {!isUser && <UserIcon />}

      {/* 訊息區域 */}
      <Box maxW="75%">
        {/* ✨ 玻璃風訊息氣泡 */}
        <Box
          bg={isUser ? "rgba(99, 211, 255, 0.85)" : "rgba(252, 228, 49, 0.85)"}
          color={isUser ? "white" : "black"}
          px={5}
          py={3}
          borderRadius="3xl"
          position="relative"
          overflow="hidden"
          border="1px solid"
          borderColor={
            isUser ? "rgba(255, 255, 255, 0.3)" : "rgba(255, 255, 255, 0.4)"
          }
          boxShadow="0 8px 20px rgba(0,0,0,0.12)"
          backdropFilter="blur(10px)"
          sx={{ WebkitBackdropFilter: "blur(10px)" }}
          _before={{
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "50%",
            bgGradient: "linear(to-b, whiteAlpha.300, transparent)",
            borderTopLeftRadius: "inherit",
            borderTopRightRadius: "inherit",
            pointerEvents: "none",
          }}
          _after={{
            content: '""',
            position: "absolute",
            width: "14px",
            height: "14px",
            bg: isUser
              ? "rgba(99, 211, 255, 0.85)"
              : "rgba(252, 228, 49, 0.85)",
            transform: "rotate(45deg)",
            right: isUser ? "-6px" : "auto",
            left: isUser ? "auto" : "-6px",
            bottom: "10px",
            borderRight: isUser
              ? "1px solid rgba(255, 255, 255, 0.3)"
              : "none",
            borderBottom: "1px solid rgba(255, 255, 255, 0.3)",
            borderLeft: !isUser
              ? "1px solid rgba(255, 255, 255, 0.3)"
              : "none",
            boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
          }}
        >
          <Box position="relative" zIndex={1}>
            {/* 使用 ReactMarkdown 渲染內容 */}
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={markdownComponents}
            >
              {message}
            </ReactMarkdown>
          </Box>
        </Box>

        {/* 時間 */}
        {timestamp && (
          <Text
            fontSize="xs"
            color="gray.500"
            mt="2"
            px="2"
            textAlign={isUser ? "right" : "left"}
          >
            {timestamp}
          </Text>
        )}
      </Box>

      {/* 用戶頭像（右側） */}
      {isUser && (
        <Avatar.Root variant="solid" size="sm" bg="#22D3EE">
          <Avatar.Fallback>U</Avatar.Fallback>
        </Avatar.Root>
      )}
    </Flex>
  );
};

export default MessageBoxMarkdown;
