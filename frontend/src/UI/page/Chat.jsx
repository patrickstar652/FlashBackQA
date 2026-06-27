import { Box, Flex, Heading, Text } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import Input from "../component/Input";
import MessageBoxMarkdown from "../component/MessageBoxMarkdown";
import QuickReplyButtons from "../component/QuickReplyButtons";
import Navbar from "../component/Navbar";

const formatTs = (d = new Date()) =>
  d.toLocaleTimeString("zh-TW", { hour12: true, hour: "numeric", minute: "2-digit" });

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  const handleSend = async (text) => {
    const content = text?.trim();
    if (!content) return;

    const userMsg = { role: "user", content, timestamp: new Date() };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:5000/api/query", { query: content });
      const aiText =
        res?.data?.answer ?? "\u62b1\u6b49\uff0c\u76ee\u524d\u6c92\u6709\u53ef\u7528\u7684\u56de\u61c9\u3002";
      const aiMsg = { role: "assistant", content: aiText, timestamp: new Date() };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      const aiErr = {
        role: "assistant",
        content: `\u767c\u751f\u932f\u8aa4\uff1a${err.message}`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiErr]);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setMessages([]);
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  return (
    <>
      <Navbar />
      <Flex
        direction="column"
        h="100vh"
        bg="#f3ede2"
        sx={{
          "--paper-dot": "rgba(111, 97, 74, 0.08)",
          backgroundImage:
            "radial-gradient(circle at 1px 1px, var(--paper-dot) 1px, transparent 0)",
          backgroundSize: "18px 18px",
        }}
      >
        <Flex direction="column" flex="1" w="100%" maxW="1200px" mx="auto" minH={0}>
          <Box
            px={{ base: 4, md: 6 }}
            pt={{ base: 4, md: 6 }}
            pb={{ base: 3, md: 4 }}
            borderBottom="1px solid #ddd4c7"
          >
            <Heading
              as="h1"
              fontSize={{ base: "3xl", md: "5xl" }}
              lineHeight="0.95"
              letterSpacing="-0.04em"
              fontWeight="900"
              color="#111111"
              textTransform="uppercase"
              fontFamily="'Arial Black', 'Segoe UI', sans-serif"
            >
              記憶串流
            </Heading>
            <Text mt={3} color="#6f6556" fontSize={{ base: "sm", md: "lg" }}>
              想問人、旅行、笑話或班級片段，都可以直接輸入。回答會保留熟悉的聊天節奏，
              並依照新的視覺風格呈現。
            </Text>
          </Box>

          <Box flex="1" overflowY="auto" px={{ base: 4, md: 6 }} py={{ base: 5, md: 6 }}>
            {messages.map((m, i) => (
              <MessageBoxMarkdown
                key={i}
                message={m.content}
                isUser={m.role === "user"}
                timestamp={formatTs(m.timestamp)}
              />
            ))}

            {loading && (
              <MessageBoxMarkdown
                message={
                  "\u6b63\u5728\u56de\u61b6\u4e2d...\u6b63\u5728\u5c0b\u627e\u76f8\u95dc\u5167\u5bb9\u3002"
                }
                isUser={false}
                timestamp={formatTs(new Date())}
              />
            )}

            <div ref={bottomRef} />
          </Box>

          <Box
            position="sticky"
            bottom="0"
            px={{ base: 4, md: 6 }}
            pt={2}
            pb={`calc(env(safe-area-inset-bottom) + 10px)`}
            zIndex={10}
            bg="rgba(243, 237, 226, 0.95)"
            borderTop="1px solid #ddd4c7"
            sx={{ backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)" }}
          >
            <Box mb={2}>
              <QuickReplyButtons onSelect={handleSend} />
            </Box>
            <Input onSend={handleSend} onClear={handleClear} loading={loading} />
          </Box>
        </Flex>
      </Flex>
    </>
  );
};

export default Chat;
