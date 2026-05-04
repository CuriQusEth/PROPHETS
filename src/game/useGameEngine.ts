import { useState, useCallback } from 'react';
import { PlayerState, CardDef } from './types';
import { getRandomCard, COMBOS } from './data';

const INITIAL_STATE: PlayerState = {
  faith: 10,
  chaos: 0,
  enlightenment: 0,
  fateTokens: 3,
  hand: [],
  playedHistory: [],
  turn: 1,
  gameOver: false,
};

export function useGameEngine() {
  const [state, setState] = useState<PlayerState>({
    ...INITIAL_STATE,
    hand: [getRandomCard(), getRandomCard(), getRandomCard()]
  });

  const [lastCombo, setLastCombo] = useState<string | null>(null);

  const resetGame = useCallback(() => {
    setState({
      ...INITIAL_STATE,
      hand: [getRandomCard(), getRandomCard(), getRandomCard()]
    });
    setLastCombo(null);
  }, []);

  const playCard = useCallback((cardId: string) => {
    setState(prev => {
      if (prev.gameOver) return prev;

      const cardToPlay = prev.hand.find(c => c.id === cardId);
      if (!cardToPlay) return prev;
      
      // Faith check
      if (prev.faith < cardToPlay.cost) {
        return prev; // Not enough faith
      }

      let newFaith = prev.faith - cardToPlay.cost + (cardToPlay.effect.faith || 0);
      let newChaos = prev.chaos + (cardToPlay.effect.chaos || 0);
      let newEnlightenment = prev.enlightenment + (cardToPlay.effect.enlightenment || 0);

      const newPlayedHistory = [...prev.playedHistory, cardToPlay];
      let triggeredComboName = null;

      // Check for combo (last 2 cards)
      if (newPlayedHistory.length >= 2) {
        const lastTwo = newPlayedHistory.slice(-2).map(c => c.element);
        const combo = COMBOS.find(c => 
          (c.elements[0] === lastTwo[0] && c.elements[1] === lastTwo[1]) ||
          (c.elements[0] === lastTwo[1] && c.elements[1] === lastTwo[0])
        );

        if (combo) {
          triggeredComboName = combo.name;
          newFaith += (combo.bonus.faith || 0);
          newChaos += (combo.bonus.chaos || 0);
          newEnlightenment += (combo.bonus.enlightenment || 0);
        }
      }

      setLastCombo(triggeredComboName);

      // Boundaries & Game Over logic
      let isGameOver = false;
      if (newChaos > 100 || newFaith <= 0) {
        isGameOver = true;
      }
      
      if (newChaos < 0) newChaos = 0;

      // Draw new cards up to 3
      const remainingHand = prev.hand.filter(c => c.id !== cardId);
      const newHand = [...remainingHand];
      while(newHand.length < 3) {
         newHand.push(getRandomCard());
      }

      return {
        ...prev,
        faith: newFaith,
        chaos: newChaos,
        enlightenment: newEnlightenment,
        playedHistory: newPlayedHistory,
        hand: newHand,
        turn: prev.turn + 1,
        gameOver: isGameOver,
      };
    });
  }, []);

  const rerollHand = useCallback(() => {
    setState(prev => {
      if (prev.fateTokens <= 0 || prev.gameOver) return prev;
      return {
        ...prev,
        fateTokens: prev.fateTokens - 1,
        hand: [getRandomCard(), getRandomCard(), getRandomCard()]
      };
    });
  }, []);

  return {
    state,
    playCard,
    rerollHand,
    resetGame,
    lastCombo
  };
}
