"use client";

export function CarList() {
  const cars = [
    {
      id: "1",
      brand: "Toyota",
      model: "Corolla",
      year: 2020,
      price: 45,
      transmission: "automatic",
      fuelType: "gasoline",
      seats: 5,
      description: "Un sedán confiable y eficiente, ideal para la ciudad.",
      imageUrl: "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
      available: true,
      features: ["Aire acondicionado", "Bluetooth", "GPS"],
    },
    {
      id: "2",
      brand: "Tesla",
      model: "Model 3",
      year: 2022,
      price: 120,
      transmission: "automatic",
      fuelType: "electric",
      seats: 5,
      description: "Auto eléctrico de alta gama con tecnología avanzada.",
      imageUrl: "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
      available: true,
      features: ["Piloto automático", "Carga rápida", "Pantalla táctil"],
    },
    {
      id: "3",
      brand: "Ford",
      model: "Mustang",
      year: 2019,
      price: 95,
      transmission: "manual",
      fuelType: "gasoline",
      seats: 4,
      description: "Deportivo clásico con gran potencia y estilo.",
      imageUrl: "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
      available: false,
      features: ["Motor V8", "Asientos de cuero", "Cámara trasera"],
    },
  ];

  const handleEdit = (id: string) => {
    console.log(`Editar coche con ID: ${id}`);
    // Lógica para editar el coche
  };

  const handleDelete = (id: string) => {
    console.log(`Borrar coche con ID: ${id}`);
    // Lógica para borrar el coche
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
                className={`px-3 py-1 text-sm rounded-full ${car.available ? "bg-green-500 text-white" : "bg-red-500 text-white"}`}
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
              <p>
                <strong>Asientos: </strong>
                {car.seats}
              </p>
            </div>
            <div className="mt-3">
              {car.features.map((feature, index) => (
                <span
                  key={index}
                  className="inline-block bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded-full mr-2 mb-2"
                >
                  {feature}
                </span>
              ))}
            </div>
            {/* Botones de editar y borrar */}
            <div className="mt-4 flex justify-between">
              <button
                onClick={() => handleEdit(car.id)}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
              >
                Editar
              </button>
              <button
                onClick={() => handleDelete(car.id)}
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
              >
                Borrar
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
