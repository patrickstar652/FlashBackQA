import { Button, Skeleton, Wrap, WrapItem } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import axios from "axios";

const QuickReplyButtons = ({ onSelect }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSuggestions = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:5000/api/suggestions");
      setSuggestions(res.data.suggestions || []);
    } catch (err) {
      console.error(
        "取得建議問題失敗：",
        err,
      );
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

  if (loading) {
    return (
      <Wrap spacing="3">
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
    );
  }

  return (
    <Wrap spacing="3">
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
            onClick={() => onSelect?.(text)}
          >
            {text}
          </Button>
        </WrapItem>
      ))}
    </Wrap>
  );
};

export default QuickReplyButtons;
