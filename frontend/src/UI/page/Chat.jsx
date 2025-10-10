import { Box, Flex } from "@chakra-ui/react";
import Input from "../component/Input";
import UserIcon from "../component/UserIcon";
import Loading from "../component/Loading";
import Skelet from "../component/Skelet";
import MessageBox from "../component/MessageBox";

const Chat = () => {
  return (
    <Flex direction="column" h="100vh" maxW="1200px" mx="auto">
      {/* 聊天訊息區域 */}
      <Box 
        flex="1" 
        overflowY="auto" 
        p="4"
      >
        <MessageBox 
          message="你好！這是用戶的訊息" 
          isUser={true}
        />
        
        <MessageBox 
          message="你好！我是 AI 助手，很高興為你服務。" 
          isUser={false}
        />
        
        {/* 測試組件 */}
        {/* <UserIcon />
        <Loading />
        <Skelet /> */}
      </Box>
      
      {/* 輸入框區域 - 固定在底部 */}
      <Box 
        p="4" 
        borderTop="1px solid" 
        borderColor="gray.200"
        bg="white"
      >
        <Input />
      </Box>
    </Flex>
  );
};

export default Chat;
