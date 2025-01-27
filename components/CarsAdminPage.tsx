"use client"
import { useState } from "react";
import { uploadImage, addCar } from "../supabase/supabaseHelpers";
import { PlusCircle } from "lucide-react";

export default function CarsAdminPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState<{
    brand: string;
    model: string;
    year: string;
    price: string;
    transmission: string;
    fuelType: string;
    imageUrl: File | null;
    description: string;
    available: boolean;
  }>({
    brand: "",
    model: "",
    year: "",
    price: "",
    transmission: "",
    fuelType: "",
    imageUrl: null,
    description: "",
    available: false,
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.imageUrl) {
      alert("Debe cargar una imagen.");
      return;
    }
    try {
      const imageUrl = await uploadImage("cars-images", formData.imageUrl);
      const carDetails = {
        ...formData,
        imageUrl,
        year: parseInt(formData.year),
        price: parseFloat(formData.price),
      };
      await addCar(carDetails);
      alert("Vehículo agregado con éxito");
      setIsDialogOpen(false);
      window.location.reload()
    } catch (error) {
      console.error(error);
      alert("Error al agregar el vehículo");
    }
  };
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { id, value, type } = e.target;

    if (type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        [id]: (e.target as HTMLInputElement).checked,
      }));
    } else if (type === "file") {
      setFormData((prev) => ({
        ...prev,
        [id]: (e.target as HTMLInputElement).files?.[0] || null,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [id]: value,
      }));
    }
  };

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

    <div className="container mx-auto py-8">
   

      {isDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-lg">
            <h2 className="text-lg font-bold mb-4">Agregar Nuevo Vehículo</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="brand" className="block text-sm font-medium">
                  Marca
                </label>
                <input
                  id="brand"
                  type="text"
                  className="w-full border px-3 py-2 rounded"
                  onChange={handleChange}
                  value={formData.brand}
                  required
                />
              </div>

              <div>
                <label htmlFor="model" className="block text-sm font-medium">
                  Modelo
                </label>
                <input
                  id="model"
                  type="text"
                  className="w-full border px-3 py-2 rounded"
                  onChange={handleChange}
                  value={formData.model}
                  required
                />
              </div>

              <div>
                <label htmlFor="year" className="block text-sm font-medium">
                  Año
                </label>
                <input
                  id="year"
                  type="number"
                  className="w-full border px-3 py-2 rounded"
                  onChange={handleChange}
                  value={formData.year}
                  required
                />
              </div>

              <div>
                <label htmlFor="price" className="block text-sm font-medium">
                  Precio
                </label>
                <input
                  id="price"
                  type="number"
                  step="0.01"
                  className="w-full border px-3 py-2 rounded"
                  onChange={handleChange}
                  value={formData.price}
                  required
                />
              </div>

              <div>
                <label htmlFor="transmission" className="block text-sm font-medium">
                  Transmisión
                </label>
                <select
                  id="transmission"
                  className="w-full border px-3 py-2 rounded"
                  onChange={handleChange}
                  value={formData.transmission}
                  required
                >
                  <option value="">Seleccione</option>
                  <option value="Manual">Manual</option>
                  <option value="Automatic">Automatic</option>
                </select>
              </div>

              <div>
                <label htmlFor="fuelType" className="block text-sm font-medium">
                  Tipo de Combustible
                </label>
                <select
                  id="fuelType"
                  className="w-full border px-3 py-2 rounded"
                  onChange={handleChange}
                  value={formData.fuelType}
                  required
                >
                  <option value="">Seleccione</option>
                  <option value="gasoline">Gasolina</option>
                  <option value="diesel">Diésel</option>
                  <option value="electric">Eléctrico</option>
                  <option value="hybrid">Híbrido</option>
                </select>
              </div>

              <div>
                <label htmlFor="imageUrl" className="block text-sm font-medium">
                  Imagen
                </label>
                <input
                  id="imageUrl"
                  type="file"
                  className="w-full border px-3 py-2 rounded"
                  onChange={handleChange}
                  accept="image/*"
                  required
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium">
                  Descripción
                </label>
                <textarea
                  id="description"
                  className="w-full border px-3 py-2 rounded"
                  onChange={handleChange}
                  value={formData.description}
                  rows={3}
                  required
                ></textarea>
              </div>

              <div className="flex items-center">
                <input
                  id="available"
                  type="checkbox"
                  className="mr-2"
                  onChange={handleChange}
                  checked={formData.available}
                />
                <label htmlFor="available" className="text-sm">
                  Disponible
                </label>
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  className="bg-gray-300 text-black px-4 py-2 rounded"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  Guardar Vehículo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
    </div>
  );
}