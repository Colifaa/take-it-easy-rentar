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
  bgImage="auto3.png"
  bgSize="cover"  // Cambia de "cover" a "contain"
  bgRepeat="no-repeat"
  bgPosition="center"  // Asegura que la imagen esté centrada
  color="white"
>
<VStack align="center" spacing={3} width="full">
          <ModalHeader fontSize="4xl" borderRadius="lg" boxShadow="lg" fontWeight="bold" textAlign="center" bg="rgba(226, 202, 183, 0.8)" color="#FB9652">
            {car.brand} {car.model}
          </ModalHeader>
          </VStack>
          <ModalCloseButton color="white" />
          <ModalBody>
            
            <VStack spacing={8} align="stretch">

              {/* Sección: Precio */}
              <VStack align="center" spacing={3} width="full">
              <Box p={4} borderRadius="lg" bg="rgba(226, 202, 183, 0.8)" boxShadow="lg">
              <Text fontSize="2xl" fontWeight="bold" color="#c96de6" >
      💰 {t.filters.pricePerDay}: ${car.price}
    </Text>
  </Box>
  <Box p={4} borderRadius="lg" bg="rgba(226, 202, 183, 0.8)" boxShadow="lg">
  <Text fontSize="xl" fontWeight="bold" color="#b4645d" >
      Aquí tienes un resumen de las especificaciones clave de este vehículo. Desde el tipo de transmisión
      hasta el combustible que utiliza, conoce todos los detalles que hacen de este modelo una excelente elección.
    </Text>
  </Box>
                <Divider borderColor="#b4645d" />
              </VStack>

              <VStack align="center" spacing={3} width="full">
              {/* Sección: Galería de Imágenes */}
              <Box p={4} borderRadius="lg" bg="rgba(226, 202, 183, 0.8)" boxShadow="lg">
    <Text fontSize="2xl" fontWeight="bold" color="#c96de6"  >
      📸 Galería de Imágenes
    </Text>
  </Box>
  </VStack>

  <Box p={4} borderRadius="lg" bg="rgba(226, 202, 183, 0.8)" boxShadow="lg">
  <Text fontSize="xl" fontWeight="bold" color="#b4645d">
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
                    border="1px solid gray"
                  >
                    <Image src={url} alt={`Car ${index}`} boxSize="130px" objectFit="cover"   />
                  </Box>
                ))}
              </SimpleGrid>

              {/* Sección: Descripción */}
              <VStack align="center" spacing={3} width="full">
              <Box p={4} borderRadius="lg" bg="rgba(226, 202, 183, 0.8)" boxShadow="lg">
           <Text fontSize="2xl" fontWeight="bold" color="#9C4CDC" alignItems="center" justifyContent="center" display="flex">
                📝 Descripción del auto
              </Text>
              </Box>
              </VStack>
              <Box p={4} borderRadius="lg" bg="rgba(226, 202, 183, 0.8)" boxShadow="lg">
                <Text fontSize="xl" fontWeight="bold" color="#b4645d">
                  "El {car.brand} {car.model} combina estilo, rendimiento y comodidad para brindarte una experiencia de conducción única. Diseñado para ofrecer eficiencia y potencia, este modelo cuenta con una transmisión {car.transmission} y un motor {car.fuelType}, ideal para cualquier tipo de viaje."
                </Text>
                <Text fontSize="md" color="gray.300" textAlign="justify">
                  {car.description}
                </Text>
              </Box>

        {/* Sección: Detalles Técnicos */}
        <VStack align="center" spacing={3} width="full">
        <Box p={4} borderRadius="lg" bg="rgba(226, 202, 183, 0.8)" boxShadow="lg">


        <Text fontSize="2xl" fontWeight="bold" color="#9C4CDC" alignItems="center" justifyContent="center" display="flex">
        ⚙️ Detalles Técnicos
              </Text>
              </Box>
              </VStack>
              <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={6}>
             <Box p={4} bg="rgba(226, 202, 183, 0.8)" borderRadius="lg" boxShadow="md" display="flex" alignItems="center">

                  <Icon as={FaCogs} color="#9C4CDC" boxSize={6} mr={3} />
                  <Box>
                    <Text fontWeight="semibold" color="#9C4CDC">{t.filters.transmission}</Text>
                    <Text color="#b4645d">{car.transmission}</Text>
                  </Box>
                </Box>

                <Box p={4} bg="rgba(226, 202, 183, 0.8)" borderRadius="lg" boxShadow="md" display="flex" alignItems="center">
                  <Icon as={FaGasPump} color="#9C4CDC" boxSize={6} mr={3} />
                  <Box>
                    <Text fontWeight="semibold" color="#9C4CDC">{t.filters.fuelType}</Text>
                    <Text color="#b4645d">{car.fuelType}</Text>
                  </Box>
                </Box>

                <Box p={4} bg="rgba(226, 202, 183, 0.8)" borderRadius="lg" boxShadow="md" display="flex" alignItems="center">
                  <Icon as={FaCar} color="#9C4CDC" boxSize={6} mr={3} />
                  <Box>
                    <Text fontWeight="semibold" color="#9C4CDC">{t.filters.brand}</Text>
                    <Text color="#b4645d">{car.brand}</Text>
                  </Box>
                </Box>

                <Box p={4} bg="rgba(226, 202, 183, 0.8)" borderRadius="lg" boxShadow="md" display="flex" alignItems="center">
                  <Icon as={car.available ? FaCheckCircle : FaTimesCircle} color={car.available ? "#b4645d" : "#D32F2F"} boxSize={6} mr={3} />
                  <Box>
                    <Text fontWeight="semibold" color="#9C4CDC">{t.filters.disponibilidad}</Text>
                    <Text color={car.available ? "#b4645d" : "#D32F2F"}>
                      {car.available ? t.filters.available : t.filters.notAvailable}
                    </Text>
                  </Box>
                </Box>
              </Grid>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>


      {/* Modal para ver la imagen en grande */}
      {selectedImage && (
        <Modal isOpen onClose={() => setSelectedImage(null)} size="4xl">
          <ModalOverlay />
          <ModalContent bgImage="auto2.png" bgPos="center" bgSize="cover"  borderRadius="lg" p={4} maxWidth="60%">
            <ModalCloseButton color="white" />
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
