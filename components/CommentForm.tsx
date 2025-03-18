"use client"
import { useState, useEffect } from "react";
import { useToast } from "@chakra-ui/react";
import { FaStar } from "react-icons/fa";
import { Palmtree, Glasses, Camera } from 'lucide-react';
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
  const [file, setFile] = useState<File | null>(null);
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

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
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
      let base64Image = file ? await convertToBase64(file) : "";
      const { error } = await supabase.from("reviews").insert([
        {
          author: user?.user_metadata?.nickname || "Anónimo",
          comment,
          rating,
          src: base64Image,
          approved: false,
        },
      ]);

      if (error) throw new Error(error.message);

      toast({
        title: "Comentario enviado",
        description: "Tu comentario está en revisión.",
        status: "success",
        duration: 4000,
        isClosable: true,
      });

      setComment("");
      setRating(5);
      setFile(null);
    } catch (error) {
      toast({
        title: "Error",
        description: (error as Error).message,
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
      {/* Decorative elements */}
      <div className="absolute top-4 right-4 text-white/20 transform rotate-45">
        <Palmtree size={64} />
      </div>
      <div className="absolute bottom-4 left-4 text-white/20">
        <Glasses size={48} />
      </div>

      <h2 className="text-2xl font-bold text-center text-white bg-white/20 px-6 py-3 rounded-full shadow-lg backdrop-blur-sm border border-white/30 flex items-center justify-center gap-2">
        <span className="text-yellow-400">⭐</span>
        {t.title}
        <span className="text-yellow-400">⭐</span>
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
        {/* Comment Field */}
        <div className="bg-white/10 p-4 rounded-xl backdrop-blur-sm border border-white/30">
          <label htmlFor="comment" className="block text-sm font-medium text-white mb-2">
            {t.commentLabel}
          </label>
          <textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            required
            rows={4}
            className="w-full p-3 rounded-lg border border-white/30 bg-white/10 text-white placeholder-white/50 focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all duration-200"
          />
        </div>

        {/* Star Rating */}
        <div className="flex flex-col items-center gap-2 bg-white/10 p-4 rounded-xl backdrop-blur-sm border border-white/30">
          <label className="text-sm font-medium text-white">{t.ratingLabel}</label>
          <div className="flex space-x-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <FaStar
                key={star}
                className={`cursor-pointer transition-colors ${
                  (hover || rating) >= star ? "text-yellow-400" : "text-white/40"
                }`}
                size={28}
                onClick={() => setRating(star)}
                onMouseEnter={() => setHover(star)}
                onMouseLeave={() => setHover(0)}
              />
            ))}
          </div>
        </div>

        {/* Image Upload */}
        <div className="bg-white/10 p-4 rounded-xl backdrop-blur-sm border border-white/30">
          <Label htmlFor="file" className="block text-sm font-medium text-white mb-2 flex items-center gap-2">
            <Camera className="w-4 h-4" />
            {t.imageLabel}
          </Label>
          <Input
            type="file"
            id="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="w-full p-3 rounded-lg border border-white/30 bg-white/10 text-white file:bg-white/20 file:border-0 file:text-white file:rounded-lg file:px-4 file:py-0 file:mr-4 file:hover:bg-white/30 file:transition-colors"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || !user}
          className={`w-full py-3 px-6 text-white font-semibold rounded-full transition-all duration-200 
            ${
              !user
                ? "bg-white/20 cursor-not-allowed"
                : "bg-white/20 hover:bg-white/30 focus:ring-2 focus:ring-white/50 backdrop-blur-sm border border-white/30"
            }
          `}
        >
          {loading ? t.submittingButton : !user ? t.loginToComment : t.submitButton}
        </button>
      </form>
    </div>
  );
};