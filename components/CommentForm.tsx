import { useState, useEffect } from "react";
import { useToast } from "@chakra-ui/react";
import supabase from "@/supabase/authTest";
import { User } from "@supabase/supabase-js";
import { useLanguage } from "../hooks/use-language";
import { languages } from "../lib/languages";

export const CommentForm = () => {
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(5);
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
    <div className="max-w-lg mx-auto bg-white dark:bg-gray-900 shadow-lg rounded-lg p-6 space-y-6">
      <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white">{t.title}</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="comment" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {t.commentLabel}
          </label>
          <textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            required
            rows={4}
            className="mt-1 block w-full p-3 rounded-md border border-gray-300 dark:border-gray-700 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:text-white"
          />
        </div>

        <div className="flex items-center gap-4">
          <div className="w-1/2">
            <label htmlFor="rating" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {t.ratingLabel}
            </label>
            <input
              type="number"
              id="rating"
              value={rating}
              onChange={(e) => setRating(parseInt(e.target.value))}
              min={1}
              max={5}
              required
              className="mt-1 block w-full p-3 rounded-md border border-gray-300 dark:border-gray-700 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:text-white"
            />
          </div>

          <div className="w-1/2">
            <label htmlFor="file" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {t.imageLabel}
            </label>
            <input
              type="file"
              id="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="mt-1 block w-full p-3 rounded-md border border-gray-300 dark:border-gray-700 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:text-white"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || !user}
          className={`w-full py-2 px-4 text-white font-semibold rounded-md transition 
            ${!user ? "bg-gray-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500"}`}
        >
          {loading ? t.submittingButton : !user ? t.loginToComment : t.submitButton}
        </button>
      </form>
    </div>
  );
};
