"use client";

import { useState, useEffect } from "react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@chakra-ui/react";
import supabase from "../supabase/authTest"; // Importa el cliente de Supabase

// Define la interfaz de filtros
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

  // Fetch datos de Supabase al montar el componente
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        // Traer las marcas
        const { data: brandData, error: brandError } = await supabase
          .from("cars")
          .select("brand");
        if (brandError) throw brandError;

        // Traer modelos
        const { data: modelData, error: modelError } = await supabase
          .from("cars")
          .select("model");
        if (modelError) throw modelError;

        // Traer transmisiones
        const { data: transmissionData, error: transmissionError } = await supabase
          .from("cars")
          .select("transmission");
        if (transmissionError) throw transmissionError;

        // Traer tipos de combustible
        const { data: fuelData, error: fuelError } = await supabase
          .from("cars")
          .select("fuelType");
        if (fuelError) throw fuelError;

        // Actualizar estados con los datos obtenidos
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
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: checked,
    }));
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const handleSliderChange = (value: number[]) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      maxPrice: value[0],
    }));
  };

  return (
    <div className="p-6 bg-white shadow-lg rounded-lg">
      <h3 className="font-semibold text-lg mb-4">Filtros de Autos</h3>

      {/* Marca */}
      <div className="mb-4">
        <label className="block text-sm font-medium">Marca</label>
        <select
          name="brand"
          value={filters.brand}
          onChange={handleSelectChange}
          className="w-full mt-2 p-2 border border-gray-300 rounded"
        >
          <option value="">Seleccionar Marca</option>
          {brands.map((brand, index) => (
            <option key={index} value={brand}>
              {brand}
            </option>
          ))}
        </select>
      </div>

      {/* Modelo */}
      <div className="mb-4">
        <label className="block text-sm font-medium">Modelo</label>
        <select
          name="model"
          value={filters.model}
          onChange={handleSelectChange}
          className="w-full mt-2 p-2 border border-gray-300 rounded"
        >
          <option value="">Seleccionar Modelo</option>
          {models.map((model, index) => (
            <option key={index} value={model}>
              {model}
            </option>
          ))}
        </select>
      </div>

      {/* Precio */}
      <div className="mb-4">
        <label className="block text-sm font-medium">Precio por Día ($)</label>
        <Slider
          value={[filters.maxPrice]}
          max={500}
          step={10}
          onValueChange={handleSliderChange}
          className="relative flex items-center select-none w-full h-2 bg-gray-300 rounded-lg"
        />
        <div className="mt-2 text-sm text-gray-600">Hasta ${filters.maxPrice}</div>
      </div>

      {/* Transmisión */}
      <div className="mb-4">
        <label className="block text-sm font-medium">Transmisión</label>
        <select
          name="transmission"
          value={filters.transmission}
          onChange={handleSelectChange}
          className="w-full mt-2 p-2 border border-gray-300 rounded"
        >
          <option value="">Todas</option>
          {transmissions.map((transmission, index) => (
            <option key={index} value={transmission}>
              {transmission}
            </option>
          ))}
        </select>
      </div>

      {/* Combustible */}
      <div className="mb-4">
        <label className="block text-sm font-medium">Tipo de Combustible</label>
        <select
          name="fuelType"
          value={filters.fuelType}
          onChange={handleSelectChange}
          className="w-full mt-2 p-2 border border-gray-300 rounded"
        >
          <option value="">Todos</option>
          {fuelTypes.map((fuelType, index) => (
            <option key={index} value={fuelType}>
              {fuelType}
            </option>
          ))}
        </select>
      </div>

      {/* Disponibilidad */}
      <div className="mb-4">
        <label className="block text-sm font-medium">Disponible</label>
        <div>
          <input
            type="checkbox"
            name="available"
            checked={filters.available}
            onChange={handleCheckboxChange}
            className="mr-2"
          />
          Solo Autos Disponibles
        </div>
      </div>

      {/* Botón de aplicar filtros */}
      <Button
        className="mt-4 w-full bg-blue-600 text-white"
        onClick={onApplyFilters}
      >
        Aplicar Filtros
      </Button>
    </div>
  );
};
