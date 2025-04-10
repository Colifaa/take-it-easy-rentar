"use client";

import { useState, useEffect } from "react";
import { Upload, Trash2, Music } from "lucide-react";
import { uploadSong, deleteSong } from "@/supabase/supabaseMusic";
import supabase from "@/supabase/authTest";

interface Song {
  id: string;
  name: string;
  url: string;
  created_at: string;
}

export default function MusicManager() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSongs();
  }, []);

  const fetchSongs = async () => {
    try {
      const { data, error } = await supabase
        .from("songs")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setSongs(data || []);
    } catch (error) {
      console.error("Error fetching songs:", error);
      setError("Error al cargar las canciones");
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validar tipo de archivo
    if (!file.type.startsWith("audio/")) {
      setError("Por favor, sube un archivo de audio válido");
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const result = await uploadSong(file);
      if (result.success) {
        await fetchSongs();
      } else {
        throw new Error("Error al subir la canción");
      }
    } catch (error) {
      console.error("Error uploading song:", error);
      setError("Error al subir la canción");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (song: Song) => {
    if (!confirm("¿Estás seguro de que deseas eliminar esta canción?")) return;

    try {
      const result = await deleteSong(song.id, song.url);
      if (result.success) {
        await fetchSongs();
      } else {
        throw new Error("Error al eliminar la canción");
      }
    } catch (error) {
      console.error("Error deleting song:", error);
      setError("Error al eliminar la canción");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-4">Administrar Música</h2>
        
        {/* Botón de subida */}
        <div className="mb-4">
          <label className="inline-flex items-center px-4 py-2 bg-rose-500 text-white rounded-lg cursor-pointer hover:bg-rose-600 transition">
            <Upload className="w-5 h-5 mr-2" />
            <span>Subir Nueva Canción</span>
            <input
              type="file"
              className="hidden"
              accept="audio/*"
              onChange={handleFileUpload}
              disabled={uploading}
            />
          </label>
          {uploading && (
            <span className="ml-4 text-gray-600">Subiendo...</span>
          )}
        </div>

        {/* Mensaje de error */}
        {error && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {/* Lista de canciones */}
        <div className="grid gap-4">
          {songs.map((song) => (
            <div
              key={song.id}
              className="flex items-center justify-between p-4 bg-white rounded-lg shadow"
            >
              <div className="flex items-center space-x-4">
                <Music className="w-6 h-6 text-rose-500" />
                <div>
                  <h3 className="font-medium">{song.name}</h3>
                  <p className="text-sm text-gray-500">
                    {new Date(song.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <button
                onClick={() => handleDelete(song)}
                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>

        {songs.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No hay canciones subidas aún
          </div>
        )}
      </div>
    </div>
  );
} 