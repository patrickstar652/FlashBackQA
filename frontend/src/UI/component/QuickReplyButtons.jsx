import { Wrap, WrapItem, Button } from "@chakra-ui/react";

const QuickReplyButtons = ({ onSelect }) => {
  const suggestions = ["最近的回憶", "你記得我嗎", "說一個趣事", "幫我找"];

  return (
    <Wrap spacing="3" px={4} py={2}>
      {suggestions.map((text, i) => (
        <WrapItem key={i}>
          <Button
            size="sm"
            rounded="full"
            px={4}
            h="32px"
            bg="linear-gradient(135deg, #ffe8ec, #ffd5d5)"
            color="#5a3a3a"
            border="1px solid rgba(255,255,255,0.7)"
            shadow="sm"
            _hover={{
              bg: "linear-gradient(135deg, #ffdadf, #ffc6c6)",
              shadow: "md",
            }}
            _active={{ transform: "translateY(1px)", shadow: "base" }}
            transition="all .2s ease"
            onClick={() => onSelect(text)}
          >
            {text}
          </Button>
        </WrapItem>
      ))}
    </Wrap>
  );
};

export default QuickReplyButtons;
