import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Box, ChakraProvider } from '@chakra-ui/react';  // Importa ChakraProvider
import  Navbar  from '@/components/navbar';
import { ParticlesBackground } from './ui/particles-background';
import Wsp from "../components/Wsp"
import MusicPlayer from '@/components/MusicPlayer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'AutoRent - Alquiler de Autos',
  description: 'Tu mejor opción para alquilar autos',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
     
      <body className={inter.className}  >
        {/* Envuelve todo en ChakraProvider */}
        
        <ChakraProvider>
      
          <Navbar />
          <Box 
          display="flex" 
          alignItems="center" 
          justifyContent="center" 
       bgColor="#CB9A99"
      
        > 
          <MusicPlayer /> 
        </Box>
          <ParticlesBackground />
        
          {children}
          <Wsp/>
        </ChakraProvider>
      </body>
    </html>
  );
}
