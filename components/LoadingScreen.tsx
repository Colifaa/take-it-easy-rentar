"use client";

import Image from "next/image";

export default function LoadingScreen() {
  return (
    <div className="relative w-full h-screen bg-gradient-to-r from-[#c47369] to-[#d8847a] text-white flex items-center justify-center">
      {/* Imagen de fondo ocupando toda la pantalla */}
      <Image
        src="/auto.png"  // Asegúrate de que la imagen esté en la carpeta public
        alt="Cargando autos"
        layout="fill"
        objectFit="cover"
        className="opacity-70"
      />

      {/* Texto animado sobre la imagen */}
      <h2 className="absolute text-3xl font-bold animate-pulse bg-black bg-opacity-50 px-6 py-2 rounded-md">
        Loading...
      </h2>
    </div>
  );
}
