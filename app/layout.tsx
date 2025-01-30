import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ChakraProvider } from '@chakra-ui/react';  // Importa ChakraProvider
import  Navbar  from '@/components/navbar';
import { Footer } from '@/components/footer';
import { ParticlesBackground } from './ui/particles-background';
import Wsp from "../components/Wsp"

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
          <ParticlesBackground />
        
          {children}
          <Footer />
          <Wsp/>
        </ChakraProvider>
      </body>
    </html>
  );
}
