import { ArrowLeft, ArrowRight, Palmtree, Glasses } from "lucide-react";
import { AiFillStar, AiOutlineStar } from "react-icons/ai"; 
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";
import supabase from "@/supabase/authTest";

type Testimonial = {
  id: number;
  comment: string;
  author: string;
  rating: number;
  approved: boolean;
  media: { media_url: string; media_type: string }[]; 
};

export const AnimatedTestimonials = ({ autoplay = false }: { autoplay?: boolean }) => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [active, setActive] = useState(0);
  const [mediaIndex, setMediaIndex] = useState(0);

  const fetchTestimonials = async () => {
    const { data: reviews, error } = await supabase.from("reviews").select("*").limit(10);

    if (error) {
      console.error("Error fetching testimonials:", error.message);
      return;
    }

    const approvedReviews = reviews.filter((item) => item.approved === true);

    const enrichedReviews = await Promise.all(
      approvedReviews.map(async (review) => {
        const { data: media } = await supabase
          .from("review_media")
          .select("media_url, media_type")
          .eq("review_id", review.id);

        return { ...review, media: media || [] };
      })
    );

    setTestimonials(enrichedReviews);
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const handleNext = () => {
    setActive((prev) => (prev + 1) % testimonials.length);
    setMediaIndex(0);
  };

  const handlePrev = () => {
    setActive((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    setMediaIndex(0);
  };

  const nextMedia = () => {
    if (testimonials[active].media.length > 1) {
      setMediaIndex((prev) => (prev + 1) % testimonials[active].media.length);
    }
  };

  const renderStars = (rating: number) => (
    <div className="flex gap-1 mt-2">
      {[...Array(5)].map((_, i) =>
        i < rating ? (
          <AiFillStar key={i} className="text-yellow-400 text-xl" />
        ) : (
          <AiOutlineStar key={i} className="text-yellow-400 text-xl" />
        )
      )}
    </div>
  );

  // Nueva función para renderizar miniatura de medios
  const renderMediaThumbnails = () => {
    const currentMedia = testimonials[active].media;
    return (
      <div className="flex gap-2 mt-4 justify-center">
        {currentMedia.map((mediaItem, index) => (
          <button
            key={index}
            onClick={() => setMediaIndex(index)}
            className={`
              w-16 h-16 rounded-lg overflow-hidden border-2 transform transition-all duration-300
              ${mediaIndex === index ? 'border-white scale-110' : 'border-white/30 opacity-60 hover:opacity-100'}
            `}
          >
            {mediaItem.media_type === 'image' ? (
              <Image
                src={mediaItem.media_url}
                alt={`Media ${index + 1}`}
                width={64}
                height={64}
                className="w-full h-full object-cover"
              />
            ) : (
              <video 
                src={mediaItem.media_url}
                className="w-full h-full object-cover"
              />
            )}
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="max-w-lg md:max-w-4xl mx-auto font-sans px-6 md:px-10 lg:px-14 py-16 bg-gradient-to-br from-[#c47369] to-[#f8c4bc] backdrop-blur-md rounded-xl shadow-2xl relative overflow-hidden">
      <h2 className="text-2xl font-bold text-center mb-6 text-white bg-white/20 px-6 py-3 rounded-full shadow-lg backdrop-blur-sm border border-white/30 flex items-center justify-center gap-2">
        <span className="text-yellow-400">⭐</span> Customer Reviews <span className="text-yellow-400">⭐</span>
      </h2>

      <div className="relative grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="relative h-80 w-full flex flex-col items-center justify-center">
          {testimonials.length > 0 && testimonials[active].media.length > 0 && (
            <div className="relative w-full h-full mb-4">
              <AnimatePresence mode="wait">
                <motion.div
                  key={mediaIndex}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  {testimonials[active].media[mediaIndex].media_type === "image" ? (
                    <Image
                      src={testimonials[active].media[mediaIndex].media_url}
                      alt="Review Media"
                      width={500}
                      height={500}
                      className="h-full w-full rounded-3xl object-cover border-4 border-white/30"
                    />
                  ) : (
                    <video
                      src={testimonials[active].media[mediaIndex].media_url}
                      controls
                      className="h-full w-full rounded-3xl border-4 border-white/30"
                    />
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          )}
          
          {/* Nuevas miniaturas de medios */}
          {testimonials.length > 0 && testimonials[active].media.length > 1 && renderMediaThumbnails()}
        </div>

        <div className="flex flex-col justify-between py-4 text-white">
          {testimonials.length > 0 && (
            <motion.div
              key={active}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              className="bg-white/10 p-6 rounded-xl backdrop-blur-sm border border-white/20"
            >
              <h3 className="text-2xl font-bold">{testimonials[active].author}</h3>
              {renderStars(testimonials[active].rating)}
              <p className="text-lg mt-4 leading-relaxed">{testimonials[active].comment}</p>
            </motion.div>
          )}

          <div className="flex gap-4 pt-10">
            <button
              onClick={handlePrev}
              className="h-12 w-12 rounded-full bg-white/20 hover:bg-white/30 transition-colors flex items-center justify-center"
            >
              <ArrowLeft className="h-6 w-6 text-white" />
            </button>
            <button
              onClick={handleNext}
              className="h-12 w-12 rounded-full bg-white/20 hover:bg-white/30 transition-colors flex items-center justify-center"
            >
              <ArrowRight className="h-6 w-6 text-white" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};