import { useState } from "react";
import { uploadImages, addCar } from "../supabase/supabaseHelpers";
import { PlusCircle } from "lucide-react";

export default function CarsAdminPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]); // Nuevo estado para las vistas previas

  const [formData, setFormData] = useState<{
    brand: string;
    model: string;
    year: string;
    price: string;
    transmission: string;
    fuelType: string;
    imageUrls: File[];  // Permite manejar múltiples archivos
    description: string;
    available: boolean;
  }>( {
    brand: "",
    model: "",
    year: "",
    price: "",
    transmission: "",
    fuelType: "",
    imageUrls: [],  // Inicializamos como un array vacío
    description: "",
    available: false,
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (formData.imageUrls.length === 0) {
      alert("Debe cargar al menos una imagen.");
      return;
    }
    console.log(formData.imageUrls);  // Verifica que el estado tiene todas las imágenes acumuladas


    try {
      // Subir las imágenes
      const imageUrls = await uploadImages("cars-images", formData.imageUrls);

      // Crear el objeto carDetails con las URLs de las imágenes
      const carDetails = {
        ...formData,
        imageUrls,  // Asegúrate de que 'uploadImages' devuelve un array de URLs
        year: parseInt(formData.year),
        price: parseFloat(formData.price),
      };

      await addCar(carDetails);  // Añadir el vehículo a la base de datos

      alert("Vehículo agregado con éxito");
      setIsDialogOpen(false);
      window.location.reload();
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
    } else if (type === "file" && (e.target as HTMLInputElement).files) {
      // Accedemos a los archivos seleccionados
      const selectedFiles = Array.from((e.target as HTMLInputElement).files || []);
      setFormData((prev) => ({
        ...prev,
        imageUrls: [...prev.imageUrls, ...selectedFiles], // Acumula las imágenes
      }));

      // Actualizamos las vistas previas de las imágenes
      const previewUrls = selectedFiles.map((file) => URL.createObjectURL(file));
      setImagePreviews((prev) => [...prev, ...previewUrls]); // Añadir las vistas previas
    } else {
      setFormData((prev) => ({
        ...prev,
        [id]: value,
      }));
    }
  };

  const handleRemoveImage = (index: number) => {
    // Eliminar la imagen de las vistas previas y de formData.imageUrls
    const updatedPreviews = imagePreviews.filter((_, i) => i !== index);
    const updatedImageUrls = formData.imageUrls.filter((_, i) => i !== index);
    setImagePreviews(updatedPreviews);
    setFormData((prev) => ({
      ...prev,
      imageUrls: updatedImageUrls,
    }));
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Gestión de Vehículos</h1>
          <p className="text-gray-600">Administra el inventario de vehículos disponibles</p>
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-lg">
            <h2 className="text-lg font-bold mb-4">Agregar Nuevo Vehículo</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="brand" className="block text-sm font-medium">Marca</label>
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
                <label htmlFor="model" className="block text-sm font-medium">Modelo</label>
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
                <label htmlFor="year" className="block text-sm font-medium">Año</label>
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
                <label htmlFor="price" className="block text-sm font-medium">Precio</label>
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
                <label htmlFor="transmission" className="block text-sm font-medium">Transmisión</label>
                <select
                  id="transmission"
                  className="w-full border px-3 py-2 rounded"
                  onChange={handleChange}
                  value={formData.transmission}
                  required
                >
                  <option value="">Seleccione</option>
                  <option value="Manual">Manual</option>
                  <option value="Automatic">Automática</option>
                </select>
              </div>

              <div>
                <label htmlFor="fuelType" className="block text-sm font-medium">Tipo de Combustible</label>
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
                <label htmlFor="imageUrls" className="block text-sm font-medium">Imágenes</label>
                <input
                  id="imageUrls"
                  type="file"
                  className="w-full border px-3 py-2 rounded"
                  onChange={handleChange}
                  accept="image/*"
                  multiple  // Permite seleccionar varias imágenes
                  required
                />
              </div>

              {imagePreviews.length > 0 && (
                <div className="grid grid-cols-3 gap-4 mt-4">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="relative">
                      <img src={preview} alt={`Preview ${index}`} className="w-full h-auto object-cover rounded-md" />
                      <button
                        type="button"
                        className="absolute top-0 right-0 p-1 bg-red-600 text-white rounded-full"
                        onClick={() => handleRemoveImage(index)}
                      >
                        X
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div>
                <label htmlFor="description" className="block text-sm font-medium">Descripción</label>
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
                <label htmlFor="available" className="text-sm">Disponible</label>
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
  );
}
