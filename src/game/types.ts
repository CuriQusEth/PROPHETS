export type VisionElement = 'FIRE' | 'WATER' | 'EARTH' | 'AIR' | 'LIGHT' | 'VOID';

export interface CardDef {
  id: string;
  name: string;
  element: VisionElement;
  cost: number; // Faith cost
  effect: {
    faith?: number;
    chaos?: number;
    enlightenment?: number;
  };
  description: string;
  isLegendary?: boolean;
}

export interface PlayerState {
  faith: number;
  chaos: number;
  enlightenment: number;
  fateTokens: number;
  hand: CardDef[];
  playedHistory: CardDef[];
  turn: number;
  gameOver: boolean;
}

export interface ComboDef {
  elements: VisionElement[];
  name: string;
  bonus: {
    faith?: number;
    chaos?: number;
    enlightenment?: number;
  };
  description: string;
}
