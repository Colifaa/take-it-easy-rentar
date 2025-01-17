"use client";

import { useState, useEffect } from "react";
import supabase from "../supabase/authTest"; // Asegúrate de que este archivo esté configurado
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Fuel, Cog, Calendar } from "lucide-react";

// Define la interfaz para el tipo de coche
interface Car {
  id: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  transmission: string;
  fuelType: string;
  imageUrl: string;
  description: string;
  available: boolean;
}

export function CarCard() {
  // Especifica el tipo del estado
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch de los datos desde Supabase
  useEffect(() => {
    const fetchCars = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("cars")
        .select(
          "id, brand, model, year, price, transmission, fuelType, imageUrl, description, available"
        );

      if (error) {
        console.error("Error al obtener los autos:", error);
      } else {
        setCars(data || []); // Asignar datos al estado
      }
      setLoading(false);
    };

    fetchCars();
  }, []);

  if (loading) {
    return <p>Cargando autos...</p>;
  }

  if (!cars.length) {
    return <p>No hay autos disponibles en este momento.</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {cars.map((car) => {
        const statusColor = car.available ? "bg-green-500" : "bg-red-500";
        const statusText = car.available ? "Disponible" : "Reservado";

        return (
          <Card key={car.id} className="overflow-hidden">
            <div className="relative">
              <img
                src={car.imageUrl}
                alt={`${car.brand} ${car.model}`}
                className="w-full h-48 object-cover"
              />
              <div
                className={`absolute top-4 right-4 px-3 py-1 rounded-full text-white ${statusColor}`}
              >
                {statusText}
              </div>
            </div>
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold">
                    {car.brand} {car.model}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {car.year} · {car.transmission}
                  </p>
                </div>
                <div className="text-xl font-bold text-primary">
                  ${car.price}
                  <span className="text-sm text-gray-600">/día</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="flex items-center text-sm text-gray-600">
                  <Users className="w-4 h-4 mr-2" />
                  5 asientos {/* Modifica esto si tienes más info */}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Cog className="w-4 h-4 mr-2" />
                  {car.transmission}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Fuel className="w-4 h-4 mr-2" />
                  {car.fuelType}
                </div>
              </div>

              {!car.available && (
                <div className="mb-4 flex items-center text-sm text-gray-600">
                  <Calendar className="w-4 h-4 mr-2" />
                  No disponible actualmente
                </div>
              )}

              <Button className="w-full" disabled={!car.available}>
                {car.available ? "Reservar Ahora" : "No Disponible"}
              </Button>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
