"use client";

import { Shield, Star, Clock, Award } from "lucide-react";
import { Card } from "@/components/ui/card";

export default function About() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-gray-100">
      <section className="relative py-20">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-center mb-12">Sobre Nosotros</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20">
            <div>
              <h2 className="text-3xl font-semibold mb-6">Tu Socio de Confianza en Alquiler de Autos</h2>
              <p className="text-gray-600 mb-4">
                Con más de 15 años de experiencia en el mercado, nos hemos convertido en líderes en el alquiler de vehículos, 
                ofreciendo un servicio personalizado y de calidad a todos nuestros clientes.
              </p>
              <p className="text-gray-600">
                Nuestra misión es proporcionar la mejor experiencia de alquiler de autos, 
                con una flota moderna y un servicio excepcional que supere tus expectativas.
              </p>
            </div>
            <div>
              <img 
                src="https://images.unsplash.com/photo-1562519819-016930ada31c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80"
                alt="Equipo de trabajo"
                className="rounded-lg shadow-xl"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="p-6 text-center">
              <Shield className="w-10 h-10 mx-auto mb-4 text-primary" />
              <h3 className="font-semibold mb-2">100% Seguro</h3>
              <p className="text-sm text-gray-600">Vehículos asegurados y certificados</p>
            </Card>
            <Card className="p-6 text-center">
              <Star className="w-10 h-10 mx-auto mb-4 text-primary" />
              <h3 className="font-semibold mb-2">Calidad Premium</h3>
              <p className="text-sm text-gray-600">Flota de última generación</p>
            </Card>
            <Card className="p-6 text-center">
              <Clock className="w-10 h-10 mx-auto mb-4 text-primary" />
              <h3 className="font-semibold mb-2">Servicio Rápido</h3>
              <p className="text-sm text-gray-600">Proceso de alquiler simplificado</p>
            </Card>
            <Card className="p-6 text-center">
              <Award className="w-10 h-10 mx-auto mb-4 text-primary" />
              <h3 className="font-semibold mb-2">Premiados</h3>
              <p className="text-sm text-gray-600">Reconocidos por nuestra excelencia</p>
            </Card>
          </div>
        </div>
      </section>
    </main>
  );
}