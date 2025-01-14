"use client";

import { useState } from "react";
import { PlusCircle, Car as CarIcon, Edit2, Trash2 } from "lucide-react";

export default function CarsAdminPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Gestión de Vehículos</h1>
          <p className="text-gray-600">
            Administra el inventario de vehículos disponibles
          </p>
        </div>
        <button
          onClick={() => setIsDialogOpen(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500"
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Agregar Vehículo
        </button>
      </div>

      {isDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white rounded-lg w-full max-w-2xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Agregar Nuevo Vehículo</h2>
              <button
                onClick={() => setIsDialogOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <form className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1" htmlFor="brand">
                    Marca
                  </label>
                  <input
                    id="brand"
                    type="text"
                    placeholder="Toyota"
                    className="w-full border rounded-md px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1" htmlFor="model">
                    Modelo
                  </label>
                  <input
                    id="model"
                    type="text"
                    placeholder="Corolla"
                    className="w-full border rounded-md px-3 py-2"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1" htmlFor="year">
                    Año
                  </label>
                  <input
                    id="year"
                    type="number"
                    placeholder="2024"
                    className="w-full border rounded-md px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1" htmlFor="price">
                    Precio por día
                  </label>
                  <input
                    id="price"
                    type="number"
                    placeholder="50.00"
                    className="w-full border rounded-md px-3 py-2"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1" htmlFor="transmission">
                    Transmisión
                  </label>
                  <select
                    id="transmission"
                    className="w-full border rounded-md px-3 py-2"
                  >
                    <option value="">Seleccionar transmisión</option>
                    <option value="automatic">Automática</option>
                    <option value="manual">Manual</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1" htmlFor="fuelType">
                    Tipo de Combustible
                  </label>
                  <select
                    id="fuelType"
                    className="w-full border rounded-md px-3 py-2"
                  >
                    <option value="">Seleccionar combustible</option>
                    <option value="gasoline">Gasolina</option>
                    <option value="diesel">Diésel</option>
                    <option value="electric">Eléctrico</option>
                    <option value="hybrid">Híbrido</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="imageUrl">
                  URL de la Imagen
                </label>
                <input
                  id="imageUrl"
                  type="url"
                  placeholder="https://ejemplo.com/imagen.jpg"
                  className="w-full border rounded-md px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="description">
                  Descripción
                </label>
                <textarea
                  id="description"
                  placeholder="Describe las características del vehículo..."
                  className="w-full border rounded-md px-3 py-2"
                ></textarea>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="available"
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded"
                />
                <label htmlFor="available" className="text-sm">
                  Disponible para reserva
                </label>
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsDialogOpen(false)}
                  className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-100"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500"
                >
                  Guardar Vehículo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
