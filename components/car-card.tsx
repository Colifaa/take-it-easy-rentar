"use client";

import { Car } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Fuel, Cog, Calendar } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { isCarAvailable } from "@/lib/reservations";

interface CarCardProps {
  car: Car;
}

export function CarCard({ car }: CarCardProps) {
  const today = new Date();
  const nextMonth = new Date();
  nextMonth.setMonth(today.getMonth() + 1);
  
  const isAvailableNow = isCarAvailable(car, today, nextMonth);
  const statusColor = isAvailableNow ? 'bg-green-500' : 'bg-red-500';
  const statusText = isAvailableNow ? 'Disponible' : 'Reservado';

  return (
    <Card className="overflow-hidden">
      <div className="relative">
        <img
          src={car.image}
          alt={`${car.brand} ${car.model}`}
          className="w-full h-48 object-cover"
        />
        <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-white ${statusColor}`}>
          {statusText}
        </div>
      </div>
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

        {!isAvailableNow && car.nextAvailableDate && (
          <div className="mb-4 flex items-center text-sm text-gray-600">
            <Calendar className="w-4 h-4 mr-2" />
            Disponible desde: {format(new Date(car.nextAvailableDate), 'PPP', { locale: es })}
          </div>
        )}

        <Button 
          className="w-full"
          disabled={!isAvailableNow}
        >
          {isAvailableNow ? 'Reservar Ahora' : 'No Disponible'}
        </Button>
      </div>
    </Card>
  );
}