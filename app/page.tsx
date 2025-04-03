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
import { CarComent } from "@/components/CarComent";
import { useLanguage } from "../hooks/use-language";
import { languages } from "../lib/languages";

import { ImagesSliderDemo } from "../components/ImagesSliderDemo";
import MotadlDetail from "../components/modalDetail";
import { InfiniteMovingCardsDemo } from "@/components/InfiniteMovingCardsDemo";
import { Footer } from "@/components/footer";
import LoadingScreen from "@/components/LoadingScreen";

interface Car {
  id: string;
  brand: string;
  model: string;
  price: number;
  transmission: string;
  fuelType: string;
  imageUrls: string[]; // Permite manejar múltiples archivos
  description: string;
  available: boolean;
}

export default function Home() {
  const [cars, setCars] = useState<Car[]>([]);
  const [filteredCars, setFilteredCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const { language } = useLanguage();
  const t = languages[language];

  const [detalle, setDetalle] = useState<Car | null>(null); // Inicializa como null

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
  const [showAlert, setShowAlert] = useState(false); // Estado para manejar el mensaje de alerta
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
          "id, brand, model, price, transmission, fuelType, imageUrls, description, available"
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

  // Función para reiniciar los filtros y restaurar los autos
  const handleResetFilters = () => {
    setFilters({
      brand: "",
      model: "",
      maxPrice: 500,
      transmission: "",
      fuelType: "",
      available: false,
    });
    setFilteredCars(cars); // Restaura la lista completa de autos
  };

  const handleOpenForm = (car: Car) => {
    setSelectedCar(car);
  };

  const handleCloseForm = () => {
    setSelectedCar(null);
  };

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <main className="min-h-screen bg-gradient-to-b">
      {/* Hero Section */}
      <ImagesSliderDemo />

      {/* Sección de Filtros y Listado de Autos */}
      <div className="container mx-auto p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Filtros */}
          <CarFilters
            filters={filters}
            setFilters={setFilters}
            onApplyFilters={handleApplyFilters}
            onResetFilters={handleResetFilters} // Pasar la función de reinicio
          />

          {/* Lista de Autos */}
          <section id="autos" className="md:col-span-3">
            <h2 className="text-md md:text-4xl font-extrabold text-center bg-[linear-gradient(45deg,#c47369,#3C888A,#E8A74D)] text-white p-4 rounded-lg shadow-lg backdrop-blur-xl tracking-wide animate-pulse">
              🌴 Encuentra tu Auto Ideal 🌴
            </h2>

            {filteredCars.length === 0 ? (
              <p className="text-center text-lg text-[#3C888A]">{t.filters.noResults}</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredCars.map((car) => (
                  <Card
                    key={car.id}
                    className="overflow-hidden shadow-lg rounded-lg bg-[#C47369] border border-gray-200"
                  >
                    <div className="relative">
                      <img
                        src={car.imageUrls?.[0] || "/placeholder.jpg"}
                        alt={`${car.brand} ${car.model}`}
                        className="w-full h-52 object-cover cursor-pointer transition-transform duration-300 hover:scale-105"
                        onClick={() => setDetalle(car)}
                      />
                      <div
                        className={`absolute top-4 right-4 px-3 py-1 rounded-full text-sm font-semibold text-white shadow-md ${car.available ? "bg-[#3C888A]" : "bg-[#C1625D]"
                          }`}
                      >
                        {car.available ? t.filters.available : t.filters.notAvailable}
                      </div>
                    </div>

                    {/* Alerta si el usuario no está autenticado */}
                    {showAlert && <AlertComponent message={t.filters.alert} />}
                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-[#103c3d]">
                        {car.brand} {car.model}
                      </h3>
                      <p className="text-sm text-[#e3b167]">{t.reservation.price}</p>
                      <div className="text-xl font-bold text-[#505e32]">${car.price}</div>

                      {/* Características del Auto */}
                      <div className="grid grid-cols-3 gap-2 text-sm text-[#e3b167] mt-3">
                        <div className="flex items-center">
                          <Users className="w-4 h-4 mr-1" /> {t.reservation.assets}
                        </div>
                        <div className="flex items-center">
                          <Cog className="w-4 h-4 mr-1" /> {car.transmission}
                        </div>
                        <div className="flex items-center">
                          <Fuel className="w-4 h-4 mr-1" /> {car.fuelType}
                        </div>
                      </div>

                      {/* Botón de Reserva */}
                      <Button
                        className="w-full mt-4"
                        disabled={!car.available}
                        onClick={() => {
                          if (!user?.user.id) {
                            setShowAlert(true);
                          } else {
                            handleOpenForm(car);
                          }
                        }}
                      >
                        {car.available ? t.filters.reservaButton : t.filters.notAvailable}
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>

      {/* Sección de Testimonios */}
      <section className="mt-16">
        <AnimatedTestimonialsDemo />
      </section>

      {/* Comentarios de Autos */}
      <CarComent />

      {/* Modal de Detalles */}
      {detalle && (
        <MotadlDetail 
          car={detalle} 
          onClose={() => setDetalle(null)} 
          onReserve={() => {
            setSelectedCar(detalle);
          }}
        />
      )}

      {/* Formulario de Reserva */}
      {selectedCar && <ReservationForm car={selectedCar} onClose={handleCloseForm} />}
      <Footer />
    </main>
  );
}