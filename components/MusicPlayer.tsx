"use client";

import { useState, useRef, useEffect } from "react";
import { Play, Pause, Music } from "lucide-react";

export default function FloatingMusicPlayer() {
  const songs = [
    { name: "Take it easy", src: "/TakeItEasy.mp3" },
    { name: "Panteras", src: "/Panteras.mp3" },
  ];

  // Estados con recuperación desde localStorage
  const [selectedSong, setSelectedSong] = useState<string>(() => localStorage.getItem("selectedSong") || songs[0].src);
  const [isPlaying, setIsPlaying] = useState<boolean>(() => localStorage.getItem("isPlaying") === "true");
  const [currentTime, setCurrentTime] = useState<number>(() => parseFloat(localStorage.getItem("songTime") || "0"));

  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.currentTime = currentTime;
      if (isPlaying) {
        audio.play().catch(() => setIsPlaying(false));
      }
    }
  }, [selectedSong]);

  useEffect(() => {
    const saveTime = () => {
      if (audioRef.current) {
        localStorage.setItem("songTime", audioRef.current.currentTime.toString());
      }
    };

    const audio = audioRef.current;
    if (audio) {
      audio.addEventListener("timeupdate", saveTime);
      return () => audio.removeEventListener("timeupdate", saveTime);
    }
  }, [currentTime]);

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (audio) {
      if (isPlaying) {
        audio.pause();
      } else {
        audio.play().catch(() => setIsPlaying(false));
      }
      setIsPlaying(!isPlaying);
      localStorage.setItem("isPlaying", (!isPlaying).toString());
    }
  };

  const handleSongChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newSong = event.target.value;
    localStorage.setItem("selectedSong", newSong);
    localStorage.setItem("songTime", "0");

    setSelectedSong(newSong);
    setIsPlaying(false);
    setCurrentTime(0);

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.load();
    }
  };

  return (
    <div className="fixed bottom-2  z-10 bg-gray-900 text-white p-3 rounded-lg shadow-lg flex items-center space-x-4 w-80">
      <Music size={24} className="text-rose-500" />

      {/* Botón de play/pausa */}
      <button
        onClick={togglePlayPause}
        className="bg-rose-500 hover:bg-rose-600 text-white py-2 px-4 rounded-lg flex items-center transition"
      >
        {isPlaying ? <Pause size={20} /> : <Play size={20} />}
      </button>

      {/* Selector de canción */}
      <select
        className="bg-gray-800 border border-gray-600 text-white text-xs p-1 rounded flex-grow"
        value={selectedSong}
        onChange={handleSongChange}
      >
        {songs.map((song) => (
          <option key={song.src} value={song.src}>
            {song.name}
          </option>
        ))}
      </select>

      {/* Audio */}
      <audio ref={audioRef} src={selectedSong} autoPlay={isPlaying} onEnded={() => setIsPlaying(false)}></audio>
    </div>
  );
}
