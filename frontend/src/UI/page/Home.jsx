import React from "react";
import Navbar from "../component/Navbar";
import {
  Box,
  Container,
  Heading,
  Text,
  Button,
  SimpleGrid,
  Image,
  VStack,
  HStack,
  Icon,
  Flex,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { TbMessageCircle, TbPhoto, TbSparkles, TbHeart } from "react-icons/tb";

export default function Home() {
  const navigate = useNavigate();

  // ==================== 功能特色資料 ====================
  const features = [
    {
      icon: TbPhoto,
      title: "珍藏回憶",
      description: "記錄每一個美好瞬間，讓回憶永不褪色",
    },
    {
      icon: TbMessageCircle,
      title: "智慧對話",
      description: "透過 AI 對話，輕鬆搜尋過往的美好時光",
    },
    {
      icon: TbSparkles,
      title: "AI 助手",
      description: "智能分析您的回憶，提供溫暖的回應",
    },
    {
      icon: TbHeart,
      title: "情感連結",
      description: "與朋友共享回憶，讓感情更緊密",
    },
  ];

  return (
    <Box minH="100vh" bg="#FFFCF7">
      <Navbar />

      {/* ==================== Hero 區域 ==================== */}
      <Box position="relative" overflow="hidden">
        {/* 背景漸層 */}
        <Box
          position="absolute"
          top={0}
          left={0}
          right={0}
          bottom={0}
          bgGradient="linear(to-br, yellow.50, orange.50, pink.50)"
          opacity={0.7}
        />

        <Container maxW="1200px" position="relative" py={{ base: 12, md: 20 }}>
          <Flex
            direction={{ base: "column", lg: "row" }}
            align="center"
            justify="space-between"
            gap={10}
          >
            {/* 左側文字區 */}
            <VStack align={{ base: "center", lg: "flex-start" }} gap={6} flex={1}>
              <Heading
                as="h1"
                fontSize={{ base: "3xl", md: "5xl", lg: "6xl" }}
                fontWeight="bold"
                lineHeight="1.2"
                textAlign={{ base: "center", lg: "left" }}
              >
                <Text as="span" color="gray.800">
                  讓每一段回憶
                </Text>
                <br />
                <Text
                  as="span"
                  bgGradient="linear(to-r, yellow.500, orange.400, pink.400)"
                  bgClip="text"
                >
                  閃閃發光 ✨
                </Text>
              </Heading>

              <Text
                fontSize={{ base: "lg", md: "xl" }}
                color="gray.600"
                maxW="500px"
                textAlign={{ base: "center", lg: "left" }}
              >
                FlashBackQA 是你的 AI 回憶助手，幫助你記錄、整理、重溫那些珍貴的時刻。
                只需簡單對話，就能找到你想要的回憶。
              </Text>

              <HStack gap={4} pt={4}>
                <Button
                  size="lg"
                  colorScheme="yellow"
                  px={8}
                  py={6}
                  fontSize="lg"
                  rounded="full"
                  shadow="lg"
                  _hover={{ transform: "translateY(-2px)", shadow: "xl" }}
                  transition="all 0.2s"
                  onClick={() => navigate("/chat")}
                >
                  開始探索回憶 🔙
                </Button>
              </HStack>
            </VStack>

            {/* 右側照片展示區 */}
            <Box flex={1} position="relative" w="100%" maxW="550px">
              {/* 裝飾圓形背景 */}
              <Box
                position="absolute"
                top="50%"
                left="50%"
                transform="translate(-50%, -50%)"
                w="400px"
                h="400px"
                borderRadius="full"
                bg="yellow.100"
                opacity={0.5}
                filter="blur(40px)"
              />

              {/* 照片堆疊效果 */}
              <Box position="relative" h={{ base: "350px", md: "450px" }}>
                {/* 第一張照片 - 沙灘車 */}
                <Box
                  position="absolute"
                  top={{ base: "0", md: "0" }}
                  left={{ base: "0", md: "0" }}
                  w={{ base: "280px", md: "380px" }}
                  transform="rotate(-6deg)"
                  transition="all 0.3s"
                  _hover={{ transform: "rotate(-3deg) scale(1.02)", zIndex: 10 }}
                  cursor="pointer"
                >
                  <Box
                    bg="white"
                    p={3}
                    pb={12}
                    rounded="lg"
                    shadow="2xl"
                    border="1px solid"
                    borderColor="gray.100"
                  >
                    <Image
                      src="/beach.jpg"
                      alt="沙灘車回憶"
                      rounded="md"
                      objectFit="cover"
                      w="100%"
                      h={{ base: "180px", md: "240px" }}
                    />
                    <Text
                      position="absolute"
                      bottom={4}
                      left={4}
                      fontSize="sm"
                      color="gray.500"
                      fontFamily="cursive"
                    >
                      花蓮沙灘車初體驗 🏖️
                    </Text>
                  </Box>
                </Box>

                {/* 第二張照片 - 街道 */}
                <Box
                  position="absolute"
                  top={{ base: "100px", md: "120px" }}
                  right={{ base: "0", md: "0" }}
                  w={{ base: "260px", md: "350px" }}
                  transform="rotate(4deg)"
                  transition="all 0.3s"
                  _hover={{ transform: "rotate(1deg) scale(1.02)", zIndex: 10 }}
                  cursor="pointer"
                  zIndex={5}
                >
                  <Box
                    bg="white"
                    p={3}
                    pb={12}
                    rounded="lg"
                    shadow="2xl"
                    border="1px solid"
                    borderColor="gray.100"
                  >
                    <Image
                      src="/lunch.jpg"
                      alt="旅遊回憶"
                      rounded="md"
                      objectFit="cover"
                      w="100%"
                      h={{ base: "160px", md: "220px" }}
                    />
                    <Text
                      position="absolute"
                      bottom={4}
                      left={4}
                      fontSize="sm"
                      color="gray.500"
                      fontFamily="cursive"
                    >
                      美食探險之旅 🍜
                    </Text>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Flex>
        </Container>
      </Box>

      {/* ==================== 功能特色區域 ==================== */}
      <Box py={{ base: 16, md: 24 }} bg="white">
        <Container maxW="1200px">
          <VStack gap={4} mb={16}>
            <Heading
              as="h2"
              fontSize={{ base: "2xl", md: "4xl" }}
              fontWeight="bold"
              textAlign="center"
            >
              為什麼選擇 FlashBackQA？
            </Heading>
            <Text fontSize="lg" color="gray.500" textAlign="center" maxW="600px">
              我們用最先進的 AI 技術，讓你的回憶管理變得簡單又有趣
            </Text>
          </VStack>

          <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} gap={8}>
            {features.map((feature, index) => (
              <Box
                key={index}
                p={8}
                bg="#FFFCF7"
                rounded="2xl"
                border="1px solid"
                borderColor="gray.100"
                transition="all 0.3s"
                _hover={{
                  transform: "translateY(-8px)",
                  shadow: "xl",
                  borderColor: "yellow.200",
                }}
              >
                <Box
                  w={14}
                  h={14}
                  bg="yellow.100"
                  rounded="xl"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  mb={5}
                >
                  <Icon as={feature.icon} boxSize={7} color="yellow.600" />
                </Box>
                <Heading as="h3" fontSize="xl" fontWeight="bold" mb={3}>
                  {feature.title}
                </Heading>
                <Text color="gray.500" lineHeight="tall">
                  {feature.description}
                </Text>
              </Box>
            ))}
          </SimpleGrid>
        </Container>
      </Box>

      {/* ==================== CTA 區域 ==================== */}
      <Box
        py={{ base: 16, md: 20 }}
        bgGradient="linear(to-r, yellow.400, orange.400)"
      >
        <Container maxW="800px">
          <VStack gap={6} textAlign="center">
            <Heading
              as="h2"
              fontSize={{ base: "2xl", md: "4xl" }}
              fontWeight="bold"
              color="white"
            >
              準備好探索你的回憶了嗎？
            </Heading>
            <Text fontSize="lg" color="whiteAlpha.900" maxW="500px">
              現在就開始，讓 AI 幫你找到那些被遺忘的美好時光
            </Text>
            <Button
              size="lg"
              bg="white"
              color="orange.500"
              px={10}
              py={6}
              fontSize="lg"
              rounded="full"
              shadow="lg"
              _hover={{
                transform: "translateY(-2px)",
                shadow: "2xl",
                bg: "gray.50",
              }}
              transition="all 0.2s"
              onClick={() => navigate("/chat")}
            >
              立即開始對話 💬
            </Button>
          </VStack>
        </Container>
      </Box>

      {/* ==================== Footer ==================== */}
      <Box py={8} bg="gray.800">
        <Container maxW="1200px">
          <Flex
            direction={{ base: "column", md: "row" }}
            justify="space-between"
            align="center"
            gap={4}
          >
            <HStack gap={2}>
              <Text color="gray.400" fontSize="sm">
                © 2025 FlashBackQA. Made with ❤️
              </Text>
            </HStack>
            <Text color="gray.500" fontSize="sm">
              用 AI 珍藏每一個美好回憶
            </Text>
          </Flex>
        </Container>
      </Box>
    </Box>
  );
}
