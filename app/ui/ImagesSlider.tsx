import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import React, { useEffect, useState, useCallback, useRef } from "react";
import LoadingOverlay from "../../components/LoadingOverlay"; // Importa el componente de carga

export const ImagesSlider = ({
  images,
  children,
  overlay = true,
  overlayClassName,
  className,
  autoplay = true,
  direction = "up",
}: {
  images: string[];
  children: React.ReactNode;
  overlay?: React.ReactNode;
  overlayClassName?: string;
  className?: string;
  autoplay?: boolean;
  direction?: "up" | "down";
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loadedMedia, setLoadedMedia] = useState<string[]>([]);
  const [loading, setLoading] = useState(true); // Inicializa en true
  const [error, setError] = useState(false); // Estado para manejar errores
  const videoRef = useRef<HTMLVideoElement>(null); // Referencia al video actual

  const handleNext = useCallback(() => {
    setCurrentIndex((prevIndex) =>
      prevIndex + 1 === loadedMedia.length ? 0 : prevIndex + 1
    );
  }, [loadedMedia.length]);

  const handlePrevious = useCallback(() => {
    setCurrentIndex((prevIndex) =>
      prevIndex - 1 < 0 ? loadedMedia.length - 1 : prevIndex - 1
    );
  }, [loadedMedia.length]);

  const loadMedia = useCallback(() => {
    setLoading(true);
    setError(false); // Reinicia el estado de error
    const loadPromises = images.map((media) => {
      return new Promise((resolve, reject) => {
        const video = document.createElement("video");
        video.src = media;
        video.onloadeddata = () => resolve(media);
        video.onerror = (err) => {
          console.error(`Error al cargar el video: ${media}`, err);
          reject(err);
        };
      });
    });

    Promise.allSettled(loadPromises)
      .then((results) => {
        const loadedVideos = results
          .filter((result) => result.status === "fulfilled")
          .map((result) => (result as any).value);

        if (loadedVideos.length === 0) {
          setError(true); // Si ningún video se carga, marca un error
        }
        setLoadedMedia(loadedVideos);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Failed to load videos", error);
        setError(true);
        setLoading(false);
      });
  }, [images]);

  useEffect(() => {
    loadMedia();
  }, [loadMedia]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") {
        handleNext();
      } else if (event.key === "ArrowLeft") {
        handlePrevious();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleNext, handlePrevious]);

  const slideVariants = {
    initial: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, transition: { duration: 0.3 } },
  };

  const handleVideoEnd = () => {
    handleNext(); // Cambia al siguiente video cuando termine el actual
  };

  if (error) {
    return (
      <div className="flex items-center justify-center h-full w-full bg-red-500 text-white">
        Error al cargar los videos. Por favor, inténtalo más tarde.
      </div>
    );
  }

  return (
    <div
      className={cn(
        "overflow-hidden h-full w-full relative flex items-center justify-center",
        className
      )}
      style={{ perspective: "1000px" }}
    >
      {loading && <LoadingOverlay loading={loading} />}

      {!loading && (
        <>
          {children}
          {overlay && (
            <div className={cn("absolute inset-0 bg-black/10 z-40", overlayClassName)} />
          )}
          <AnimatePresence>
            <motion.div
              key={currentIndex}
              initial="initial"
              animate="visible"
              exit="exit"
              variants={slideVariants}
              className="video h-full w-full absolute inset-0"
              style={{ willChange: "opacity" }}
            >
              <video
                ref={videoRef}
                className="w-full h-full object-cover"
                autoPlay
                muted
                playsInline
                onEnded={handleVideoEnd} // Cambia al siguiente video cuando termine
              >
                <source src={loadedMedia[currentIndex]} type="video/mp4" />
              </video>
            </motion.div>
          </AnimatePresence>
        </>
      )}
    </div>
  );
};