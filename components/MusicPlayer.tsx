"use client";

import { useState, useRef, useEffect } from "react";

export default function MusicPlayer() {
  const songs = [
    "/Lasser - Take it easy (ft. Cráneo)  Prod. Sloth Brite.mp3",
    "/Cráneo - Panteras (Prod. Sr. Guayaba).mp3"
  ];

  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [selectedSong, setSelectedSong] = useState("");

  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Seleccionar una canción al azar cuando se carga la página
    const randomSong = songs[Math.floor(Math.random() * songs.length)];
    setSelectedSong(randomSong);
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      const handleLoadedMetadata = () => {
        setDuration(audioRef.current?.duration || 0);
        audioRef.current?.play(); // Reproducir automáticamente
      };

      audioRef.current.addEventListener("loadedmetadata", handleLoadedMetadata);

      return () => {
        audioRef.current?.removeEventListener("loadedmetadata", handleLoadedMetadata);
      };
    }
  }, [selectedSong]);

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleSongChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSong(event.target.value);
    setIsPlaying(false);
    setCurrentTime(0);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.load();
      setTimeout(() => audioRef.current?.play(), 500);
    }
    setIsPlaying(true);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleSeek = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (audioRef.current) {
      audioRef.current.currentTime = parseFloat(event.target.value);
      setCurrentTime(parseFloat(event.target.value));
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-4 bg-[#c47369] text-white rounded-lg shadow-lg">
      <h2 className="text-lg font-semibold text-center mb-4">🎶 Reproductor de Música</h2>

      <select
        className="w-full p-2 border border-white bg-[#d8847a] rounded-md mb-4 text-white"
        value={selectedSong}
        onChange={handleSongChange}
      >
        <option value={songs[0]}>Canción 1</option>
        <option value={songs[1]}>Canción 2</option>
      </select>

      <audio
        ref={audioRef}
        src={selectedSong}
        onTimeUpdate={handleTimeUpdate}
        onEnded={() => setIsPlaying(false)}
      ></audio>

      <div className="flex items-center space-x-4 justify-center">
        <button
          onClick={togglePlayPause}
          className="px-4 py-2 bg-[#d8847a] text-white rounded-md"
        >
          {isPlaying ? "⏸️ Pausar" : "▶️ Reproducir"}
        </button>
      </div>

      <div className="mt-4">
        <input
          type="range"
          min="0"
          max={duration}
          value={currentTime}
          onChange={handleSeek}
          className="w-full accent-[#d8847a]"
        />
        <p className="text-sm text-center">
          {Math.floor(currentTime)}s / {Math.floor(duration)}s
        </p>
      </div>
    </div>
  );
}
