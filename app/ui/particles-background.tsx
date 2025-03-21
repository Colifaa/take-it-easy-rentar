"use client";
import { useCallback } from "react";
import { loadFull } from "tsparticles";
import Particles from "react-tsparticles";
import type { Engine } from "tsparticles-engine";

export function ParticlesBackground() {
  const particlesInit = useCallback(async (engine: Engine) => {
    await loadFull(engine);
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full h-full -z-50">
      {/* Contenedor del video con z-[-1] para que esté detrás */}
      <div className="absolute top-0 left-0 w-full h-full z-[-1]">
        <video
          className="w-full h-full object-cover"
          autoPlay
          loop
          muted
          playsInline
        >
          {/* Actualiza la URL del video para apuntar a Supabase */}
          <source
            src="https://osffhjnmklypecylepyw.supabase.co/storage/v1/object/public/videos/Background/background.mp4"
            type="video/mp4"
          />
          Tu navegador no soporta videos.
        </video>
      </div>

      {/* Partículas encima del video */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <Particles
          id="tsparticles"
          init={particlesInit}
          className="w-full h-full"
          options={{
            fullScreen: false,
            background: {
              color: {
                value: "transparent",
              },
            },
            fpsLimit: 60,
            particles: {
              color: {
                value: ["#ffffff", "#FFDDC1", "#FFC8A2"],
              },
              move: {
                enable: true,
                speed: 0.6,
                direction: "top",
                random: true,
                straight: false,
                outModes: {
                  default: "out",
                },
              },
              number: {
                value: 50,
                density: {
                  enable: true,
                  area: 800,
                },
              },
              opacity: {
                value: { min: 0.3, max: 0.7 },
              },
              shape: {
                type: ["circle", "star"],
              },
              size: {
                value: { min: 2, max: 6 },
              },
            },
            detectRetina: true,
          }}
        />
      </div>
    </div>
  );
}