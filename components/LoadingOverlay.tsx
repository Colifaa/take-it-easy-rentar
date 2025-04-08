"use client";

import Image from "next/image";

type LoadingOverlayProps = {
  loading: boolean;
};

export default function LoadingOverlay({ loading }: LoadingOverlayProps) {
  if (!loading) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-r from-[#c47369] to-[#d8847a] text-white">
      {/* Imagen de fondo con opacidad */}
      <Image
       src="/Calidad5.jpg" // Asegúrate de que esté en la carpeta public
        alt="Cargando..."
        layout="fill"
        objectFit="cover"
        className="opacity-50"
      />

      {/* Texto de carga animado */}
      <h2 className="absolute text-3xl font-bold animate-pulse bg-black bg-opacity-50 px-6 py-2 rounded-md">
        Loading...
      </h2>
    </div>
  );
}
