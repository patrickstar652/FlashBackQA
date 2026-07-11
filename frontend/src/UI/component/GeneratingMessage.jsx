import { Box, Flex, Text } from "@chakra-ui/react";
import { motion } from "framer-motion";

const MotionDiv = motion.div;
const MotionSpan = motion.span;

const GeneratingMessage = ({ timestamp }) => {
  return (
    <MotionDiv
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22, ease: "easeOut" }}
      style={{ width: "100%" }}
    >
      <Flex direction="column" align="flex-start" w="100%" mb={{ base: 7, md: 10 }}>
        <Text
          mb={3}
          fontSize="sm"
          letterSpacing="0.18em"
          color="#635948"
          fontWeight="700"
        >
          FQA-bot
        </Text>

        <Box maxW={{ base: "100%", sm: "92%", md: "78%" }}>
          <Box
            bg="#f8f4eb"
            color="#45403a"
            px={{ base: 4, md: 6 }}
            py={{ base: 3.5, md: 5 }}
            borderRadius={{ base: "22px", md: "30px" }}
            border="2px solid #3c3934"
            boxShadow="0 8px 24px rgba(60, 57, 52, 0.08)"
          >
            <Flex align="center" gap={3}>
              <Text mb={0} lineHeight="1.9" fontWeight="600">
                正在整理回憶
              </Text>
              <Flex as="span" align="center" gap={1.5} aria-label="生成中">
                {[0, 1, 2].map((dot) => (
                  <MotionSpan
                    key={dot}
                    animate={{ opacity: [0.35, 1, 0.35], y: [0, -5, 0] }}
                    transition={{
                      duration: 0.9,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: dot * 0.15,
                    }}
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: 999,
                      background: "#2f78dc",
                      display: "inline-block",
                    }}
                  />
                ))}
              </Flex>
            </Flex>
          </Box>

          {timestamp && (
            <Text fontSize="xs" color="#8a7e6f" mt="2" px="2" textAlign="left">
              {timestamp}
            </Text>
          )}
        </Box>
      </Flex>
    </MotionDiv>
  );
};

export default GeneratingMessage;
