import React, { useEffect, useState } from "react";
import supabase from "@/supabase/authTest";


// Componente para mostrar estrellas
const CalificacionEstrellas: React.FC = () => {
  return (
    <div className="flex justify-center mt-2">
      {[...Array(5)].map((_, index) => (
        <svg
          key={index}
          xmlns="http://www.w3.org/2000/svg"
          fill="yellow"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="w-5 h-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 17.75l-6.518 3.427a1 1 0 01-1.449-1.055l1.247-7.271L.812 8.75a1 1 0 01.554-1.707l7.291-1.06L11.244.713a1 1 0 011.768 0l3.271 5.27 7.291 1.06a1 1 0 01.554 1.707l-5.268 5.052 1.247 7.271a1 1 0 01-1.449 1.055L12 17.75z"
          />
        </svg>
      ))}
    </div>
  );
};

const CarruselComentariosClientes: React.FC = () => {
  const [comentarios, setComentarios] = useState<
    { comment: string; author: string; imagen: string }[]
  >([]);

  console.log(comentarios,"comentarios");
  
  const [nuevoComentario, setNuevoComentario] = useState("");
  const [autor, setAutor] = useState("");

  // Obtener comentarios de Supabase
  const fetchComentarios = async () => {
    const { data, error } = await supabase.from("reviews").select("*");
    if (error) {
      console.error("Error fetching reviews:", error.message);
    } else {
      setComentarios(data || []);
    }
  };

  // Agregar un nuevo comentario
  const agregarComentario = async () => {
    if (!nuevoComentario || !autor) return;
    const { error } = await supabase.from("reviews").insert([
      {
        texto: nuevoComentario,
        autor: autor,
        imagen:
          "https://via.placeholder.com/60", // Puedes reemplazar esto con un sistema para subir imágenes
      },
    ]);

    if (error) {
      console.error("Error adding review:", error.message);
    } else {
      setNuevoComentario("");
      setAutor("");
      fetchComentarios();
    }
  };

  useEffect(() => {
    fetchComentarios();
  }, []);

  return (
    <div className="relative w-full overflow-hidden bg-gray-100 py-8">
      <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
        Comentarios de Clientes
      </h2>

      {/* Formulario para añadir nuevo comentario */}
      <div className="mb-8 text-center">
        <textarea
          className="border border-gray-300 rounded w-full p-2 mb-2"
          placeholder="Escribe tu comentario aquí..."
          value={nuevoComentario}
          onChange={(e) => setNuevoComentario(e.target.value)}
        />
        <input
          className="border border-gray-300 rounded w-full p-2 mb-2"
          placeholder="Tu nombre"
          value={autor}
          onChange={(e) => setAutor(e.target.value)}
        />
        <button
          onClick={agregarComentario}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Añadir comentario
        </button>
      </div>

      {/* Carrusel de comentarios */}
      <div className="flex animate-scroll space-x-8">
        {[...comentarios, ...comentarios].map((comentario, index) => (
          <div
            key={index}
            className="flex-shrink-0 w-72 p-4 bg-white rounded-lg shadow-md text-center"
          >
            <img
              src={comentario.imagen}
              alt={comentario.author}
              className="w-16 h-16 rounded-full mx-auto mb-4"
            />
            <p className="italic text-gray-700">{comentario.author}</p>
            <CalificacionEstrellas /> {/* Componente de estrellas */}
            <p className="font-semibold text-gray-800 mt-2">{comentario.author}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CarruselComentariosClientes;
