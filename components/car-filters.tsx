"use client";

import { useState, useEffect } from "react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@chakra-ui/react";
import supabase from "../supabase/authTest";
import { useLanguage } from "../hooks/use-language";
import { languages } from "../lib/languages";
import { Palmtree, Car, Gauge } from 'lucide-react';

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
}

export const CarFilters = ({ filters, setFilters, onApplyFilters }: CarFiltersProps) => {
  const [brands, setBrands] = useState<string[]>([]);
  const [models, setModels] = useState<string[]>([]);
  const [transmissions, setTransmissions] = useState<string[]>([]);
  const [fuelTypes, setFuelTypes] = useState<string[]>([]);
  const { language } = useLanguage();
  const t = languages[language];

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [{ data: brandData }, { data: modelData }, { data: transmissionData }, { data: fuelData }] = await Promise.all([
          supabase.from("cars").select("brand"),
          supabase.from("cars").select("model"),
          supabase.from("cars").select("transmission"),
          supabase.from("cars").select("fuelType")
        ]);

        setBrands(Array.from(new Set(brandData?.map((item) => item.brand) || [])));
        setModels(Array.from(new Set(modelData?.map((item) => item.model) || [])));
        setTransmissions(Array.from(new Set(transmissionData?.map((item) => item.transmission) || [])));
        setFuelTypes(Array.from(new Set(fuelData?.map((item) => item.fuelType) || [])));
      } catch (error) {
        console.error("Error fetching data from Supabase:", error);
      }
    };

    fetchOptions();
  }, []);

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
  return (
    <div className="p-8 bg-gradient-to-br from-[#c47369] to-[#f8c4bc] shadow-xl rounded-3xl 
    border border-white/30 text-white min-h-[700px] relative overflow-visible backdrop-blur-md">

      {/* Decorative elements */}
      <div className="absolute top-4 right-4 text-white/10 transform rotate-45">
        <Palmtree size={100} />
      </div>
      <div className="absolute bottom-4 left-4 text-white/10">
        <Palmtree size={80} />
      </div>

      <h3 className="font-bold text-2xl mb-8 text-white flex items-center gap-2 
      bg-white/20 p-4 rounded-full backdrop-blur-sm border border-white/30 shadow-lg text-center justify-center">
        <Car className="w-6 h-6" />
        {t.filters.carFilters}
      </h3>

      <div className="space-y-6 relative z-10">
      {/* Brand */}
<div className="bg-white/10 p-4 rounded-xl backdrop-blur-sm border border-white/30">
  <label className="block text-sm font-semibold mb-1">{t.filters.brand}</label>
  <select
  name="brand"
  value={filters.brand}
  onChange={handleSelectChange}
  className="w-full p-2 rounded border bg-white/20 text-black focus:bg-white focus:text-black"
>
  <option value="">{t.filters.selectBrand}</option>
  {brands.map((brand) => (
    <option key={brand} value={brand} className="text-black">
      {brand}
    </option>
  ))}
</select>
</div>

{/* Model */}
<div className="bg-white/10 p-4 rounded-xl backdrop-blur-sm border border-white/30">
  <label className="block text-sm font-semibold mb-1">{t.filters.model}</label>
  <select
    name="model"
    value={filters.model}
    onChange={handleSelectChange}
  className="w-full p-2 rounded border bg-white/20 text-black focus:bg-white focus:text-black"
  >
    <option value="">{t.filters.selectModel}</option>
    {models.map((model) => (
      <option key={model} value={model}>{model}</option>
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
      <option key={transmission} value={transmission}>{transmission}</option>
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
      <option key={fuel} value={fuel}>{fuel}</option>
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

        {/* Apply Filters Button */}
        <Button
          onClick={onApplyFilters}
          className="w-full py-4 bg-white/20 hover:bg-white/30 text-white font-semibold rounded-full
          transition-all duration-200 border border-white/30 backdrop-blur-sm
          transform hover:scale-102 shadow-lg mt-6"
        >
          {t.filters.applyFilters}
        </Button>
      </div>
    </div>
  )
};