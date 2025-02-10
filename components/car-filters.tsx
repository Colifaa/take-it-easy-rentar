"use client";

import { useState, useEffect } from "react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@chakra-ui/react";
import supabase from "../supabase/authTest";
import { useLanguage } from "../hooks/use-language";
import { languages } from "../lib/languages";

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
    <div className="p-6 bg-gradient-to-br from-[#DBAFA0] to-[#BB8493] shadow-lg rounded-2xl border border-[#704264]  text-[#49243E] max-h-[700px]">
      <h3 className="font-bold text-2xl mb-6 text-[#561130]">{t.filters.carFilters}</h3>

      {/* Marca */}
      <div className="mb-6">
        <label className="block text-sm font-semibold">{t.filters.brand}</label>
        <select
          name="brand"
          value={filters.brand}
          onChange={handleSelectChange}
          className="w-full mt-2 p-2 border border-[#704264] rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-[#49243E]"
        >
          <option value="">{t.filters.selectBrand}</option>
          {brands.map((brand, index) => (
            <option key={index} value={brand}>
              {brand}
            </option>
          ))}
        </select>
      </div>

      {/* Modelo */}
      <div className="mb-6">
        <label className="block text-sm font-semibold">{t.filters.model}</label>
        <select
          name="model"
          value={filters.model}
          onChange={handleSelectChange}
          className="w-full mt-2 p-2 border border-[#704264] rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-[#49243E]"
        >
          <option value="">{t.filters.selectModel}</option>
          {models.map((model, index) => (
            <option key={index} value={model}>
              {model}
            </option>
          ))}
        </select>
      </div>

      {/* Precio */}
      <div className="mb-6">
        <label className="block text-sm font-semibold">{t.filters.pricePerDay}</label>
        <Slider value={[filters.maxPrice]} max={500} step={10} onValueChange={handleSliderChange} />
        <div className="mt-2 text-sm">{t.filters.hasta} ${filters.maxPrice}</div>
      </div>

      {/* Transmisión */}
      <div className="mb-6">
        <label className="block text-sm font-semibold">{t.filters.transmission}</label>
        <select
          name="transmission"
          value={filters.transmission}
          onChange={handleSelectChange}
          className="w-full mt-2 p-2 border border-[#704264] rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-[#49243E]"
        >
          <option value="">{t.filters.todas}</option>
          {transmissions.map((transmission, index) => (
            <option key={index} value={transmission}>
              {transmission}
            </option>
          ))}
        </select>
      </div>

      {/* Combustible */}
      <div className="mb-6">
        <label className="block text-sm font-semibold">{t.filters.fuelType}</label>
        <select
          name="fuelType"
          value={filters.fuelType}
          onChange={handleSelectChange}
          className="w-full mt-2 p-2 border border-[#704264] rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-[#49243E]"
        >
          <option value="">{t.filters.selectFuelType}</option>
          {fuelTypes.map((fuelType, index) => (
            <option key={index} value={fuelType}>
              {fuelType}
            </option>
          ))}
        </select>
      </div>

      {/* Disponibilidad */}
      <div className="mb-6 flex items-center">
        <input type="checkbox" name="available" checked={filters.available} onChange={handleCheckboxChange} className="mr-2" />
        <span>{t.filters.availableOnly}</span>
      </div>

      {/* Botón de aplicar filtros */}
      <Button
        className="mt-4 w-full bg-[#704264] text-white py-2 rounded-xl hover:bg-[#561130] transition-all transform hover:scale-105"
        onClick={onApplyFilters}
      >
        {t.filters.applyFilters}
      </Button>
    </div>
  );
};
