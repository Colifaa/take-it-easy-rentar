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
  Button,
  Flex,
} from "@chakra-ui/react";
import { FaCar, FaGasPump, FaCogs, FaCheckCircle, FaTimesCircle, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useLanguage } from "../hooks/use-language";
import { languages } from "../lib/languages";
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
  onReserve?: () => void;
}

const ModalDetail = memo(({ car, onClose, onReserve }: ModalDetailProps) => {
  const { language } = useLanguage();
  const t = languages[language];
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const bgColor = "white";
  const textColor = "#103c3d";
  const borderColor = "#e3b167";
  const accentColor = "#3C888A";
  const hoverColor = "#c47369";

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % car.imageUrls.length);
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + car.imageUrls.length) % car.imageUrls.length);
  };

  return (
    <Modal isOpen={!!car} onClose={onClose} size="xl" motionPreset="slideInBottom">
      <ModalOverlay bg="blackAlpha.600" backdropFilter="blur(10px)" />
      <ModalContent
        bg={bgColor}
        color={textColor}
        maxW="900px"
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
          p={4}
          bg="white"
          color={textColor}
        >
          {car.brand} {car.model}
        </ModalHeader>
        <ModalCloseButton
          size="lg"
          color={textColor}
          _hover={{ bg: hoverColor, color: "white" }}
        />
        <ModalBody p={4}>
          <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={6}>
            <Box>
              <Box position="relative" borderRadius="lg" overflow="hidden">
                <Zoom>
                  <Image
                    src={car.imageUrls[currentImageIndex]}
                    alt={`${car.brand} ${car.model}`}
                    objectFit="cover"
                    w="100%"
                    h="300px"
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
                      _hover={{ bg: hoverColor }}
                    />
                    <IconButton
                      aria-label="Next image"
                      icon={<FaChevronRight />}
                      onClick={handleNextImage}
                      bg="blackAlpha.500"
                      color="white"
                      _hover={{ bg: hoverColor }}
                    />
                  </Box>
                )}
              </Box>
              <SimpleGrid columns={3} spacing={2} mt={2}>
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
                      h="80px"
                      borderRadius="md"
                    />
                  </Box>
                ))}
              </SimpleGrid>
            </Box>

            <VStack spacing={4} align="stretch">
              <Box>
                <Text fontSize="lg" fontWeight="bold" mb={2} color={textColor}>
                  Descripción
                </Text>
                <Text color={textColor} fontSize="sm" lineHeight="tall">
                  {car.description}
                </Text>
              </Box>

              <Divider borderColor={borderColor} />

              <SimpleGrid columns={2} spacing={4}>
                <Flex align="center" gap={2}>
                  <Icon as={FaCar} color={accentColor} boxSize={5} />
                  <Box>
                    <Text fontSize="sm" fontWeight="bold" color={textColor}>
                      Transmisión:
                    </Text>
                    <Text fontSize="sm" color={textColor}>
                      {car.transmission}
                    </Text>
                  </Box>
                </Flex>
                <Flex align="center" gap={2}>
                  <Icon as={FaGasPump} color={accentColor} boxSize={5} />
                  <Box>
                    <Text fontSize="sm" fontWeight="bold" color={textColor}>
                      Combustible:
                    </Text>
                    <Text fontSize="sm" color={textColor}>
                      {car.fuelType}
                    </Text>
                  </Box>
                </Flex>
                <Flex align="center" gap={2}>
                  <Icon as={FaCogs} color={accentColor} boxSize={5} />
                  <Box>
                    <Text fontSize="sm" fontWeight="bold" color={textColor}>
                      Precio:
                    </Text>
                    <Text fontSize="sm" color={textColor}>
                      ${car.price}/día
                    </Text>
                  </Box>
                </Flex>
                <Flex align="center" gap={2}>
                  <Icon
                    as={car.available ? FaCheckCircle : FaTimesCircle}
                    color={car.available ? "green.500" : "red.500"}
                    boxSize={5}
                  />
                  <Box>
                    <Text fontSize="sm" fontWeight="bold" color={textColor}>
                      Disponibilidad:
                    </Text>
                    <Text fontSize="sm" color={textColor}>
                      {car.available ? "Disponible" : "No disponible"}
                    </Text>
                  </Box>
                </Flex>
              </SimpleGrid>

              <Divider borderColor={borderColor} />

              <Button
                bg={accentColor}
                color="white"
                size="md"
                width="full"
                isDisabled={!car.available}
                onClick={() => {
                  onClose();
                  onReserve && onReserve();
                }}
                _hover={{ bg: hoverColor }}
                _disabled={{ bg: "gray.300", cursor: "not-allowed" }}
              >
                {car.available ? "Reservar Ahora" : "No Disponible"}
              </Button>
            </VStack>
          </Grid>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
});

ModalDetail.displayName = "ModalDetail";

export default ModalDetail;