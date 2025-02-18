"use client";
import { useEffect, useState } from "react";
import supabase from "@/supabase/authTest";
import "../../ui/global.css";

// Interfaz para los comentarios
interface Comment {
  id: number;
  author: string;
  comment: string;
  rating: number;
  src?: string;
  created_at: string;
  approved: boolean;
}

export default function Page() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Cargar comentarios al montar el componente
  useEffect(() => {
    const fetchComments = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("reviews")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) throw new Error(error.message);
        setComments(data as Comment[]);
      } catch (error) {
        setErrorMessage((error as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, []);

  // Eliminar comentario
  const deleteComment = async (id: number) => {
    try {
      const { error } = await supabase.from("reviews").delete().eq("id", id);
      if (error) throw new Error(error.message);
      setComments((prev) => prev.filter((comment) => comment.id !== id));
    } catch (error) {
      setErrorMessage((error as Error).message);
    }
  };

  // Aprobar/desaprobar comentario
  const toggleApproval = async (id: number, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from("reviews")
        .update({ approved: !currentStatus })
        .eq("id", id);

      if (error) throw new Error(error.message);
      setComments((prev) =>
        prev.map((comment) =>
          comment.id === id ? { ...comment, approved: !currentStatus } : comment
        )
      );
    } catch (error) {
      setErrorMessage((error as Error).message);
    }
  };

  return (
    <div className="flex flex-col min-h-screen p-4 md:p-6">
      <h1 className="text-2xl font-bold mb-4 text-[#704264]">Comentarios</h1>

      {errorMessage && <p className="text-red-600 text-center mb-4">{errorMessage}</p>}

      {loading ? (
        <p className="text-center text-gray-600">Cargando comentarios...</p>
      ) : (
        <div className="flex-grow overflow-auto">
          {comments.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {comments.map((comment) => (
                <div key={comment.id} className="p-4 border rounded-lg shadow bg-white">
                  <p className="text-[#49243E] font-semibold">{comment.author}:</p>
                  <p className="text-gray-700">{comment.comment}</p>
                  <p className="text-sm text-gray-500">Calificación: {comment.rating}/5</p>

                  {comment.src && (
                    <img
                      src={comment.src}
                      alt="Comentario adjunto"
                      className="w-20 h-20 mt-2 object-cover rounded"
                    />
                  )}

                  <div className="flex justify-between mt-4">
                    <button
                      onClick={() => toggleApproval(comment.id, comment.approved)}
                      className={`py-1 px-3 rounded text-white transition ${
                        comment.approved
                          ? "bg-green-600 hover:bg-green-700"
                          : "bg-yellow-600 hover:bg-yellow-700"
                      }`}
                    >
                      {comment.approved ? "Desaprobar" : "Aprobar"}
                    </button>

                    <button
                      onClick={() => deleteComment(comment.id)}
                      className="py-1 px-3 bg-red-600 text-white rounded hover:bg-red-700 transition"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500">No hay comentarios disponibles.</p>
          )}
        </div>
      )}
    </div>
  );
}
