import { Box, Flex, Text, Avatar } from "@chakra-ui/react";
import UserIcon from "./UserIcon";

const MessageBox = ({ message, isUser }) => {
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
      
      {/* 訊息氣泡 */}
      <Box
        maxW="70%"
        bg={isUser ? "blue.500" : "gray.100"}
        color={isUser ? "white" : "gray.800"}
        px="4"
        py="3"
        borderRadius="lg"
      >
        <Text>{message}</Text>
      </Box>
      
      {/* 用戶頭像（右側）- 可選 */}
      {isUser && (
        <Avatar.Root variant="solid" size="sm" bg="blue.500">
          <Avatar.Fallback>U</Avatar.Fallback>
        </Avatar.Root>
      )}
    </Flex>
  );
};

export default MessageBox;