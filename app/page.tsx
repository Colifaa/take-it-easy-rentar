"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DatePicker } from "@/components/date-picker";
import { CarFilters } from "@/components/car-filters";
import supabase from "@/supabase/authTest";
import { Users, Fuel, Cog } from "lucide-react";
import { ReservationForm } from "../components/ReservationForm";
import AlertComponent from "../components/AlertReserve"; // Importamos el componente de alerta
import { AnimatedTestimonialsDemo } from "@/components/AnimatedTestimonialsDemo";
import { CommentForm } from "@/components/CommentForm";
import { CarComent } from "@/components/CarComent";

interface Car {
  id: string;
  brand: string;
  model: string;
  price: number;
  transmission: string;
  fuelType: string;
  imageUrl: string;
  description: string;
  available: boolean;
}

export default function Home() {
  const [cars, setCars] = useState<Car[]>([]);
  const [filteredCars, setFilteredCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    brand: "",
    model: "",
    maxPrice: 500,
    transmission: "",
    fuelType: "",
    available: false,
  });

  const [fechaRecogida, setFechaRecogida] = useState<Date>();
  const [fechaDevolucion, setFechaDevolucion] = useState<Date>();

  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [showAlert, setShowAlert] = useState(false);   // Estado para manejar el mensaje de alerta
  const [user, setUser] = useState<any>(null); // Estado para almacenar información del usuario
  console.log(user?.user.id);


  useEffect(() => {
    const checkSession = async () => {
      // Esperar la resolución de la promesa para obtener la sesión de Supabase
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.error("Error al obtener la sesión:", error);
      } else {
        setUser(data?.session); // Si la sesión es válida, guardamos la información
      }
    };

    // Verificar sesión y obtener los autos
    checkSession();

    const fetchCars = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("cars")
        .select(
          "id, brand, model, price, transmission, fuelType, imageUrl, description, available"
        );

      if (error) {
        console.error("Error al obtener los autos:", error);
      } else {
        setCars(data || []);
        setFilteredCars(data || []);
      }
      setLoading(false);
    };

    fetchCars();
  }, []); // Esta parte se ejecuta solo al montar el componente

  const handleApplyFilters = () => {
    const filtered = cars.filter((car) => {
      const matchesBrand =
        !filters.brand || car.brand.toLowerCase().includes(filters.brand.toLowerCase());
      const matchesModel =
        !filters.model || car.model.toLowerCase().includes(filters.model.toLowerCase());
      const matchesTransmission =
        !filters.transmission || car.transmission === filters.transmission;
      const matchesFuelType =
        !filters.fuelType || car.fuelType === filters.fuelType;
      const matchesAvailability = filters.available ? car.available : true;
      const matchesPrice = filters.maxPrice === 0 || car.price <= filters.maxPrice;

      return (
        matchesBrand &&
        matchesModel &&
        matchesTransmission &&
        matchesFuelType &&
        matchesAvailability &&
        matchesPrice
      );
    });

    setFilteredCars(filtered);
  };

  const handleOpenForm = (car: Car) => {
    setSelectedCar(car);
  };

  const handleCloseForm = () => {
    setSelectedCar(null);
  };

  if (loading) {
    return <p>Cargando autos...</p>;
  }





  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-gray-100">
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center justify-center">
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1485291571150-772bcfc10da5?ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80')",
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
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">
                  Fecha de Recogida
                </label>
                <DatePicker date={fechaRecogida} setDate={setFechaRecogida} />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">
                  Fecha de Devolución
                </label>
                <DatePicker date={fechaDevolucion} setDate={setFechaDevolucion} />
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
      <div className="container mx-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-1">
            <CarFilters
              filters={filters}
              setFilters={setFilters}
              onApplyFilters={handleApplyFilters}
            />
              
          </div>

          <div className="md:col-span-3">
            {filteredCars.length === 0 ? (
              <p>No hay autos que coincidan con los filtros seleccionados.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCars.map((car) => (
                  <Card key={car.id} className="overflow-hidden">
                    <div className="relative">
                      <img
                        src={car.imageUrl}
                        alt={`${car.brand} ${car.model}`}
                        className="w-full h-48 object-cover"
                      />
                      <div
                        className={`absolute top-4 right-4 px-3 py-1 rounded-full text-white ${car.available ? "bg-green-500" : "bg-red-500"
                          }`}
                      >
                        {car.available ? "Disponible" : "Reservado"}
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-semibold">
                        {car.brand} {car.model}
                      </h3>
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

                    <Button
                      className="w-full"
                      disabled={!car.available}
                      onClick={() => {
                        if (!user?.user.id) {
                          // Si no hay usuario autenticado, mostrar el componente de alerta
                          setShowAlert(true);
                        } else {
                          // Si hay un usuario autenticado, abrir el formulario
                          handleOpenForm(car);
                        }
                      }}
                    >
                      {car.available ? "Reservar Ahora" : "No Disponible"}
                    </Button>

                    {/* Renderizar el componente de alerta solo si showAlert es verdadero */}
                    {showAlert && (
                      <AlertComponent
                        message="Por favor, inicia sesión para continuar."

                      />
                    )}


                  </Card>
                ))}

              </div>

            )}
          
            
         
          </div>
         
        
        </div>
        <AnimatedTestimonialsDemo />
      </div>
     
      {selectedCar && (
        <ReservationForm car={selectedCar} onClose={handleCloseForm} />
      )}
   
<CarComent/>

    </main>
  );
}
