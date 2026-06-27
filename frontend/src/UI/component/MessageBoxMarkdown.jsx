import { Box, Flex, Text } from "@chakra-ui/react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const MessageBoxMarkdown = ({ message, isUser, timestamp }) => {
  const markdownComponents = {
    h2: ({ children }) => (
      <Text
        fontSize="xl"
        fontWeight="bold"
        mt={4}
        mb={2}
        color={isUser ? "white" : "#3f3a34"}
      >
        {children}
      </Text>
    ),
    h3: ({ children }) => (
      <Text
        fontSize="lg"
        fontWeight="semibold"
        mt={3}
        mb={1.5}
        color={isUser ? "white" : "#4a443d"}
      >
        {children}
      </Text>
    ),
    p: ({ children }) => (
      <Text mb={2} lineHeight="1.9">
        {children}
      </Text>
    ),
    strong: ({ children }) => (
      <Text as="span" fontWeight="700" color={isUser ? "white" : "#2f2a24"}>
        {children}
      </Text>
    ),
    hr: () => (
      <Box
        as="hr"
        my={3}
        borderWidth="1px"
        borderColor={isUser ? "whiteAlpha.400" : "#d5ccbf"}
        borderStyle="solid"
      />
    ),
    ul: ({ children }) => (
      <Box as="ul" pl={5} my={2}>
        {children}
      </Box>
    ),
    li: ({ children }) => (
      <Text as="li" mb={1}>
        {children}
      </Text>
    ),
    code: ({ inline, children }) =>
      inline ? (
        <Text
          as="code"
          px={1.5}
          py={0.5}
          bg={isUser ? "whiteAlpha.300" : "#ede6db"}
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
          bg={isUser ? "whiteAlpha.200" : "#ede6db"}
          borderRadius="md"
          overflowX="auto"
          my={2}
        >
          <Text as="code" fontSize="sm" fontFamily="mono">
            {children}
          </Text>
        </Box>
      ),
    blockquote: ({ children }) => (
      <Box
        pl={4}
        py={2}
        my={2}
        borderLeft="4px solid"
        borderColor={isUser ? "whiteAlpha.600" : "#c9bea9"}
        bg={isUser ? "whiteAlpha.200" : "#f1eadf"}
        borderRadius="md"
      >
        {children}
      </Box>
    ),
  };

  return (
    <Flex
      direction="column"
      align={isUser ? "flex-end" : "flex-start"}
      w="100%"
      mb={{ base: 7, md: 10 }}
    >
      <Text
        mb={3}
        fontSize="sm"
        letterSpacing="0.18em"
        color="#635948"
        fontWeight="700"
      >
        {isUser ? "你" : "FQA-bot"}
      </Text>

      <Box maxW={{ base: "92%", md: isUser ? "30%" : "78%" }}>
        <Box
          bg={isUser ? "#050505" : "#f8f4eb"}
          color={isUser ? "white" : "#45403a"}
          px={{ base: 5, md: 6 }}
          py={{ base: 4, md: 5 }}
          borderRadius="30px"
          border="2px solid #3c3934"
          boxShadow="0 8px 24px rgba(60, 57, 52, 0.08)"
        >
          <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
            {message}
          </ReactMarkdown>
        </Box>

        {timestamp && (
          <Text
            fontSize="xs"
            color="#8a7e6f"
            mt="2"
            px="2"
            textAlign={isUser ? "right" : "left"}
          >
            {timestamp}
          </Text>
        )}
      </Box>
    </Flex>
  );
};

export default MessageBoxMarkdown;
