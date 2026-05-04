import { CardDef, ComboDef, VisionElement } from './types';

export const BASE_CARDS: CardDef[] = [
  { id: 'f1', name: 'Spark of War', element: 'FIRE', cost: 1, effect: { chaos: 5, enlightenment: 2 }, description: 'Ignite the flames of conflict.' },
  { id: 'f2', name: 'Cleansing Flame', element: 'FIRE', cost: 2, effect: { chaos: -3, enlightenment: 5 }, description: 'Purify corruption with holy fire.' },
  { id: 'w1', name: 'Healing Rain', element: 'WATER', cost: 1, effect: { chaos: -2, faith: 5 }, description: 'Soothe the wounded lands.' },
  { id: 'w2', name: 'Tidal Wave', element: 'WATER', cost: 3, effect: { chaos: 10, enlightenment: 1 }, description: 'Wash away the weak.' },
  { id: 'e1', name: 'Fertile Soil', element: 'EARTH', cost: 1, effect: { faith: 3, enlightenment: 2 }, description: 'Grow new life.' },
  { id: 'e2', name: 'Earthquake', element: 'EARTH', cost: 2, effect: { chaos: 8, faith: -2 }, description: 'Shatter the foundations.' },
  { id: 'a1', name: 'Whispering Wind', element: 'AIR', cost: 1, effect: { enlightenment: 3, faith: 1 }, description: 'Carry secrets of the divine.' },
  { id: 'l1', name: 'Divine Ray', element: 'LIGHT', cost: 2, effect: { enlightenment: 8, chaos: -5 }, description: 'Illuminate the truth.', isLegendary: true },
  { id: 'v1', name: 'Abyssal Gaze', element: 'VOID', cost: 0, effect: { chaos: 15, faith: -5, enlightenment: 10 }, description: 'Stare into nothingness.', isLegendary: true },
];

export const COMBOS: ComboDef[] = [
  {
    elements: ['FIRE', 'FIRE'],
    name: 'Inferno',
    bonus: { chaos: 10, enlightenment: 5 },
    description: 'The world burns in chaos.'
  },
  {
    elements: ['WATER', 'WATER'],
    name: 'Great Flood',
    bonus: { faith: 10, chaos: 5 },
    description: 'A new beginning from destruction.'
  },
  {
    elements: ['LIGHT', 'WATER'],
    name: 'Golden Age',
    bonus: { enlightenment: 15, chaos: -10, faith: 10 },
    description: 'Prosperity and peace reign supreme.'
  },
  {
    elements: ['FIRE', 'VOID'],
    name: 'Apocalypse',
    bonus: { chaos: 25, enlightenment: 20, faith: -20 },
    description: 'The end times are upon us!'
  },
  {
    elements: ['EARTH', 'WATER'],
    name: 'Bountiful Harvest',
    bonus: { faith: 15, enlightenment: 5 },
    description: 'The lands provide.'
  }
];

export function getRandomCard(): CardDef {
  const rand = Math.floor(Math.random() * BASE_CARDS.length);
  return { ...BASE_CARDS[rand], id: Math.random().toString(36).substring(7) };
}
