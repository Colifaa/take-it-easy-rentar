import { useState, useEffect } from "react";
import supabase from "../supabase/authTest"; 
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Fuel, Cog, Calendar } from "lucide-react";

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

interface CarCardProps {
  filters: { transmission: string; fuelType: string; available: boolean };
}

export function CarCard({ filters }: CarCardProps) {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);

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
        setCars(data || []); 
      }
      setLoading(false);
    };

    fetchCars();
  }, []);

  // Filtramos los autos según los filtros
  const filteredCars = cars.filter((car) => {
    const matchesTransmission = !filters.transmission || car.transmission === filters.transmission;
    const matchesFuelType = !filters.fuelType || car.fuelType === filters.fuelType;
    const matchesAvailability = filters.available ? car.available : true;

    return matchesTransmission && matchesFuelType && matchesAvailability;
  });

  if (loading) {
    return <p>Cargando autos...</p>;
  }

  if (!filteredCars.length) {
    return <p>No hay autos disponibles con esos filtros.</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredCars.map((car) => {
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
                  5 asientos
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
