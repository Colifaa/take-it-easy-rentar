import { useState, useEffect } from "react";
import { useToast } from "@chakra-ui/react"; // Importar el toast de Chakra UI
import supabase from "@/supabase/authTest";
import { User } from "@supabase/supabase-js"; // Importa el tipo User

export const CommentForm = () => {
  const [author, setAuthor] = useState("");  // Aquí mantengo el estado para el autor
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(5);
  const [file, setFile] = useState<File | null>(null); // Archivo seleccionado
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [user, setUser] = useState<User | null>(null); // Especificamos que user puede ser User o null
  console.log(user?.user_metadata.nickname,"userese");
  

  const toast = useToast(); // Chakra UI Toast

  // Verificar si hay un usuario conectado
  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();

      if (error) {
        console.error("Error fetching user:", error.message);
        setUser(null);
        return;
      }

      setUser(data?.user || null); // Asegúrate de que `user` esté presente en `data`
    };

    fetchUser();
  }, []);

  // Función para convertir el archivo a Base64
  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file); // Convierte el archivo a Base64
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Si no hay un usuario conectado, mostramos una alerta de Chakra UI
    if (!user) {
      toast({
        title: "Debe iniciar sesión.",
        description: "Inicie sesión para poder dejar un comentario.",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
      return; // Detener el envío del comentario
    }

    setLoading(true);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      let base64Image = "";

      if (file) {
        // Convertir la imagen seleccionada a Base64
        base64Image = await convertToBase64(file);
      }

      const { error } = await supabase
        .from("reviews") // Cambia "reviews" si tu tabla tiene otro nombre
        .insert([
          {
            author: user?.user_metadata?.nickname|| "Anónimo", // Asigna el correo del usuario conectado o "Anónimo"
            comment,
            rating,
            src: base64Image, // Guardamos la imagen como Base64
            approved: false,  // Añadimos el campo `approved` como `false` por defecto
          },
        ]);

      if (error) {
        throw new Error(error.message);
      }

      setSuccessMessage("¡Comentario enviado exitosamente!");
      setAuthor("");  // Limpiar el campo de nombre
      setComment("");
      setRating(5);
      setFile(null);
    } catch (error) {
      setErrorMessage((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8">
      <h2 className="text-2xl font-bold text-center mb-4">Deja tu comentario</h2>
      {successMessage && (
        <p className="text-green-600 text-center mb-4">{successMessage}</p>
      )}
      {errorMessage && (
        <p className="text-red-600 text-center mb-4">{errorMessage}</p>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="comment"
            className="block text-sm font-medium text-gray-700"
          >
            Comentario
          </label>
          <textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            required
            rows={4}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label
            htmlFor="rating"
            className="block text-sm font-medium text-gray-700"
          >
            Calificación (1-5)
          </label>
          <input
            type="number"
            id="rating"
            value={rating}
            onChange={(e) => setRating(parseInt(e.target.value))} // Aquí usamos parseInt y un valor por defecto de 1
            min={1}
            max={5}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label
            htmlFor="file"
            className="block text-sm font-medium text-gray-700"
          >
            Imagen (opcional)
          </label>
          <input
            type="file"
            id="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
        <button
          type="submit"
          disabled={loading || !user}  // Deshabilitar si no hay usuario
          className="w-full py-2 px-4 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 focus:outline-none"
        >
          {loading ? "Enviando..." : !user ? "Debe iniciar sesión para comentar" : "Enviar comentario"}
        </button>
      </form>
    </div>
  );
};
