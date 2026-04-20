import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Play, Pause, CloudRain, Flame, Coffee, Waves } from 'lucide-react';

const TRACKS = [
  { id: 'rain', name: 'Chuva Suave', icon: CloudRain, url: 'https://cdn.pixabay.com/download/audio/2021/08/04/audio_0625c1539c.mp3' },
  { id: 'fire', name: 'Lareira', icon: Flame, url: 'https://cdn.pixabay.com/download/audio/2022/02/07/audio_67758ea7a5.mp3' },
  { id: 'cafe', name: 'Cafeteria', icon: Coffee, url: 'https://cdn.pixabay.com/download/audio/2021/08/09/audio_8e7f10b784.mp3' },
  { id: 'waves', name: 'Ondas do Mar', icon: Waves, url: 'https://cdn.pixabay.com/download/audio/2021/08/09/audio_24da1c4b7b.mp3' }
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
    <div className="audio-player-dropdown">
      <div className="audio-player-header">
        <h4>Sons de Foco</h4>
      </div>
      
      <div className="audio-tracks">
        {TRACKS.map(track => {
          const isActive = activeTrack?.id === track.id;
          const Icon = track.icon;
          return (
            <button 
              key={track.id} 
              className={`track-btn ${isActive ? 'active' : ''}`}
              onClick={() => togglePlay(track)}
            >
              <Icon size={16} />
              <span>{track.name}</span>
              {isActive && (
                <div className="play-indicator">
                  {isPlaying ? <Pause size={14} /> : <Play size={14} />}
                </div>
              )}
            </button>
          )
        })}
      </div>

      <div className="audio-volume">
        {volume === 0 ? <VolumeX size={16} /> : <Volume2 size={16} />}
        <input 
          type="range" 
          min="0" 
          max="1" 
          step="0.05" 
          value={volume}
          onChange={(e) => setVolume(parseFloat(e.target.value))}
          className="volume-slider"
        />
      </div>
    </div>
  );
}
