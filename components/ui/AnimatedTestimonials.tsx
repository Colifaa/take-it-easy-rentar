import { ArrowLeft, ArrowRight, Palmtree, Glasses } from "lucide-react";
import { AiFillStar, AiOutlineStar } from "react-icons/ai"; // Importamos las estrellas
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";
import supabase from "@/supabase/authTest";

type Testimonial = {
  id: number;
  comment: string;
  author: string;
  rating: number;
  src: string;
  approved: boolean;
};

export const AnimatedTestimonials = ({ autoplay = false }: { autoplay?: boolean }) => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [active, setActive] = useState(0);

  const fetchTestimonials = async () => {
    const { data, error } = await supabase.from("reviews").select("*");

    if (error) {
      console.error("Error fetching testimonials:", error.message);
    } else {
      const approvedTestimonials = data.filter((item) => item.approved === true);
      setTestimonials(approvedTestimonials);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const handleNext = () => {
    setActive((prev) => (prev + 1) % testimonials.length);
  };

  const handlePrev = () => {
    setActive((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const isActive = (index: number) => index === active;

  const renderStars = (rating: number) => {
    return (
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
  };

  const gradientStyle = "bg-gradient-to-br from-[#c47369] to-[#f8c4bc]";

  return (
    <div className={`max-w-sm md:max-w-4xl mx-auto antialiased font-sans px-6 md:px-10 lg:px-14 py-16 ${gradientStyle} backdrop-blur-md rounded-xl shadow-2xl relative overflow-hidden`}>
      {/* Decorative elements */}
      <div className="absolute top-4 right-4 text-white/20">
        <Palmtree size={64} />import 
      </div>
      <div className="absolute bottom-4 left-4 text-white/20">
        <Glasses size={48} />
      </div>

      <h2 className="text-2xl font-bold text-center mb-6 text-white bg-white/20 px-6 py-3 rounded-full shadow-lg backdrop-blur-sm border border-white/30 flex items-center justify-center gap-2">
        <span className="text-yellow-400">⭐</span>
        Customer Reviews
        <span className="text-yellow-400">⭐</span>
      </h2>

      <div className="relative grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Image section */}
        <div className="relative h-80 w-full">
          <AnimatePresence>
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, scale: 0.9, z: -100 }}
                animate={{
                  opacity: isActive(index) ? 1 : 0.7,
                  scale: isActive(index) ? 1 : 0.95,
                  zIndex: isActive(index) ? 999 : testimonials.length + 2 - index,
                }}
                exit={{ opacity: 0, scale: 0.9, z: 100 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="absolute inset-0 origin-bottom"
              >
                <Image
                  src={testimonial.src || "/default-avatar.png"}
                  alt={testimonial.author}
                  width={500}
                  height={500}
                  draggable={false}
                  className="h-full w-full rounded-3xl object-cover object-center shadow-lg border-4 border-white/30 hover:border-white/50 transition-all duration-300"
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Testimonial content */}
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
              <motion.p className="text-lg mt-6 leading-relaxed">
                {testimonials[active].comment.split(" ").map((word, index) => (
                  <motion.span
                    key={index}
                    initial={{ filter: "blur(10px)", opacity: 0, y: 5 }}
                    animate={{ filter: "blur(0px)", opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, ease: "easeInOut", delay: 0.02 * index }}
                    className="inline-block"
                  >
                    {word}&nbsp;
                  </motion.span>
                ))}
              </motion.p>
            </motion.div>
          )}

          {/* Navigation buttons */}
          <div className="flex gap-4 pt-10">
            <button
              onClick={handlePrev}
              className="h-12 w-12 rounded-full bg-white/20 hover:bg-white/30 transition-colors flex items-center justify-center shadow-lg backdrop-blur-sm border border-white/30"
            >
              <ArrowLeft className="h-6 w-6 text-white" />
            </button>
            <button
              onClick={handleNext}
              className="h-12 w-12 rounded-full bg-white/20 hover:bg-white/30 transition-colors flex items-center justify-center shadow-lg backdrop-blur-sm border border-white/30"
            >
              <ArrowRight className="h-6 w-6 text-white" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};