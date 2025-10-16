import { Textarea, Flex, IconButton, Center } from "@chakra-ui/react";
import { TbSend2 } from "react-icons/tb";
import { useState } from "react";
import axios from "axios";

const Input = () => {
  const [inputValue, setInputValue] = useState("");
  const handleForm = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/query", {
        question: inputValue,
      });
      setInputValue("");
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <>
      <form action="" onSubmit={handleForm}>
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
            focusRingColor="yellow.600"
            border="1px solid "
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <IconButton rounded="full">
            <TbSend2 />
          </IconButton>
        </Flex>
      </form>
    </>
  );
};

export default Input;
