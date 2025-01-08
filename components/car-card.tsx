"use client";

import { Car } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Fuel, Cog } from "lucide-react";

interface CarCardProps {
  car: Car;
}

export function CarCard({ car }: CarCardProps) {
  return (
    <Card className="overflow-hidden">
      <img
        src={car.image}
        alt={`${car.brand} ${car.model}`}
        className="w-full h-48 object-cover"
      />
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-semibold">{car.brand} {car.model}</h3>
            <p className="text-sm text-gray-600">{car.year} · {car.type}</p>
          </div>
          <div className="text-xl font-bold text-primary">
            ${car.pricePerDay}
            <span className="text-sm text-gray-600">/día</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="flex items-center text-sm text-gray-600">
            <Users className="w-4 h-4 mr-2" />
            {car.seats} asientos
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

        <Button className="w-full">Reservar Ahora</Button>
      </div>
    </Card>
  );
}