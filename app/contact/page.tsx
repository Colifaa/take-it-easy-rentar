"use client";

import { Mail, Phone, MapPin, Clock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export default function Contact() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-gray-100">
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-center mb-12">Contáctanos</h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <Card className="p-6">
              <Phone className="w-8 h-8 text-primary mb-4" />
              <h3 className="font-semibold mb-2">Teléfono</h3>
              <p className="text-gray-600">+1 234 567 890</p>
              <p className="text-gray-600">Lun - Dom: 8:00 - 20:00</p>
            </Card>
            <Card className="p-6">
              <Mail className="w-8 h-8 text-primary mb-4" />
              <h3 className="font-semibold mb-2">Email</h3>
              <p className="text-gray-600">info@autorent.com</p>
              <p className="text-gray-600">soporte@autorent.com</p>
            </Card>
            <Card className="p-6">
              <MapPin className="w-8 h-8 text-primary mb-4" />
              <h3 className="font-semibold mb-2">Ubicación</h3>
              <p className="text-gray-600">123 Calle Principal</p>
              <p className="text-gray-600">Ciudad, País</p>
            </Card>
          </div>

          <Card className="max-w-2xl mx-auto p-8">
            <h2 className="text-2xl font-semibold mb-6">Envíanos un mensaje</h2>
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Nombre</label>
                  <Input placeholder="Tu nombre" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <Input type="email" placeholder="tu@email.com" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Asunto</label>
                <Input placeholder="Asunto del mensaje" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Mensaje</label>
                <Textarea placeholder="Escribe tu mensaje aquí" rows={4} />
              </div>
              <Button className="w-full">Enviar Mensaje</Button>
            </form>
          </Card>
        </div>
      </section>
    </main>
  );
}