"use client";
import { useState, useEffect } from "react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@chakra-ui/react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import supabase from "../supabase/authTest";
import { useLanguage } from "../hooks/use-language";
import { languages } from "../lib/languages";
import { Car, Filter } from "lucide-react";

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
}

export const CarFilters = ({ filters, setFilters, onApplyFilters, onResetFilters }: CarFiltersProps) => {
  const [brands, setBrands] = useState<string[]>([]);
  const [models, setModels] = useState<string[]>([]);
  const [brandsLoaded, setBrandsLoaded] = useState(false);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const { language } = useLanguage();
  const t = languages[language];

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
      {/* Botón de Filtros para Móviles */}
      <div className="md:hidden z-50 relative">
        <Sheet >
          <SheetTrigger asChild>
            <div className="grid place-items-center">
              <Button
                colorScheme="none"
                className="rounded-full p-3 shadow-lg  mx-auto bg-gradient-to-br from-[#c47369] to-[#f8c4bc] text-white font-semibold flex items-center gap-2"
              >
                <Filter className="w-6 h-6" />
                {t.filters.filters}
              </Button>
            </div>
          </SheetTrigger>
          <SheetContent
            side="bottom"
            className="h-[100vh] rounded-t-3xl bg-gradient-to-br
             from-[#c47369] to-[#f8c4bc] shadow-xl border border-white/30 text-white overflow-visible backdrop-blur-md"
          >
            <SheetHeader>
              <SheetTitle className="text-center flex items-center justify-center gap-2">
                <Car className="w-6 h-6" />
                {t.filters.carFilters}
              </SheetTitle>
            </SheetHeader>
            {/* Contenido de filtros para móvil */}
            <div className="space-y-6 relative z-10 p-6">
              {/* Brand */}
              <div className="bg-white/10 p-4 rounded-xl backdrop-blur-sm border border-white/30">
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
              </div>
              {/* Model */}
              <div className="bg-white/10 p-4 rounded-xl backdrop-blur-sm border border-white/30">
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
              </div>
              {/* Transmission */}
              <div className="bg-white/10 p-4 rounded-xl backdrop-blur-sm border border-white/30">
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
              </div>
              {/* Fuel Type */}
              <div className="bg-white/10 p-4 rounded-xl backdrop-blur-sm border border-white/30">
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
              </div>
              {/* Availability */}
              <div className="bg-white/10 p-4 rounded-xl backdrop-blur-sm border border-white/30 flex items-center">
                <input
                  type="checkbox"
                  name="available"
                  checked={filters.available}
                  onChange={handleCheckboxChange}
                  className="mr-3 w-4 h-4 rounded border-white/30 text-[#c47369] focus:ring-white/30"
                />
                <span className="text-sm">{t.filters.availableOnly}</span>
              </div>
              {/* Botones: Aplicar Filtros y Reiniciar Filtros */}
              <div className="flex flex-col md:flex-row gap-4">
                {/* Botón para Reiniciar Filtros */}
                <Button
                  onClick={resetFilters}
                  colorScheme="red"
                  variant="solid"
                  size="md"
                  className="w-full md:w-auto py-4 text-white font-semibold rounded-full shadow-lg transform hover:scale-102 transition-all duration-200"
                >
                  {t.filters.resetFilters}
                </Button>
                {/* Apply Filters Button */}
                <Button
                  onClick={onApplyFilters}
                  colorScheme="teal"
                  variant="solid"
                  size="md"
                  className="w-full md:w-auto py-4 text-white font-semibold rounded-full shadow-lg transform hover:scale-102 transition-all duration-200"
                >
                  {t.filters.applyFilters}
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
      {/* Filtros de Escritorio */}
      <div className="p-8 bg-gradient-to-br from-[#c47369] to-[#f8c4bc] shadow-xl rounded-3xl border border-white/30 text-white min-h-[700px] relative overflow-visible backdrop-blur-md hidden md:block">
        <h3 className="font-bold text-2xl mb-8 text-white flex items-center gap-2 bg-white/20 p-4 rounded-full backdrop-blur-sm border border-white/30 shadow-lg text-center justify-center">
          <Car className="w-6 h-6" />
          {t.filters.carFilters}
        </h3>
        <div className="space-y-6 relative z-10">
          {/* Brand */}
          <div className="bg-white/10 p-4 rounded-xl backdrop-blur-sm border border-white/30">
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
          </div>
          {/* Model */}
          <div className="bg-white/10 p-4 rounded-xl backdrop-blur-sm border border-white/30">
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
          </div>
          {/* Transmission */}
          <div className="bg-white/10 p-4 rounded-xl backdrop-blur-sm border border-white/30">
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
          </div>
          {/* Fuel Type */}
          <div className="bg-white/10 p-4 rounded-xl backdrop-blur-sm border border-white/30">
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
          </div>
          {/* Availability */}
          <div className="bg-white/10 p-4 rounded-xl backdrop-blur-sm border border-white/30 flex items-center">
            <input
              type="checkbox"
              name="available"
              checked={filters.available}
              onChange={handleCheckboxChange}
              className="mr-3 w-4 h-4 rounded border-white/30 text-[#c47369] focus:ring-white/30"
            />
            <span className="text-sm">{t.filters.availableOnly}</span>
          </div>
          {/* Botones: Aplicar Filtros y Reiniciar Filtros */}
          <div className="flex flex-col md:flex-row gap-4">
            {/* Botón para Reiniciar Filtros */}
            <Button
              onClick={resetFilters}
              colorScheme="red"
              variant="solid"
              size="md"
              className="w-full md:w-auto py-4 text-white font-semibold rounded-full shadow-lg transform hover:scale-102 transition-all duration-200"
            >
              {t.filters.resetFilters}
            </Button>
            {/* Apply Filters Button */}
            <Button
              onClick={onApplyFilters}
              colorScheme="teal"
              variant="solid"
              size="md"
              className="w-full md:w-auto py-4 text-white font-semibold rounded-full shadow-lg transform hover:scale-102 transition-all duration-200"
            >
              {t.filters.applyFilters}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};