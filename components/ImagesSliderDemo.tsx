"use client";
import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { ImagesSlider } from "../app/ui/ImagesSlider";
import { VortexDemo } from "./VortexDemo";
import Image from "next/image"; // Optimización de imágenes
import { useLanguage } from "../hooks/use-language";
import { languages } from "../lib/languages";

export function ImagesSliderDemo() {
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const { language } = useLanguage();
  const t = languages[language];

  useEffect(() => {
    // Imágenes desde carpeta public
    const imagePaths = [
      "/carousel/Calidad9.webp",
      "/carousel/Calidad10.jpg",
      "/carousel/Calidad5.webp",
      "/carousel/Calidad6.webp",
      "/carousel/Calidad1.webp",
      "/carousel/Calidad4.webp",
    ];
    setImageUrls(imagePaths);
  }, []);

  const handleScrollToAutos = () => {
    const autosSection = document.getElementById("autos");
    if (autosSection) {
      autosSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <ImagesSlider
      className="h-screen sm:h-[20rem] md:h-[30rem] lg:h-[55rem] bg-[#D1A1A1]/30 flex flex-col items-center justify-end relative"
      images={imageUrls}
    >
      <VortexDemo />

      <button
        onClick={handleScrollToAutos}
        className="mb-44 absolute bottom-10 left-1/2 transform -translate-x-1/2 z-50 inline-flex h-14 w-auto active:scale-95 transition-transform overflow-hidden rounded-full p-[2px] focus:outline-none shadow-lg"
      >
        <span className="absolute inset-0 bg-[conic-gradient(from_90deg_at_50%_50%,#FF7F50_0%,#FFA07A_50%,#20B2AA_100%)] animate-spin-slow rounded-full"></span>

        <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-white/20 px-6 md:px-8 text-lg md:text-xl font-semibold text-white backdrop-blur-xl whitespace-nowrap gap-1 md:gap-2 transition-all hover:scale-105 hover:shadow-2xl">
          {t.filters.reservaButton}
          <svg
            stroke="currentColor"
            fill="currentColor"
            strokeWidth="0"
            viewBox="0 0 448 512"
            height="1.2em"
            width="1.2em"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M429.6 92.1c4.9-11.9 2.1-25.6-7-34.7s-22.8-11.9-34.7-7l-352 144c-14.2 5.8-22.2 20.8-19.3 35.8s16.1 25.8 31.4 25.8H224V432c0 15.3 10.8 28.4 25.8 31.4s30-5.1 35.8-19.3l144-352z"></path>
          </svg>
        </span>
      </button>
    </ImagesSlider>
  );
}
