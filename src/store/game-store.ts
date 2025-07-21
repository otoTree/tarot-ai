import { create } from 'zustand';
import { GameState, DrawnCard } from '@/types/game';
import { TarotSpread } from '@/types/tarot';
import { allCards, shuffleCards } from '@/lib/tarot-data';
import { db } from '@/lib/database';

interface GameStore extends GameState {
  // Actions
  setSpread: (spread: TarotSpread) => void;
  shuffleDeck: () => Promise<void>;
  drawCard: (positionId: string) => DrawnCard | null;
  resetGame: () => void;
  saveSession: () => Promise<void>;
  loadSession: (sessionId: string) => Promise<void>;
  removeCardFromPosition: (positionId: string) => void;
  cutCardFromPosition: (positionId: string) => void;
  toggleCardReverse: (positionId: string) => void;
  revealCard: (positionId: string) => void;
  revealAllCards: () => void;
  hideAllCards: () => void;
}

export const useGameStore = create<GameStore>((set, get) => ({
  // Initial state
  drawnCards: [],
  shuffledDeck: [],
  isShuffling: false,
  gamePhase: 'setup',
  sessionId: '',

  // Actions
  setSpread: (spread) => {
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    set({ 
      currentSpread: spread, 
      gamePhase: 'drawing',
      sessionId,
      drawnCards: [],
      shuffledDeck: []
    });
  },

  shuffleDeck: async () => {
    set({ isShuffling: true });
    
    // 模拟洗牌过程
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const shuffled = shuffleCards(allCards);
    
    set({ 
      shuffledDeck: shuffled, 
      isShuffling: false 
    });
  },

  drawCard: (positionId) => {
    const { shuffledDeck, drawnCards, currentSpread } = get();
    
    if (shuffledDeck.length === 0) {
      console.warn('牌堆为空，请先洗牌');
      return null;
    }
    
    // 检查该位置是否已有牌
    const existingCard = drawnCards.find(dc => dc.position === positionId);
    if (existingCard) {
      console.warn('该位置已有牌');
      return existingCard;
    }
    
    // 检查位置是否有效
    const position = currentSpread?.positions.find(p => p.id === positionId);
    if (!position) {
      console.warn('无效的牌位');
      return null;
    }
    
    const card = shuffledDeck[0];
    const isReversed = Math.random() < 0.5; // 50% 概率逆位
    
    const drawnCard: DrawnCard = {
      card,
      isReversed,
      position: positionId,
      drawnAt: new Date(),
      isRevealed: false // 默认不显示卡牌内容
    };
    
    set({
      shuffledDeck: shuffledDeck.slice(1),
      drawnCards: [...drawnCards, drawnCard]
    });
    
    // 检查是否完成抽牌
    const newDrawnCards = [...drawnCards, drawnCard];
    if (currentSpread && newDrawnCards.length === currentSpread.positions.length) {
      set({ gamePhase: 'reading' });
    }
    
    return drawnCard;
  },

  removeCardFromPosition: (positionId) => {
    const { drawnCards, shuffledDeck } = get();
    const cardToRemove = drawnCards.find(dc => dc.position === positionId);
    
    if (cardToRemove) {
      set({
        drawnCards: drawnCards.filter(dc => dc.position !== positionId),
        shuffledDeck: [cardToRemove.card, ...shuffledDeck],
        gamePhase: 'drawing'
      });
    }
  },

  cutCardFromPosition: (positionId) => {
    const { drawnCards } = get();
    const cardToCut = drawnCards.find(dc => dc.position === positionId);
    
    if (cardToCut) {
      // 切牌：只移除drawnCards中的牌，不放回shuffledDeck
      // 这样被切掉的牌就永久从游戏中移除了
      set({
        drawnCards: drawnCards.filter(dc => dc.position !== positionId),
        gamePhase: 'drawing'
      });
    }
  },

  toggleCardReverse: (positionId) => {
    const { drawnCards } = get();
    const updatedCards = drawnCards.map(dc => 
      dc.position === positionId 
        ? { ...dc, isReversed: !dc.isReversed }
        : dc
    );
    
    set({ drawnCards: updatedCards });
  },

  revealCard: (positionId) => {
    const { drawnCards } = get();
    const updatedCards = drawnCards.map(dc => 
      dc.position === positionId 
        ? { ...dc, isRevealed: true }
        : dc
    );
    
    set({ drawnCards: updatedCards });
  },

  revealAllCards: () => {
    const { drawnCards } = get();
    const updatedCards = drawnCards.map(dc => ({ ...dc, isRevealed: true }));
    
    set({ drawnCards: updatedCards });
  },

  hideAllCards: () => {
    const { drawnCards } = get();
    const updatedCards = drawnCards.map(dc => ({ ...dc, isRevealed: false }));
    
    set({ drawnCards: updatedCards });
  },

  resetGame: () => {
    set({
      currentSpread: undefined,
      drawnCards: [],
      shuffledDeck: [],
      gamePhase: 'setup',
      sessionId: '',
      isShuffling: false
    });
  },

  saveSession: async () => {
    const state = get();
    if (!state.currentSpread || state.drawnCards.length === 0) {
      console.warn('没有可保存的会话数据');
      return;
    }
    
    try {
      await db.saveGameSession({
        spreadId: state.currentSpread.id,
        drawnCards: state.drawnCards,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      
      console.log('会话已保存');
    } catch (error) {
      console.error('保存会话失败:', error);
    }
  },

  loadSession: async (sessionId) => {
    try {
      const session = await db.getGameSession(sessionId);
      if (!session) {
        console.warn('未找到指定的会话');
        return;
      }
      
      // 这里需要根据spreadId加载对应的牌阵
      // 暂时设置基本状态
      set({
        sessionId: session.id,
        drawnCards: session.drawnCards,
        gamePhase: 'reading'
      });
      
      console.log('会话已加载');
    } catch (error) {
      console.error('加载会话失败:', error);
    }
  }
}));

// 辅助函数：获取当前游戏状态摘要
export function getGameSummary() {
  const state = useGameStore.getState();
  return {
    hasSpread: !!state.currentSpread,
    spreadName: state.currentSpread?.name,
    drawnCardsCount: state.drawnCards.length,
    totalPositions: state.currentSpread?.positions.length || 0,
    isComplete: state.gamePhase === 'reading' || state.gamePhase === 'complete',
    phase: state.gamePhase
  };
}

// 辅助函数：检查游戏是否可以开始解读
export function canStartReading() {
  const state = useGameStore.getState();
  return state.currentSpread && 
         state.drawnCards.length === state.currentSpread.positions.length;
}