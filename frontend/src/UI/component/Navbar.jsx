import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Box, Button, Flex, HStack, Text } from "@chakra-ui/react";
import { TbCircleFilled } from "react-icons/tb";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isActive = (path) => location.pathname === path;

  return (
    <Box
      as="nav"
      position="sticky"
      top={0}
      zIndex={50}
      px={{ base: 2.5, md: 6 }}
      pt={{ base: 2, md: 5 }}
      pb={{ base: 1.5, md: 2 }}
      bg="#f3ede2"
    >
      <Flex justify="center">
        <Flex
          w="100%"
          maxW="1500px"
          align="center"
          justify="space-between"
          gap={{ base: 2, md: 4 }}
          px={{ base: 2.5, md: 4 }}
          py={{ base: 2.5, md: 4 }}
          borderRadius="999px"
          border="2px solid rgba(9, 8, 7, 0.16)"
          bg="rgba(243, 237, 226, 0.86)"
          boxShadow="0 12px 28px rgba(9, 8, 7, 0.12)"
          sx={{ backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)" }}
        >
          <Link to="/">
            <HStack gap={{ base: 2, md: 4 }} minW={{ base: "auto", lg: "330px" }}>
              <Flex
                w={{ base: "66px", sm: "82px", md: "112px" }}
                h={{ base: "40px", sm: "48px", md: "58px" }}
                align="center"
                justify="center"
                bg="#050505"
                color="#fbf8ef"
                borderRadius={{ base: "14px", md: "20px" }}
                fontFamily="Impact, 'Arial Black', sans-serif"
                fontSize={{ base: "md", sm: "xl", md: "2xl" }}
                fontWeight="900"
                letterSpacing="0"
              >
                F.QA
              </Flex>
              <Box display={{ base: "none", md: "block" }}>
                <Text color="#0a0908" fontSize="lg" fontWeight="900" lineHeight="1.15">
                  Flashback QA
                </Text>
                <Text color="#777064" fontSize="sm">
                  像老同學還記得一樣，問回那些舊故事。
                </Text>
              </Box>
            </HStack>
          </Link>

          <HStack
            gap={{ base: 1, md: 3 }}
            position={{ base: "static", lg: "absolute" }}
            left="50%"
            transform={{ base: "none", lg: "translateX(-50%)" }}
          >
            <Link to="/">
              <Button
                h={{ base: "38px", sm: "42px", md: "48px" }}
                px={{ base: 3, sm: 4, md: 6 }}
                borderRadius="999px"
                bg={isActive("/") ? "#ffeeb8" : "transparent"}
                color="#292620"
                fontSize={{ base: "sm", md: "md" }}
                fontWeight={isActive("/") ? "800" : "500"}
                _hover={{ bg: isActive("/") ? "#ffeeb8" : "rgba(9, 8, 7, 0.06)" }}
              >
                首頁
              </Button>
            </Link>

            <Link to="/chat">
              <Button
                h={{ base: "38px", sm: "42px", md: "48px" }}
                px={{ base: 3, sm: 4, md: 6 }}
                borderRadius="999px"
                bg={isActive("/chat") ? "#ffeeb8" : "transparent"}
                color="#6f675f"
                fontSize={{ base: "sm", md: "md" }}
                fontWeight={isActive("/chat") ? "800" : "500"}
                _hover={{ bg: isActive("/chat") ? "#ffeeb8" : "rgba(9, 8, 7, 0.06)" }}
              >
                聊天
              </Button>
            </Link>
          </HStack>

          <HStack gap={3} display={{ base: "none", md: "flex" }} minW={{ lg: "330px" }} justify="flex-end">
            <HStack
              h="48px"
              px={5}
              border="2px solid #151311"
              borderRadius="999px"
              bg="#f3ede2"
              boxShadow="4px 4px 0 rgba(9, 8, 7, 0.1)"
              gap={3}
            >
              <TbCircleFilled size={10} color="#2582ff" />
              <Text
                color="#4e4841"
                fontFamily="'Courier New', monospace"
                fontSize="sm"
                fontWeight="900"
                letterSpacing="0.16em"
              >
                記憶檢索
              </Text>
            </HStack>

            <Button
              h="52px"
              px={7}
              bg="#050505"
              color="white"
              borderRadius="999px"
              border="2px solid #050505"
              fontSize="md"
              fontWeight="900"
              _hover={{ bg: "#171717", transform: "translateY(-1px)" }}
              onClick={() => navigate("/chat")}
            >
              開始聊天
            </Button>
          </HStack>
        </Flex>
      </Flex>
    </Box>
  );
};

export default Navbar;
