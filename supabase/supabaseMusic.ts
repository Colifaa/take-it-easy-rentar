import supabase from "./authTest";

export async function uploadSong(file: File) {
  try {
    // Verificar la sesión del usuario
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !session) {
      throw new Error("No hay sesión activa. Por favor, inicia sesión.");
    }

    // Verificar el rol de administrador
    const { data: roleData, error: roleError } = await supabase
      .from("user_roles")
      .select("role_id")
      .eq("user_id", session.user.id)
      .single();

    if (roleError || !roleData || roleData.role_id !== 1) {
      throw new Error("No tienes permisos de administrador.");
    }

    // Subir el archivo a Supabase Storage
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;

    console.log("Intentando subir archivo:", {
      bucket: 'music',
      fileName,
      fileSize: file.size,
      fileType: file.type
    });

    const { error: uploadError, data } = await supabase.storage
      .from('music')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      console.error("Error uploading file:", uploadError);
      throw new Error(`Error al subir el archivo: ${uploadError.message}`);
    }

    // Obtener la URL pública del archivo
    const { data: { publicUrl } } = supabase.storage
      .from('music')
      .getPublicUrl(fileName);

    console.log("Archivo subido exitosamente:", publicUrl);

    // Guardar la referencia en la base de datos
    const { error: dbError } = await supabase
      .from('songs')
      .insert([
        {
          name: file.name,
          url: publicUrl,
        }
      ]);

    if (dbError) {
      console.error("Error saving to database:", dbError);
      // Si falla la inserción en la base de datos, eliminar el archivo
      await supabase.storage.from('music').remove([fileName]);
      throw new Error(`Error al guardar en la base de datos: ${dbError.message}`);
    }

    return { success: true, url: publicUrl };
  } catch (error) {
    console.error('Error completo:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Error desconocido' 
    };
  }
}

export async function deleteSong(id: string, url: string) {
  try {
    // Verificar la sesión del usuario
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !session) {
      throw new Error("No hay sesión activa. Por favor, inicia sesión.");
    }

    // Verificar el rol de administrador
    const { data: roleData, error: roleError } = await supabase
      .from("user_roles")
      .select("role_id")
      .eq("user_id", session.user.id)
      .single();

    if (roleError || !roleData || roleData.role_id !== 1) {
      throw new Error("No tienes permisos de administrador.");
    }

    // Extraer el nombre del archivo de la URL
    const fileName = url.split('/').pop();
    if (!fileName) throw new Error('URL inválida');

    console.log("Intentando eliminar archivo:", fileName);

    // Eliminar el archivo de Storage
    const { error: storageError } = await supabase.storage
      .from('music')
      .remove([fileName]);

    if (storageError) {
      console.error("Error deleting from storage:", storageError);
      throw new Error(`Error al eliminar el archivo: ${storageError.message}`);
    }

    // Eliminar la referencia de la base de datos
    const { error: dbError } = await supabase
      .from('songs')
      .delete()
      .eq('id', id);

    if (dbError) {
      console.error("Error deleting from database:", dbError);
      throw new Error(`Error al eliminar de la base de datos: ${dbError.message}`);
    }

    return { success: true };
  } catch (error) {
    console.error('Error deleting song:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Error desconocido' 
    };
  }
} 