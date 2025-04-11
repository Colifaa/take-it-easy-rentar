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
import { motion } from "framer-motion";
import { ImagesSliderDemo } from "../components/ImagesSliderDemo";
import MotadlDetail from "../components/modalDetail";
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
  nextAvailableDate?: string; // Nueva propiedad
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
  const [searchTerm, setSearchTerm] = useState("");
  console.log(user?.user.id);

  // Variantes de animación para las cards
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { 
      opacity: 0,
      y: 20
    },
    visible: { 
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };

  useEffect(() => {
    const checkSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.error("Error al obtener la sesión:", error);
      } else {
        setUser(data?.session);
      }
    };

    checkSession();

    const fetchCars = async () => {
      setLoading(true);
      try {
        // Obtener los autos
        const { data: carsData, error: carsError } = await supabase
          .from("cars")
          .select("*");

        if (carsError) {
          console.error("Error al obtener los autos:", carsError);
          setLoading(false);
          return;
        }

        // Obtener las disponibilidades actuales y futuras
        const { data: availabilityData, error: availabilityError } = await supabase
          .from("car_availability")
          .select("*");

        if (availabilityError) {
          console.error("Error al obtener disponibilidades:", availabilityError);
          setLoading(false);
          return;
        }

        // Procesar los autos con su disponibilidad
        const processedCars = carsData.map(car => {
          const today = new Date();
          today.setHours(0, 0, 0, 0);

          // Verificar las fechas de disponibilidad
          const carAvailabilities = availabilityData
            ?.filter(a => a.car_id === car.id)
            ?.sort((a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime());

          const isCurrentlyReserved = carAvailabilities?.some(availability => {
            const startDate = new Date(availability.start_date);
            startDate.setHours(0, 0, 0, 0);
            const endDate = new Date(availability.end_date);
            endDate.setHours(23, 59, 59, 999);
            
            return today >= startDate && today <= endDate;
          });

          // Encontrar la próxima fecha disponible
          let nextAvailableDate = null;

          // Si el auto no está disponible por checkbox o tiene reservas
          if (!car.available || isCurrentlyReserved) {
            if (carAvailabilities && carAvailabilities.length > 0) {
              const currentOrFutureReservations = carAvailabilities.filter(availability => {
                const endDate = new Date(availability.end_date);
                endDate.setHours(23, 59, 59, 999);
                return endDate >= today;
              });

              if (currentOrFutureReservations.length > 0) {
                const lastReservation = currentOrFutureReservations[currentOrFutureReservations.length - 1];
                nextAvailableDate = new Date(lastReservation.end_date);
                nextAvailableDate.setDate(nextAvailableDate.getDate() + 1);
              }
            }
          }

          return {
            ...car,
            available: car.available && !isCurrentlyReserved,
            nextAvailableDate: !car.available || nextAvailableDate ? 
              (nextAvailableDate ? nextAvailableDate.toISOString().split('T')[0] : null) : 
              null
          };
        });

        setCars(processedCars);
        setFilteredCars(processedCars);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, []);

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

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    const searchResults = cars.filter((car) =>
      `${car.brand} ${car.model}`.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredCars(searchResults);
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
      {/* Hero Section con animación */}
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <ImagesSliderDemo />
      </motion.div>

      {/* Sección de Filtros y Listado de Autos */}
      <div className="container mx-auto p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Filtros con animación */}
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
            className="mb-4"
          >
            <div className="">
              {/* Fondo con gradiente */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#c47369]/10 to-[#f8c4bc]/10 rounded-xl" />
              
              <div className="relative z-10 text-center mb-6">
                <motion.h1 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="text-4xl md:text-5xl font-light text-gray-800"
                >
                  {t.pageTitle.mainTitle}
                </motion.h1>
                
                <div className="w-32 h-0.5 mx-auto my-4 bg-gradient-to-r from-[#c47369] to-[#f8c4bc]" />
                
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="text-lg md:text-xl text-gray-600 font-light"
                >
                  {t.pageTitle.findCar}
                </motion.p>
              </div>
              
              <CarFilters 
                filters={filters}
                setFilters={setFilters}
                onApplyFilters={handleApplyFilters}
                onResetFilters={handleResetFilters}
                onSearch={handleSearch}
              />
            </div>
          </motion.div>

          {/* Lista de Autos */}
          <section id="autos" className="md:col-span-3">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-6"
            >
              <div className="relative w-full mb-4">
                <div className="absolute inset-0 bg-gradient-to-r from-[#c47369] to-[#f8c4bc] opacity-5 rounded-lg"></div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="relative p-6 text-center"
                >
                  <h2 className="text-xl md:text-2xl font-light text-gray-600">
              
                  </h2>
                </motion.div>
              </div>
            </motion.div>

            {filteredCars.length === 0 ? (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center text-lg text-[#3C888A]"
              >
                {t.filters.noResults}
              </motion.p>
            ) : (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                {filteredCars.map((car) => (
                  <motion.div
                    key={car.id}
                    variants={cardVariants}
                    whileHover={{ 
                      scale: 1.03,
                      transition: { duration: 0.2 }
                    }}
                  >
                    <Card className="overflow-hidden shadow-lg rounded-lg bg-[#C47369] border border-gray-200">
                      <div className="relative">
                        <motion.img
                          src={car.imageUrls?.[0] || "/placeholder.jpg"}
                          alt={`${car.brand} ${car.model}`}
                          className="w-full h-52 object-cover cursor-pointer"
                          onClick={() => setDetalle(car)}
                          whileHover={{ scale: 1.1 }}
                          transition={{ duration: 0.3 }}
                        />
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="absolute top-4 right-4"
                        >
                          {car.available ? (
                            <span className="bg-[#3C888A] px-3 py-1 rounded-full text-sm font-semibold text-white shadow-md">
                              {t.filters.available}
                            </span>
                          ) : (
                            <div className="flex flex-col items-end gap-2">
                              <span className="bg-[#C1625D] px-3 py-1 rounded-full text-sm font-semibold text-white shadow-md">
                                {t.filters.notAvailable}
                              </span>
                              {car.nextAvailableDate && (
                                <motion.div
                                  initial={{ opacity: 0, y: -5 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: 0.2 }}
                                  className="bg-[#505e32]/90 backdrop-blur-sm px-3 py-2 rounded-lg text-xs text-white shadow-md"
                                >
                                  <div className="font-medium mb-1">{t.filters.availableFrom}</div>
                                  <div className="font-bold">
                                    {new Date(car.nextAvailableDate).toLocaleDateString(language === 'es' ? 'es-ES' : 'en-US', {
                                      year: 'numeric',
                                      month: 'short',
                                      day: 'numeric'
                                    })}
                                  </div>
                                </motion.div>
                              )}
                            </div>
                          )}
                        </motion.div>
                      </div>

                      {/* Alerta si el usuario no está autenticado */}
                      {showAlert && <AlertComponent message={t.filters.alert} />}
                      
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="p-4"
                      >
                        <h3 className="text-lg font-semibold text-[#103c3d]">
                          {car.brand} {car.model}
                        </h3>
                        <p className="text-sm text-[#e3b167]">{t.reservation.price}</p>
                        <div className="text-xl font-bold text-[#505e32]">${car.price}</div>

                        {/* Características del Auto */}
                        <motion.div 
                          className="grid grid-cols-3 gap-2 text-sm text-[#e3b167] mt-3"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 }}
                        >
                          <div className="flex items-center">
                            <Users className="w-4 h-4 mr-1" /> {t.reservation.assets}
                          </div>
                          <div className="flex items-center">
                            <Cog className="w-4 h-4 mr-1" /> {car.transmission}
                          </div>
                          <div className="flex items-center">
                            <Fuel className="w-4 h-4 mr-1" /> {car.fuelType}
                          </div>
                        </motion.div>

                        {/* Botón de Reserva */}
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.4 }}
                        >
                          <Button
                            className={`w-full mt-4 ${!car.available ? 'bg-gray-400 cursor-not-allowed' : ''}`}
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
                        </motion.div>
                      </motion.div>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </section>
        </div>
      </div>

      {/* Sección de Testimonios con animación */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="mt-16"
      >
        <AnimatedTestimonialsDemo />
      </motion.section>

      {/* Comentarios de Autos con animación */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <CarComent />
      </motion.section>

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
      
      {/* Footer con animación */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
      >
        <Footer />
      </motion.div>
    </main>
  );
}