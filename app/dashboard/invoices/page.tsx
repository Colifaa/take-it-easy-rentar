"use client";

import { useEffect, useState } from "react";
import supabase from "@/supabase/authTest";
import Breadcrumbs from "@/app/ui/invoices/breadcrumbs";
import "../../ui/global.css";

// Definimos la interfaz para los comentarios
interface Comment {
  id: number;
  author: string;
  comment: string;
  rating: number;
  src?: string; // URL de la imagen, opcional
  created_at: string; // Fecha de creación
}

export default function Page() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Invoices", href: "/invoices" },
    { label: "Details", href: "/invoices/details", active: true },
  ];

  // Cargar comentarios al montar el componente
  useEffect(() => {
    const fetchComments = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("reviews") // Cambia "reviews" si tu tabla tiene otro nombre
          .select("*")
          .order("created_at", { ascending: false });

        if (error) {
          throw new Error(error.message);
        }

        setComments(data as Comment[]);
      } catch (error) {
        setErrorMessage((error as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, []);

  // Función para eliminar un comentario
  const deleteComment = async (id: number) => {
    try {
      const { error } = await supabase
        .from("reviews") // Cambia "reviews" si tu tabla tiene otro nombre
        .delete()
        .eq("id", id);

      if (error) {
        throw new Error(error.message);
      }

      // Actualizar lista de comentarios localmente
      setComments((prevComments) => prevComments.filter((comment) => comment.id !== id));
    } catch (error) {
      setErrorMessage((error as Error).message);
    }
  };

  return (
    <div className="p-6">
      <Breadcrumbs breadcrumbs={breadcrumbs} />

      <h1 className="text-2xl font-bold mb-4">Comentarios</h1>

      {errorMessage && (
        <p className="text-red-600 text-center mb-4">{errorMessage}</p>
      )}

      {loading ? (
        <p>Cargando comentarios...</p>
      ) : (
        <div className="space-y-4">
          {comments.length > 0 ? (
            comments.map((comment) => (
              <div
                key={comment.id}
                className="p-4 border rounded-md shadow-md bg-white flex justify-between items-center"
              >
                <div>
                  <p>
                    <span className="font-bold">{comment.author}</span>:{" "}
                    {comment.comment}
                  </p>
                  <p className="text-sm text-gray-500">Calificación: {comment.rating}/5</p>
                  {comment.src && (
                    <img
                      src={comment.src}
                      alt="Comentario adjunto"
                      className="w-20 h-20 mt-2 object-cover rounded"
                    />
                  )}
                </div>
                <button
                  onClick={() => deleteComment(comment.id)}
                  className="py-1 px-3 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Eliminar
                </button>
              </div>
            ))
          ) : (
            <p>No hay comentarios disponibles.</p>
          )}
        </div>
      )}
    </div>
  );
}
