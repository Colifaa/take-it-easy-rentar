"use client";
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
} from "@chakra-ui/react";
import { useLanguage } from "../hooks/use-language";
import { languages } from "../lib/languages";
import { InfiniteMovingCards } from "../app/ui/InfiniteMovingCards";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css"; // Importar estilos de zoom

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
        <ModalContent maxW="100%" height="100vh" borderRadius={0} p={6}>
          <ModalHeader fontSize="2xl">{car.brand} {car.model}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={8} align="stretch">
              {/* Precio */}
              <VStack align="start" spacing={3} width="full">
                <Text fontSize="2xl" fontWeight="bold">
                  {t.filters.pricePerDay} {car.price}
                </Text>
              </VStack>

              {/* Carrusel infinito */}
              <Box className="h-[50vh] w-full rounded-md flex flex-col items-center justify-center relative overflow-hidden">
                <InfiniteMovingCards
                  items={car.imageUrls.map((url) => ({ image: url }))}
                  direction="right"
                  speed="slow"
                />
              </Box>

              {/* Galería de imágenes en miniatura (6 columnas, varias filas) */}
              <SimpleGrid columns={{ base: 2, sm: 3, md: 4, lg: 5 }} spacing={4} >
                {car.imageUrls.map((url, index) => (
                  <Box key={index} cursor="pointer" onClick={() => setSelectedImage(url)}>
                    <Image
                      src={url}
                      alt={`Car ${index}`}
                      boxSize="120px"
                      objectFit="cover"
                      borderRadius="md"
                      transition="transform 0.2s"
                      _hover={{ transform: "scale(1.1)" }}
                    />
                  </Box>
                ))}
              </SimpleGrid>

              {/* Descripción */}
              <Text fontSize="lg" color="gray.600">
                {car.description}
              </Text>

              {/* Información extra */}
              <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={2}>
                <Box>
                  <Text fontWeight="semibold">{t.filters.transmission}</Text>
                  <Text>{car.transmission}</Text>
                </Box>
                <Box>
                  <Text fontWeight="semibold">{t.filters.fuelType}</Text>
                  <Text>{car.fuelType}</Text>
                </Box>
                <Box>
                  <Text fontWeight="semibold">{t.filters.disponibilidad}</Text>
                  <Text color={car.available ? "green.500" : "red.500"}>
                    {car.available ? t.filters.available : t.filters.notAvailable}
                  </Text>
                </Box>
              </Grid>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* Modal para ver la imagen en grande con zoom */}
      {selectedImage && (
        <Modal isOpen={true} onClose={() => setSelectedImage(null)} size="4xl">
          <ModalOverlay />
          <ModalContent bg="white" borderRadius="lg" p={4}>
            <ModalCloseButton />
            <ModalBody display="flex" justifyContent="center">
              <Zoom>
                <Image src={selectedImage} alt="Selected Car" maxH="80vh" borderRadius="md" />
              </Zoom>
            </ModalBody>
          </ModalContent>
        </Modal>
      )}
    </>
  );
}
