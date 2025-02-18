"use client";
import "../app/globals.css";
import React, { useState } from "react";
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
  Button,
  Divider,
  Icon,
} from "@chakra-ui/react";
import { FaCar, FaGasPump, FaCogs, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
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

export default function ModalDetail({ car, onClose }: ModalDetailProps) {
  const { language } = useLanguage();
  const t = languages[language];

  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  return (
    <>
      <Modal isOpen onClose={onClose} size="full" scrollBehavior="inside">
        <ModalOverlay />
        <ModalContent
          maxW="full"
          height="full"
          borderRadius="lg"
          p={6}
          bgGradient="linear(to-b, #CF9E9B, #C47369)"
        >
          <VStack align="center" spacing={3} width="full">
            <ModalHeader
              fontSize="4xl"
              fontWeight="bold"
              textAlign="center"
              bg="rgba(255, 218, 224, 0.9)"
              color="#FF69B4"
              borderRadius="lg"
              boxShadow="lg"
            >
              🌴 {car.brand} {car.model} 🌴
            </ModalHeader>
          </VStack>
          <ModalCloseButton color="#FF69B4" />
          <ModalBody>
            <VStack spacing={8} align="stretch">
              <VStack align="center" spacing={3} width="full">
                <Box p={4} borderRadius="lg" bg="rgba(255, 182, 193, 0.6)" boxShadow="lg" backdropFilter="blur(10px)">
                  <Text fontSize="2xl" fontWeight="bold" color="#FF1493">
                    🌺 {t.filters.pricePerDay}: ${car.price}
                  </Text>
                </Box>
                <Box p={4} borderRadius="lg" bg="rgba(255, 182, 193, 0.6)" boxShadow="lg" backdropFilter="blur(10px)">
                  <Text fontSize="xl" fontWeight="bold" color="#FF69B4">
                    Aquí tienes un resumen de las especificaciones clave de este vehículo. Desde el tipo de transmisión
                    hasta el combustible que utiliza, conoce todos los detalles que hacen de este modelo una excelente elección.
                  </Text>
                </Box>
                <Divider borderColor="#FF69B4" />
              </VStack>

              <VStack align="center" spacing={3} width="full">
                <Box p={4} borderRadius="lg" bg="rgba(255, 182, 193, 0.6)" boxShadow="lg" backdropFilter="blur(10px)">
                  <Text fontSize="2xl" fontWeight="bold" color="#FF1493">
                    🌺 Galería de Imágenes
                  </Text>
                </Box>
              </VStack>

              <Box p={4} borderRadius="lg" bg="rgba(255, 182, 193, 0.6)" boxShadow="lg" backdropFilter="blur(10px)">
                <Text fontSize="xl" fontWeight="bold" color="#FF69B4">
                  Explora cada ángulo de este vehículo con nuestra galería de imágenes en alta resolución. 
                  Haz clic en una imagen para verla en detalle.
                </Text>
              </Box>

              <Box className="h-[50vh] w-full rounded-lg flex flex-col items-center justify-center relative overflow-hidden">
                <InfiniteMovingCards
                  items={car.imageUrls.map((url) => ({ image: url }))}
                  direction="right"
                  speed="slow"
                />
              </Box>

              <SimpleGrid columns={{ base: 2, sm: 3, md: 4, lg: 5 }} gap={3} justifyItems="center">
                {car.imageUrls.map((url, index) => (
                  <Box
                    key={index}
                    cursor="pointer"
                    onClick={() => setSelectedImage(url)}
                    borderRadius="md"
                    overflow="hidden"
                    _hover={{ transform: "scale(1.08)", boxShadow: "xl" }}
                    transition="all 0.3s ease"
                    border="2px solid #FFC0CB"
                  >
                    <Image src={url} alt={`Car ${index}`} boxSize="130px" objectFit="cover" />
                  </Box>
                ))}
              </SimpleGrid>

              <VStack align="center" spacing={3} width="full">
                <Box p={4} borderRadius="lg" bg="rgba(255, 182, 193, 0.6)" boxShadow="lg" backdropFilter="blur(10px)">
                  <Text fontSize="2xl" fontWeight="bold" color="#FF1493" alignItems="center" justifyContent="center" display="flex">
                    🌺 Descripción del auto
                  </Text>
                </Box>
              </VStack>

              <Box p={4} borderRadius="lg" bg="rgba(255, 182, 193, 0.6)" boxShadow="lg" backdropFilter="blur(10px)">
                <Text fontSize="xl" fontWeight="bold" color="#FF69B4">
                  "El {car.brand} {car.model} combina estilo, rendimiento y comodidad para brindarte una experiencia de conducción única. Diseñado para ofrecer eficiencia y potencia, este modelo cuenta con una transmisión {car.transmission} y un motor {car.fuelType}, ideal para cualquier tipo de viaje."
                </Text>
                <Text fontSize="md" color="#DB7093" textAlign="justify">
                  {car.description}
                </Text>
              </Box>

              <VStack align="center" spacing={3} width="full">
                <Box p={4} borderRadius="lg" bg="rgba(255, 182, 193, 0.6)" boxShadow="lg" backdropFilter="blur(10px)">
                  <Text fontSize="2xl" fontWeight="bold" color="#FF1493" alignItems="center" justifyContent="center" display="flex">
                    🌺 Detalles Técnicos
                  </Text>
                </Box>
              </VStack>

              <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={6}>
                <Box p={4} bg="rgba(255, 182, 193, 0.6)" borderRadius="lg" boxShadow="md" backdropFilter="blur(10px)" display="flex" alignItems="center">
                  <Icon as={FaCogs} color="#FF1493" boxSize={6} mr={3} />
                  <Box>
                    <Text fontWeight="semibold" color="#FF1493">{t.filters.transmission}</Text>
                    <Text color="#DB7093">{car.transmission}</Text>
                  </Box>
                </Box>

                <Box p={4} bg="rgba(255, 182, 193, 0.6)" borderRadius="lg" boxShadow="md" backdropFilter="blur(10px)" display="flex" alignItems="center">
                  <Icon as={FaGasPump} color="#FF1493" boxSize={6} mr={3} />
                  <Box>
                    <Text fontWeight="semibold" color="#FF1493">{t.filters.fuelType}</Text>
                    <Text color="#DB7093">{car.fuelType}</Text>
                  </Box>
                </Box>

                <Box p={4} bg="rgba(255, 182, 193, 0.6)" borderRadius="lg" boxShadow="md" backdropFilter="blur(10px)" display="flex" alignItems="center">
                  <Icon as={FaCar} color="#FF1493" boxSize={6} mr={3} />
                  <Box>
                    <Text fontWeight="semibold" color="#FF1493">{t.filters.brand}</Text>
                    <Text color="#DB7093">{car.brand}</Text>
                  </Box>
                </Box>

                <Box p={4} bg="rgba(255, 182, 193, 0.6)" borderRadius="lg" boxShadow="md" backdropFilter="blur(10px)" display="flex" alignItems="center">
                  <Icon as={car.available ? FaCheckCircle : FaTimesCircle} color={car.available ? "green" : "#FF6B6B"} boxSize={6} mr={3} />
                  <Box>
                    <Text fontWeight="semibold" color="#FF1493">{t.filters.disponibilidad}</Text>
                    <Text color={car.available ? "green" : "#FF6B6B"}>
                      {car.available ? t.filters.available : t.filters.notAvailable}
                    </Text>
                  </Box>
                </Box>
              </Grid>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>

      {selectedImage && (
        <Modal isOpen onClose={() => setSelectedImage(null)} size="4xl">
          <ModalOverlay />
          <ModalContent bgGradient="linear(to-b, #CF9E9B, #C47369)" bgPos="center" bgSize="cover" borderRadius="lg" p={4} maxWidth="60%">
            <ModalCloseButton color="#FF1493" />
            <ModalBody display="flex" justifyContent="center">
              <Zoom>
                <Image src={selectedImage} alt="Selected Car" maxH="70vh" borderRadius="lg" />
              </Zoom>
            </ModalBody>
          </ModalContent>
        </Modal>
      )}
    </>
  );
}