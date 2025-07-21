export interface TarotCard {
  id: string;
  name: string;
  nameEn: string;
  suit?: 'wands' | 'cups' | 'swords' | 'pentacles';
  number?: number;
  type: 'major' | 'minor';
  uprightMeaning: string;
  reversedMeaning: string;
  imageUrl: string;
  keywords: string[];
  description: string;
}

export interface CardPosition {
  id: string;
  name: string;
  meaning: string;
  x: number;
  y: number;
  card?: DrawnCard;
}

export interface DrawnCard {
  card: TarotCard;
  isReversed: boolean;
  position: string;
  drawnAt: Date;
  isRevealed: boolean; // 是否已翻开显示
}

export interface TarotSpread {
  id: string;
  name: string;
  description: string;
  positions: CardPosition[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: string;
}