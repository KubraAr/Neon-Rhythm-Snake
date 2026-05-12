
import { useState, useRef, useEffect } from 'react';
import { Track } from '../types';
import { Play, Pause, SkipBack, SkipForward, Volume2, Music as MusicIcon } from 'lucide-react';
import { motion } from 'motion/react';

const DUMMY_TRACKS: Track[] = [
  {
    id: 1,
    title: "Cyber Pulse",
    artist: "Synth-AI Gen",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    color: "#00f3ff",
    bpm: 128
  },
  {
    id: 2,
    title: "Neon Dreams",
    artist: "Glitch-AI",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    color: "#ff00ff",
    bpm: 110
  },
  {
    id: 3,
    title: "Vortex Groove",
    artist: "Logic-AI",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    color: "#39ff14",
    bpm: 140
  }
];

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentTrack = DUMMY_TRACKS[currentTrackIndex];

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(e => console.error("Playback failed", e));
      }
      setIsPlaying(!isPlaying);
    }
  };

  const skipTrack = (direction: 'next' | 'prev') => {
    let nextIndex = currentTrackIndex + (direction === 'next' ? 1 : -1);
    if (nextIndex >= DUMMY_TRACKS.length) nextIndex = 0;
    if (nextIndex < 0) nextIndex = DUMMY_TRACKS.length - 1;
    
    setCurrentTrackIndex(nextIndex);
    setIsPlaying(true); // Auto-play next
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.src = currentTrack.url;
      if (isPlaying) {
        audioRef.current.play().catch(e => console.log("Play interrupted or failed"));
      }
    }
  }, [currentTrackIndex]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateProgress = () => {
      const p = (audio.currentTime / audio.duration) * 100;
      setProgress(p || 0);
    };

    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('ended', () => skipTrack('next'));
    
    return () => {
      audio.removeEventListener('timeupdate', updateProgress);
    };
  }, [currentTrackIndex]);

  return (
    <div className="w-full max-w-md bg-zinc-900/80 border border-zinc-800/50 rounded-2xl p-6 backdrop-blur-2xl shadow-xl flex flex-col gap-6">
      <audio ref={audioRef} />
      
      {/* Track Info */}
      <div className="flex items-center gap-4">
        <div 
          className="w-16 h-16 rounded-xl flex items-center justify-center bg-zinc-800 overflow-hidden relative group"
          style={{ boxShadow: `0 0 20px ${currentTrack.color}33` }}
        >
          <motion.div 
            animate={isPlaying ? { rotate: 360 } : {}}
            transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
            className="absolute inset-0 flex items-center justify-center opacity-20"
          >
            <MusicIcon size={40} style={{ color: currentTrack.color }} />
          </motion.div>
          <img 
            src={`https://api.dicebear.com/7.x/shapes/svg?seed=${currentTrack.title}`} 
            alt="Album Art" 
            className="w-full h-full object-cover z-10"
          />
        </div>
        <div className="flex-1 overflow-hidden">
          <h3 className="text-white font-bold truncate text-lg">{currentTrack.title}</h3>
          <p className="text-zinc-500 font-mono text-xs uppercase tracking-wider">{currentTrack.artist}</p>
        </div>
        <div className="flex items-center gap-1">
          <Volume2 className="w-4 h-4 text-zinc-600" />
          <div className="text-[10px] font-mono text-zinc-600">HQ</div>
        </div>
      </div>

      {/* Visualizer (Simplified) */}
      <div className="h-8 flex items-end gap-1.5 justify-center">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            animate={{ 
              height: isPlaying ? [10, 20 + Math.random() * 15, 10] : 4
            }}
            transition={{ 
              repeat: Infinity, 
              duration: 0.5 + Math.random() * 0.5,
              ease: "easeInOut"
            }}
            className="w-2 rounded-full"
            style={{ backgroundColor: currentTrack.color, opacity: isPlaying ? 0.8 : 0.2 }}
          />
        ))}
      </div>

      {/* Progress Bar */}
      <div className="flex flex-col gap-2">
        <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden cursor-pointer group">
          <div 
            className="h-full transition-all duration-300 relative"
            style={{ 
              width: `${progress}%`, 
              backgroundColor: currentTrack.color,
              boxShadow: `0 0 10px ${currentTrack.color}`
            }}
          />
        </div>
        <div className="flex justify-between text-[10px] font-mono text-zinc-600">
          <span>{`0:${Math.floor((audioRef.current?.currentTime || 0)).toString().padStart(2, '0')}`}</span>
          <span>{`0:${Math.floor((audioRef.current?.duration || 0)).toString().padStart(2, '0')}`}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between px-4">
        <button 
          onClick={() => skipTrack('prev')}
          className="p-2 text-zinc-400 hover:text-white transition-colors hover:bg-zinc-800 rounded-full"
        >
          <SkipBack />
        </button>
        <button 
          onClick={togglePlay}
          className="w-14 h-14 bg-white rounded-full flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-lg group"
          style={{ backgroundColor: isPlaying ? '#222' : 'white' }}
        >
          {isPlaying ? (
            <Pause className="text-white fill-white" />
          ) : (
            <Play className="text-black fill-black ml-1" />
          )}
        </button>
        <button 
          onClick={() => skipTrack('next')}
          className="p-2 text-zinc-400 hover:text-white transition-colors hover:bg-zinc-800 rounded-full"
        >
          <SkipForward />
        </button>
      </div>
    </div>
  );
}
