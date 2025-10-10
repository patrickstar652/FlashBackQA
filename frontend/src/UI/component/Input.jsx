import { Textarea, Flex, IconButton } from "@chakra-ui/react";
import { TbSend2 } from "react-icons/tb";

const Input = () => {
  // arrow function
  return (
    <>
      <Flex>
        <Textarea
          placeholder="探索回憶...🔙"
          variant="outline"
          size="xs"
          resize="none"
          autoresize
          rounded="full"
          pt={5}
          pb={2}
        />
        <IconButton  rounded="full">
          <TbSend2 />
        </IconButton>
      </Flex>
    </>
  );
};

export default Input;
