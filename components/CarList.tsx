"use client"
import { useEffect, useState } from "react";
import supabase from "../supabase/authTest";
import { EditCarDialog } from "./EditCarDialog";

interface Car {
  id: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  transmission: string;
  fuelType: string;
  imageUrls: string[];
  description: string;
  available: boolean;
}

export function CarList() {
  const [cars, setCars] = useState<Car[]>([]);

  const fetchCars = async () => {
    const { data, error } = await supabase
      .from("cars")
      .select("id, brand, model, year, price, transmission, fuelType, imageUrls, description, available");

    if (error) {
      console.error("Error al obtener los autos:", error.message);
    } else {
      setCars(
        data?.map(car => ({
          ...car,
          imageUrls: Array.isArray(car.imageUrls) ? car.imageUrls : [],
        })) || []
      );
    }
  };

  useEffect(() => {
    fetchCars();
  }, []);

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("cars").delete().eq("id", id);

    if (error) {
      console.error("Error al eliminar el auto:", error.message);
    } else {
      setCars(prevCars => prevCars.filter(car => car.id !== id));
    }
  };

  return (
    <div className="container mx-auto px-4 mb-10">
      <h2 className="text-xl font-bold text-center text-[#DBAFA0] mb-4">Listado de Autos</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cars.map(car => (
          <div key={car.id} className="bg-[#704264] shadow-md rounded-lg overflow-hidden">
            {car.imageUrls.length > 0 ? (
              <img
                src={car.imageUrls[0]}
                alt={`${car.brand} ${car.model}`}
                className="w-full h-40 md:h-48 object-cover"
              />
            ) : (
              <div className="w-full h-40 md:h-48 bg-gray-400 flex items-center justify-center text-gray-700">
                No image available
              </div>
            )}

            <div className="p-2">
              <h3 className="text-base font-semibold text-[#DBAFA0]">
                {`${car.brand} ${car.model} ${car.year}`}
              </h3>
              <p className="text-[#BB8493] text-xs">{car.description}</p>

              <div className="flex items-center justify-between mt-2">
                <span
                  className={`px-2 py-1 text-xs rounded-full ${
                    car.available ? "bg-green-500 text-white" : "bg-red-500 text-white"
                  }`}
                >
                  {car.available ? "Disponible" : "No disponible"}
                </span>
                <span className="font-semibold text-sm text-[#DBAFA0]">${car.price}</span>
              </div>

              <div className="mt-2 text-[#DBAFA0] text-xs">
                <p>
                  <strong>Transmisión: </strong>
                  {car.transmission}
                </p>
                <p>
                  <strong>Tipo de combustible: </strong>
                  {car.fuelType === "gasoline"
                    ? "Gasolina"
                    : car.fuelType === "diesel"
                    ? "Diésel"
                    : car.fuelType === "electric"
                    ? "Eléctrico"
                    : car.fuelType === "hybrid"
                    ? "Híbrido"
                    : "Desconocido"}
                </p>
              </div>

              <div className="mt-3 flex justify-between">
                <button
                  onClick={() => handleDelete(car.id)}
                  className="bg-[#E63946] text-white px-3 py-1 rounded-md text-xs hover:bg-[#B83238] transition-all"
                >
                  Borrar
                </button>

                <EditCarDialog
                  carId={car.id}
                  initialData={{
                    brand: car.brand,
                    model: car.model,
                    year: car.year,
                    price: car.price,
                    transmission: car.transmission,
                    fuelType: car.fuelType,
                    imageUrls: car.imageUrls,
                    description: car.description,
                    available: car.available,
                  }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
