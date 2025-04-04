"use client";
import React from "react";
import { Box, Container, VStack, Text, SimpleGrid, useColorModeValue } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { ParticlesBackground } from "../ui/particles-background";
import { useLanguage } from "../../hooks/use-language";
import { languages } from "../../lib/languages";

const MotionBox = motion(Box);

const ContactPage = () => {
  const { language } = useLanguage();
  const t = languages[language];
  const accentColor = "#CB9A99";
  const textColor = useColorModeValue("gray.800", "white");
  const cardTextColor = useColorModeValue("gray.900", "gray.900");

  return (
    <Box
      minH="100vh"
      position="relative"
      overflow="hidden"
    >
      <ParticlesBackground />
      <Container maxW="container.xl" position="relative" zIndex="1" py={20}>
        <VStack spacing={12}>
          {/* Hero Section */}
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            textAlign="center"
            maxW="800px"
            mx="auto"
          >
            <Text
              fontSize={{ base: "4xl", md: "5xl", lg: "6xl" }}
              fontWeight="bold"
              mb={6}
              color={accentColor}
              textShadow="0 2px 4px rgba(0,0,0,0.1)"
            >
              {language === 'es' ? 'Contacto' : 'Contact'}
            </Text>
            <Text
              fontSize={{ base: "lg", md: "xl" }}
              color={textColor}
              lineHeight="tall"
              fontWeight="medium"
            >
              {t.contact.messagePlaceholder}
            </Text>
          </MotionBox>

          {/* Contact Information */}
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8} width="100%">
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
                {language === 'es' ? 'Información de Contacto' : 'Contact Information'}
              </Text>
              <VStack spacing={6} align="start">
                <Box>
                  <Text fontWeight="bold" color={cardTextColor}>{t.contact.location}:</Text>
                  <Text color={cardTextColor} fontWeight="medium">123 Beach Road, Bondi Beach, NSW 2026, Australia</Text>
                </Box>
                <Box>
                  <Text fontWeight="bold" color={cardTextColor}>{t.contact.phone}:</Text>
                  <Text color={cardTextColor} fontWeight="medium">+61 2 1234 5678</Text>
                </Box>
                <Box>
                  <Text fontWeight="bold" color={cardTextColor}>{t.contact.email}:</Text>
                  <Text color={cardTextColor} fontWeight="medium">takeiteasyrentacar@gmail.com</Text>
                </Box>
                <Box>
                  <Text fontWeight="bold" color={cardTextColor}>{t.contact.hours}:</Text>
                  <Text color={cardTextColor} fontWeight="medium">Monday - Friday: 9:00 AM - 6:00 PM</Text>
                  <Text color={cardTextColor} fontWeight="medium">Saturday: 10:00 AM - 4:00 PM</Text>
                  <Text color={cardTextColor} fontWeight="medium">Sunday: Closed</Text>
                </Box>
              </VStack>
            </MotionBox>

            {/* Map Section */}
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
                {language === 'es' ? 'Ubicación' : 'Location'}
              </Text>
              <Box
                as="iframe"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3312.838977435104!2d151.2755693152108!3d-33.89148498078976!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6b12b1d4d419d5c1%3A0x5045675218ccd30!2sBondi%20Beach!5e0!3m2!1sen!2sau!4v1712345678901!5m2!1sen!2sau"
                width="100%"
                height="400"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                borderRadius="xl"
              />
            </MotionBox>
          </SimpleGrid>
        </VStack>
      </Container>
    </Box>
  );
};

export default ContactPage;
