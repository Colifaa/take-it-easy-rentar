import supabase from "./authTest";
interface Car {
  id: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  transmission: string;
  fuelType: string;
  imageUrls: string[]; // Ahora es un array de strings
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
    // Genera un nombre único para la nueva imagen
    const uniqueImageName = `${newImage.name.split('.')[0]}_${Date.now()}.${newImage.name.split('.').pop()}`;
    const imagePath = `images/${uniqueImageName}`;

    console.log('Subiendo nueva imagen:', uniqueImageName);

    // Eliminar la imagen antigua si existe
    const oldImageData = await getCarById(carId);
    const oldImagePaths = oldImageData?.imageUrls || []; // Obtiene las URLs de las imágenes antiguas
    console.log('Imagenes antiguas encontradas:', oldImagePaths);

    if (oldImagePaths.length > 0) {
      // Eliminamos cada imagen antigua en el array
      const { error: deleteError } = await supabase.storage
        .from('cars-images')
        .remove(oldImagePaths);

      if (deleteError) {
        console.error('Error al eliminar las imágenes antiguas:', deleteError.message);
        return { success: false, message: deleteError.message };
      }
      console.log('Imágenes antiguas eliminadas correctamente');
    }

    // Subir la nueva imagen
    const { data, error } = await supabase.storage
      .from('cars-images')
      .upload(imagePath, newImage);

    if (error) {
      console.error('Error al subir la nueva imagen:', error.message || error);
      return { success: false, message: error.message || 'Error desconocido al subir la imagen' };
    }

    console.log('Imagen subida correctamente:', data);

    // Obtener la URL pública de la nueva imagen
    const { data: urlData } = supabase.storage
      .from('cars-images')
      .getPublicUrl(imagePath);

    const publicUrl = urlData.publicUrl; // Aquí accedemos directamente a publicUrl

    console.log('URL pública de la nueva imagen:', publicUrl);

    // Actualizar la base de datos con la nueva URL pública de la imagen
    const { data: updateData, error: updateError } = await supabase
      .from('cars')
      .update({ imageUrls: [...oldImagePaths, publicUrl] }) // Agrega la nueva URL al array
      .eq('id', carId);

    if (updateError) {
      console.error('Error al actualizar la base de datos:', updateError.message);
      return { success: false, message: 'Error al actualizar la base de datos' };
    }

    console.log('Base de datos actualizada correctamente con la nueva imagen');
    return { success: true, data: updateData };
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
