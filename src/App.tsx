import React, { useState } from 'react';
import { NavBar } from './components/NavBar';
import { GameScreen } from './components/GameScreen';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [screen, setScreen] = useState<'title' | 'game'>('title');

  return (
    <div className="w-full h-full bg-[#050507] text-[#e0e0e0] font-sans flex flex-col relative overflow-hidden">
      <div className="absolute top-2 left-4 text-[10px] text-white/20 font-mono z-50 pointer-events-none">APP_ID: 68f51d868c4fe3f562003e65 | BUILDER: bc_fh385nuq</div>
      <NavBar />
      
      <main className="flex-1 flex flex-col items-center justify-center relative z-10 w-full">
        <AnimatePresence mode="wait">
          {screen === 'title' && (
            <motion.div
              key="title"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="flex flex-col items-center text-center p-6 z-10"
            >
              <h1 className="font-serif font-black text-6xl md:text-8xl tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-yellow-100 via-yellow-500 to-yellow-900 drop-shadow-[0_0_20px_rgba(234,179,8,0.3)] mb-4">
                PROPHETS
              </h1>
              <p className="text-slate-400 max-w-md text-sm md:text-base leading-relaxed mb-10">
                Interpret the visions, balance the forces of Chaos and Faith, and reach divine Enlightenment in an endless struggle.
              </p>
              <button
                onClick={() => setScreen('game')}
                className="h-14 px-12 bg-gradient-to-r from-yellow-600 to-amber-700 text-black font-bold uppercase tracking-[0.2em] rounded-md shadow-[0_0_30px_rgba(217,119,6,0.3)] hover:brightness-110 active:scale-95 transition-all outline-none"
              >
                Assemble The Visions
              </button>
            </motion.div>
          )}

          {screen === 'game' && (
            <GameScreen key="game" onExit={() => setScreen('title')} />
          )}
        </AnimatePresence>
      </main>
      
      {/* Decorative Temple Background Elements */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-0 w-64 h-64 bg-yellow-900/10 blur-[120px]"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-900/10 blur-[150px]"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-white/[0.02] rounded-full"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-white/[0.03] rounded-full"></div>
      </div>
    </div>
  );
}

