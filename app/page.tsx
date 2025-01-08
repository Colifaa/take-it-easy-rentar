"use client";

import { useState } from "react";
import { Car, Calendar, Users, Search } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DatePicker } from "@/components/date-picker";
import { CarFilters } from "@/components/car-filters";
import { CarCard } from "@/components/car-card";
import { cars } from "@/lib/data";
import { FilterState } from "@/lib/types";

export default function Home() {
  const [fechaRecogida, setFechaRecogida] = useState<Date>();
  const [fechaDevolucion, setFechaDevolucion] = useState<Date>();
  const [filters, setFilters] = useState<FilterState>({
    type: [],
    transmission: [],
    fuelType: [],
    minPrice: 0,
    maxPrice: 200,
  });

  const filteredCars = cars.filter((car) => {
    if (filters.type.length > 0 && !filters.type.includes(car.type)) return false;
    if (filters.transmission.length > 0 && !filters.transmission.includes(car.transmission)) return false;
    if (filters.fuelType.length > 0 && !filters.fuelType.includes(car.fuelType)) return false;
    if (car.pricePerDay > filters.maxPrice) return false;
    return true;
  });

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-gray-100">
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center justify-center">
        <div 
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1485291571150-772bcfc10da5?ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-black/40" />
        </div>

        <div className="relative z-10 container mx-auto px-4">
          <h1 className="text-5xl font-bold text-white mb-6 text-center">
            Alquila el Auto Perfecto
          </h1>
          <p className="text-xl text-white/90 text-center mb-12">
            La mejor selección de autos para tus necesidades
          </p>

          <Card className="p-6 max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Lugar de Recogida
                </label>
                <div className="relative">
                  <Input placeholder="Ciudad o Aeropuerto" />
                  <Search className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">
                  Fecha de Recogida
                </label>
                <DatePicker
                  date={fechaRecogida}
                  setDate={setFechaRecogida}
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">
                  Fecha de Devolución
                </label>
                <DatePicker
                  date={fechaDevolucion}
                  setDate={setFechaDevolucion}
                />
              </div>

              <div className="flex items-end">
                <Button className="w-full bg-primary hover:bg-primary/90">
                  Buscar Autos
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Car Listings Section */}
      <section className="py-20 container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <CarFilters onFilterChange={setFilters} />
          </div>
          <div className="md:col-span-3">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCars.map((car) => (
                <CarCard key={car.id} car={car} />
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}