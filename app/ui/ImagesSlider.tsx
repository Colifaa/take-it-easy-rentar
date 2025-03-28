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
}: {
  images: string[];
  children: React.ReactNode;
  overlay?: React.ReactNode;
  overlayClassName?: string;
  className?: string;
}) => {
  const [loadedImages, setLoadedImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true); // Inicializa en true
  const [error, setError] = useState(false); // Estado para manejar errores
  const [currentIndex, setCurrentIndex] = useState(0); // Índice de la imagen actual

  // Función para cargar las imágenes
  const loadImages = useCallback(() => {
    setLoading(true);
    setError(false); // Reinicia el estado de error

    if (images.length === 0) {
      setError(true);
      setLoading(false);
      return;
    }

    const loadPromises = images.map((src) => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = src;
        img.onload = () => resolve(src);
        img.onerror = (err) => {
          console.error(`Error al cargar la imagen: ${src}`, err);
          reject(err);
        };
      });
    });

    Promise.allSettled(loadPromises)
      .then((results) => {
        const loadedImages = results
          .filter((result) => result.status === "fulfilled")
          .map((result) => (result as any).value);

        if (loadedImages.length === 0) {
          setError(true); // Si ninguna imagen se carga, marca un error
        }
        setLoadedImages(loadedImages);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Failed to load images", error);
        setError(true);
        setLoading(false);
      });
  }, [images]);

  useEffect(() => {
    loadImages();
  }, [loadImages]);

  // Lógica para cambiar automáticamente de imagen
  useEffect(() => {
    if (loadedImages.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % loadedImages.length);
    }, 5000); // Cambia cada 5 segundos

    return () => clearInterval(interval); // Limpia el intervalo al desmontar
  }, [loadedImages]);

  if (error) {
    return (
      <div className="flex items-center justify-center h-full w-full bg-red-500 text-white">
        Error al cargar las imágenes. Por favor, inténtalo más tarde.
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

      {!loading && loadedImages.length > 0 && (
        <>
          {children}
          {overlay && (
            <div className={cn("absolute inset-0 bg-black/10 z-40", overlayClassName)} />
          )}
          <AnimatePresence mode="wait">
            <motion.img
              key={currentIndex}
              src={loadedImages[currentIndex]}
              alt={`Slide ${currentIndex}`}
              className="w-full h-full object-cover absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { duration: 0.5 } }}
              exit={{ opacity: 0, transition: { duration: 0.5 } }}
            />
          </AnimatePresence>
        </>
      )}
    </div>
  );
};