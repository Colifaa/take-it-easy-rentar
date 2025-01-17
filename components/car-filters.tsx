import { useState } from "react";

// Define la interfaz de filtros
interface Filters {
  brand: string;
  model: string;
  year: string;
  price: string;
  transmission: string;
  fuelType: string;
  available: boolean;
}

interface CarFiltersProps {
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
}

export function CarFilters({ filters, setFilters }: CarFiltersProps) {
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

  return (
    <div className="p-6 bg-white shadow-lg rounded-lg">
      <h3 className="font-semibold text-lg mb-4">Filtros de Autos</h3>

      <div className="mb-4">
        <label className="block text-sm font-medium">Marca</label>
        <input
          type="text"
          name="brand"
          value={filters.brand}
          onChange={handleInputChange}
          className="w-full mt-2 p-2 border border-gray-300 rounded"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium">Modelo</label>
        <input
          type="text"
          name="model"
          value={filters.model}
          onChange={handleInputChange}
          className="w-full mt-2 p-2 border border-gray-300 rounded"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium">Año</label>
        <input
          type="text"
          name="year"
          value={filters.year}
          onChange={handleInputChange}
          className="w-full mt-2 p-2 border border-gray-300 rounded"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium">Precio</label>
        <input
          type="text"
          name="price"
          value={filters.price}
          onChange={handleInputChange}
          className="w-full mt-2 p-2 border border-gray-300 rounded"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium">Transmisión</label>
        <select
          name="transmission"
          value={filters.transmission}
          onChange={handleSelectChange}
          className="w-full mt-2 p-2 border border-gray-300 rounded"
        >
          <option value="">Todas</option>
          <option value="Manual">Manual</option>
          <option value="Automática">Automática</option>
        </select>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium">Tipo de Combustible</label>
        <select
          name="fuelType"
          value={filters.fuelType}
          onChange={handleSelectChange}
          className="w-full mt-2 p-2 border border-gray-300 rounded"
        >
          <option value="">Todos</option>
          <option value="Gasolina">Gasolina</option>
          <option value="Diésel">Diésel</option>
          <option value="Eléctrico">Eléctrico</option>
        </select>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium">Disponible</label>
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
  );
}
