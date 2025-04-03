"use client";
import "../app/globals.css";
import React, { useState, memo } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Text,
  Box,
  VStack,
  Grid,
  Image,
  SimpleGrid,
  Divider,
  Icon,
  IconButton,
  useColorModeValue,
} from "@chakra-ui/react";
import { FaCar, FaGasPump, FaCogs, FaCheckCircle, FaTimesCircle, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useLanguage } from "../hooks/use-language";
import { languages } from "../lib/languages";
import { InfiniteMovingCards } from "../app/ui/InfiniteMovingCards";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";

interface Car {
  id: string;
  brand: string;
  model: string;
  price: number;
  transmission: string;
  fuelType: string;
  imageUrls: string[];
  description: string;
  available: boolean;
}

interface ModalDetailProps {
  car: Car;
  onClose: () => void;
}

const ModalDetail = memo(({ car, onClose }: ModalDetailProps) => {
  const { language } = useLanguage();
  const t = languages[language];
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const bgColor = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.800", "white");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % car.imageUrls.length);
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + car.imageUrls.length) % car.imageUrls.length);
  };

  return (
    <Modal isOpen={!!car} onClose={onClose} size="full" motionPreset="slideInBottom">
      <ModalOverlay bg="blackAlpha.600" backdropFilter="blur(10px)" />
      <ModalContent
        bg={bgColor}
        color={textColor}
        maxW="1200px"
        mx="auto"
        my={8}
        borderRadius="xl"
        overflow="hidden"
        boxShadow="2xl"
      >
        <ModalHeader
          fontSize="2xl"
          fontWeight="bold"
          borderBottom="1px"
          borderColor={borderColor}
          p={6}
        >
          {car.brand} {car.model}
        </ModalHeader>
        <ModalCloseButton
          size="lg"
          color={textColor}
          _hover={{ bg: "#009688", color: "white" }}
        />
        <ModalBody p={6}>
          <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={8}>
            <Box>
              <Box position="relative" borderRadius="lg" overflow="hidden">
                <Zoom>
                  <Image
                    src={car.imageUrls[currentImageIndex]}
                    alt={`${car.brand} ${car.model}`}
                    objectFit="cover"
                    w="100%"
                    h="400px"
                  />
                </Zoom>
                {car.imageUrls.length > 1 && (
                  <Box
                    position="absolute"
                    bottom={4}
                    left={4}
                    right={4}
                    display="flex"
                    justifyContent="space-between"
                  >
                    <IconButton
                      aria-label="Previous image"
                      icon={<FaChevronLeft />}
                      onClick={handlePrevImage}
                      bg="blackAlpha.500"
                      color="white"
                      _hover={{ bg: "#009688" }}
                    />
                    <IconButton
                      aria-label="Next image"
                      icon={<FaChevronRight />}
                      onClick={handleNextImage}
                      bg="blackAlpha.500"
                      color="white"
                      _hover={{ bg: "#009688" }}
                    />
                  </Box>
                )}
              </Box>
              <SimpleGrid columns={3} spacing={4} mt={4}>
                {car.imageUrls.map((url, index) => (
                  <Box
                    key={index}
                    cursor="pointer"
                    onClick={() => setCurrentImageIndex(index)}
                    opacity={currentImageIndex === index ? 1 : 0.6}
                    transition="all 0.3s ease"
                    _hover={{ opacity: 1 }}
                  >
                    <Image
                      src={url}
                      alt={`${car.brand} ${car.model} ${index + 1}`}
                      objectFit="cover"
                      w="100%"
                      h="100px"
                      borderRadius="md"
                    />
                  </Box>
                ))}
              </SimpleGrid>
            </Box>

            <VStack spacing={6} align="stretch">
              <Box>
                <Text fontSize="xl" fontWeight="bold" mb={2}>
                  Descripción
                </Text>
                <Text color={textColor}>{car.description}</Text>
              </Box>

              <Divider borderColor={borderColor} />

              <SimpleGrid columns={2} spacing={4}>
                <Box>
                  <Icon as={FaCar} color="#009688" mr={2} />
                  <Text display="inline" fontWeight="bold">
                    Transmisión:
                  </Text>
                  <Text display="inline" ml={2}>
                    {car.transmission}
                  </Text>
                </Box>
                <Box>
                  <Icon as={FaGasPump} color="#009688" mr={2} />
                  <Text display="inline" fontWeight="bold">
                    Combustible:
                  </Text>
                  <Text display="inline" ml={2}>
                    {car.fuelType}
                  </Text>
                </Box>
                <Box>
                  <Icon as={FaCogs} color="#009688" mr={2} />
                  <Text display="inline" fontWeight="bold">
                    Precio:
                  </Text>
                  <Text display="inline" ml={2}>
                    ${car.price}/día
                  </Text>
                </Box>
                <Box>
                  <Icon
                    as={car.available ? FaCheckCircle : FaTimesCircle}
                    color={car.available ? "green.500" : "red.500"}
                    mr={2}
                  />
                  <Text display="inline" fontWeight="bold">
                    Disponibilidad:
                  </Text>
                  <Text display="inline" ml={2}>
                    {car.available ? "Disponible" : "No disponible"}
                  </Text>
                </Box>
              </SimpleGrid>

              <Divider borderColor={borderColor} />

              <InfiniteMovingCards 
                items={car.imageUrls.map(url => ({ image: url }))}
                direction="right"
                speed="slow"
                pauseOnHover={true}
              />
            </VStack>
          </Grid>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
});

ModalDetail.displayName = "ModalDetail";

export default ModalDetail;