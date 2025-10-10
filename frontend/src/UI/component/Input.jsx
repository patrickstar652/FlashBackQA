import { Textarea, Flex, IconButton } from "@chakra-ui/react";
import { TbSend2 } from "react-icons/tb";

const Input = () => {
  // arrow function
  return (
    <>
      <Flex>
        <Textarea
          placeholder="Type your message..."
          variant="outline"
          size="xs"
          resize="none"
          autoresize
        />
        <IconButton  rounded="full">
          <TbSend2 />
        </IconButton>
      </Flex>
    </>
  );
};

export default Input;
