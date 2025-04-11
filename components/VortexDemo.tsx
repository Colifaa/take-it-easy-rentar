"use client";
import React, { useEffect, useState } from "react";
//import { Vortex } from "../app/ui/Vortex";
import { useLanguage } from "../hooks/use-language";
import { languages } from "../lib/languages";
import { motion } from "framer-motion";

export function VortexDemo() {
  const { language } = useLanguage();
  const t = languages[language];
  const [text, setText] = useState("");
  const [subText, setSubText] = useState("");
  const [isTyping, setIsTyping] = useState(true);

  const fullText = t.hero.title;
  const fullSubText = t.hero.subtitle;

  useEffect(() => {
    let currentIndex = 0;
    let currentSubIndex = 0;

    const titleInterval = setInterval(() => {
      if (currentIndex <= fullText.length) {
        setText(fullText.slice(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(titleInterval);

        const subtitleInterval = setInterval(() => {
          if (currentSubIndex <= fullSubText.length) {
            setSubText(fullSubText.slice(0, currentSubIndex));
            currentSubIndex++;
          } else {
            clearInterval(subtitleInterval);
            setIsTyping(false);
          }
        }, 30);
      }
    }, 50);

    return () => clearInterval(titleInterval);
  }, [fullText, fullSubText]);

  return (
    <div    className="flex items-center flex-col justify-center px-4 md:px-10 py-4 w-full h-full relative z-10">
    
 
  
        <div className="relative z-20">
        <motion.h2
  className="text-white text-4xl sm:text-5xl md:text-7xl font-bold text-center drop-shadow-lg"
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.5 }}
>
  {text}
  {isTyping && (
    <motion.span
      className="inline-block text-[#ff6b6b]"
      animate={{ opacity: [1, 0] }}
      transition={{ duration: 0.7, repeat: Infinity }}
    >
      |
    </motion.span>
  )}
</motion.h2>

<motion.p
  className="text-[#FFA060] text-xl sm:text-2xl md:text-3xl max-w-3xl mt-6 text-center mx-auto drop-shadow-md px-6 sm:px-10 font-bold"
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.5, delay: 0.5 }}
>
  {subText}
  {isTyping && (
    <motion.span
      className="inline-block text-[#ff6b6b]"
      animate={{ opacity: [1, 0] }}
      transition={{ duration: 0.7, repeat: Infinity }}
    >
      |
    </motion.span>
  )}
</motion.p>
        </div>
   
    </div>
  );
}
