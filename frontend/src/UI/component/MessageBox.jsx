
import { Box, Flex, Text, Avatar } from "@chakra-ui/react";
import UserIcon from "./UserIcon";

const MessageBox = ({ message, isUser, timestamp }) => {
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
      <Box maxW="70%">
        {/* ✨ 玻璃風訊息氣泡（保留原顏色） */}
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
          sx={{ WebkitBackdropFilter: "blur(10px)" }} // Safari 支援
          _before={{
            // 上半部高光
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
            // 尾巴氣泡
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
          <Text position="relative" zIndex={1}>
            {message}
          </Text>
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

      {/* 用戶頭像（右側） - 不動 */}
      {isUser && (
        <Avatar.Root variant="solid" size="sm" bg="#22D3EE">
          <Avatar.Fallback>U</Avatar.Fallback>
        </Avatar.Root>
      )}
    </Flex>
  );
};

export default MessageBox;



