"use client"
import { useEffect, useState } from "react";
import supabase from "../supabase/authTest";
import { EditCarDialog } from "./EditCarDialog";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Trash2, Edit3, Search } from "lucide-react";

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
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<{field: keyof Car, direction: 'asc' | 'desc'}>({
    field: 'brand',
    direction: 'asc'
  });

  const ITEMS_PER_PAGE = 8;

  const fetchCars = async () => {
    setLoading(true);
    try {
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
    } catch (error) {
      console.error("Error al obtener los autos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCars();
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este vehículo?")) {
      try {
        const { error } = await supabase.from("cars").delete().eq("id", id);
        if (error) {
          console.error("Error al eliminar el auto:", error.message);
        } else {
          setCars(prevCars => prevCars.filter(car => car.id !== id));
        }
      } catch (error) {
        console.error("Error al eliminar el auto:", error);
      }
    }
  };

  const handleSort = (field: keyof Car) => {
    setSortBy(prev => ({
      field,
      direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const filteredCars = cars
    .filter(car => 
      car.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      car.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      car.year.toString().includes(searchTerm)
    )
    .sort((a, b) => {
      const aValue = a[sortBy.field];
      const bValue = b[sortBy.field];
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortBy.direction === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      return sortBy.direction === 'asc'
        ? (aValue as number) - (bValue as number)
        : (bValue as number) - (aValue as number);
    });

  const totalPages = Math.ceil(filteredCars.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedCars = filteredCars.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div className="container mx-auto px-4 mb-10">
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-center gap-4">
        <h2 className="text-2xl font-bold text-[#49243E]">Listado de Vehículos</h2>
        <div className="relative w-full sm:w-64">
          <input
            type="text"
            placeholder="Buscar vehículos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#BB8493] focus:border-transparent"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#BB8493]"></div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {paginatedCars.map(car => (
              <motion.div
                key={car.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300"
              >
                <div className="relative h-48 overflow-hidden group">
                  {car.imageUrls.length > 0 ? (
                    <img
                      src={car.imageUrls[0]}
                      alt={`${car.brand} ${car.model}`}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-400">Sin imagen</span>
                    </div>
                  )}
                  <div className="absolute top-2 right-2">
                    <span
                      className={`px-3 py-1 text-xs font-semibold rounded-full ${
                        car.available 
                          ? "bg-green-500 text-white" 
                          : "bg-red-500 text-white"
                      }`}
                    >
                      {car.available ? "Disponible" : "No disponible"}
                    </span>
                  </div>
                </div>

                <div className="p-4">
                  <h3 className="text-lg font-semibold text-[#49243E] mb-2">
                    {car.brand} {car.model} {car.year}
                  </h3>
                  
                  <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                    {car.description}
                  </p>

                  <div className="grid grid-cols-2 gap-2 text-sm mb-4">
                    <div className="text-gray-600">
                      <span className="font-medium">Transmisión:</span>
                      <br />
                      {car.transmission}
                    </div>
                    <div className="text-gray-600">
                      <span className="font-medium">Combustible:</span>
                      <br />
                      {car.fuelType === "gasoline"
                        ? "Gasolina"
                        : car.fuelType === "diesel"
                        ? "Diésel"
                        : car.fuelType === "electric"
                        ? "Eléctrico"
                        : car.fuelType === "hybrid"
                        ? "Híbrido"
                        : "Desconocido"}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-[#BB8493]">
                      ${car.price}
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleDelete(car.id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="Eliminar"
                      >
                        <Trash2 className="h-5 w-5" />
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
              </motion.div>
            ))}
          </div>

          {/* Paginación */}
          {totalPages > 1 && (
            <div className="mt-8 flex justify-center items-center gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
              >
                <ChevronLeft className="h-5 w-5 text-gray-600" />
              </button>
              
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                      currentPage === page
                        ? "bg-[#BB8493] text-white"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
              >
                <ChevronRight className="h-5 w-5 text-gray-600" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
