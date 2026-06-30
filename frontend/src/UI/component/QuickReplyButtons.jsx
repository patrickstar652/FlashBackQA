import { Button, Flex, Skeleton } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import axios from "axios";
import { apiUrl } from "../../api";

const QuickReplyButtons = ({ onSelect }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSuggestions = async () => {
    setLoading(true);
    try {
      const res = await axios.get(apiUrl("/api/suggestions"));
      setSuggestions(res.data.suggestions || []);
    } catch (err) {
      console.error("\u53d6\u5f97\u5efa\u8b70\u554f\u984c\u5931\u6557\uff1a", err);
      setSuggestions([
        "\u73ed\u7d1a\u56de\u61b6\u9304",
        "\u7562\u65c5\u804a\u5929\u7d00\u9304",
        "\u8ab0\u6700\u5e38\u9072\u5230\uff1f",
        "\u8001\u5e2b\u8b1b\u904e\u7684\u7b11\u8a71",
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuggestions();
  }, []);

  if (loading) {
    return (
      <Flex gap={3} overflowX="hidden">
        {[1, 2].map((i) => (
          <Skeleton
            key={i}
            flex="0 0 auto"
            height="34px"
            width={{ base: "164px", md: "126px" }}
            rounded="full"
            startColor="#ece4d7"
            endColor="#f7f2e9"
          />
        ))}
      </Flex>
    );
  }

  return (
    <Flex
      gap={3}
      overflowX={{ base: "auto", md: "visible" }}
      flexWrap={{ base: "nowrap", md: "wrap" }}
      pb={{ base: 1, md: 0 }}
      mx={{ base: -3, sm: -4, md: 0 }}
      px={{ base: 3, sm: 4, md: 0 }}
      css={{
        WebkitOverflowScrolling: "touch",
        scrollbarWidth: "none",
        "&::-webkit-scrollbar": { display: "none" },
      }}
    >
      {suggestions.map((text, i) => (
        <Button
          key={i}
          size="sm"
          rounded="full"
          px={{ base: 3.5, md: 4 }}
          h="auto"
          minH={{ base: "38px", md: "38px" }}
          maxW={{ base: "78vw", md: "none" }}
          flex="0 0 auto"
          whiteSpace="normal"
          textAlign="left"
          lineHeight="1.35"
          bg="#faf6ef"
          color="#6f6556"
          border="1px solid #d7cebf"
          fontWeight="500"
          _before={{
            content: '""',
            display: "inline-block",
            flexShrink: 0,
            width: "10px",
            height: "10px",
            borderRadius: "full",
            bg: "#3583f6",
            marginRight: "10px",
          }}
          _hover={{ bg: "#f0e8da", color: "#4d463d" }}
          onClick={() => onSelect?.(text)}
        >
          {text}
        </Button>
      ))}
    </Flex>
  );
};

export default QuickReplyButtons;
