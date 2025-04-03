"use client";
import { useState } from "react";
import { uploadImages, addCar } from "../supabase/supabaseHelpers";
import { PlusCircle, X } from "lucide-react";
import { motion } from "framer-motion";

export default function CarsAdminPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState<{
    brand: string;
    model: string;
    year: string;
    price: string;
    transmission: string;
    fuelType: string;
    imageUrls: File[];
    description: string;
    available: boolean;
  }>({
    brand: "",
    model: "",
    year: "",
    price: "",
    transmission: "",
    fuelType: "",
    imageUrls: [],
    description: "",
    available: false,
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (formData.imageUrls.length === 0) {
      alert("Debe cargar al menos una imagen.");
      return;
    }

    setIsSubmitting(true);
    try {
      const imageUrls = await uploadImages("cars-images", formData.imageUrls);
      const carDetails = {
        ...formData,
        imageUrls,
        year: parseInt(formData.year),
        price: parseFloat(formData.price),
      };

      await addCar(carDetails);
      alert("Vehículo agregado con éxito");
      setIsDialogOpen(false);
      window.location.reload();
    } catch (error) {
      console.error(error);
      alert("Error al agregar el vehículo");
    } finally {
      setIsSubmitting(false);
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
    } else if (type === "file" && (e.target as HTMLInputElement).files) {
      const selectedFiles = Array.from((e.target as HTMLInputElement).files || []);
      setFormData((prev) => ({
        ...prev,
        imageUrls: [...prev.imageUrls, ...selectedFiles],
      }));

      const previewUrls = selectedFiles.map((file) => URL.createObjectURL(file));
      setImagePreviews((prev) => [...prev, ...previewUrls]);
    } else {
      setFormData((prev) => ({
        ...prev,
        [id]: value,
      }));
    }
  };

  const handleRemoveImage = (index: number) => {
    const updatedPreviews = imagePreviews.filter((_, i) => i !== index);
    const updatedImageUrls = formData.imageUrls.filter((_, i) => i !== index);
    setImagePreviews(updatedPreviews);
    setFormData((prev) => ({
      ...prev,
      imageUrls: updatedImageUrls,
    }));
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4"
      >
        <div className="bg-gradient-to-r from-[#49243E] to-[#704264] p-6 rounded-xl shadow-lg w-full md:w-auto">
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">Gestión de Vehículos</h1>
          <p className="text-[#DBAFA0]">Administra el inventario de vehículos disponibles</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsDialogOpen(true)}
          className="flex items-center px-6 py-3 bg-[#BB8493] text-white rounded-xl hover:bg-[#DBAFA0] transition-all duration-300 shadow-lg w-full md:w-auto justify-center"
        >
          <PlusCircle className="mr-2 h-5 w-5" />
          <span className="font-semibold">Agregar Vehículo</span>
        </motion.button>
      </motion.div>
  
      {isDialogOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        >
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-auto"
          >
            <div className="sticky top-0 bg-white px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-[#49243E]">Agregar Nuevo Vehículo</h2>
              <button
                onClick={() => setIsDialogOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="h-6 w-6 text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="brand" className="block text-sm font-medium text-gray-700">Marca</label>
                  <input
                    id="brand"
                    type="text"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#BB8493] focus:border-transparent transition-all"
                    onChange={handleChange}
                    value={formData.brand}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="model" className="block text-sm font-medium text-gray-700">Modelo</label>
                  <input
                    id="model"
                    type="text"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#BB8493] focus:border-transparent transition-all"
                    onChange={handleChange}
                    value={formData.model}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="year" className="block text-sm font-medium text-gray-700">Año</label>
                  <input
                    id="year"
                    type="number"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#BB8493] focus:border-transparent transition-all"
                    onChange={handleChange}
                    value={formData.year}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="price" className="block text-sm font-medium text-gray-700">Precio</label>
                  <input
                    id="price"
                    type="number"
                    step="0.01"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#BB8493] focus:border-transparent transition-all"
                    onChange={handleChange}
                    value={formData.price}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="transmission" className="block text-sm font-medium text-gray-700">Transmisión</label>
                  <select
                    id="transmission"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#BB8493] focus:border-transparent transition-all"
                    onChange={handleChange}
                    value={formData.transmission}
                    required
                  >
                    <option value="">Seleccione</option>
                    <option value="Manual">Manual</option>
                    <option value="Automatic">Automática</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label htmlFor="fuelType" className="block text-sm font-medium text-gray-700">Tipo de Combustible</label>
                  <select
                    id="fuelType"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#BB8493] focus:border-transparent transition-all"
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
              </div>

              <div className="space-y-2">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">Descripción</label>
                <textarea
                  id="description"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#BB8493] focus:border-transparent transition-all"
                  onChange={handleChange}
                  value={formData.description}
                  rows={3}
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="imageUrls" className="block text-sm font-medium text-gray-700">Imágenes</label>
                <input
                  id="imageUrls"
                  type="file"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#BB8493] focus:border-transparent transition-all file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#BB8493] file:text-white hover:file:bg-[#DBAFA0]"
                  onChange={handleChange}
                  accept="image/*"
                  multiple
                  required
                />
              </div>

              {imagePreviews.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-4">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="relative group">
                      <img 
                        src={preview} 
                        alt={`Preview ${index}`} 
                        className="w-full h-24 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex items-center space-x-3 mt-4">
                <input
                  id="available"
                  type="checkbox"
                  className="w-4 h-4 text-[#BB8493] border-gray-300 rounded focus:ring-[#BB8493]"
                  onChange={handleChange}
                  checked={formData.available}
                />
                <label htmlFor="available" className="text-sm text-gray-700">Disponible</label>
              </div>

              <div className="flex flex-col sm:flex-row justify-end gap-3 mt-8">
                <button
                  type="button"
                  onClick={() => setIsDialogOpen(false)}
                  className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 bg-[#BB8493] text-white rounded-lg hover:bg-[#DBAFA0] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Guardando...
                    </>
                  ) : (
                    'Guardar Vehículo'
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
