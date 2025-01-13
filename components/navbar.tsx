"use client";

import { useState } from "react";
import Link from "next/link";
import { Car, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import  LoginForm  from "../components/login"

export function Navbar() {
  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center space-x-2">
            <Car className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl">AutoRent</span>
          </Link>
          
          {/* Desktop Navigation */}
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
            
            {/* Botón Iniciar sesión */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" className="text-gray-700 hover:text-primary">
                  Iniciar sesión
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                {/* Contenido del Drawer con el LoginForm */}
                <LoginForm />
              </SheetContent>
            </Sheet>
          </div>

          {/* Mobile Navigation */}
          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <nav className="flex flex-col space-y-4">
                <Link 
                  href="/" 
                  className="text-lg font-medium hover:text-primary transition-colors"
                >
                  Inicio
                </Link>
                <Link 
                  href="/about" 
                  className="text-lg font-medium hover:text-primary transition-colors"
                >
                  Sobre Nosotros
                </Link>
                <Link 
                  href="/contact" 
                  className="text-lg font-medium hover:text-primary transition-colors"
                >
                  Contacto
                </Link>
                
                {/* Botón Iniciar sesión para la vista móvil */}
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="ghost" className="text-gray-700 hover:text-primary">
                      Iniciar sesión
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                    <LoginForm />
                  </SheetContent>
                </Sheet>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
