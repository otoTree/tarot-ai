import { TarotSpread, DrawnCard, TarotCard } from './tarot';

export interface GameState {
  currentSpread?: TarotSpread;
  drawnCards: DrawnCard[];
  shuffledDeck: TarotCard[];
  isShuffling: boolean;
  gamePhase: 'setup' | 'drawing' | 'reading' | 'complete';
  sessionId: string;
}

export interface GameSession {
  id: string;
  spreadId: string;
  drawnCards: DrawnCard[];
  aiReading?: string;
  userQuestion?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Re-export DrawnCard for external use
export type { DrawnCard };