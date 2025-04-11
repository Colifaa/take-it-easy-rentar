"use client";
import React from "react";
import { Box, Container, VStack, Text, SimpleGrid, Image, useColorModeValue, Heading } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { ParticlesBackground } from "../ui/particles-background";
import { useLanguage } from "../../hooks/use-language";
import { languages } from "../../lib/languages";

const MotionBox = motion(Box);

const AboutPage = () => {
  const { language } = useLanguage();
  const t = languages[language];
  const accentColor = "#CB9A99";
  const textColor = useColorModeValue("gray.800", "gray.800");
  const cardTextColor = useColorModeValue("gray.900", "gray.900");

  return (
    <Box
      minH="100vh"
      position="relative"
      overflow="hidden"
    >
      <ParticlesBackground />
      <Container maxW="container.xl" position="relative" zIndex="1" py={20}>
        <VStack spacing={20}>
          {/* Hero Section */}
          <MotionBox
           initial={{ opacity: 0, x: -20 }}
           whileInView={{ opacity: 1, x: 0 }}
           transition={{ duration: 0.8 }}
           viewport={{ once: true }}
           p={8}
           borderRadius="2xl"
           bg="linear-gradient(135deg, #F8E5E5 0%, #FFF5F5 100%)"
           boxShadow="xl"
           border={`1px solid ${accentColor}20`}
           backdropFilter="blur(10px)"
           _hover={{
             transform: "translateY(-5px)",
             boxShadow: "2xl",
             transition: "all 0.3s ease-in-out",
           }}
          >
            <Text
              fontSize={{ base: "4xl", md: "5xl", lg: "6xl" }}
              fontWeight="bold"
              mb={6}
              color={accentColor}
              textShadow="0 2px 4px rgba(0,0,0,0.1)"
              textAlign="center"
            >
              {t.about.title}
            </Text>
            <Text
              fontSize={{ base: "lg", md: "xl" }}
              color={textColor}
              lineHeight="tall"
              fontWeight="medium"
            >
              {t.about.paragraph1}
            </Text>
          </MotionBox>

          {/* Mission & Vision */}
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={10} width="full">
            <MotionBox
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              p={8}
              borderRadius="2xl"
              bg="linear-gradient(135deg, #F8E5E5 0%, #FFF5F5 100%)"
              boxShadow="xl"
              border={`1px solid ${accentColor}20`}
              backdropFilter="blur(10px)"
              _hover={{
                transform: "translateY(-5px)",
                boxShadow: "2xl",
                transition: "all 0.3s ease-in-out",
              }}
            >
              <Text fontSize="2xl" fontWeight="bold" mb={6} color={accentColor}>
                {t.about.paragraph3}
              </Text>
              <Text color={cardTextColor} fontSize="lg" lineHeight="tall" fontWeight="medium">
                {t.about.description1}
              </Text>
            </MotionBox>

            <MotionBox
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              p={8}
              borderRadius="2xl"
              bg="linear-gradient(135deg, #F8E5E5 0%, #FFF5F5 100%)"
              boxShadow="xl"
              border={`1px solid ${accentColor}20`}
              backdropFilter="blur(10px)"
              _hover={{
                transform: "translateY(-5px)",
                boxShadow: "2xl",
                transition: "all 0.3s ease-in-out",
              }}
            >
              <Text fontSize="2xl" fontWeight="bold" mb={6} color={accentColor}>
                {t.about.paragraph4}
              </Text>
              <Text color={cardTextColor} fontSize="lg" lineHeight="tall" fontWeight="medium">
                {t.about.description2}
              </Text>
            </MotionBox>
          </SimpleGrid>

          {/* Values Section */}
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            p={8}
            borderRadius="2xl"
            bg="linear-gradient(135deg, #F8E5E5 0%, #FFF5F5 100%)"
            boxShadow="xl"
            border={`1px solid ${accentColor}20`}
            backdropFilter="blur(10px)"
            _hover={{
              transform: "translateY(-5px)",
              boxShadow: "2xl",
              transition: "all 0.3s ease-in-out",
            }}
            width="full"
          >
            <Text fontSize="2xl" fontWeight="bold" mb={6} color={accentColor}>
              {t.about.paragraph5}
            </Text>
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8}>
              {[
                { title: t.about.paragraph6, description: t.about.description3 },
                { title: t.about.paragraph3, description: t.about.description1 },
                { title: t.about.paragraph4, description: t.about.description2 },
              ].map((value, index) => (
                <Box key={index} p={6} borderRadius="xl" bg="white" boxShadow="md">
                  <Text fontSize="xl" fontWeight="bold" mb={4} color={accentColor}>
                    {value.title}
                  </Text>
                  <Text color={cardTextColor} fontWeight="medium">{value.description}</Text>
                </Box>
              ))}
            </SimpleGrid>
          </MotionBox>


        </VStack>
      </Container>
    </Box>
  );
};

export default AboutPage;