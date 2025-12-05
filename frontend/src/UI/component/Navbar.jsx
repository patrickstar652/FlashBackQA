import React from "react";
import { IoMdLogIn } from "react-icons/io";
import { TbHome, TbMessageCircle } from "react-icons/tb";
import { Link, useLocation } from "react-router-dom";
import { Flex, HStack, Box, Button, Text } from "@chakra-ui/react";
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
      w="100%"
      bg="white"
      borderBottom="1px solid"
      borderColor="gray.200"
      backdropFilter="blur(8px)"
    >
      <Flex
        maxW="1200px"
        mx="auto"
        px={{ base: 4, md: 6 }}
        h="64px"
        align="center"
        justify="space-between"
      >
        {/* Left - Logo Area */}
        <Link to="/">
          <HStack gap={3} _hover={{ opacity: 0.8, transform: "scale(1.02)" }} transition="all 0.2s">
            <Logo size="44px" />
            <Text
              fontSize="xl"
              fontWeight="bold"
              color="gray.800"
              display={{ base: "none", md: "block" }}
            >
              FlashBackQA
            </Text>
          </HStack>
        </Link>

        {/* Right Section */}
        <HStack gap={4}>
          {/* Navigation Links */}
          <HStack gap={2}>
            <Link to="/">
              <Button
                size="sm"
                rounded="full"
                variant={isActive("/") ? "solid" : "ghost"}
                colorScheme={isActive("/") ? "yellow" : "gray"}
                gap={2}
              >
                <TbHome />
                <Text display={{ base: "none", sm: "inline" }}>首頁</Text>
              </Button>
            </Link>

            <Link to="/chat">
              <Button
                size="sm"
                rounded="full"
                variant={isActive("/chat") ? "solid" : "ghost"}
                colorScheme={isActive("/chat") ? "yellow" : "gray"}
                gap={2}
              >
                <TbMessageCircle />
                <Text display={{ base: "none", sm: "inline" }}>探索回憶</Text>
              </Button>
            </Link>
          </HStack>

          {/* Separator */}
          <Box
            h="24px"
            w="1px"
            bg="gray.200"
            display={{ base: "none", sm: "block" }}
          />

          {/* Login Button */}
          <Button
            size="sm"
            rounded="full"
            variant="outline"
            gap={2}
          >
            <IoMdLogIn />
            <Text display={{ base: "none", sm: "inline" }}>登入</Text>
          </Button>
        </HStack>
      </Flex>
    </Box>
  );
};

export default Navbar;