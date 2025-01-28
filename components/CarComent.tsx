"use client";

import { Box } from "@chakra-ui/react";
import { CommentForm } from "./CommentForm";

export const CarComent = () => {
  return (
   
    <Box
      bgColor="white"
      width={["90%", "80%", "400px"]} // 90% para pantallas pequeñas, 80% para medianas, 400px para grandes
      height={["450px", "350px", "400px"]} // Ajuste dinámico del alto según el ancho
      margin="0 auto" // Centrado horizontalmente
      mt={["10", "16", "20"]} // Margen superior adaptado a diferentes pantallas
      borderRadius="md" // Bordes redondeados
      display="flex" // Para centrar el contenido dentro del cuadrado
      alignItems="center" // Centrado verticalmente
      justifyContent="center" // Centrado horizontalmente
      boxShadow="md" // Sombra opcional para mejor visibilidad
      mb="14"
   
    
    >
      <CommentForm />
    </Box>

  );
};
