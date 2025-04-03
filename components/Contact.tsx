"use client";
import React, { useState, useRef, useEffect } from "react";
import { motion, useAnimation, useInView } from "framer-motion";
import {
  Box,
  Text,
  VStack,
  HStack,
  Input,
  Textarea,
  Button,
  useToast,
  Icon,
  useColorModeValue,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Grid,
} from "@chakra-ui/react";
import { FaPaperPlane, FaMapMarkerAlt, FaPhone, FaEnvelope } from "react-icons/fa";
import { useLanguage } from "../hooks/use-language";
import { languages } from "../lib/languages";

const Contact = () => {
  const { language } = useLanguage();
  const t = languages[language];
  const toast = useToast();
  const controls = useAnimation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

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
  const cardBgColor = useColorModeValue("gray.50", "gray.700");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  const validateForm = () => {
    const newErrors = {
      name: "",
      email: "",
      phone: "",
      message: "",
    };

    if (!formData.name) {
      newErrors.name = "Por favor ingresa tu nombre";
    }

    if (!formData.email) {
      newErrors.email = "Por favor ingresa tu correo electrónico";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Por favor ingresa un correo electrónico válido";
    }

    if (!formData.phone) {
      newErrors.phone = "Por favor ingresa tu número de teléfono";
    }

    if (!formData.message) {
      newErrors.message = "Por favor ingresa tu mensaje";
    }

    setErrors(newErrors);
    return Object.values(newErrors).every((error) => !error);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      // Aquí iría la lógica para enviar el formulario
      toast({
        title: "¡Mensaje enviado!",
        description: "Gracias por contactarnos. Nos pondremos en contacto contigo pronto.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      setFormData({
        name: "",
        email: "",
        phone: "",
        message: "",
      });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Limpiar el error cuando el usuario comienza a escribir
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

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
    >
      <VStack spacing={12} maxW="1200px" mx="auto">
        {/* Hero Section */}
        <motion.div
          variants={itemVariants}
          className="text-center"
        >
          <Text
            fontSize={{ base: "3xl", md: "4xl", lg: "5xl" }}
            fontWeight="bold"
            className="mb-4"
            bgGradient="linear(to-r, #009688, #4DB6AC)"
            bgClip="text"
          >
            Contáctanos
          </Text>
          <Text
            fontSize={{ base: "lg", md: "xl" }}
            maxW="800px"
            mx="auto"
            className="text-gray-600 dark:text-gray-300"
          >
            ¿Tienes alguna pregunta? Estamos aquí para ayudarte. Envíanos un mensaje y te responderemos lo antes posible.
          </Text>
        </motion.div>

        <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={8} width="full">
          {/* Contact Form */}
          <motion.div variants={itemVariants}>
            <Box
              p={8}
              borderRadius="xl"
              boxShadow="xl"
              bg={cardBgColor}
            >
              <form onSubmit={handleSubmit}>
                <VStack spacing={6}>
                  <FormControl isInvalid={!!errors.name}>
                    <FormLabel>Nombre</FormLabel>
                    <Input
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Tu nombre completo"
                      size="lg"
                    />
                    <FormErrorMessage>{errors.name}</FormErrorMessage>
                  </FormControl>

                  <FormControl isInvalid={!!errors.email}>
                    <FormLabel>Correo electrónico</FormLabel>
                    <Input
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="tu@email.com"
                      size="lg"
                    />
                    <FormErrorMessage>{errors.email}</FormErrorMessage>
                  </FormControl>

                  <FormControl isInvalid={!!errors.phone}>
                    <FormLabel>Teléfono</FormLabel>
                    <Input
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Tu número de teléfono"
                      size="lg"
                    />
                    <FormErrorMessage>{errors.phone}</FormErrorMessage>
                  </FormControl>

                  <FormControl isInvalid={!!errors.message}>
                    <FormLabel>Mensaje</FormLabel>
                    <Textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Tu mensaje"
                      size="lg"
                      rows={6}
                    />
                    <FormErrorMessage>{errors.message}</FormErrorMessage>
                  </FormControl>

                  <Button
                    type="submit"
                    colorScheme="teal"
                    size="lg"
                    width="full"
                    leftIcon={<FaPaperPlane />}
                    _hover={{
                      transform: "translateY(-2px)",
                      boxShadow: "lg",
                    }}
                    transition="all 0.3s ease"
                  >
                    Enviar mensaje
                  </Button>
                </VStack>
              </form>
            </Box>
          </motion.div>

          {/* Contact Information */}
          <motion.div variants={itemVariants}>
            <VStack spacing={8} align="stretch">
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
              ].map((info, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  whileHover={{ scale: 1.02 }}
                >
                  <Box
                    p={6}
                    borderRadius="xl"
                    boxShadow="lg"
                    bg={cardBgColor}
                  >
                    <HStack spacing={4}>
                      <Box
                        p={3}
                        borderRadius="full"
                        style={{ backgroundColor: `${info.color}20` }}
                      >
                        <Icon
                          as={info.icon}
                          boxSize={6}
                          style={{ color: info.color }}
                        />
                      </Box>
                      <VStack align="start" spacing={1}>
                        <Text fontSize="lg" fontWeight="bold">
                          {info.title}
                        </Text>
                        <Text className="text-gray-600 dark:text-gray-300">
                          {info.content}
                        </Text>
                      </VStack>
                    </HStack>
                  </Box>
                </motion.div>
              ))}
            </VStack>
          </motion.div>
        </Grid>
      </VStack>
    </Box>
  );
};

export default Contact; 