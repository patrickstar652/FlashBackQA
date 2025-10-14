import { Box, Flex } from "@chakra-ui/react";
import Input from "../component/Input";
import MessageBox from "../component/MessageBox";
import QuickReplyButtons from "../component/QuickReplyButtons";
import Navbar from "../component/Navbar";

const Chat = () => {
  return (
    <>
      <Navbar />
      <Flex direction="column" h="100vh" bg="#FFFCF7">
        <Flex direction="column" flex="1" w="100%" maxW="1200px" mx="auto">
          {/* === 聊天內容區 === */}
          <Box flex="1" overflowY="auto" p={{ base: 4, md: 6 }}>
            <MessageBox
              message="你好！這是用戶的訊息"
              isUser
              timestamp="下午 5:30"
            />
            <MessageBox
              message="你好！我是 AI 助手，很高興為你服務。"
              timestamp="下午 5:31"
            />
          </Box>

          {/* === 底部功能區（不包背景框） === */}
          <Box
            position="sticky"
            bottom="0"
            px={{ base: 4, md: 6 }}
            pb={`calc(env(safe-area-inset-bottom) + 12px)`}
            zIndex={10}
            bg="#FFFCF7"
          >
            {/* ✅ 快速回答按鈕：直接貼底、無外框 */}
            <Box mb={3}>
              <QuickReplyButtons />
            </Box>

            {/* ✅ 輸入框 */}
            <Input />
          </Box>
        </Flex>
      </Flex>
    </>
  );
};

export default Chat;
