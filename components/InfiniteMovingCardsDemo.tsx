"use client";

import React, { useEffect, useState } from "react";
import { InfiniteMovingCards } from "../app/ui/InfiniteMovingCards";
import supabase from "@/supabase/authTest";

export function InfiniteMovingCardsDemo() {
  const [cars, setCars] = useState<{ image: string }[]>([]);

  useEffect(() => {
    const fetchCars = async () => {
      let { data, error } = await supabase.from("cars").select("imageUrls");

      if (error) {
        console.error("Error fetching cars:", error);
      } else {
        // 🔹 Extraer todas las imágenes de todos los autos en una lista plana
        const formattedCars =
          data?.flatMap(car => car.imageUrls.map((url: string) => ({ image: url }))) || [];
        setCars(formattedCars);
      }
    };

    fetchCars();
  }, []);

  return (
    <div className="h-[15rem] rounded-md flex flex-col antialiased bg-transparent dark:bg-black dark:bg-grid-white/[0.05] items-center justify-center relative overflow-hidden">
      <InfiniteMovingCards items={cars} direction="right" speed="fast" />
    </div>
  );
}
