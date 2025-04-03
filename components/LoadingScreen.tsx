"use client";

import Image from "next/image";
import { Box, Text } from "@chakra-ui/react";
import { keyframes } from "@emotion/react";

const pulse = keyframes`
  0% { opacity: 0.5; }
  50% { opacity: 1; }
  100% { opacity: 0.5; }
`;

export default function LoadingScreen() {
  return (
    <Box
      position="fixed"
      top={0}
      left={0}
      right={0}
      bottom={0}
      display="flex"
      alignItems="center"
      justifyContent="center"
      bgGradient="linear(to-r, #c47369, #d8847a)"
      zIndex={9999}
    >
      <Box
        position="absolute"
        top={0}
        left={0}
        right={0}
        bottom={0}
        opacity={0.7}
      >
        <Image
          src="/auto.png"
          alt="Cargando autos"
          layout="fill"
          objectFit="cover"
          priority
        />
      </Box>

      <Box
        position="relative"
        zIndex={1}
        textAlign="center"
        animation={`${pulse} 2s infinite`}
      >
        <Text
          fontSize="3xl"
          fontWeight="bold"
          color="white"
          bg="blackAlpha.500"
          px={6}
          py={2}
          borderRadius="md"
          boxShadow="xl"
        >
          Loading...
        </Text>
      </Box>
    </Box>
  );
}
