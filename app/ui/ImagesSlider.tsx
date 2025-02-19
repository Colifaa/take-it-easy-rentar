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
    if (autoplay) {
      interval = setInterval(() => {
        handleNext();
      }, 5000);
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      clearInterval(interval);
    };
  }, [autoplay, handleNext, handlePrevious]);

  const slideVariants = {
    initial: { scale: 0, opacity: 0, rotateX: 45 },
    visible: { scale: 1, rotateX: 0, opacity: 1, transition: { duration: 0.5, ease: [0.645, 0.045, 0.355, 1.0] } },
    upExit: { opacity: 1, y: "-150%", transition: { duration: 1 } },
    downExit: { opacity: 1, y: "150%", transition: { duration: 1 } },
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
          {overlay && <div className={cn("absolute inset-0 bg-black/10 z-40", overlayClassName)} />}
          <AnimatePresence>
            <motion.div
              key={currentIndex}
              initial="initial"
              animate="visible"
              exit={direction === "up" ? "upExit" : "downExit"}
              variants={slideVariants}
              className="video h-full w-full absolute inset-0"
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
