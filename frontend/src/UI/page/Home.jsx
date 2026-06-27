import React from "react";
import {
  Badge,
  Box,
  Button,
  Container,
  Flex,
  Grid,
  GridItem,
  Heading,
  HStack,
  Image,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { TbArrowRight, TbCircleFilled, TbMessageCircle } from "react-icons/tb";
import Navbar from "../component/Navbar";

const proofPoints = [
  "介面清楚，回憶保留中文語境",
  "回答都有來源依據",
  "為真實共同記憶設計",
];

const memoryCards = [
  {
    label: "01",
    title: "Class Fragments",
    text: "人名、旅行、老師、綽號與細碎片段，都能在多年後重新被找回來。",
  },
  {
    label: "02",
    title: "Grounded Replies",
    text: "聊天機器人會先找出相關資料，再根據脈絡回答，不是憑空亂猜。",
  },
  {
    label: "03",
    title: "Warm Recall",
    text: "用平常聊天的方式提問，讓資料庫把那段共同故事重新帶回眼前。",
  },
];

export default function Home() {
  const navigate = useNavigate();

  return (
    <Box
      minH="100vh"
      bg="#f6f1e7"
      color="#090807"
      backgroundImage="
        radial-gradient(circle at 1px 1px, rgba(12, 10, 8, 0.08) 1px, transparent 0),
        linear-gradient(105deg, rgba(255, 205, 0, 0.16) 0%, rgba(255, 255, 255, 0) 34%),
        linear-gradient(180deg, #fbf8ef 0%, #f0ece3 100%)
      "
      backgroundSize="22px 22px, 100% 100%, 100% 100%"
      overflow="hidden"
    >
      <Navbar />

      <Box as="main" pt={{ base: 8, md: 14 }} pb={{ base: 16, md: 24 }}>
        <Container maxW="1500px" px={{ base: 5, md: 8 }}>
          <Grid
            templateColumns={{ base: "1fr", lg: "minmax(0, 1.04fr) minmax(430px, 0.72fr)" }}
            gap={{ base: 12, lg: 8 }}
            alignItems="end"
          >
            <GridItem minW={0}>
              <VStack align="stretch" gap={{ base: 7, md: 9 }}>
                <Badge
                  alignSelf="flex-start"
                  display="inline-flex"
                  alignItems="center"
                  gap={3}
                  px={{ base: 4, md: 5 }}
                  py={3}
                  bg="#ffcc05"
                  color="#0a0908"
                  border="2px solid #0a0908"
                  borderRadius="999px"
                  boxShadow="10px 10px 0 rgba(10, 9, 8, 0.13)"
                  fontFamily="'Arial Narrow', Impact, sans-serif"
                  fontSize={{ base: "xs", md: "sm" }}
                  fontWeight="900"
                  letterSpacing="0.18em"
                >
                  共同故事，隨時可搜尋
                  <Box as="span" px={3} py={1} bg="#050505" color="white" borderRadius="999px">
                    RAG
                  </Box>
                </Badge>

                <Heading
                  as="h1"
                  fontFamily="Impact, 'Arial Black', sans-serif"
                  fontSize={{ base: "clamp(4rem, 18vw, 7.4rem)", md: "clamp(6.4rem, 12vw, 11.5rem)" }}
                  lineHeight="0.94"
                  fontWeight="900"
                  letterSpacing="0"
                  textTransform="uppercase"
                >
                  <Box as="span" display="block">
                    Ask
                  </Box>
                  <Box as="span" display="block">
                    Your
                  </Box>
                  <Box
                    as="span"
                    display="inline-block"
                    bg="#2582ff"
                    color="#fffaf0"
                    px={{ base: 3, md: 5 }}
                    pt={{ base: 0, md: 1 }}
                    pb={{ base: 1, md: 2 }}
                    mt={{ base: 3, md: 5 }}
                    mb={{ base: 3, md: 5 }}
                    borderRadius={{ base: "10px", md: "14px" }}
                    boxShadow="0 10px 0 rgba(37, 130, 255, 0.16)"
                  >
                    Memories
                  </Box>
                  <Box as="span" display="block">
                    Back
                  </Box>
                </Heading>

                <Text
                  maxW="760px"
                  color="#6b6258"
                  fontSize={{ base: "lg", md: "2xl" }}
                  lineHeight="1.75"
                >
                  FlashBack QA 是為國中同學打造的 RAG 聊天機器人，能一起找回班級回憶、
                  有趣瞬間、內部笑話、老師與舊故事，讓重溫過去不只是另一個普通 AI 應用。
                </Text>

                <Flex
                  direction={{ base: "column", md: "row" }}
                  align={{ base: "stretch", md: "center" }}
                  gap={{ base: 5, md: 8 }}
                >
                  <Button
                    h="58px"
                    px={8}
                    bg="#050505"
                    color="white"
                    borderRadius="999px"
                    border="2px solid #050505"
                    fontSize="lg"
                    fontWeight="900"
                    boxShadow="0 8px 0 rgba(5, 5, 5, 0.14)"
                    _hover={{ bg: "#171717", transform: "translateY(-2px)" }}
                    _active={{ transform: "translateY(1px)", boxShadow: "0 4px 0 rgba(5, 5, 5, 0.14)" }}
                    transition="all 0.16s"
                    onClick={() => navigate("/chat")}
                  >
                    開始聊天
                    <TbArrowRight />
                  </Button>

                  <HStack
                    gap={{ base: 3, md: 5 }}
                    color="#777064"
                    fontSize={{ base: "sm", md: "md" }}
                    flexWrap="wrap"
                  >
                    {proofPoints.map((point) => (
                      <HStack key={point} gap={2}>
                        <Box w="7px" h="7px" bg="#a39a8e" borderRadius="full" />
                        <Text>{point}</Text>
                      </HStack>
                    ))}
                  </HStack>
                </Flex>
              </VStack>
            </GridItem>

            <GridItem>
              <Box
                position="relative"
                border="2px solid #151311"
                borderRadius={{ base: "28px", md: "34px" }}
                bg="rgba(250, 247, 239, 0.8)"
                p={{ base: 4, md: 7 }}
                boxShadow="18px 18px 0 rgba(10, 9, 8, 0.08)"
              >
                <Badge
                  position="absolute"
                  top={{ base: 5, md: 7 }}
                  right={{ base: 4, md: 7 }}
                  px={5}
                  py={3}
                  bg="#ffcc05"
                  color="#070707"
                  border="2px solid #080808"
                  borderRadius="16px"
                  transform="rotate(7deg)"
                  boxShadow="7px 7px 0 rgba(10, 9, 8, 0.12)"
                  fontSize={{ base: "sm", md: "lg" }}
                  fontWeight="900"
                  letterSpacing="0"
                >
                  已啟用 RAG
                </Badge>

                <Box
                  mt={{ base: 18, md: 24 }}
                  p={{ base: 6, md: 8 }}
                  border="2px solid #151311"
                  borderRadius={{ base: "22px", md: "28px" }}
                  bg="#fbf8ef"
                >
                  <Heading
                    as="h2"
                    fontFamily="Impact, 'Arial Black', sans-serif"
                    fontSize={{ base: "3rem", md: "4.4rem" }}
                    lineHeight="0.92"
                    letterSpacing="0"
                    textTransform="uppercase"
                    mb={7}
                  >
                    Not just
                    <br />
                    nostalgia.
                    <br />
                    Context.
                  </Heading>

                  <Text color="#6e665d" fontSize={{ base: "md", md: "lg" }} lineHeight="1.9" mb={7}>
                    輸入一個名字、一趟旅行，或一段奇怪的班級傳聞，系統會先找回相關片段，
                    再整理成回答。感覺是溫暖的，檢索則是精準的。
                  </Text>

                  <Grid templateColumns={{ base: "1fr", md: "repeat(2, minmax(0, 1fr))" }} gap={5}>
                    {[
                      { src: "/beach.jpg", alt: "畢旅回憶", caption: "畢旅資料" },
                      { src: "/lunch.jpg", alt: "午餐回憶", caption: "午餐紀錄" },
                    ].map((item) => (
                      <Box
                        key={item.src}
                        bg="#f6f1e7"
                        border="2px solid #151311"
                        borderRadius="18px"
                        p={3}
                        transform={item.src.includes("beach") ? "rotate(-2deg)" : "rotate(2deg)"}
                        boxShadow="7px 7px 0 rgba(10, 9, 8, 0.09)"
                      >
                        <Image
                          src={item.src}
                          alt={item.alt}
                          w="100%"
                          h={{ base: "180px", md: "180px", lg: "210px" }}
                          objectFit="cover"
                          borderRadius="12px"
                          filter="saturate(0.75) contrast(1.08)"
                        />
                        <Text
                          mt={2}
                          color="#6f675f"
                          fontFamily="'Courier New', monospace"
                          fontSize="xs"
                          fontWeight="900"
                          letterSpacing="0.12em"
                        >
                          {item.caption}
                        </Text>
                      </Box>
                    ))}
                  </Grid>
                </Box>
              </Box>
            </GridItem>
          </Grid>
        </Container>

        <Container maxW="1280px" px={{ base: 5, md: 8 }} mt={{ base: 16, md: 24 }}>
          <Grid templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }} gap={5}>
            {memoryCards.map((card) => (
              <Box
                key={card.label}
                bg="#fbf8ef"
                border="2px solid #151311"
                borderRadius="18px"
                p={{ base: 5, md: 6 }}
                boxShadow="8px 8px 0 rgba(10, 9, 8, 0.08)"
              >
                <HStack justify="space-between" mb={8}>
                  <Text
                    fontFamily="'Courier New', monospace"
                    fontWeight="900"
                    color="#777064"
                    letterSpacing="0.12em"
                  >
                    {card.label}
                  </Text>
                  <TbCircleFilled color="#2582ff" />
                </HStack>
                <Heading
                  as="h3"
                  fontFamily="Impact, 'Arial Black', sans-serif"
                  fontSize={{ base: "2rem", md: "2.5rem" }}
                  lineHeight="0.95"
                  letterSpacing="0"
                  textTransform="uppercase"
                  mb={4}
                >
                  {card.title}
                </Heading>
                <Text color="#6b6258" lineHeight="1.75">
                  {card.text}
                </Text>
              </Box>
            ))}
          </Grid>
        </Container>
      </Box>

      <Box bg="#050505" color="#f6f1e7" py={7}>
        <Container maxW="1280px" px={{ base: 5, md: 8 }}>
          <Flex
            align={{ base: "flex-start", md: "center" }}
            justify="space-between"
            gap={5}
            direction={{ base: "column", md: "row" }}
          >
            <HStack gap={3}>
              <TbMessageCircle />
              <Text fontWeight="800">FlashBack QA</Text>
            </HStack>
            <Text color="#aca59b">先找回故事，再給出回答。</Text>
          </Flex>
        </Container>
      </Box>
    </Box>
  );
}
