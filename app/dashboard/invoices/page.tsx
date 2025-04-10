"use client";
import { useEffect, useState, useCallback } from "react";
import supabase from "@/supabase/authTest";
import "../../ui/global.css";
import { motion } from "framer-motion";
import { Search, Star, ThumbsUp, ThumbsDown, Trash2, Image as ImageIcon, Video, ChevronLeft, ChevronRight, X } from "lucide-react";

// Interfaz para los medios
interface ReviewMedia {
  id: number;
  review_id: number;
  media_url: string;
  media_type: string;
  created_at: string;
}

// Interfaz para los comentarios
interface Comment {
  id: number;
  author: string;
  comment: string;
  rating: number;
  created_at: string;
  approved: boolean;
  review_media?: ReviewMedia[];
}

export default function Page() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedMedia, setSelectedMedia] = useState<ReviewMedia | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<{field: keyof Comment, direction: 'asc' | 'desc'}>({
    field: 'created_at',
    direction: 'desc'
  });

  const ITEMS_PER_PAGE = 6;

  const fetchComments = useCallback(async () => {
    setLoading(true);
    try {
      // Obtener comentarios con sus medios asociados
      const { data: commentsData, error: commentsError } = await supabase
        .from("reviews")
        .select(`
          *,
          review_media (
            id,
            media_url,
            media_type,
            created_at
          )
        `)
        .order('created_at', { ascending: false });

      if (commentsError) throw commentsError;

      setComments(commentsData);
      setErrorMessage("");
    } catch (error) {
      console.error("Error al cargar los comentarios:", error);
      setErrorMessage("Error al cargar los comentarios. Por favor, intente nuevamente.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const toggleApproval = async (id: number, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from("reviews")
        .update({ approved: !currentStatus })
        .eq("id", id);

      if (error) throw error;

      setComments(prevComments =>
        prevComments.map(comment =>
          comment.id === id
            ? { ...comment, approved: !currentStatus }
            : comment
        )
      );
    } catch (error) {
      console.error("Error al actualizar el estado del comentario:", error);
      setErrorMessage("Error al actualizar el estado del comentario.");
    }
  };

  const deleteComment = async (id: number) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este comentario?")) {
      try {
        const { error } = await supabase
          .from("reviews")
          .delete()
          .eq("id", id);

        if (error) throw error;

        setComments(prevComments =>
          prevComments.filter(comment => comment.id !== id)
        );
      } catch (error) {
        console.error("Error al eliminar el comentario:", error);
        setErrorMessage("Error al eliminar el comentario.");
      }
    }
  };

  const closeMediaModal = () => {
    setSelectedMedia(null);
  };

  const handleSort = (field: keyof Comment) => {
    setSortBy(prev => ({
      field,
      direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const filteredComments = comments
    .filter(comment => 
      comment.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comment.comment.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      const aValue = a[sortBy.field];
      const bValue = b[sortBy.field];
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortBy.direction === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      return sortBy.direction === 'asc'
        ? Number(aValue) - Number(bValue)
        : Number(bValue) - Number(aValue);
    });

  const totalPages = Math.ceil(filteredComments.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedComments = filteredComments.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="flex flex-col min-h-screen p-4 md:p-6 bg-gray-50">
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-center gap-4">
        <h1 className="text-2xl font-bold text-[#49243E]">Gestión de Comentarios</h1>
        <div className="relative w-full sm:w-64">
          <input
            type="text"
            placeholder="Buscar comentarios..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#BB8493] focus:border-transparent"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        </div>
      </div>

      {errorMessage && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
          {errorMessage}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#BB8493]"></div>
        </div>
      ) : (
        <>
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {paginatedComments.map((comment) => (
              <motion.div
                key={comment.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-[#49243E]">{comment.author}</h3>
                      <p className="text-sm text-gray-500">{formatDate(comment.created_at)}</p>
                    </div>
                    <div className="flex items-center">
                      {[...Array(5)].map((_, index) => (
                        <Star
                          key={index}
                          className={`h-4 w-4 ${
                            index < comment.rating
                              ? "text-yellow-400 fill-current"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  <p className="text-gray-600 mb-4">{comment.comment}</p>

                  {/* Visualización de medios */}
                  {comment.review_media && comment.review_media.length > 0 && (
                    <div className="grid grid-cols-2 gap-2 mb-4">
                      {comment.review_media.map((media: any) => (
                        <div key={media.id} className="relative group">
                          {media.media_type.includes('image') ? (
                            <img
                              src={media.media_url}
                              alt="Media del comentario"
                              className="w-full h-32 object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                              onClick={() => setSelectedMedia(media)}
                            />
                          ) : media.media_type.includes('video') ? (
                            <video
                              src={media.media_url}
                              className="w-full h-32 object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                              controls
                            />
                          ) : null}
                          <div className="absolute top-2 right-2">
                            {media.media_type.includes('image') ? (
                              <ImageIcon className="h-4 w-4 text-white bg-black/50 rounded p-0.5" />
                            ) : (
                              <Video className="h-4 w-4 text-white bg-black/50 rounded p-0.5" />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                    <button
                      onClick={() => toggleApproval(comment.id, comment.approved)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                        comment.approved
                          ? "bg-green-100 text-green-700 hover:bg-green-200"
                          : "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                      }`}
                    >
                      {comment.approved ? (
                        <>
                          <ThumbsUp className="h-4 w-4" />
                          <span>Aprobado</span>
                        </>
                      ) : (
                        <>
                          <ThumbsDown className="h-4 w-4" />
                          <span>Pendiente</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => deleteComment(comment.id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      title="Eliminar comentario"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Paginación */}
          {totalPages > 1 && (
            <div className="mt-8 flex justify-center items-center gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
              >
                <ChevronLeft className="h-5 w-5 text-gray-600" />
              </button>
              
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                      currentPage === page
                        ? "bg-[#BB8493] text-white"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
              >
                <ChevronRight className="h-5 w-5 text-gray-600" />
              </button>
            </div>
          )}
        </>
      )}

      {/* Modal para visualizar medios */}
      {selectedMedia && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="relative max-w-4xl w-full mx-4">
            <button
              onClick={() => setSelectedMedia(null)}
              className="absolute -top-10 right-0 text-white hover:text-gray-300"
            >
              <X className="h-6 w-6" />
            </button>
            {selectedMedia.media_type.includes('image') ? (
              <img
                src={selectedMedia.media_url}
                alt="Media ampliada"
                className="w-full h-auto max-h-[80vh] object-contain rounded-lg"
              />
            ) : (
              <video
                src={selectedMedia.media_url}
                className="w-full h-auto max-h-[80vh] object-contain rounded-lg"
                controls
                autoPlay
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}