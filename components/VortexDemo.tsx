import React from "react";
import { Vortex } from "../app/ui/Vortex";
import { useLanguage } from "../hooks/use-language";
import { languages } from "../lib/languages";


export function VortexDemo() {

    const { language } = useLanguage();
    const t = languages[language];
  
  return (
    <div className="w-[calc(100%-4rem)] mx-auto rounded-md  h-screen overflow-hidden z-30">
      <Vortex
        backgroundColor="transparent"
        rangeY={800}
        particleCount={500}
        baseHue={120}
        className="flex items-center flex-col justify-center px-2 md:px-10  py-4 w-full h-full"
      >
        <h2 className="text-white text-2xl md:text-6xl font-bold text-center">
          {t.hero.title}
        </h2>
        <p className="text-white text-sm md:text-2xl max-w-xl mt-6 text-center">
          {t.hero.subtitle}
        </p>
     
      </Vortex>
    
    </div>
  );
}
