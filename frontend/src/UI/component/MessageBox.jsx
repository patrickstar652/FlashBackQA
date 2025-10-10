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
        {/* 訊息氣泡 */}
        <Box
          bg={isUser ? "rgba(99, 211, 255, 0.85)" : "rgba(252, 228, 49, 0.85)"} // 帶透明度
          color={isUser ? "white" : "black"}
          px={5}
          py={3}
          borderRadius="3xl" // 超圓角
          boxShadow="0 4px 15px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.6)" // 外陰影 + 內光暈
          border="1px solid"
          borderColor={isUser ? "rgba(255, 255, 255, 0.3)" : "rgba(255, 255, 255, 0.4)"} // 半透明邊框
          backdropFilter="blur(10px)" // 玻璃模糊效果
          position="relative"
          overflow="hidden"
          _before={{
            content: '""',
            position: "absolute",
            top: "0",
            left: "0",
            right: "0",
            height: "50%",
            bgGradient: "linear(to-b, whiteAlpha.300, transparent)", // 上半部高光
            borderRadius: "3xl",
            pointerEvents: "none"
          }}
        >
          <Text position="relative" zIndex={1}>{message}</Text>
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

      {/* 用戶頭像（右側）- 可選 */}
      {isUser && (
        <Avatar.Root variant="solid" size="sm" bg="#22D3EE">
          <Avatar.Fallback>U</Avatar.Fallback>
        </Avatar.Root>
      )}
    </Flex>
  );
};

export default MessageBox;
