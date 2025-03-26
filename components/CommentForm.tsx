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
      <h2 className="text-2xl font-bold text-center text-white bg-white/20 px-6 py-3 rounded-full shadow-lg backdrop-blur-sm border border-white/30">
        {t.title}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          required
          rows={4}
          className="w-full p-3 rounded-lg border bg-white/10 text-white placeholder-white/50"
        />

        {/* Estrellas */}
        <div className="flex justify-center">
          {[1, 2, 3, 4, 5].map((star) => (
            <FaStar
              key={star}
              className={`cursor-pointer ${
                (hover || rating) >= star ? "text-yellow-400" : "text-white/40"
              }`}
              size={28}
              onClick={() => setRating(star)}
              onMouseEnter={() => setHover(star)}
              onMouseLeave={() => setHover(0)}
            />
          ))}
        </div>

        {/* Subida de múltiples archivos */}
        <div>
          <Label htmlFor="files" className="text-white mb-2 flex items-center gap-2">
            <Camera className="w-4 h-4" />
            {t.imageLabel} (Máximo 6 archivos, 20MB cada uno)
          </Label>
          <Input
            type="file"
            id="files"
            accept="image/*,video/*"
            multiple
            onChange={handleFileChange}
          />
        </div>

        {/* Vista previa de archivos */}
        {files.length > 0 && (
          <div className="grid grid-cols-3 gap-2">
            {files.map((file, index) => (
              <div key={index} className="relative">
                {file.type.startsWith("image") ? (
                  <img
                    src={URL.createObjectURL(file)}
                    className="w-full h-20 object-cover rounded-lg"
                    alt="Preview"
                  />
                ) : (
                  <video
                    src={URL.createObjectURL(file)}
                    className="w-full h-20 rounded-lg"
                    controls
                  />
                )}
                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                >
                  <FaTimes />
                </button>
              </div>
            ))}
          </div>
        )}

        <button 
          type="submit" 
          disabled={loading || !user} 
          className="w-full py-3 text-white bg-white/20 rounded-full"
        >
          {loading ? "Enviando..." : "Publicar"}
        </button>
      </form>
    </div>
  );
};