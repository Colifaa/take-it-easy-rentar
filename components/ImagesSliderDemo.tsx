"use client";
import { motion } from "framer-motion";
import React from "react";
import { ImagesSlider } from "../app/ui/ImagesSlider";
import { VortexDemo } from "./VortexDemo";

export function ImagesSliderDemo() {
  const videos = [
    "/202501302126.mp4",  // Video 1
    "/202502101422.mp4",
    "/202502101422 (4).mp4",
    "/202502101422 (5).mp4",
  ];

  const handleScrollToAutos = () => {
    const autosSection = document.getElementById("autos");
    if (autosSection) {
      autosSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <ImagesSlider className="h-screen sm:h-[20rem] md:h-[30rem] lg:h-[40rem] bg-black flex flex-col items-center justify-end relative" images={videos}>
    <VortexDemo />
    <button
      onClick={handleScrollToAutos}
      className=" mb-20 absolute bottom-10 left-1/2 transform -translate-x-1/2 z-50 inline-flex h-12 w-auto active:scale-95 transition-transform overflow-hidden rounded-lg p-[2px] focus:outline-none"
    >
      <span className="absolute inset-[-1000%] animate-spin bg-[conic-gradient(from_90deg_at_50%_50%,#555555_0%,#666666_50%,#333333_100%)]"></span>
      <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-lg bg-[#333333] px-6 text-lg font-medium text-white backdrop-blur-[10px] gap-2">
        Reservá ahora
        <svg
          stroke="currentColor"
          fill="currentColor"
          strokeWidth="0"
          viewBox="0 0 448 512"
          height="1em"
          width="1em"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M429.6 92.1c4.9-11.9 2.1-25.6-7-34.7s-22.8-11.9-34.7-7l-352 144c-14.2 5.8-22.2 20.8-19.3 35.8s16.1 25.8 31.4 25.8H224V432c0 15.3 10.8 28.4 25.8 31.4s30-5.1 35.8-19.3l144-352z"></path>
        </svg>
      </span>
    </button>
  </ImagesSlider>
  )  
}
