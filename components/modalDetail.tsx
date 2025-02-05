import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Text,
  Box,
  VStack,
  Grid,
} from "@chakra-ui/react";
import { useLanguage } from "../hooks/use-language";
import { languages } from "../lib/languages";

import { InfiniteMovingCards } from "../app/ui/InfiniteMovingCards"; // Asegúrate de importar el componente correctamente.

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

interface MotadlDetailProps {
  car: Car;
  onClose: () => void;
}

export default function MotadlDetail({ car, onClose }: MotadlDetailProps) {
  const { language } = useLanguage();
  const t = languages[language];

  return (
    <Modal isOpen onClose={onClose} size="full" scrollBehavior="inside">
      <ModalOverlay />
      <ModalContent
        maxW="100%"
        height="100vh"
        borderRadius={0} // Para asegurarnos de que el contenido ocupe toda la pantalla sin bordes
      >
        <ModalHeader fontSize="xl" p={4}>
          {car.brand} {car.model}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody p={4}>
          <VStack spacing={6} align="stretch">
   

            <VStack align="start" spacing={2} width="full">
              <Text fontSize="2xl" fontWeight="bold">
                {t.filters.pricePerDay} {car.price}
              </Text>
                       {/* Reemplazar la galería de imágenes con InfiniteMovingCards */}
         
              <Text fontSize="lg" color="gray.500">
                {car.description}
              </Text>
            </VStack>
            <Box
              className="h-[50vh] w-full rounded-md flex flex-col antialiased bg-transparent dark:bg-black dark:bg-grid-white/[0.05] items-center justify-center relative overflow-hidden"
            >
              {/* Usamos InfiniteMovingCards para mostrar las imágenes */}
              <InfiniteMovingCards
                items={car.imageUrls.map((url) => ({ image: url }))}
                direction="right"
                speed="slow"
              />
            </Box>

            <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={4}>
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
  );
}
