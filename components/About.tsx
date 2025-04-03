"use client";
import React, { useEffect, useRef } from "react";
import { motion, useAnimation, useInView } from "framer-motion";
import { Box, Text, VStack, HStack, Icon, useColorModeValue, Container, SimpleGrid } from "@chakra-ui/react";
import { FaCar, FaShieldAlt, FaHandshake, FaClock, FaMapMarkerAlt, FaPhone, FaEnvelope } from "react-icons/fa";
import { useLanguage } from "../hooks/use-language";
import { languages } from "../lib/languages";

const About = () => {
  const { language } = useLanguage();
  const t = languages[language];
  const controls = useAnimation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [controls, isInView]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10,
      },
    },
  };

  const bgColor = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.800", "white");
  const cardBgColor = useColorModeValue("white", "gray.700");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  return (
    <Box
      ref={ref}
      as={motion.div}
      initial="hidden"
      animate={controls}
      variants={containerVariants}
      className="min-h-screen py-16 px-4 sm:px-6 lg:px-8"
      bg={bgColor}
      color={textColor}
      position="relative"
      overflow="hidden"
    >
      {/* Background Elements */}
      <Box
        position="absolute"
        top="0"
        left="0"
        right="0"
        height="400px"
        bgGradient="linear(to-b, #00968820, transparent)"
        zIndex="0"
      />
      <Box
        position="absolute"
        bottom="0"
        left="0"
        right="0"
        height="400px"
        bgGradient="linear(to-t, #4DB6AC20, transparent)"
        zIndex="0"
      />

      <Container maxW="1200px" position="relative" zIndex="1">
        <VStack spacing={16}>
          {/* Hero Section */}
          <motion.div
            variants={itemVariants}
            className="text-center"
          >
            <Text
              fontSize={{ base: "4xl", md: "5xl", lg: "6xl" }}
              fontWeight="bold"
              className="mb-6"
              bgGradient="linear(to-r, #009688, #4DB6AC)"
              bgClip="text"
              textShadow="0 2px 4px rgba(0,0,0,0.1)"
            >
              Sobre Nosotros
            </Text>
            <Text
              fontSize={{ base: "lg", md: "xl" }}
              maxW="800px"
              mx="auto"
              className="text-gray-600 dark:text-gray-300"
              lineHeight="tall"
            >
              Somos una empresa dedicada a proporcionar el mejor servicio de alquiler de vehículos. Nuestra misión es hacer que tu experiencia de alquiler sea fácil, segura y placentera.
            </Text>
          </motion.div>

          {/* Features Grid */}
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8} width="full">
            {[
              {
                icon: FaCar,
                title: "Calidad Garantizada",
                description: "Nuestros vehículos son inspeccionados regularmente para garantizar el mejor rendimiento y seguridad.",
                color: "#009688",
              },
              {
                icon: FaShieldAlt,
                title: "Seguridad Total",
                description: "Implementamos las más altas medidas de seguridad para proteger tu información y garantizar transacciones seguras.",
                color: "#4DB6AC",
              },
              {
                icon: FaHandshake,
                title: "Servicio Excepcional",
                description: "Nuestro equipo está comprometido a brindarte la mejor atención y soporte durante todo el proceso.",
                color: "#009688",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
                }}
                className="p-8 rounded-2xl"
                style={{ 
                  backgroundColor: cardBgColor,
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                  border: `1px solid ${borderColor}`,
                }}
              >
                <div className="flex items-center mb-6">
                  <div
                    className="p-4 rounded-full mr-4"
                    style={{ 
                      backgroundColor: `${feature.color}20`,
                      boxShadow: `0 4px 6px -1px ${feature.color}40`
                    }}
                  >
                    <Icon
                      as={feature.icon}
                      boxSize={8}
                      style={{ color: feature.color }}
                    />
                  </div>
                  <Text fontSize="2xl" fontWeight="bold" className="text-gray-800 dark:text-white">
                    {feature.title}
                  </Text>
                </div>
                <Text className="text-gray-600 dark:text-gray-300" lineHeight="tall">
                  {feature.description}
                </Text>
              </motion.div>
            ))}
          </SimpleGrid>

          {/* Contact Section */}
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8} width="full">
            {[
              {
                icon: FaMapMarkerAlt,
                title: "Dirección",
                content: "Av. Principal #123, Ciudad",
                color: "#009688",
              },
              {
                icon: FaPhone,
                title: "Teléfono",
                content: "+1 234 567 890",
                color: "#4DB6AC",
              },
              {
                icon: FaEnvelope,
                title: "Correo electrónico",
                content: "contacto@takeiteasyrentar.com",
                color: "#009688",
              },
            ].map((contact, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
                }}
                className="p-8 rounded-2xl"
                style={{ 
                  backgroundColor: cardBgColor,
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                  border: `1px solid ${borderColor}`,
                }}
              >
                <div className="flex items-center mb-6">
                  <div
                    className="p-4 rounded-full mr-4"
                    style={{ 
                      backgroundColor: `${contact.color}20`,
                      boxShadow: `0 4px 6px -1px ${contact.color}40`
                    }}
                  >
                    <Icon
                      as={contact.icon}
                      boxSize={8}
                      style={{ color: contact.color }}
                    />
                  </div>
                  <Text fontSize="2xl" fontWeight="bold" className="text-gray-800 dark:text-white">
                    {contact.title}
                  </Text>
                </div>
                <Text className="text-gray-600 dark:text-gray-300" fontSize="lg">
                  {contact.content}
                </Text>
              </motion.div>
            ))}
          </SimpleGrid>

          {/* Business Hours */}
          <motion.div
            variants={itemVariants}
            className="w-full"
          >
            <div 
              className="p-8 rounded-2xl"
              style={{ 
                backgroundColor: cardBgColor,
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                border: `1px solid ${borderColor}`,
              }}
            >
              <div className="flex items-center mb-6">
                <div
                  className="p-4 rounded-full mr-4"
                  style={{ 
                    backgroundColor: "#4DB6AC20",
                    boxShadow: "0 4px 6px -1px #4DB6AC40"
                  }}
                >
                  <Icon
                    as={FaClock}
                    boxSize={8}
                    style={{ color: "#4DB6AC" }}
                  />
                </div>
                <Text fontSize="2xl" fontWeight="bold" className="text-gray-800 dark:text-white">
                  Horario de Atención
                </Text>
              </div>
              <div className="space-y-4">
                {[
                  { day: "Lunes a Viernes", hours: "9:00 AM - 6:00 PM" },
                  { day: "Sábados", hours: "9:00 AM - 2:00 PM" },
                  { day: "Domingos", hours: "Cerrado" },
                ].map((schedule) => (
                  <div key={schedule.day} className="flex justify-between items-center p-4 rounded-lg" style={{ backgroundColor: `${borderColor}20` }}>
                    <Text fontWeight="medium" fontSize="lg">{schedule.day}</Text>
                    <Text className="text-gray-600 dark:text-gray-300" fontSize="lg">{schedule.hours}</Text>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </VStack>
      </Container>
    </Box>
  );
};

export default About;