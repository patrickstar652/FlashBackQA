import { Box, Button, Flex, Skeleton, Text, VStack, Wrap, WrapItem } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import axios from "axios";
import { TbChevronDown, TbSparkles } from "react-icons/tb";
import { apiUrl } from "../../api";

const QuickReplyButtons = ({ onSelect }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);

  const fetchSuggestions = async () => {
    setLoading(true);
    try {
      const res = await axios.get(apiUrl("/api/suggestions"));
      setSuggestions(res.data.suggestions || []);
    } catch (err) {
      console.error("取得建議問題失敗：", err);
      setSuggestions([
        "班級回憶錄",
        "畢旅聊天紀錄",
        "誰最常遲到？",
        "老師講過的笑話",
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuggestions();
  }, []);

  const handleSelect = (text) => {
    setIsExpanded(false);
    onSelect?.(text);
  };

  if (loading) {
    return (
      <>
        <Skeleton
          display={{ base: "block", md: "none" }}
          h="36px"
          w="126px"
          rounded="full"
          startColor="#ece4d7"
          endColor="#f7f2e9"
        />
        <Wrap display={{ base: "none", md: "flex" }} gap={3}>
          {[1, 2].map((i) => (
            <WrapItem key={i}>
              <Skeleton
                height="34px"
                width="126px"
                rounded="full"
                startColor="#ece4d7"
                endColor="#f7f2e9"
              />
            </WrapItem>
          ))}
        </Wrap>
      </>
    );
  }

  return (
    <>
      <Box display={{ base: "block", md: "none" }}>
        <Button
          type="button"
          h="36px"
          px={3}
          borderRadius="full"
          bg="#faf6ef"
          color="#5f574d"
          border="1px solid #d7cebf"
          fontSize="sm"
          fontWeight="700"
          aria-expanded={isExpanded}
          aria-controls="mobile-quick-replies"
          onClick={() => setIsExpanded((current) => !current)}
          _hover={{ bg: "#f0e8da" }}
          _active={{ transform: "scale(0.98)" }}
          transition="background 180ms ease, transform 180ms ease"
        >
          <Flex align="center" gap={2}>
            <TbSparkles size={17} aria-hidden="true" />
            <Text>提問靈感</Text>
            <Text color="#918677" fontSize="xs">
              {suggestions.length}
            </Text>
            <Box
              as={TbChevronDown}
              boxSize="17px"
              transform={isExpanded ? "rotate(180deg)" : "rotate(0deg)"}
              transition="transform 180ms ease"
              aria-hidden="true"
            />
          </Flex>
        </Button>

        {isExpanded && (
          <VStack
            id="mobile-quick-replies"
            align="stretch"
            gap={1.5}
            mt={2}
            p={2}
            border="1px solid #d7cebf"
            borderRadius="18px"
            bg="#f9f6ef"
            boxShadow="0 12px 26px rgba(60, 57, 52, 0.12)"
          >
            {suggestions.map((text, i) => (
              <Button
                key={i}
                type="button"
                justifyContent="flex-start"
                h="auto"
                minH="40px"
                px={3}
                py={2}
                borderRadius="12px"
                bg="transparent"
                color="#5f574d"
                fontSize="sm"
                fontWeight="500"
                whiteSpace="normal"
                textAlign="left"
                _before={{
                  content: '""',
                  flex: "0 0 auto",
                  width: "8px",
                  height: "8px",
                  borderRadius: "full",
                  bg: "#3583f6",
                  marginRight: "10px",
                }}
                _hover={{ bg: "#f0e8da", color: "#4d463d" }}
                _active={{ transform: "scale(0.99)" }}
                onClick={() => handleSelect(text)}
              >
                {text}
              </Button>
            ))}
          </VStack>
        )}
      </Box>

      <Wrap display={{ base: "none", md: "flex" }} gap={3}>
        {suggestions.map((text, i) => (
          <WrapItem key={i}>
            <Button
              size="sm"
              rounded="full"
              px={4}
              h="38px"
              bg="#faf6ef"
              color="#6f6556"
              border="1px solid #d7cebf"
              fontWeight="500"
              _before={{
                content: '""',
                display: "inline-block",
                width: "10px",
                height: "10px",
                borderRadius: "full",
                bg: "#3583f6",
                marginRight: "10px",
              }}
              _hover={{ bg: "#f0e8da", color: "#4d463d" }}
              _active={{ transform: "scale(0.98)" }}
              onClick={() => handleSelect(text)}
            >
              {text}
            </Button>
          </WrapItem>
        ))}
      </Wrap>
    </>
  );
};

export default QuickReplyButtons;
