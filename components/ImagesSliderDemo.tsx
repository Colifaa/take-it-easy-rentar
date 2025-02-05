"use client";
import { motion } from "framer-motion";
import React from "react";
import { ImagesSlider } from "../app/ui/ImagesSlider";
import { VortexDemo } from "./VortexDemo";

export function ImagesSliderDemo() {
  const videos = [
    "/202501302126.mp4",  // Video 1
    "/202502051714.mp4",  // Video 2
  ];

  return (
    <ImagesSlider className="h-screen sm:h-80 md:h-[30rem] lg:h-[40rem] bg-transparent" images={videos}>
      <motion.div
        initial={{
          opacity: 0,
          y: -80,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.6,
        }}
        className="absolute inset-0 z-20 flex justify-center items-center p-4"
      >
  
      </motion.div>
      <VortexDemo/>
    </ImagesSlider>
  );
}
