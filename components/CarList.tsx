import { useEffect, useState } from "react";
import supabase from "../supabase/authTest";  // Asegúrate de que tu cliente de Supabase esté correctamente configurado
import { EditCarDialog } from "./EditCarDialog";

// Definir el tipo para los autos
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

export function CarList() {
  // Estado para almacenar los autos
  const [cars, setCars] = useState<Car[]>([]);
  const [editingCar, setEditingCar] = useState<Car | null>(null);

  // Función para obtener los autos desde Supabase
  const fetchCars = async () => {
    const { data, error } = await supabase
      .from("cars")
      .select("id, brand, model, year, price, transmission, fuelType, imageUrl, description, available");

    if (error) {
      console.error("Error al obtener los autos:", error.message);
    } else {
      setCars(data || []); // Establecer los autos obtenidos en el estado
    }
  };

  // Llamar a la función para obtener los autos cuando el componente se monte
  useEffect(() => {
    fetchCars();
  }, []);

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("cars").delete().eq("id", id);

    if (error) {
      console.error("Error al eliminar el auto:", error.message);
    } else {
      // Después de eliminar el coche, actualizamos la lista
      setCars((prevCars) => prevCars.filter((car) => car.id !== id));
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {cars.map((car) => (
        <div key={car.id} className="bg-white shadow-lg rounded-lg overflow-hidden">
          <img
            src={car.imageUrl}
            alt={`${car.brand} ${car.model}`}
            className="w-full h-48 object-cover"
          />
          <div className="p-4">
            <h2 className="text-xl font-semibold text-gray-800">
              {`${car.brand} ${car.model} ${car.year}`}
            </h2>
            <p className="text-gray-600 text-sm">{car.description}</p>
            <div className="flex items-center justify-between mt-4">
              <span
                className={`px-3 py-1 text-sm rounded-full ${
                  car.available ? "bg-green-500 text-white" : "bg-red-500 text-white"
                }`}
              >
                {car.available ? "Disponible" : "No disponible"}
              </span>
              <span className="font-semibold text-xl">${car.price}</span>
            </div>
            <div className="mt-2 text-gray-700 text-sm">
              <p>
                <strong>Transmisión: </strong>
                {car.transmission === "automatic" ? "Automática" : "Manual"}
              </p>
              <p>
                <strong>Tipo de combustible: </strong>
                {car.fuelType === "gasoline"
                  ? "Gasolina"
                  : car.fuelType === "electric"
                  ? "Eléctrico"
                  : "Desconocido"}
              </p>
            </div>

            {/* Botón de borrar */}
            <div className="mt-4 flex justify-between">
              <button
                onClick={() => handleDelete(car.id)}
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
              >
                Borrar
              </button>
                     {/* Reemplazar el botón de editar con el componente EditCarDialog */}
            <EditCarDialog
              carId={car.id}
              initialData={{
                brand: car.brand,
                model: car.model,
                year: car.year,
                price: car.price,
                transmission: car.transmission,
                fuelType: car.fuelType,
                imageUrl: car.imageUrl,
                description: car.description,
                available: car.available,
              }}
            />
            </div>

     
          </div>
        </div>
      ))}
    </div>
  );
}
