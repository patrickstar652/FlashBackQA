import React from "react";
import { IoMdLogIn } from "react-icons/io";
import { TbHome, TbMessageCircle } from "react-icons/tb";
import { Link, useLocation } from "react-router-dom";
import { Box, Button, Flex, HStack, Text } from "@chakra-ui/react";
import Logo from "./Logo";

const Navbar = () => {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  return (
    <Box
      as="nav"
      position="sticky"
      top={0}
      zIndex={50}
      px={{ base: 3, md: 5 }}
      pt={{ base: 3, md: 4 }}
      bg="#f3ede2"
    >
      <Flex justify="center">
        <Flex
          w="100%"
          maxW="1120px"
          align="center"
          justify="space-between"
          px={{ base: 4, md: 5 }}
          py="3"
          borderRadius="999px"
          border="1px solid rgba(60, 57, 52, 0.18)"
          bg="rgba(249, 244, 235, 0.72)"
          boxShadow="0 12px 30px rgba(60, 57, 52, 0.08)"
          sx={{ backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)" }}
        >
          <Link to="/">
            <HStack
              gap={3}
              pr={{ base: 2, md: 4 }}
              _hover={{ opacity: 0.86, transform: "translateY(-1px)" }}
              transition="all 0.2s"
            >
              <Logo size="40px" />
              <Text
                fontSize={{ base: "lg", md: "xl" }}
                fontWeight="800"
                color="#2c2823"
                letterSpacing="-0.02em"
                display={{ base: "none", md: "block" }}
              >
                FlashBackQA
              </Text>
            </HStack>
          </Link>

          <HStack gap={{ base: 2, md: 3 }}>
            <HStack gap={2}>
              <Link to="/">
                <Button
                  size="sm"
                  h="40px"
                  px={{ base: 3, md: 4 }}
                  rounded="full"
                  bg={isActive("/") ? "#191816" : "transparent"}
                  color={isActive("/") ? "white" : "#4a433a"}
                  border={isActive("/") ? "1px solid #191816" : "1px solid transparent"}
                  _hover={{
                    bg: isActive("/") ? "#191816" : "rgba(60, 57, 52, 0.08)",
                  }}
                  gap={2}
                >
                  <TbHome />
                  <Text display={{ base: "none", sm: "inline" }}>
                    {"\u9996\u9801"}
                  </Text>
                </Button>
              </Link>

              <Link to="/chat">
                <Button
                  size="sm"
                  h="40px"
                  px={{ base: 3, md: 4 }}
                  rounded="full"
                  bg={isActive("/chat") ? "#2f78dc" : "transparent"}
                  color={isActive("/chat") ? "white" : "#4a433a"}
                  border={isActive("/chat") ? "1px solid #2f78dc" : "1px solid transparent"}
                  _hover={{
                    bg: isActive("/chat") ? "#2f78dc" : "rgba(47, 120, 220, 0.08)",
                  }}
                  gap={2}
                >
                  <TbMessageCircle />
                  <Text display={{ base: "none", sm: "inline" }}>
                    {"\u804a\u5929"}
                  </Text>
                </Button>
              </Link>
            </HStack>

            <Box h="24px" w="1px" bg="rgba(60, 57, 52, 0.14)" display={{ base: "none", sm: "block" }} />

            <Button
              size="sm"
              h="40px"
              px={{ base: 3, md: 4 }}
              rounded="full"
              variant="outline"
              borderColor="rgba(60, 57, 52, 0.24)"
              color="#332f2a"
              bg="rgba(255, 255, 255, 0.18)"
              _hover={{ bg: "rgba(255, 255, 255, 0.32)" }}
              gap={2}
            >
              <IoMdLogIn />
              <Text display={{ base: "none", sm: "inline" }}>
                {"\u767b\u5165"}
              </Text>
            </Button>
          </HStack>
        </Flex>
      </Flex>
    </Box>
  );
};

export default Navbar;
