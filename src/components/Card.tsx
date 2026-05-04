import React from 'react';
import { motion, PanInfo } from 'motion/react';
import { CardDef } from '../game/types';
import { cn } from '../lib/utils';
import { Sparkles, Droplet, Mountain, Wind, Sun, Skull } from 'lucide-react';

interface CardProps {
  card: CardDef;
  onPlay: (id: string) => void;
  disabled?: boolean;
}

const ELEMENT_COLORS: Record<string, { theme: string, label: string, hover: string, badge: string }> = {
  FIRE: { theme: 'text-orange-400', label: 'Vision of Fire', hover: 'hover:border-orange-500/50', badge: 'bg-orange-900/80 border-orange-500 text-orange-200' },
  WATER: { theme: 'text-blue-400', label: 'Vision of Water', hover: 'hover:border-blue-500/50', badge: 'bg-blue-900/80 border-blue-500 text-blue-200' },
  EARTH: { theme: 'text-emerald-400', label: 'Vision of Earth', hover: 'hover:border-emerald-500/50', badge: 'bg-emerald-900/80 border-emerald-500 text-emerald-200' },
  AIR: { theme: 'text-slate-300', label: 'Vision of Air', hover: 'hover:border-slate-400/50', badge: 'bg-slate-800/80 border-slate-400 text-slate-200' },
  LIGHT: { theme: 'text-yellow-400', label: 'Vision of Light', hover: 'hover:border-yellow-500/50', badge: 'bg-yellow-900/80 border-yellow-500 text-yellow-200' },
  VOID: { theme: 'text-purple-400', label: 'Vision of Void', hover: 'hover:border-purple-500/50', badge: 'bg-indigo-950/80 border-purple-500 text-purple-200' },
};

const ELEMENT_ICONS: Record<string, string> = {
  FIRE: '☄️',
  WATER: '🌊',
  EARTH: '🌿',
  AIR: '💨',
  LIGHT: '👁️',
  VOID: '🌑',
};

export const Card = ({ card, onPlay, disabled }: CardProps) => {
  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (disabled) return;
    if (info.offset.y < -100) {
      onPlay(card.id);
    }
  };

  const styleParts = ELEMENT_COLORS[card.element];

  return (
    <motion.div
      drag={!disabled ? "y" : false}
      dragConstraints={{ top: 0, bottom: 0 }}
      dragElastic={0.2}
      onDragEnd={handleDragEnd}
      whileHover={!disabled ? { scale: 1.05, y: -10 } : {}}
      whileTap={!disabled ? { scale: 1.1 } : {}}
      className={cn(
        "group w-[160px] h-[240px] sm:w-[180px] sm:h-[260px] bg-gradient-to-b from-[#1a1a1c] to-black border border-white/10 rounded-xl flex flex-col p-3 sm:p-4 relative cursor-grab active:cursor-grabbing shadow-xl transition-colors",
        styleParts.hover,
        card.isLegendary && "border-2 border-yellow-500 shadow-[0_0_25px_rgba(234,179,8,0.2)] bg-gradient-to-b from-[#1c1c1f] to-black w-[180px] h-[260px] sm:w-[210px] sm:h-[300px]",
        disabled && "opacity-50 grayscale cursor-not-allowed"
      )}
    >
      <div className={cn("absolute -top-3 left-1/2 -translate-x-1/2 text-[10px] px-2 py-1 rounded border uppercase whitespace-nowrap tracking-wider", card.isLegendary ? "bg-yellow-600 border-yellow-500 text-black font-bold" : styleParts.badge)}>
        {card.isLegendary ? "Legendary Intervention" : styleParts.label}
      </div>

      <div className={cn("h-24 sm:h-32 w-full rounded-lg mb-4 flex items-center justify-center text-4xl", card.isLegendary ? "bg-yellow-900/10 text-5xl" : "bg-[#111]")}>
        {ELEMENT_ICONS[card.element]}
      </div>
      
      <h4 className={cn("text-center text-sm font-bold mb-2 uppercase tracking-tighter sm:tracking-widest drop-shadow-md", card.isLegendary ? "text-yellow-500 font-serif text-base" : "text-white")}>
        {card.name}
      </h4>
      <p className={cn("text-[9px] sm:text-[10px] text-center leading-tight sm:leading-normal font-sans italic flex-1", card.isLegendary ? "text-yellow-100/70" : "text-gray-400")}>
        {card.description}
      </p>

      <div className="mt-auto flex justify-between items-center text-[10px] font-bold font-sans">
        <span className={card.isLegendary ? "text-yellow-400" : styleParts.theme}>Cost: {card.cost} Faith</span>
        <div className="flex gap-1">
          {card.effect.chaos ? <span className="text-red-400">{card.effect.chaos > 0 ? '+' : ''}{card.effect.chaos}C</span> : null}
          {card.effect.enlightenment ? <span className={card.isLegendary ? "text-yellow-400" : "text-blue-300"}>{card.effect.enlightenment > 0 ? '+' : ''}{card.effect.enlightenment}E</span> : null}
        </div>
      </div>
    </motion.div>
  );
};
