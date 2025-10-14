import React from "react";
import { IoMdLogIn } from "react-icons/io";
import { Flex, Spacer, Box, IconButton, Image, HStack } from "@chakra-ui/react";

const Navbar = () => {
  return (
    <Flex align="center" p={4} borderBottom="1px solid" borderColor="gray.200">
      <HStack gap={3}>
        <Box
          as="img"
          src="/logo.png"
          alt="FlashBackQA Logo"
          boxSize="48px"
        />
        <Box fontSize="xl" fontWeight="bold">
          FlashBackQA
        </Box>
      </HStack>
      <Spacer />
      <Box mr={4}>
        <IconButton rounded="md" gap={2} px={4} py={2}>
          <IoMdLogIn />
          登入
        </IconButton>
      </Box>
    </Flex>
  );
};
export default Navbar;
