"use client";

import Link from "next/link";
import { Car } from "lucide-react";

export function Navbar() {
  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center space-x-2">
            <Car className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl">AutoRent</span>
          </Link>
          
          <div className="hidden md:flex space-x-8">
            <Link 
              href="/" 
              className="text-gray-700 hover:text-primary transition-colors"
            >
              Inicio
            </Link>
            <Link 
              href="/about" 
              className="text-gray-700 hover:text-primary transition-colors"
            >
              Sobre Nosotros
            </Link>
            <Link 
              href="/contact" 
              className="text-gray-700 hover:text-primary transition-colors"
            >
              Contacto
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}