import React from 'react';
import { motion } from 'motion/react';
import { useGameEngine } from '../game/useGameEngine';
import { Card } from './Card';
import { Sparkles, Skull, Flame } from 'lucide-react';
import { ScoreSubmitter } from './ScoreSubmitter';
import { cn } from '../lib/utils';

export const GameScreen: React.FC<{ onExit: () => void }> = ({ onExit }) => {
  const { state, playCard, resetGame, rerollHand, lastCombo } = useGameEngine();

  const isDeadByChaos = state.chaos >= 100;
  const isDeadByFaith = state.faith <= 0;

  if (state.gameOver) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center p-8 text-center z-10 w-full max-w-lg mx-auto my-auto backdrop-blur-md bg-[#0a0a0c]/90 border border-white/10 rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.8)]"
      >
        <div className="text-6xl mb-4">{isDeadByChaos ? '💀' : '🕊️'}</div>
        <h2 className={cn("text-4xl sm:text-5xl font-serif font-black mb-2 uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-br", isDeadByChaos ? "from-red-400 to-red-900 drop-shadow-[0_0_15px_rgba(220,38,38,0.5)]" : "from-slate-200 to-slate-600")}>
          {isDeadByChaos ? "CONSUMED BY CHAOS" : "FAITH FADED"}
        </h2>
        <div className="w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent my-6"></div>
        
        <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Final Enlightenment</p>
        <p className="text-5xl text-yellow-500 mb-8 font-serif font-black drop-shadow-[0_0_20px_rgba(234,179,8,0.3)]">{state.enlightenment}</p>
        
        <ScoreSubmitter score={state.enlightenment} />

        <div className="flex gap-4 mt-8 w-full justify-center">
          <button onClick={resetGame} className="px-6 py-3 bg-gray-800 border border-gray-600 rounded text-gray-200 hover:bg-gray-700 font-bold uppercase tracking-widest text-xs transition-all w-1/2">Play Again</button>
          <button onClick={onExit} className="px-6 py-3 bg-transparent border border-white/10 text-gray-400 hover:text-white rounded font-bold uppercase tracking-widest text-xs transition-all w-1/2">Main Menu</button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="flex flex-col items-center w-full h-full p-4 md:p-8 z-10 justify-between max-w-4xl mx-auto"
    >
      {/* HUD block styled as Divine Resources */}
      <div className="w-full flex flex-col sm:flex-row justify-between items-center gap-4 bg-[#0a0a0c] border border-white/5 rounded-lg p-4 mb-4 shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
        <div className="flex items-center space-x-4 sm:space-x-8">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-widest text-yellow-600 font-bold">Enlightenment</span>
            <div className="flex items-center space-x-2 mt-1">
              <span className="text-2xl font-serif text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-600">{state.enlightenment}</span>
            </div>
          </div>
          <div className="flex flex-col border-l border-white/10 pl-4 sm:pl-6">
            <span className="text-[10px] uppercase tracking-widest text-blue-400">Faith</span>
            <span className="text-xl font-serif text-white">{state.faith}</span>
          </div>
          <div className="flex flex-col border-l border-white/10 pl-4 sm:pl-6">
            <span className="text-[10px] uppercase tracking-widest text-red-500">Chaos</span>
            <span className="text-xl font-serif text-white">{state.chaos}/100</span>
          </div>
        </div>

        <div className="flex flex-col items-end gap-1 text-right border-t sm:border-t-0 sm:border-l border-white/10 pt-2 sm:pt-0 sm:pl-6 w-full sm:w-auto">
          <div className="text-[10px] text-gray-500 uppercase tracking-widest">Turn Record</div>
          <div className="text-sm text-gray-300 font-mono">Turn: <span className="text-white">{state.turn}</span></div>
        </div>
      </div>

      {/* Middle Arena Area */}
      <div className="flex-1 w-full flex flex-col items-center justify-center relative my-8">
        <div className="w-full max-w-sm h-48 border border-slate-800/50 bg-slate-900/30 rounded-[2rem] flex flex-col items-center justify-center relative overflow-hidden backdrop-blur-md">
           <span className="text-slate-600/50 font-serif text-2xl font-black uppercase tracking-[0.2em]">The Void</span>
           
           {/* Center particles or visual cue for dragging */}
           <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900/20 via-transparent to-transparent pointer-events-none"></div>

           {/* Last Combo Popup */}
           {lastCombo && (
             <motion.div 
               initial={{ opacity: 0, scale: 0.5, y: 20 }}
               animate={{ opacity: 1, scale: 1, y: 0 }}
               className="absolute z-20 text-yellow-300 font-serif font-black text-2xl uppercase tracking-widest drop-shadow-[0_0_10px_rgba(253,224,71,0.8)]"
             >
               {lastCombo}!
             </motion.div>
           )}
        </div>
        <p className="mt-4 text-xs text-slate-500 uppercase tracking-widest">Drag visions into the void</p>
      </div>

      {/* Hand / Deck Area and Bottom Controls */}
      <div className="w-full flex flex-col items-center gap-8 pb-4 mt-auto">
        <div className="flex items-center justify-center gap-0 sm:gap-4 h-64 relative">
          {state.hand.map((card, idx) => (
             <div key={card.id} className="relative z-10" style={{ perspective: 1000}}>
               <motion.div 
                  initial={{ y: 50, opacity: 0, rotateY: 90 }}
                  animate={{ y: 0, opacity: 1, rotateY: 0 }}
                  transition={{ delay: idx * 0.1 }}
               >
                 <Card 
                   card={card} 
                   onPlay={playCard} 
                   disabled={state.faith < card.cost} 
                 />
               </motion.div>
             </div>
          ))}
        </div>
        
        {/* Bottom Controls styled like Footer */}
        <div className="w-full bg-[#0a0a0c] border border-white/5 rounded-lg p-4 flex flex-col sm:flex-row items-center justify-between shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
          <div className="flex items-center space-x-4">
            <div className="bg-white/5 border border-white/10 px-4 py-2 rounded-lg text-center min-w-[100px]">
              <div className="text-[9px] text-gray-500 uppercase">Fate Tokens</div>
              <div className="text-xl font-serif text-white tracking-widest">
                {Array(state.fateTokens).fill('•').join('') || 'NONE'}
              </div>
            </div>
            <button 
              onClick={rerollHand} 
              disabled={state.fateTokens <= 0}
              className="px-6 py-3 bg-gray-800 border border-gray-600 text-gray-300 text-xs font-bold uppercase tracking-widest rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              Reroll Visions
            </button>
          </div>
          
          <div className="mt-4 sm:mt-0 text-right pr-4">
             <div className="text-[10px] text-gray-500 uppercase">Played Omens</div>
             <div className="text-sm text-yellow-500 font-serif">{state.playedHistory.length}</div>
          </div>
        </div>
      </div>

    </motion.div>
  );
};
