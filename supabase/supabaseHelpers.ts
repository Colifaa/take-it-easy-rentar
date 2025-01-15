import supabase from "../supabase/authTest";

// Función para subir una imagen al bucket
export async function uploadImage(bucketName: string, file: File) {
  // Nombre único para la imagen
  const filePath = `images/${Date.now()}-${file.name}`;

  // Subir la imagen al bucket
  const { data, error } = await supabase.storage.from(bucketName).upload(filePath, file);

  if (error) {
    console.error("Error al subir la imagen:", error.message);
    throw new Error(`Error al subir la imagen: ${error.message}`);
  }

  // Obtener la URL pública
  const { data: publicUrlData } = supabase.storage.from(bucketName).getPublicUrl(filePath);

  if (!publicUrlData.publicUrl) {
    console.error("Error: No se pudo generar la URL pública.");
    throw new Error("No se pudo generar la URL pública.");
  }

  return publicUrlData.publicUrl;
}

// Función para agregar un vehículo a la base de datos
export async function addCar(carDetails: {
  brand: string;
  model: string;
  year: number;
  price: number;
  transmission: string;
  fuelType: string;
  imageUrl: string;
  description: string;
  available: boolean;
}) {
  // Validar los detalles del vehículo antes de intentar insertarlos
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

// Función para subir imagen y agregar vehículo
export async function uploadImageAndAddCar(
  bucketName: string,
  file: File,
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
    // Subir imagen al bucket
    const imageUrl = await uploadImage(bucketName, file);

    // Agregar vehículo a la base de datos con la URL de la imagen
    const carWithImage = { ...carDetails, imageUrl };
    
    // Verificar que todos los detalles del vehículo sean válidos
    if (!carWithImage.imageUrl) {
      throw new Error("La URL de la imagen no es válida.");
    }

    const result = await addCar(carWithImage);
    return result;
  } catch (error) {
    console.error("Error al procesar la solicitud:", error);
    throw error;
  }
}
