"use client";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import React, { useEffect, useState, useCallback, useRef } from "react";
import LoadingOverlay from "../../components/LoadingOverlay";

export const ImagesSlider = ({
  images,
  children,
  overlay = true,
  overlayClassName,
  className,
  transitionDuration = 0.5, // Duración más corta para transiciones más rápidas
  displayDuration = 5000, // 5 segundos entre imágenes (ajusta según necesites)
  autoPlay = true,
  pauseOnHover = true,
}: {
  images: string[];
  children: React.ReactNode;
  overlay?: React.ReactNode;
  overlayClassName?: string;
  className?: string;
  transitionDuration?: number;
  displayDuration?: number;
  autoPlay?: boolean;
  pauseOnHover?: boolean;
}) => {
  const [loadedImages, setLoadedImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [nextIndex, setNextIndex] = useState(1); // Para precargar la siguiente imagen
  const [isPaused, setIsPaused] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const imageCache = useRef<Map<string, HTMLImageElement>>(new Map());
  
  // Función para preparar la siguiente imagen con anticipación
  const prepareNextImage = useCallback(() => {
    if (loadedImages.length <= 1) return;
    const next = (currentIndex + 1) % loadedImages.length;
    setNextIndex(next);
  }, [currentIndex, loadedImages.length]);

  // Función optimizada para avanzar a la siguiente diapositiva
  const nextSlide = useCallback(() => {
    if (isTransitioning || loadedImages.length <= 1) return;
    
    setIsTransitioning(true);
    const next = (currentIndex + 1) % loadedImages.length;
    setCurrentIndex(next);
    
    // Preparar la imagen después de la siguiente
    setTimeout(() => {
      setNextIndex((next + 1) % loadedImages.length);
      setIsTransitioning(false);
    }, transitionDuration * 1000);
  }, [currentIndex, loadedImages.length, isTransitioning, transitionDuration]);

  // Función para ir a la diapositiva anterior
  const prevSlide = useCallback(() => {
    if (isTransitioning || loadedImages.length <= 1) return;
    
    setIsTransitioning(true);
    const prev = (currentIndex - 1 + loadedImages.length) % loadedImages.length;
    setCurrentIndex(prev);
    
    setTimeout(() => {
      setNextIndex((prev + 1) % loadedImages.length);
      setIsTransitioning(false);
    }, transitionDuration * 1000);
  }, [currentIndex, loadedImages.length, isTransitioning, transitionDuration]);

  // Función para ir a un índice específico
  const goToSlide = useCallback((index: number) => {
    if (isTransitioning || index === currentIndex || loadedImages.length <= 1) return;
    
    setIsTransitioning(true);
    setCurrentIndex(index);
    
    setTimeout(() => {
      setNextIndex((index + 1) % loadedImages.length);
      setIsTransitioning(false);
    }, transitionDuration * 1000);
  }, [currentIndex, loadedImages.length, isTransitioning, transitionDuration]);

  // Cargar imágenes con precarga agresiva
  const loadImages = useCallback(() => {
    setLoading(true);
    setError(false);

    if (images.length === 0) {
      setError(true);
      setLoading(false);
      return;
    }

    // Precargar todas las imágenes simultáneamente
    const imagePromises = images.map((src, index) => {
      return new Promise<string>((resolve, reject) => {
        // Verificar si la imagen ya está en caché
        if (imageCache.current.has(src)) {
          resolve(src);
          return;
        }
        
        const img = new Image();
        
        // Alta prioridad para las primeras imágenes
        if (index < 2) {
          img.fetchPriority = "high";
        }
        
        img.src = src;
        img.onload = () => {
          // Guardar en caché
          imageCache.current.set(src, img);
          resolve(src);
          
          // Si es la primera imagen, mostrar inmediatamente
          if (index === 0 && loading) {
            setLoadedImages([src]);
            setLoading(false);
          }
        };
        img.onerror = (err) => {
          console.error(`Error al cargar la imagen: ${src}`, err);
          reject(err);
        };
      });
    });

    // Actualizar el estado a medida que se cargan las imágenes
    Promise.allSettled(imagePromises).then((results) => {
      const successfullyLoaded = results
        .filter(result => result.status === "fulfilled")
        .map(result => (result as PromiseFulfilledResult<string>).value);
      
      if (successfullyLoaded.length === 0) {
        setError(true);
      } else {
        setLoadedImages(successfullyLoaded);
      }
      
      setLoading(false);
    });
  }, [images, loading]);

  // Iniciar carga
  useEffect(() => {
    loadImages();
  }, [loadImages]);

  // Preparar la siguiente imagen cuando cambia el índice actual
  useEffect(() => {
    prepareNextImage();
  }, [currentIndex, prepareNextImage]);

  // Temporizador para avance automático
  useEffect(() => {
    if (!autoPlay || loading || error || isPaused || loadedImages.length <= 1) {
      return;
    }

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => {
      nextSlide();
    }, displayDuration);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [autoPlay, loading, error, isPaused, currentIndex, loadedImages.length, displayDuration, nextSlide]);

  // Navegación por teclado
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        prevSlide();
      } else if (e.key === 'ArrowRight') {
        nextSlide();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [nextSlide, prevSlide]);

  // Preparar las imágenes siguiente y anterior en el DOM pero ocultas
  const renderHiddenPreloadImages = () => {
    if (loadedImages.length <= 1) return null;
    
    const preloadIndices = [
      (currentIndex + 1) % loadedImages.length,
      (currentIndex - 1 + loadedImages.length) % loadedImages.length
    ];
    
    return preloadIndices.map(idx => (
      <img 
        key={`preload-${idx}`} 
        src={loadedImages[idx]} 
        alt="" 
        className="absolute opacity-0 pointer-events-none" 
        style={{ width: 1, height: 1 }}
        aria-hidden="true"
      />
    ));
  };

  if (error) {
    return (
      <div className="flex items-center justify-center h-full w-full bg-red-500/80 text-white">
        <p className="text-center px-4">Error al cargar las imágenes. Por favor, inténtalo más tarde.</p>
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
      onMouseEnter={() => pauseOnHover && setIsPaused(true)}
      onMouseLeave={() => pauseOnHover && setIsPaused(false)}
    >
      {loading && <LoadingOverlay loading={loading} />}

      {!loading && loadedImages.length > 0 && (
        <>
          {/* Imágenes precargadas ocultas */}
          {renderHiddenPreloadImages()}
          
          {/* Imagen siguiente precargada */}
          {loadedImages[nextIndex] && (
            <div className="absolute opacity-0 pointer-events-none" aria-hidden="true">
              <img src={loadedImages[nextIndex]} alt="" style={{ width: 1, height: 1 }} />
            </div>
          )}

          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              className="absolute inset-0 w-full h-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ 
                duration: transitionDuration,
                ease: "easeInOut"
              }}
            >
              <img
                src={loadedImages[currentIndex]}
                alt={`Slide ${currentIndex + 1}`}
                className="w-full h-full object-cover"
              />
            </motion.div>
          </AnimatePresence>

          {children}
          
          {overlay && (
            <div className={cn("absolute inset-0 bg-black/10 z-40", overlayClassName)} />
          )}

          {/* Controles de navegación */}
          {loadedImages.length > 1 && (
            <>
              <button 
                onClick={prevSlide}
                className="absolute left-4 z-50 bg-black/20 text-white p-2 rounded-full hover:bg-black/40 transition-all duration-300 backdrop-blur-sm"
                disabled={isTransitioning}
                aria-label="Imagen anterior"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m15 18-6-6 6-6" />
                </svg>
              </button>
              
              <button 
                onClick={nextSlide}
                className="absolute right-4 z-50 bg-black/20 text-white p-2 rounded-full hover:bg-black/40 transition-all duration-300 backdrop-blur-sm"
                disabled={isTransitioning}
                aria-label="Siguiente imagen"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </button>

              {/* Indicadores de progreso */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-50 flex gap-2">
                {loadedImages.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => goToSlide(idx)}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      idx === currentIndex 
                        ? "w-8 bg-white" 
                        : "w-2 bg-white/50 hover:bg-white/70"
                    }`}
                    aria-label={`Ir a diapositiva ${idx + 1}`}
                    disabled={isTransitioning}
                  />
                ))}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};