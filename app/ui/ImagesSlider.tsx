"use client";

import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import React, { useEffect, useState, useCallback } from "react";
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

  const handleNext = useCallback(() => {
    setCurrentIndex((prevIndex) =>
      prevIndex + 1 === images.length ? 0 : prevIndex + 1
    );
  }, [images.length]);

  const handlePrevious = useCallback(() => {
    setCurrentIndex((prevIndex) =>
      prevIndex - 1 < 0 ? images.length - 1 : prevIndex - 1
    );
  }, [images.length]);

  const loadMedia = useCallback(() => {
    setLoading(true);
    const loadPromises = images.map((media) => {
      return new Promise((resolve, reject) => {
        const video = document.createElement("video");
        video.src = media;
        video.onloadeddata = () => resolve(media);
        video.onerror = reject;
      });
    });

    Promise.all(loadPromises)
      .then((loadedVideos) => {
        setLoadedMedia(loadedVideos as string[]);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Failed to load videos", error);
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

    let interval: NodeJS.Timeout;

  if (autoplay && !loading) {
    interval = setInterval(() => {
      handleNext();
    }, 7000); // Incrementa el intervalo a 7 segundos
  }

  return () => clearInterval(interval);
}, [autoplay, handleNext, loading]);

  const slideVariants = {
    initial: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, transition: { duration: 0.3 } },
  };

  return (
    <div
      className={cn("overflow-hidden h-full w-full relative flex items-center justify-center", className)}
      style={{ perspective: "1000px" }}
    >
      {/* Muestra el loading cuando los videos aún están cargando */}
      {loading && <LoadingOverlay loading={loading} />}

      {/* Solo renderiza los videos si ya cargaron */}
      {!loading && (
        <>
          {children}
          {overlay && (
  <div
    className={cn("absolute inset-0 bg-black/10 z-40", overlayClassName)}
  />
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
              <video className="w-full h-full object-cover" autoPlay loop muted playsInline>
                <source src={loadedMedia[currentIndex]} type="video/mp4" />
              </video>
            </motion.div>
          </AnimatePresence>
        </>
      )}
    </div>
  );
};
