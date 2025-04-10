"use client"; // Indica que este componente se ejecuta solo en el cliente

import { useState, useRef, useEffect } from "react";
import { Play, Pause, Music } from "lucide-react";
import supabase from "@/supabase/authTest";

interface Song {
  id: string;
  name: string;
  url: string;
}

export default function FloatingMusicPlayer() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [selectedSong, setSelectedSong] = useState<string>("");
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Cargar canciones y restaurar estado
  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const { data, error } = await supabase
          .from("songs")
          .select("*")
          .order("created_at", { ascending: true });

        if (error) throw error;

        if (data && data.length > 0) {
          setSongs(data);
          // Recuperar la última canción seleccionada o usar la primera
          const lastSong = localStorage.getItem("selectedSong");
          if (lastSong && data.find(song => song.url === lastSong)) {
            setSelectedSong(lastSong);
          } else {
            setSelectedSong(data[0].url);
          }

          // Recuperar el tiempo de reproducción
          const savedTime = localStorage.getItem("songTime");
          if (savedTime) {
            setCurrentTime(parseFloat(savedTime));
          }

          // Recuperar el estado de reproducción
          const wasPlaying = localStorage.getItem("isPlaying") === "true";
          setIsPlaying(wasPlaying);
        }
      } catch (error) {
        console.error("Error fetching songs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSongs();

    // Guardar estado al desmontar
    return () => {
      if (audioRef.current) {
        localStorage.setItem("songTime", audioRef.current.currentTime.toString());
        localStorage.setItem("selectedSong", selectedSong);
        localStorage.setItem("isPlaying", isPlaying.toString());
      }
    };
  }, []);

  // Manejar reproducción y tiempo
  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      // Restaurar tiempo de reproducción
      audio.currentTime = currentTime;

      if (isPlaying) {
        const playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise.catch(error => {
            console.error("Error al reproducir:", error);
            setIsPlaying(false);
            localStorage.setItem("isPlaying", "false");
          });
        }
      } else {
        audio.pause();
      }

      // Guardar tiempo periódicamente
      const saveTimeInterval = setInterval(() => {
        if (audio) {
          localStorage.setItem("songTime", audio.currentTime.toString());
          setCurrentTime(audio.currentTime);
        }
      }, 1000);

      return () => clearInterval(saveTimeInterval);
    }
  }, [isPlaying, selectedSong, currentTime]);

  const togglePlayPause = () => {
    const newPlayingState = !isPlaying;
    setIsPlaying(newPlayingState);
    localStorage.setItem("isPlaying", newPlayingState.toString());
  };

  const handleSongChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newSong = event.target.value;
    setSelectedSong(newSong);
    localStorage.setItem("selectedSong", newSong);
    setIsPlaying(true);
    localStorage.setItem("isPlaying", "true");
  };

  if (loading) {
    return (
      <div className="fixed bottom-2 left-4 z-10 bg-gray-900 text-white p-3 rounded-lg shadow-lg flex items-center space-x-4 w-64">
        <Music size={24} className="text-rose-500" />
        <span>Cargando música...</span>
      </div>
    );
  }

  if (songs.length === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-2 left-4 z-10 bg-gray-900 text-white p-3 rounded-lg shadow-lg flex items-center space-x-4 w-64">
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
          <option key={song.id} value={song.url}>
            {song.name}
          </option>
        ))}
      </select>

      {/* Audio */}
      <audio 
        ref={audioRef}
        src={selectedSong}
        onEnded={() => {
          setIsPlaying(false);
          localStorage.setItem("isPlaying", "false");
        }}
      />
    </div>
  );
}