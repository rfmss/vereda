import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Play, Pause, CloudRain, Flame, Coffee, Waves } from 'lucide-react';

const TRACKS = [
  { id: 'rain', name: 'Chuva Suave', icon: 'cloudy_snowing', url: 'https://cdn.pixabay.com/download/audio/2021/08/04/audio_0625c1539c.mp3' },
  { id: 'fire', name: 'Lareira', icon: 'mode_heat', url: 'https://cdn.pixabay.com/download/audio/2022/02/07/audio_67758ea7a5.mp3' },
  { id: 'cafe', name: 'Cafeteria', icon: 'coffee', url: 'https://cdn.pixabay.com/download/audio/2021/08/09/audio_8e7f10b784.mp3' },
  { id: 'waves', name: 'Ondas do Mar', icon: 'tsunami', url: 'https://cdn.pixabay.com/download/audio/2021/08/09/audio_24da1c4b7b.mp3' }
];

export function AudioPlayer({ isOpen, onClose }) {
  const [activeTrack, setActiveTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const audioRef = useRef(new Audio());

  useEffect(() => {
    const audio = audioRef.current;
    audio.loop = true;
    
    return () => {
      audio.pause();
    };
  }, []);

  useEffect(() => {
    audioRef.current.volume = volume;
  }, [volume]);

  useEffect(() => {
    if (activeTrack) {
      audioRef.current.src = activeTrack.url;
      if (isPlaying) {
        audioRef.current.play().catch(e => console.log("Audio play failed:", e));
      }
    }
  }, [activeTrack]);

  useEffect(() => {
    if (isPlaying && activeTrack) {
      audioRef.current.play().catch(e => console.log("Audio play failed:", e));
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying]);

  const togglePlay = (track) => {
    if (activeTrack?.id === track.id) {
      setIsPlaying(!isPlaying);
    } else {
      setActiveTrack(track);
      setIsPlaying(true);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-24 right-8 w-64 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl shadow-2xl p-4 animate-in fade-in slide-in-from-bottom-4 duration-300 z-50 overflow-hidden">
      <div className="flex items-center justify-between mb-4 border-b border-stone-100 dark:border-stone-800 pb-3">
        <h4 className="text-[10px] font-black uppercase tracking-widest text-primary">Atmosfera de Escrita</h4>
        <button onClick={onClose} className="text-stone-400 hover:text-stone-600 dark:hover:text-stone-200">
          <span className="material-symbols-outlined text-sm">close</span>
        </button>
      </div>
      
      <div className="space-y-1 mb-6">
        {TRACKS.map(track => {
          const isActive = activeTrack?.id === track.id;
          return (
            <button 
              key={track.id} 
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition-all ${isActive ? 'bg-primary/10 text-primary shadow-sm' : 'hover:bg-stone-50 dark:hover:bg-stone-800 text-stone-600 dark:text-stone-400'}`}
              onClick={() => togglePlay(track)}
            >
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-lg">{track.icon}</span>
                <span className="text-xs font-bold tracking-tight">{track.name}</span>
              </div>
              {isActive && (
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-lg animate-pulse">{isPlaying ? 'pause' : 'play_arrow'}</span>
                </div>
              )}
            </button>
          )
        })}
      </div>

      <div className="flex items-center gap-3 px-2">
        <span className="material-symbols-outlined text-stone-400 text-sm">{volume === 0 ? 'volume_off' : 'volume_up'}</span>
        <input 
          type="range" 
          min="0" 
          max="1" 
          step="0.05" 
          value={volume}
          onChange={(e) => setVolume(parseFloat(e.target.value))}
          className="flex-1 h-1 bg-stone-200 dark:bg-stone-800 rounded-lg appearance-none cursor-pointer accent-primary"
        />
      </div>
    </div>
  );
}
