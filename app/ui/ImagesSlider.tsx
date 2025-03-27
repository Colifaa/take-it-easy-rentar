"use client"
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import React, { useEffect, useState, useRef,useCallback } from "react";
import LoadingOverlay from "../../components/LoadingOverlay"; // Importa el componente de carga

export const ImagesSlider = ({
  images,
  children,
  overlay = true,
  overlayClassName,
  className,
}: {
  images: string[];
  children: React.ReactNode;
  overlay?: React.ReactNode;
  overlayClassName?: string;
  className?: string;
}) => {
  const [loadedMedia, setLoadedMedia] = useState<string | null>(null);
  const [loading, setLoading] = useState(true); // Inicializa en true
  const [error, setError] = useState(false); // Estado para manejar errores
  const videoRef = useRef<HTMLVideoElement>(null); // Referencia al video actual

  const loadMedia = useCallback(() => {
    setLoading(true);
    setError(false); // Reinicia el estado de error

    if (images.length === 0) {
      setError(true);
      setLoading(false);
      return;
    }

    const video = document.createElement("video");
    video.src = images[0]; // Solo cargamos el primer video
    video.onloadeddata = () => {
      setLoadedMedia(images[0]);
      setLoading(false);
    };
    video.onerror = (err) => {
      console.error(`Error al cargar el video: ${images[0]}`, err);
      setError(true);
      setLoading(false);
    };
  }, [images]);

  useEffect(() => {
    loadMedia();
  }, [loadMedia]);

  if (error) {
    return (
      <div className="flex items-center justify-center h-full w-full bg-red-500 text-white">
        Error al cargar el video. Por favor, inténtalo más tarde.
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

      {!loading && loadedMedia && (
        <>
          {children}
          {overlay && (
            <div className={cn("absolute inset-0 bg-black/10 z-40", overlayClassName)} />
          )}
          <AnimatePresence>
            <motion.div
              key="video"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { duration: 0.3 } }}
              exit={{ opacity: 0, transition: { duration: 0.3 } }}
              className="video h-full w-full absolute inset-0"
              style={{ willChange: "opacity" }}
            >
              <video
                ref={videoRef}
                className="w-full h-full object-cover"
                autoPlay
                muted
                playsInline
                loop // Atributo para reproducir en bucle
              >
                <source src={loadedMedia} type="video/mp4" />
              </video>
            </motion.div>
          </AnimatePresence>
        </>
      )}
    </div>
  );
};