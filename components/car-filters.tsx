"use client";

import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Card } from "@/components/ui/card";
import { FilterState } from "@/lib/types";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";



export function CarFilters() {
  const [filters, setFilters] = useState<FilterState>({
    type: [],
    transmission: [],
    fuelType: [],
    minPrice: 0,
    maxPrice: 200,
    availability: 'all'
  });

  const handleFilterChange = (newFilters: Partial<FilterState>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
   
  };

  return (
    <Card className="p-6 space-y-6">
      <div>
        <h3 className="font-semibold mb-4">Disponibilidad</h3>
        <RadioGroup
          defaultValue={filters.availability}
          onValueChange={(value) => 
            handleFilterChange({ 
              availability: value as 'all' | 'available' | 'reserved' 
            })
          }
        >
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="all" id="all" />
              <Label htmlFor="all">Todos</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="available" id="available" />
              <Label htmlFor="available">Disponibles</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="reserved" id="reserved" />
              <Label htmlFor="reserved">Reservados</Label>
            </div>
          </div>
        </RadioGroup>
      </div>

      <div>
        <h3 className="font-semibold mb-4">Tipo de Vehículo</h3>
        <div className="space-y-2">
          {['SUV', 'Sedan', 'Hatchback', 'Pickup', 'Sports'].map((type) => (
            <div key={type} className="flex items-center space-x-2">
              <Checkbox
                id={`type-${type}`}
                checked={filters.type.includes(type)}
                onCheckedChange={(checked) => {
                  handleFilterChange({
                    type: checked
                      ? [...filters.type, type]
                      : filters.type.filter((t) => t !== type),
                  });
                }}
              />
              <label htmlFor={`type-${type}`} className="text-sm">{type}</label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-semibold mb-4">Transmisión</h3>
        <div className="space-y-2">
          {['Manual', 'Automático'].map((transmission) => (
            <div key={transmission} className="flex items-center space-x-2">
              <Checkbox
                id={`transmission-${transmission}`}
                checked={filters.transmission.includes(transmission)}
                onCheckedChange={(checked) => {
                  handleFilterChange({
                    transmission: checked
                      ? [...filters.transmission, transmission]
                      : filters.transmission.filter((t) => t !== transmission),
                  });
                }}
              />
              <label htmlFor={`transmission-${transmission}`} className="text-sm">{transmission}</label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-semibold mb-4">Tipo de Combustible</h3>
        <div className="space-y-2">
          {['Gasolina', 'Diesel', 'Híbrido', 'Eléctrico'].map((fuel) => (
            <div key={fuel} className="flex items-center space-x-2">
              <Checkbox
                id={`fuel-${fuel}`}
                checked={filters.fuelType.includes(fuel)}
                onCheckedChange={(checked) => {
                  handleFilterChange({
                    fuelType: checked
                      ? [...filters.fuelType, fuel]
                      : filters.fuelType.filter((f) => f !== fuel),
                  });
                }}
              />
              <label htmlFor={`fuel-${fuel}`} className="text-sm">{fuel}</label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-semibold mb-4">Precio por Día ($)</h3>
        <div className="px-2">
          <Slider
            defaultValue={[filters.maxPrice]}
            max={200}
            step={10}
            onValueChange={([value]) => {
              handleFilterChange({ maxPrice: value });
            }}
          />
          <div className="mt-2 text-sm text-gray-600">
            Hasta ${filters.maxPrice}
          </div>
        </div>
      </div>
    </Card>
  );
}