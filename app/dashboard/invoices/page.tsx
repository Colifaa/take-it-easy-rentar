"use client";
import { useEffect, useState, useCallback } from "react";
import supabase from "@/supabase/authTest";
import "../../ui/global.css";

// Interfaz para los comentarios
interface Comment {
  id: number;
  author: string;
  comment: string;
  rating: number;
  created_at: string;
  approved: boolean;
}

// Interfaz para los medios
interface ReviewMedia {
  id: number;
  review_id: number;
  media_type: 'image' | 'video';
  media_url: string;
}

export default function Page() {
  const [comments, setComments] = useState<(Comment & { media?: ReviewMedia[] })[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedMedia, setSelectedMedia] = useState<{url: string, type: string} | null>(null);

  // Cargar comentarios al montar el componente
  useEffect(() => {
    const fetchComments = async () => {
      setLoading(true);
      try {
        // Fetch reviews
        const { data: reviewsData, error: reviewsError } = await supabase
          .from("reviews")
          .select("*")
          .order("created_at", { ascending: false });

        if (reviewsError) throw new Error(reviewsError.message);

        // Fetch media for each review
        const commentsWithMedia = await Promise.all(
          (reviewsData as Comment[]).map(async (comment) => {
            const { data: mediaData, error: mediaError } = await supabase
              .from("review_media")
              .select("*")
              .eq("review_id", comment.id);

            if (mediaError) {
              console.error(`Error fetching media for review ${comment.id}:`, mediaError);
              return { ...comment, media: [] };
            }

            return { 
              ...comment, 
              media: mediaData as ReviewMedia[] 
            };
          })
        );

        setComments(commentsWithMedia);
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
      // First, delete associated media
      const { error: mediaDeleteError } = await supabase
        .from("review_media")
        .delete()
        .eq("review_id", id);

      if (mediaDeleteError) throw new Error(mediaDeleteError.message);

      // Then delete the review
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

  // Abrir modal de media
  const openMediaModal = (url: string, type: string) => {
    setSelectedMedia({ url, type });
  };

  // Cerrar modal de media
  const closeMediaModal = () => {
    setSelectedMedia(null);
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

                  {/* Render media with improved display */}
                  {comment.media && comment.media.length > 0 && (
                    <div className={`mt-2 grid gap-2 ${
                      comment.media.length === 1 ? 'grid-cols-1' : 
                      comment.media.length === 2 ? 'grid-cols-2' : 
                      'grid-cols-3'
                    }`}>
                      {comment.media.map((media) => (
                        media.media_type === 'image' ? (
                          <img
                            key={media.id}
                            src={media.media_url}
                            alt="Comentario adjunto"
                            className="w-full h-32 object-cover rounded cursor-pointer"
                            onClick={() => openMediaModal(media.media_url, 'image')}
                          />
                        ) : (
                          <video
                            key={media.id}
                            src={media.media_url}
                            className="w-full h-32 object-cover rounded cursor-pointer"
                            onClick={() => openMediaModal(media.media_url, 'video')}
                          />
                        )
                      ))}
                    </div>
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

      {/* Modal para visualización de media en tamaño completo */}
      {selectedMedia && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
          onClick={closeMediaModal}
        >
          {selectedMedia.type === 'image' ? (
            <img 
              src={selectedMedia.url} 
              alt="Media en tamaño completo" 
              className="max-w-full max-h-full"
            />
          ) : (
            <video 
              src={selectedMedia.url} 
              controls 
              className="max-w-full max-h-full"
            />
          )}
        </div>
      )}
    </div>
  );
}