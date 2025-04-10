"use client";
import { useState, useEffect } from "react";
import { useToast } from "@chakra-ui/react";
import { FaStar, FaTimes } from "react-icons/fa";
import { Camera } from "lucide-react";
import supabase from "@/supabase/authTest";
import { User } from "@supabase/supabase-js";
import { useLanguage } from "../hooks/use-language";
import { languages } from "../lib/languages";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const CommentForm = () => {
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(5);
  const [hover, setHover] = useState(0);
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  const { language } = useLanguage();
  const t = languages[language].comments;
  const toast = useToast();

  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (!error) setUser(data?.user || null);
    };
    fetchUser();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = Array.from(e.target.files || []);
    
    // Combine existing and new files, with a max limit of 6 files
    const combinedFiles = [...files, ...newFiles].slice(0, 6);

    // Validate file types and sizes
    const validFiles = combinedFiles.filter(file => {
      const isValidType = file.type.startsWith('image/') || file.type.startsWith('video/');
      const isValidSize = file.size <= 20 * 1024 * 1024; // 20MB max
      return isValidType && isValidSize;
    });

    if (validFiles.length !== combinedFiles.length) {
      toast({
        title: "Archivo inválido",
        description: "Solo se permiten hasta 6 archivos de imagen o video, cada uno de máximo 20MB.",
        status: "warning",
        duration: 4000,
        isClosable: true,
      });
    }

    setFiles(validFiles);
  };

  const removeFile = (indexToRemove: number) => {
    setFiles(files.filter((_, index) => index !== indexToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({
        title: t.loginToComment,
        description: "Inicie sesión para comentar.",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
      return;
    }

    setLoading(true);
    try {
      // Insertar el comentario en la tabla "reviews"
      const { data: reviewData, error: reviewError } = await supabase
        .from("reviews")
        .insert([
          {
            author: user?.user_metadata?.nickname || "Anónimo",
            comment,
            rating,
            approved: false,
          },
        ])
        .select("id")
        .single();

      if (reviewError) {
        console.error("Review Insert Error:", reviewError);
        throw new Error(reviewError.message);
      }

      // Subir archivos a Supabase Storage y guardar en la tabla "review_media"
      const uploadPromises = files.map(async (file) => {
        const fileExt = file.name.split(".").pop();
        const filePath = `reviews/${reviewData.id}/${Date.now()}_${file.name}`;
        
        // Subir archivo
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("reviewmedia")
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false
          });
        
        if (uploadError) {
          console.error("Storage Upload Error:", uploadError);
          throw new Error(`Upload failed: ${uploadError.message}`);
        }
        
        // Obtener la URL pública
        const { data: urlData } = supabase.storage
          .from("reviewmedia")
          .getPublicUrl(filePath);
        
        const publicUrl = urlData.publicUrl;
        
        // Guardar la URL en la base de datos
        const { error: mediaError } = await supabase.from("review_media").insert([
          {
            review_id: reviewData.id,
            media_url: publicUrl,
            media_type: file.type.startsWith("image") ? "image" : "video",
          },
        ]);
        
        if (mediaError) {
          console.error("Media Insert Error:", mediaError);
          throw new Error(`Media insert failed: ${mediaError.message}`);
        }
        
        return publicUrl;
      });

      // Esperar a que se suban todos los archivos
      await Promise.all(uploadPromises);

      toast({
        title: "Comentario enviado",
        description: "Tu comentario y archivos han sido enviados.",
        status: "success",
        duration: 4000,
        isClosable: true,
      });

      // Resetear formulario
      setComment("");
      setRating(5);
      setFiles([]);
    } catch (error) {
      console.error("Submission Error:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Ocurrió un error inesperado",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto bg-gradient-to-br from-[#c47369] to-[#f8c4bc] backdrop-blur-md shadow-2xl rounded-xl p-8 space-y-6 border border-white/30 relative overflow-hidden">
      {/* Sección informativa */}
      <div className="bg-white/20 rounded-xl p-6 mb-8 backdrop-blur-sm border border-white/30">
        <h2 className="text-2xl font-bold text-center text-white mb-4">
          {t.shareAdventure}
        </h2>
        <div className="flex flex-col md:flex-row gap-6 items-center text-white/90">
          <div className="flex-1 space-y-4">
            <p className="text-lg leading-relaxed">
              {t.shareDescription}
            </p>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <span className="text-yellow-300">🌅</span> {t.landscapes}
              </li>
              <li className="flex items-center gap-2">
                <span className="text-yellow-300">🚗</span> {t.carExperience}
              </li>
              <li className="flex items-center gap-2">
                <span className="text-yellow-300">🌟</span> {t.specialMoments}
              </li>
            </ul>
          </div>
          <div className="hidden md:block w-1/3">
            <div className="relative h-48 w-full rounded-lg overflow-hidden shadow-xl transform rotate-2">
              <div className="absolute inset-0 bg-gradient-to-br from-[#c47369]/40 to-[#f8c4bc]/40 mix-blend-overlay"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Camera className="w-16 h-16 text-white/80" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
        <div className="space-y-2">
          <label className="text-white text-sm font-medium">{t.yourComment}</label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            required
            placeholder={t.commentPlaceholder}
            rows={4}
            className="w-full p-4 rounded-lg border bg-white/10 text-white placeholder-white/50 focus:ring-2 focus:ring-yellow-300 focus:border-transparent resize-none"
          />
        </div>

        {/* Estrellas */}
        <div className="space-y-2">
          <label className="text-white text-sm font-medium">{t.rating}</label>
          <div className="flex justify-center bg-white/10 py-3 rounded-lg">
            {[1, 2, 3, 4, 5].map((star) => (
              <FaStar
                key={star}
                className={`cursor-pointer transition-colors ${
                  (hover || rating) >= star ? "text-yellow-400" : "text-white/40"
                }`}
                size={32}
                onClick={() => setRating(star)}
                onMouseEnter={() => setHover(star)}
                onMouseLeave={() => setHover(0)}
              />
            ))}
          </div>
        </div>

        {/* Subida de archivos */}
        <div className="space-y-3">
          <label className="text-white text-sm font-medium flex items-center gap-2">
            <Camera className="w-4 h-4" />
            {t.shareMedia}
          </label>
          <div className="bg-white/10 p-4 rounded-lg border border-white/30">
            <div className="flex flex-col items-center gap-3">
              <input
                type="file"
                id="files"
                accept="image/*,video/*"
                multiple
                onChange={handleFileChange}
                className="hidden"
              />
              <label
                htmlFor="files"
                className="w-full py-3 px-4 bg-white/20 hover:bg-white/30 rounded-lg cursor-pointer text-white text-center transition-colors flex items-center justify-center gap-2"
              >
                <Camera className="w-5 h-5" />
                {t.selectFiles}
              </label>
              <p className="text-white/70 text-sm text-center">
                {t.maxFiles}
              </p>
            </div>
          </div>
        </div>

        {/* Vista previa de archivos */}
        {files.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {files.map((file, index) => (
              <div key={index} className="relative group">
                {file.type.startsWith("image") ? (
                  <img
                    src={URL.createObjectURL(file)}
                    className="w-full h-24 object-cover rounded-lg"
                    alt={t.preview}
                  />
                ) : (
                  <video
                    src={URL.createObjectURL(file)}
                    className="w-full h-24 rounded-lg"
                    controls
                  />
                )}
                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-red-600"
                >
                  <FaTimes className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}

        <button 
          type="submit" 
          disabled={loading || !user}
          className={`w-full py-3 px-6 rounded-full text-white font-medium transition-all ${
            loading || !user
              ? "bg-white/20 cursor-not-allowed"
              : "bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 transform hover:scale-[1.02]"
          }`}
        >
          {loading ? t.submittingButton : user ? t.publishComment : t.loginRequired}
        </button>
      </form>
    </div>
  );
};