import supabase from "../supabase/authTest";
export const uploadImages = async (path: string, files: File[]): Promise<string[]> => {
  const uploadedImageUrls: string[] = [];

  // Subir cada imagen
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    try {
      const { data, error } = await supabase.storage
        .from("cars-images")  // Cambiado de "images" a "cars-images"
        .upload(`${path}/${file.name}`, file);

      if (error) throw error;

      // Almacenamos la URL de la imagen
      const imageUrl = supabase.storage.from("cars-images").getPublicUrl(data.path).data.publicUrl;  // Cambiado aquí también

      uploadedImageUrls.push(imageUrl);

      // Debug para verificar que se están subiendo todas las imágenes
      console.log(`Imagen subida: ${imageUrl}`);
    } catch (error) {
      console.error("Error uploading image:", error);
      throw error;  // Manejar el error según sea necesario
    }
  }

  console.log("Todas las URLs de imágenes subidas:", uploadedImageUrls);  // Ver las URLs finales
  return uploadedImageUrls;  // Devolver las URLs de todas las imágenes subidas
};

// Función para agregar un vehículo a la base de datos con múltiples imágenes
export async function addCar(carDetails: {
  brand: string;
  model: string;
  year: number;
  price: number;
  transmission: string;
  fuelType: string;
  imageUrls: string[]; // Ahora acepta un array de URLs
  description: string;
  available: boolean;
}) {
  if (!carDetails.brand || !carDetails.model || !carDetails.year || !carDetails.price || !carDetails.transmission || !carDetails.fuelType || !carDetails.description) {
    throw new Error("Faltan detalles obligatorios del vehículo.");
  }

  const { data, error } = await supabase.from("cars").insert([carDetails]);

  if (error) {
    console.error("Error al agregar el vehículo:", error.message);
    throw new Error(`Error al agregar el vehículo: ${error.message}`);
  }

  return data;
}

// Función para subir imágenes y agregar vehículo
export async function uploadImagesAndAddCar(
  bucketName: string,
  files: File[],
  carDetails: {
    brand: string;
    model: string;
    year: number;
    price: number;
    transmission: string;
    fuelType: string;
    description: string;
    available: boolean;
  }
) {
  try {
    if (files.length === 0) {
      throw new Error("Debe cargar al menos una imagen.");
    }

    // Subir imágenes al bucket y obtener las URLs
    const imageUrls = await uploadImages(bucketName, files);

    // Agregar vehículo a la base de datos con las URLs de las imágenes
    const carWithImages = { ...carDetails, imageUrls };

    const result = await addCar(carWithImages);
    return result;
  } catch (error) {
    console.error("Error al procesar la solicitud:", error);
    throw error;
  }
}
