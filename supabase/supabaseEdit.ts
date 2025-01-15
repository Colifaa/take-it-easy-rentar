import supabase from "./authTest";
interface Car {
  id: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  transmission: string;
  fuelType: string;
  imageUrl: string; // assuming imageUrl exists in the returned data
  description: string;
  available: boolean;
}

export const getCarById = async (id: string): Promise<Car | null> => {
  const { data, error } = await supabase
    .from("cars")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error al obtener el vehículo:", error);
    throw error;
  }
  return data;
};

export const updateCarImage = async (
  carId: string,
  newImage: File
) => {
  try {
    // Genera un nombre único para la nueva imagen (puedes usar un timestamp o UUID)
    const uniqueImageName = `${newImage.name.split('.')[0]}_${Date.now()}.${newImage.name.split('.').pop()}`;

    // Ruta en la carpeta 'images' del bucket
    const imagePath = `images/${uniqueImageName}`;

    // Eliminar la imagen antigua (si la tienes)
    const oldImageUrl = await getCarById(carId);
    const oldImagePath = oldImageUrl?.imageUrl || ''; // Obtiene la URL de la imagen antigua

    if (oldImagePath) {
      const { error: deleteError } = await supabase.storage
        .from('cars-images')
        .remove([oldImagePath]);

      if (deleteError) {
        console.error('Error al eliminar la imagen antigua:', deleteError.message);
        return { success: false, message: deleteError.message };
      }
    }

    // Subir la nueva imagen
    const { data, error } = await supabase.storage
      .from('cars-images')
      .upload(imagePath, newImage);

    if (error) {
      console.error('Error al subir la nueva imagen:', error.message || error);
      return { success: false, message: error.message || 'Error desconocido al subir la imagen' };
    }

    // Obtener la URL pública de la nueva imagen
    const publicUrl = supabase.storage
      .from('cars-images')
      .getPublicUrl(imagePath).data.publicUrl;  // Aquí está el cambio, se usa 'publicUrl' en vez de 'publicURL'

    // Actualizar la base de datos con la URL pública de la nueva imagen
    const { data: updateData, error: updateError } = await supabase
      .from('cars')
      .update({ imageUrl: publicUrl }) // Actualiza la columna 'imageUrl' con la nueva URL pública
      .eq('id', carId);

    if (updateError) {
      console.error('Error al actualizar la base de datos:', updateError.message);
      return { success: false, message: 'Error al actualizar la base de datos' };
    }

    return { success: true, data };
  } catch (err) {
    if (err instanceof Error) {
      console.error('Error en la actualización de la imagen:', err.message);
      return { success: false, message: err.message };
    } else {
      console.error('Error desconocido:', err);
      return { success: false, message: 'Error desconocido' };
    }
  }
};


