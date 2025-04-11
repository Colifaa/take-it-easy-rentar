"use client";
import { useState, useEffect } from "react";
import { Slider } from "@/components/ui/slider";
import { Button, Image } from "@chakra-ui/react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import supabase from "../supabase/authTest";
import { useLanguage } from "../hooks/use-language";
import { languages } from "../lib/languages";
import { Car, Filter, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Filters {
  brand: string;
  model: string;
  maxPrice: number;
  transmission: string;
  fuelType: string;
  available: boolean;
}

interface CarFiltersProps {
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
  onApplyFilters: () => void;
  onResetFilters: () => void;
  onSearch: (term: string) => void;
}

export function CarFilters({
  filters,
  setFilters,
  onApplyFilters,
  onResetFilters,
  onSearch,
}: CarFiltersProps) {
  const [brands, setBrands] = useState<string[]>([]);
  const [models, setModels] = useState<string[]>([]);
  const [brandsLoaded, setBrandsLoaded] = useState(false);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const { language } = useLanguage();
  const t = languages[language];
  const [isOpen, setIsOpen] = useState(false);

  // Datos hardcodeados para transmisión y tipo de combustible
  const transmissions = ["Manual", "Automatic"];
  const fuelTypes = ["gasoline", "electric", "diesel", "hybrid"];

  useEffect(() => {
    if (!brandsLoaded && !modelsLoaded) return;
    const fetchOptions = async () => {
      try {
        const { data } = await supabase.from("cars").select("brand, model");
        if (brandsLoaded) {
          setBrands(Array.from(new Set(data?.map((item) => item.brand) || [])));
        }
        if (modelsLoaded) {
          setModels(Array.from(new Set(data?.map((item) => item.model) || [])));
        }
      } catch (error) {
        console.error("Error fetching data from Supabase:", error);
      }
    };
    fetchOptions();
  }, [brandsLoaded, modelsLoaded]);

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFilters((prevFilters) => ({ ...prevFilters, [name]: checked }));
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({ ...prevFilters, [name]: value }));
  };

  const handleSliderChange = (value: number[]) => {
    setFilters((prevFilters) => ({ ...prevFilters, maxPrice: value[0] }));
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearch(e.target.value);
  };

  // Función para reiniciar los filtros
  const resetFilters = () => {
    setFilters({
      brand: "",
      model: "",
      maxPrice: 0,
      transmission: "",
      fuelType: "",
      available: false,
    });
    onResetFilters();
  };

  return (
    <>


      {/* Botón para mostrar/ocultar filtros en móvil */}
      <div className="md:hidden mb-4">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-br from-[#c47369] to-[#f8c4bc] text-white py-3 px-6 rounded-full shadow-lg border border-white/30 backdrop-blur-sm"
        >
          <Filter className="w-4 h-4" />
          <span className="text-sm font-medium">
            {isOpen ? t.filters.hideFilters : t.filters.showFilters}
          </span>
        </motion.button>
      </div>

      {/* Contenedor de filtros */}
      <AnimatePresence>
        {(isOpen || window.innerWidth >= 768) && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="p-8 bg-gradient-to-br from-[#c47369] to-[#f8c4bc] shadow-xl rounded-3xl border border-white/30 text-white min-h-[700px] relative overflow-visible backdrop-blur-md"
          >

                
                  
      <div className="relative z-10 text-center mb-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Image 
          src="/logo.png" 
          alt="Logo de la empresa" 
          width={200} 
          height={180} 
          className="mx-auto"
        />
      </motion.div>
    </div>
            
      {/* Barra de búsqueda siempre visible */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full mb-4"
      >
    
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder={t.filters.searchPlaceholder}
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/10 border border-white/30 text-white placeholder-white/50 focus:ring-2 focus:ring-yellow-300 focus:border-transparent backdrop-blur-sm"
              onChange={handleSearch}
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/70 h-5 w-5" />
         
        </div>
      </motion.div>

            <div className="space-y-6 relative z-10">
              {/* Brand */}
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="bg-white/10 p-4 rounded-xl backdrop-blur-sm border border-white/30"
              >
                <label className="block text-sm font-semibold mb-1">{t.filters.brand}</label>
                <select
                  onFocus={() => setBrandsLoaded(true)}
                  name="brand"
                  value={filters.brand}
                  onChange={handleSelectChange}
                  className="w-full p-2 rounded border bg-white/20 text-black focus:bg-white focus:text-black"
                >
                  <option value="">{t.filters.selectBrand}</option>
                  {brands.map((brand) => (
                    <option key={brand} value={brand}>
                      {brand}
                    </option>
                  ))}
                </select>
              </motion.div>

              {/* Model */}
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="bg-white/10 p-4 rounded-xl backdrop-blur-sm border border-white/30"
              >
                <label className="block text-sm font-semibold mb-1">{t.filters.model}</label>
                <select
                  onFocus={() => setModelsLoaded(true)}
                  name="model"
                  value={filters.model}
                  onChange={handleSelectChange}
                  className="w-full p-2 rounded border bg-white/20 text-black focus:bg-white focus:text-black"
                >
                  <option value="">{t.filters.selectModel}</option>
                  {models.map((model) => (
                    <option key={model} value={model}>
                      {model}
                    </option>
                  ))}
                </select>
              </motion.div>

              {/* Transmission */}
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="bg-white/10 p-4 rounded-xl backdrop-blur-sm border border-white/30"
              >
                <label className="block text-sm font-semibold mb-1">{t.filters.transmission}</label>
                <select
                  name="transmission"
                  value={filters.transmission}
                  onChange={handleSelectChange}
                  className="w-full p-2 rounded border bg-white/20 text-black focus:bg-white focus:text-black"
                >
                  <option value="">{t.filters.todas}</option>
                  {transmissions.map((transmission) => (
                    <option key={transmission} value={transmission}>
                      {transmission}
                    </option>
                  ))}
                </select>
              </motion.div>

              {/* Fuel Type */}
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="bg-white/10 p-4 rounded-xl backdrop-blur-sm border border-white/30"
              >
                <label className="block text-sm font-semibold mb-1">{t.filters.fuelType}</label>
                <select
                  name="fuelType"
                  value={filters.fuelType}
                  onChange={handleSelectChange}
                  className="w-full p-2 rounded border bg-white/20 text-black focus:bg-white focus:text-black"
                >
                  <option value="">{t.filters.selectFuelType}</option>
                  {fuelTypes.map((fuel) => (
                    <option key={fuel} value={fuel}>
                      {fuel}
                    </option>
                  ))}
                </select>
              </motion.div>

              {/* Availability */}
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="bg-white/10 p-4 rounded-xl backdrop-blur-sm border border-white/30 flex items-center"
              >
                <input
                  type="checkbox"
                  name="available"
                  checked={filters.available}
                  onChange={handleCheckboxChange}
                  className="mr-3 w-4 h-4 rounded border-white/30 text-[#c47369] focus:ring-white/30"
                />
                <span className="text-sm">{t.filters.availableOnly}</span>
              </motion.div>

              {/* Botones con animación */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="flex flex-col md:flex-row gap-4"
              >
                <Button
                  onClick={resetFilters}
                  colorScheme="red"
                  variant="solid"
                  size="md"
                  className="w-full md:w-auto py-4 text-white font-semibold rounded-full shadow-lg transform hover:scale-102 transition-all duration-200"
                >
                  {t.filters.resetFilters}
                </Button>
                <Button
                  onClick={onApplyFilters}
                  colorScheme="teal"
                  variant="solid"
                  size="md"
                  className="w-full md:w-auto py-4 text-white font-semibold rounded-full shadow-lg transform hover:scale-102 transition-all duration-200"
                >
                  {t.filters.applyFilters}
                </Button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}