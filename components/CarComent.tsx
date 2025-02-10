"use client";

import { Box } from "@chakra-ui/react";
import { CommentForm } from "./CommentForm";

export const CarComent = () => {
  return (
    <Box
      bgColor="white"
      width={["100%", "85%", "full"]} // Más ancho en pantallas grandes
      maxW="full" // Evita que se expanda demasiado en pantallas grandes
      padding={["4", "6", "8"]} // Padding adaptado a diferentes tamaños
      margin="auto" // Centrado en la pantalla
      mt={["8", "12", "16"]} // Margen superior adaptado
      borderRadius="lg" // Bordes más redondeados para un look moderno
      boxShadow="lg" // Sombra más marcada para resaltar el contenedor
      display="flex"
      flexDirection="column" // Para que el contenido fluya mejor
      alignItems="center"
      justifyContent="center"
      transition="all 0.3s ease-in-out" // Suaviza cambios de tamaño
    >
      <CommentForm />
    </Box>
  );
};
