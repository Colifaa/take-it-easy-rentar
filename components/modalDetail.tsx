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
          bgGradient="linear(to-b, #e600c4, #000191)" // Fondo principal: gradiente de rosa (#e600c4) al azul (#000191)
        >
          <VStack align="center" spacing={3} width="full">
            <ModalHeader
              fontSize="4xl"
              fontWeight="bold"
              textAlign="center"
              bg="rgba(255, 255, 255, 0.1)"
              color="#ffffff" // Texto en blanco
              borderRadius="lg"
              boxShadow="lg"
            >
              🌴 {car.brand} {car.model} 🌴
            </ModalHeader>
          </VStack>
          <ModalCloseButton color="#ffffff" /> {/* Botón de cierre en blanco */}
          <ModalBody>
            <VStack spacing={8} align="stretch">
              {/* Precio */}
              <VStack align="center" spacing={3} width="full">
              <Box
                p={4}
                borderRadius="lg"
                bg="rgba(255, 255, 255, 0.1)"
                boxShadow="lg"
                backdropFilter="blur(10px)"
              >
                <Text fontSize="2xl" fontWeight="bold" color="#ffffff">
                  🌺 {t.filters.pricePerDay}: ${car.price}
                </Text>
              </Box>
              </VStack>

              {/* Descripción Breve */}
              <Box
                p={4}
                borderRadius="lg"
                bg="rgba(255, 255, 255, 0.1)"
                boxShadow="lg"
                backdropFilter="blur(10px)"
              >
                <Text fontSize="xl" fontWeight="bold" color="#ffffff">
                  Aquí tienes un resumen de las especificaciones clave de este vehículo. Desde el tipo de transmisión hasta el combustible que utiliza, conoce todos los detalles que hacen de este modelo una excelente elección.
                </Text>
              </Box>
              <Divider borderColor="#ffffff" />

              {/* Galería de Imágenes */}
              <VStack align="center" spacing={3} width="full">
              <Box
                p={4}
                borderRadius="lg"
                bg="rgba(255, 255, 255, 0.1)"
                boxShadow="lg"
                backdropFilter="blur(10px)"
              >
                <Text fontSize="2xl" fontWeight="bold" color="#ffffff">
                    🌺 Galería de Imágenes
                  </Text>
                </Box>
              </VStack>

              <Box
                className="h-[50vh] w-full rounded-lg flex flex-col items-center justify-center relative overflow-hidden"
                bg="rgba(255, 255, 255, 0.1)"
                boxShadow="lg"
                backdropFilter="blur(10px)"
              >
                <InfiniteMovingCards
                  items={car.imageUrls.map((url) => ({ image: url }))}
                  direction="right"
                  speed="slow"
                />
              </Box>

              {/* Miniaturas de Imágenes */}
              <SimpleGrid
                columns={{ base: 2, sm: 3, md: 4, lg: 5 }}
                gap={3}
                justifyItems="center"
              >
                {car.imageUrls.map((url, index) => (
                  <Box
                    key={index}
                    cursor="pointer"
                    onClick={() => setSelectedImage(url)}
                    borderRadius="md"
                    overflow="hidden"
                    _hover={{ transform: "scale(1.08)", boxShadow: "xl" }}
                    transition="all 0.3s ease"
                    border="2px solid #ffffff"
                  >
                    <Image src={url} alt={`Car ${index}`} boxSize="130px" objectFit="cover" />
                  </Box>
                ))}
              </SimpleGrid>

              {/* Descripción Detallada */}
              <Box
                p={4}
                borderRadius="lg"
                bg="rgba(255, 255, 255, 0.1)"
                boxShadow="lg"
                backdropFilter="blur(10px)"
              >
                <Text fontSize="2xl" fontWeight="bold" color="#ffffff" textAlign="center">
                  🌺 Descripción del Auto
                </Text>
                <Text fontSize="md" color="#ffffff" textAlign="justify">
                  "El {car.brand} {car.model} combina estilo, rendimiento y comodidad para brindarte una experiencia de conducción única. Diseñado para ofrecer eficiencia y potencia, este modelo cuenta con una transmisión {car.transmission} y un motor {car.fuelType}, ideal para cualquier tipo de viaje."
                </Text>
                <Text fontSize="sm" color="#ffffff" textAlign="justify">
                  {car.description}
                </Text>
              </Box>

              {/* Detalles Técnicos */}
              <Box
                p={4}
                borderRadius="lg"
                bg="rgba(255, 255, 255, 0.1)"
                boxShadow="lg"
                backdropFilter="blur(10px)"
              >
                <Text fontSize="2xl" fontWeight="bold" color="#ffffff" textAlign="center">
                  🌺 Detalles Técnicos
                </Text>
              </Box>

              <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={6}>
                {/* Transmisión */}
                <Box
                  p={4}
                  bg="rgba(255, 255, 255, 0.1)"
                  borderRadius="lg"
                  boxShadow="md"
                  backdropFilter="blur(10px)"
                  display="flex"
                  alignItems="center"
                >
                  <Icon as={FaCogs} color="#ffffff" boxSize={6} mr={3} />
                  <Box>
                    <Text fontWeight="semibold" color="#ffffff">{t.filters.transmission}</Text>
                    <Text color="#ffffff">{car.transmission}</Text>
                  </Box>
                </Box>

                {/* Tipo de Combustible */}
                <Box
                  p={4}
                  bg="rgba(255, 255, 255, 0.1)"
                  borderRadius="lg"
                  boxShadow="md"
                  backdropFilter="blur(10px)"
                  display="flex"
                  alignItems="center"
                >
                  <Icon as={FaGasPump} color="#ffffff" boxSize={6} mr={3} />
                  <Box>
                    <Text fontWeight="semibold" color="#ffffff">{t.filters.fuelType}</Text>
                    <Text color="#ffffff">{car.fuelType}</Text>
                  </Box>
                </Box>

                {/* Marca */}
                <Box
                  p={4}
                  bg="rgba(255, 255, 255, 0.1)"
                  borderRadius="lg"
                  boxShadow="md"
                  backdropFilter="blur(10px)"
                  display="flex"
                  alignItems="center"
                >
                  <Icon as={FaCar} color="#ffffff" boxSize={6} mr={3} />
                  <Box>
                    <Text fontWeight="semibold" color="#ffffff">{t.filters.brand}</Text>
                    <Text color="#ffffff">{car.brand}</Text>
                  </Box>
                </Box>

                {/* Disponibilidad */}
                <Box
                  p={4}
                  bg="rgba(255, 255, 255, 0.1)"
                  borderRadius="lg"
                  boxShadow="md"
                  backdropFilter="blur(10px)"
                  display="flex"
                  alignItems="center"
                >
                  <Icon
                    as={car.available ? FaCheckCircle : FaTimesCircle}
                    color={car.available ? "#00ff00" : "#ff0000"}
                    boxSize={6}
                    mr={3}
                  />
                  <Box>
                    <Text fontWeight="semibold" color="#ffffff">{t.filters.disponibilidad}</Text>
                    <Text color={car.available ? "#00ff00" : "#ff0000"}>
                      {car.available ? t.filters.available : t.filters.notAvailable}
                    </Text>
                  </Box>
                </Box>
              </Grid>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* Modal de Imagen Ampliada */}
      {selectedImage && (
        <Modal isOpen onClose={() => setSelectedImage(null)} size="4xl">
          <ModalOverlay />
          <ModalContent
            bgGradient="linear(to-b, #e600c4, #000191)" // Fondo principal: gradiente de rosa (#e600c4) al azul (#000191)
            borderRadius="lg"
            p={4}
            maxWidth="60%"
          >
            <ModalCloseButton color="#ffffff" />
            <ModalBody display="flex" justifyContent="center">
              <Zoom>
                <Image
                  src={selectedImage}
                  alt="Selected Car"
                  maxH="70vh"
                  borderRadius="lg"
                />
              </Zoom>
            </ModalBody>
          </ModalContent>
        </Modal>
      )}
    </>
  );
}