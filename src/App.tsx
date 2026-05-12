/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';
import { motion } from 'motion/react';
import { Music, Gamepad2, Layers } from 'lucide-react';

export default function App() {
  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-4 md:p-8 relative overflow-hidden">
      
      {/* Background Decor */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-neon-cyan/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-neon-magenta/5 rounded-full blur-[120px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-6xl flex flex-col lg:flex-row items-center lg:items-start justify-center gap-12 z-10"
      >
        
        {/* Left Sidebar - Player / Info */}
        <div className="flex flex-col gap-8 w-full lg:w-1/3 order-2 lg:order-1">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-zinc-900 border border-zinc-800 rounded-lg">
              <Layers className="w-5 h-5 text-neon-cyan" />
            </div>
            <div>
              <h1 className="text-2xl font-black italic tracking-tighter leading-none italic">NEON RHYTHM</h1>
              <p className="text-[10px] uppercase tracking-[0.3em] font-mono text-zinc-500">Multisensory Engine v1.0</p>
            </div>
          </div>

          <MusicPlayer />

          <div className="bg-zinc-900/40 border border-zinc-800/50 rounded-2xl p-6 backdrop-blur-md">
            <h4 className="text-xs font-mono text-zinc-500 uppercase tracking-widest mb-4 flex items-center gap-2">
              <Music className="w-3 h-3" /> System Logs
            </h4>
            <ul className="text-[10px] font-mono space-y-2 text-zinc-400">
              <li className="flex gap-2">
                <span className="text-neon-cyan opacity-50">[0.01s]</span> Initializing audio buffer...
              </li>
              <li className="flex gap-2">
                <span className="text-neon-cyan opacity-50">[0.05s]</span> Loading dummy AI track metadata...
              </li>
              <li className="flex gap-2">
                <span className="text-neon-magenta opacity-50">[0.12s]</span> Neon grid synchronization active.
              </li>
              <li className="flex gap-2">
                <span className="text-neon-lime opacity-50">[READY]</span> System awaiting player input.
              </li>
            </ul>
          </div>
        </div>

        {/* Center - Game */}
        <div className="flex-1 flex flex-col items-center justify-center order-1 lg:order-2">
           <div className="mb-4 flex items-center gap-3 px-4 py-1.5 bg-zinc-900/50 border border-zinc-800 rounded-full">
              <div className="w-2 h-2 rounded-full bg-neon-lime animate-pulse glow-lime" />
              <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest">Live Game Session</span>
           </div>
           <SnakeGame />
        </div>

        {/* Right Sidebar - Social / Leaderboard (Contextual Mock) */}
        <div className="hidden xl:flex flex-col gap-6 w-1/4 order-3">
          <div className="bg-zinc-900/40 border border-zinc-800/50 rounded-2xl p-6 backdrop-blur-md">
            <h4 className="text-xs font-mono text-zinc-500 uppercase tracking-widest mb-6 flex items-center gap-2">
              <Gamepad2 className="w-3 h-3" /> Global Rankings
            </h4>
            <div className="space-y-4">
              {[
                { name: 'CyberSnake', score: 1240, color: 'text-neon-cyan' },
                { name: 'NeonRider', score: 980, color: 'text-neon-magenta' },
                { name: 'BitBouncer', score: 850, color: 'text-white' },
              ].map((user, i) => (
                <div key={i} className="flex items-center justify-between border-b border-zinc-800/50 pb-2">
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-mono text-zinc-600">0{i+1}</span>
                    <span className={`text-xs font-bold ${user.color}`}>{user.name}</span>
                  </div>
                  <span className="text-xs font-mono font-bold">{user.score}</span>
                </div>
              ))}
            </div>
            <button className="w-full mt-6 py-2 border border-zinc-800 hover:border-zinc-600 rounded-lg text-[10px] font-mono text-zinc-500 uppercase tracking-widest hover:text-white transition-all">
              View Full Leaderboard
            </button>
          </div>
        </div>

      </motion.div>

      {/* Footer Branding */}
      <div className="mt-12 text-[10px] font-mono text-zinc-700 uppercase tracking-[0.5em] text-center">
        Powered by High Fidelity Neon & Artificial Soundscapes
      </div>
    </div>
  );
}
