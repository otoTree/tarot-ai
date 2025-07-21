import { useCallback, useEffect } from 'react';
import { useGameStore } from '@/store/game-store';
import { useChatStore } from '@/store/chat-store';
import { useSettingsStore } from '@/store/settings-store';
import { TarotSpread } from '@/types/tarot';
import { aiService } from '@/lib/ai-service';
import { toast } from 'react-hot-toast';

export function useTarotGame() {
  const {
    currentSpread,
    drawnCards,
    shuffledDeck,
    isShuffling,
    gamePhase,
    sessionId,
    setSpread,
    shuffleDeck,
    drawCard,
    resetGame,
    saveSession,
    removeCardFromPosition,
    toggleCardReverse,
    revealCard,
    revealAllCards,
    hideAllCards
  } = useGameStore();

  const { createConversation, sendMessage } = useChatStore();
  const { autoShuffle, saveHistory } = useSettingsStore();

  // 开始新游戏
  const startNewGame = useCallback(async (spread: TarotSpread) => {
    try {
      setSpread(spread);
      
      if (autoShuffle) {
        await shuffleDeck();
      }
      
      toast.success(`已选择${spread.name}，开始占卜！`);
    } catch (error) {
      console.error('开始游戏失败:', error);
      toast.error('开始游戏失败，请重试');
    }
  }, [setSpread, shuffleDeck, autoShuffle]);

  // 手动洗牌
  const handleShuffle = useCallback(async () => {
    try {
      await shuffleDeck();
      toast.success('洗牌完成！');
    } catch (error) {
      console.error('洗牌失败:', error);
      toast.error('洗牌失败，请重试');
    }
  }, [shuffleDeck]);

  // 抽牌
  const handleDrawCard = useCallback((positionId: string) => {
    try {
      const drawnCard = drawCard(positionId);
      
      if (drawnCard) {
        const position = currentSpread?.positions.find(p => p.id === positionId);
        toast.success(`已抽取${position?.name}位置的牌`);
        return drawnCard;
      } else {
        toast.error('抽牌失败，请检查牌堆是否为空');
        return null;
      }
    } catch (error) {
      console.error('抽牌失败:', error);
      toast.error('抽牌失败，请重试');
      return null;
    }
  }, [drawCard, currentSpread]);

  // 移除牌
  const handleRemoveCard = useCallback((positionId: string) => {
    try {
      removeCardFromPosition(positionId);
      const position = currentSpread?.positions.find(p => p.id === positionId);
      toast.success(`已移除${position?.name}位置的牌`);
    } catch (error) {
      console.error('移除牌失败:', error);
      toast.error('移除牌失败，请重试');
    }
  }, [removeCardFromPosition, currentSpread]);

  // 翻转牌
  const handleToggleReverse = useCallback((positionId: string) => {
    try {
      toggleCardReverse(positionId);
      const drawnCard = drawnCards.find(dc => dc.position === positionId);
      if (drawnCard) {
        const newState = drawnCard.isReversed ? '正位' : '逆位';
        toast.success(`牌已翻转为${newState}`);
      }
    } catch (error) {
      console.error('翻转牌失败:', error);
      toast.error('翻转牌失败，请重试');
    }
  }, [toggleCardReverse, drawnCards]);

  // 翻开单张牌
  const handleRevealCard = useCallback((positionId: string) => {
    try {
      revealCard(positionId);
      const position = currentSpread?.positions.find(p => p.id === positionId);
      toast.success(`已翻开${position?.name}位置的牌`);
    } catch (error) {
      console.error('翻开牌失败:', error);
      toast.error('翻开牌失败，请重试');
    }
  }, [revealCard, currentSpread]);

  // 一键翻开所有牌
  const handleRevealAllCards = useCallback(() => {
    try {
      revealAllCards();
      toast.success('已翻开所有卡牌！');
    } catch (error) {
      console.error('翻开所有牌失败:', error);
      toast.error('翻开所有牌失败，请重试');
    }
  }, [revealAllCards]);

  // 隐藏所有牌
  const handleHideAllCards = useCallback(() => {
    try {
      hideAllCards();
      toast.success('已隐藏所有卡牌');
    } catch (error) {
      console.error('隐藏所有牌失败:', error);
      toast.error('隐藏所有牌失败，请重试');
    }
  }, [hideAllCards]);

  // 生成AI解读
  const generateReading = useCallback(async (userQuestion?: string) => {
    if (!currentSpread || drawnCards.length === 0) {
      toast.error('请先完成抽牌');
      return;
    }

    try {
      toast.loading('正在生成解读...', { id: 'generating-reading' });
      
      const reading = await aiService.generateReading({
        drawnCards,
        spreadName: currentSpread.name,
        userQuestion
      });

      // 创建或使用现有对话
      const conversationId = await createConversation(sessionId, `${currentSpread.name}解读`);
      
      // 发送解读消息
      await sendMessage(reading, 'reading');
      
      // 保存会话（如果启用）
      if (saveHistory) {
        await saveSession();
      }
      
      toast.success('解读已生成！', { id: 'generating-reading' });
      
      return reading;
    } catch (error) {
      console.error('生成解读失败:', error);
      toast.error('生成解读失败，请重试', { id: 'generating-reading' });
      throw error;
    }
  }, [currentSpread, drawnCards, sessionId, createConversation, sendMessage, saveSession, saveHistory]);

  // 重置游戏
  const handleResetGame = useCallback(() => {
    try {
      resetGame();
      toast.success('游戏已重置');
    } catch (error) {
      console.error('重置游戏失败:', error);
      toast.error('重置游戏失败');
    }
  }, [resetGame]);

  // 检查游戏状态
  const gameStatus = {
    hasSpread: !!currentSpread,
    hasShuffledDeck: shuffledDeck.length > 0,
    isComplete: currentSpread ? drawnCards.length === currentSpread.positions.length : false,
    canShuffle: !isShuffling && gamePhase !== 'setup',
    canDraw: shuffledDeck.length > 0 && gamePhase === 'drawing',
    canGenerateReading: currentSpread ? drawnCards.length === currentSpread.positions.length : false,
    hasCards: drawnCards.length > 0,
    isDrawingPhase: gamePhase === 'drawing',
    hasRevealedCards: drawnCards.some(card => card.isRevealed),
    allCardsRevealed: drawnCards.length > 0 && drawnCards.every(card => card.isRevealed)
  };

  // 获取进度信息
  const progress = {
    current: drawnCards.length,
    total: currentSpread?.positions.length || 0,
    percentage: currentSpread ? (drawnCards.length / currentSpread.positions.length) * 100 : 0
  };

  return {
    // 状态
    currentSpread,
    drawnCards,
    shuffledDeck,
    isShuffling,
    gamePhase,
    sessionId,
    gameStatus,
    progress,
    
    // 操作
    startNewGame,
    handleShuffle,
    handleDrawCard,
    handleRemoveCard,
    handleToggleReverse,
    handleRevealCard,
    handleRevealAllCards,
    handleHideAllCards,
    generateReading,
    handleResetGame,
    resetGame,
    saveSession
  };
}

// 辅助hook：获取牌位信息
export function useCardPosition(positionId: string) {
  const { currentSpread, drawnCards } = useGameStore();
  
  const position = currentSpread?.positions.find(p => p.id === positionId);
  const drawnCard = drawnCards.find(dc => dc.position === positionId);
  
  return {
    position,
    drawnCard,
    hasCard: !!drawnCard,
    isEmpty: !drawnCard
  };
}

// 辅助hook：获取牌的详细信息
export function useCardDetails(positionId: string) {
  const { drawnCard } = useCardPosition(positionId);
  
  if (!drawnCard) {
    return null;
  }
  
  const { card, isReversed } = drawnCard;
  
  return {
    card,
    isReversed,
    meaning: isReversed ? card.reversedMeaning : card.uprightMeaning,
    keywords: card.keywords,
    description: card.description,
    orientation: isReversed ? '逆位' : '正位'
  };
}