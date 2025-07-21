'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { TarotCard } from './TarotCard';
import { useGameStore } from '@/store/game-store';
import { Button } from '@/components/ui/button';
import { Shuffle, ChevronUp, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';
import { allCards } from '@/lib/tarot-data';
import { TarotCard as TarotCardType } from '@/types/tarot';
import { toast } from 'sonner';

interface DrawnCardsDisplayProps {
  className?: string;
}

export function DrawnCardsDisplay({ className }: DrawnCardsDisplayProps) {
  const { 
    shuffledDeck, 
    shuffleDeck, 
    isShuffling, 
    currentSpread, 
    drawnCards,
    drawCard 
  } = useGameStore();
  const [isExpanded, setIsExpanded] = useState(true); // 默认展开
  const [selectedCard, setSelectedCard] = useState<TarotCardType | null>(null);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [windowWidth, setWindowWidth] = useState(1200); // 默认宽度
  const [hoverTimeout, setHoverTimeout] = useState<NodeJS.Timeout | null>(null);
  
  useEffect(() => {
    const updateWindowWidth = () => {
      setWindowWidth(window.innerWidth);
    };
    
    updateWindowWidth();
    window.addEventListener('resize', updateWindowWidth);
    
    return () => {
      window.removeEventListener('resize', updateWindowWidth);
      if (hoverTimeout) {
        clearTimeout(hoverTimeout);
      }
    };
  }, [hoverTimeout]);
  
  // 获取要显示的牌组（优先显示洗牌后的牌堆，否则显示所有牌）
  const displayCards = shuffledDeck.length > 0 ? shuffledDeck : allCards;
  
  // 洗牌功能
  const handleShuffle = async () => {
    await shuffleDeck();
  };
  
  // 切换展开/收起状态
  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };
  
  // 处理卡牌悬浮 - 防抖处理
  const handleCardHover = (cardId: string | null) => {
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
    }
    
    if (cardId) {
      setHoveredCard(cardId);
    } else {
      const timeout = setTimeout(() => {
        setHoveredCard(null);
      }, 100); // 100ms 延迟，避免快速切换时的闪烁
      setHoverTimeout(timeout);
    }
  };
  
  // 处理卡牌点击 - 选择卡牌
  const handleCardClick = (card: TarotCardType) => {
    if (selectedCard?.id === card.id) {
      setSelectedCard(null); // 取消选择
    } else {
      setSelectedCard(card); // 选择新卡牌
    }
  };
  
  // 将选中的卡牌放置到牌阵中
  const placeCardInSpread = () => {
    if (!selectedCard || !currentSpread) {
      toast.error('请先选择一张卡牌');
      return;
    }
    
    // 找到下一个空的牌位
    const nextEmptyPosition = currentSpread.positions.find(pos => 
      !drawnCards.some(card => card.position === pos.id)
    );
    
    if (!nextEmptyPosition) {
      toast.error('牌阵已满，无法放置更多卡牌');
      return;
    }
    
    // 检查选中的卡牌是否在洗牌后的牌堆中
    const cardIndex = shuffledDeck.findIndex(card => card.id === selectedCard.id);
    if (cardIndex === -1) {
      toast.error('所选卡牌不在当前牌堆中');
      return;
    }
    
    // 使用游戏状态的drawCard方法，但需要先将选中的卡牌移到牌堆顶部
    const newShuffledDeck = [...shuffledDeck];
    const [selectedCardFromDeck] = newShuffledDeck.splice(cardIndex, 1);
    newShuffledDeck.unshift(selectedCardFromDeck);
    
    // 更新牌堆并抽牌
    useGameStore.setState({ shuffledDeck: newShuffledDeck });
    const drawnCard = drawCard(nextEmptyPosition.id);
    
    if (drawnCard) {
      setSelectedCard(null); // 清除选择
      toast.success(`已将 ${selectedCard.name} 放置到 ${nextEmptyPosition.name} 位置`);
    }
  };
  
  return (
    <div className={cn('fixed bottom-0 left-0 right-0 bg-black/40 backdrop-blur-sm border-t border-purple-500/30 z-40', className)}>
      <div className="w-full px-4">
        {/* 控制栏 */}
        <div className="flex items-center justify-between p-5 border-b border-purple-500/20">
          <div className="flex items-center gap-4">
            <div>
              <h3 className="text-lg font-semibold text-white mb-1">塔罗牌抽牌区</h3>
              <p className="text-sm text-gray-300">
                共 {displayCards.length} 张牌 {selectedCard && `(已选择: ${selectedCard.name})`}
              </p>
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleShuffle}
              disabled={isShuffling}
              className="bg-purple-800/50 border-purple-600 text-white hover:bg-purple-700/50"
            >
              <Shuffle className="w-4 h-4 mr-2" />
              {isShuffling ? '洗牌中...' : '洗牌'}
            </Button>
          </div>
          
          <div className="flex items-center gap-2">
            {selectedCard && (
              <Button
                variant="outline"
                size="sm"
                onClick={placeCardInSpread}
                className="bg-green-800/50 border-green-600 text-white hover:bg-green-700/50"
                disabled={!currentSpread || drawnCards.length >= (currentSpread?.positions.length || 0)}
              >
                放置到牌阵
              </Button>
            )}
            
            {selectedCard && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedCard(null)}
                className="bg-gray-800/50 border-gray-600 text-white hover:bg-gray-700/50"
              >
                取消选择
              </Button>
            )}
            
            <Button
              variant="outline"
              size="sm"
              onClick={toggleExpanded}
              className="bg-gray-800/50 border-gray-600 text-white hover:bg-gray-700/50"
            >
              {isExpanded ? (
                <>
                  <ChevronDown className="w-4 h-4 mr-1" />
                  收起
                </>
              ) : (
                <>
                  <ChevronUp className="w-4 h-4 mr-1" />
                  展开抽牌区
                </>
              )}
            </Button>
          </div>
        </div>
        
        {/* 卡牌展示区域 - 横向扑克牌式布局 */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="p-6">
                <div className="relative flex justify-center items-center h-48 overflow-x-auto">
                  <div className="relative flex items-center" style={{ width: `${Math.max(displayCards.length * 20 + 160, windowWidth - 100)}px` }}>
                    {displayCards.map((card, index) => {
                      const isSelected = selectedCard?.id === card.id;
                      const isHovered = hoveredCard === card.id;
                      const totalCards = displayCards.length;
                      const availableWidth = windowWidth - 200;
                      const cardSpacing = Math.min(20, Math.max(10, availableWidth / Math.max(totalCards - 1, 1)));
                      
                      return (
                        <motion.div
                          key={card.id}
                          initial={{ opacity: 0, y: 20, scale: 0.8 }}
                          animate={{ 
                            opacity: 1, 
                            y: isSelected ? -15 : isHovered ? -8 : 0,
                            scale: isSelected ? 1.1 : isHovered ? 1.05 : 1,
                            x: index * cardSpacing
                          }}
                          transition={{ 
                            duration: 0.3,
                            delay: index * 0.02
                          }}
                          className={cn(
                            'absolute cursor-pointer transition-all duration-300 tarot-card-container',
                            isSelected && 'ring-3 ring-gold-400 ring-offset-2 ring-offset-black/50',
                            isHovered && 'shadow-2xl shadow-purple-500/50'
                          )}
                          style={{
                            left: `${60 + index * cardSpacing}px`,
                            zIndex: isHovered ? 1000 : isSelected ? 500 : Math.max(10, totalCards - index + 10)
                          }}
                          onClick={() => handleCardClick(card)}
                          onHoverStart={() => handleCardHover(card.id)}
                          onHoverEnd={() => handleCardHover(null)}
                          whileTap={{ scale: 0.95 }}
                        >
                          <TarotCard
                            card={card}
                            isRevealed={false} // 背面朝上
                            size="medium"
                            className={cn(
                              'transition-all duration-300',
                              isSelected && 'brightness-110 border-gold-400 border-2',
                              isHovered && 'brightness-105 border-purple-400'
                            )}
                          />
                          
                          {/* 选择指示器 */}
                          {isSelected && (
                            <motion.div
                              initial={{ scale: 0, rotate: -180 }}
                              animate={{ scale: 1, rotate: 0 }}
                              className="absolute -top-3 -right-3 w-6 h-6 bg-gold-500 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-lg"
                            >
                              ✓
                            </motion.div>
                          )}
                          
                          {/* 悬浮时显示牌名 */}
                          {isHovered && (
                            <motion.div
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="absolute -top-14 left-1/2 transform -translate-x-1/2 tarot-card-tooltip"
                            >
                              <div className="bg-black/95 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap border border-gold-400/50 shadow-2xl backdrop-blur-sm">
                                {card.name}
                                <div className="text-xs text-gray-300 mt-1">
                                  点击选择此牌
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
                
                {/* 使用说明 */}
                <div className="mt-4 text-center">
                  <p className="text-xs text-gray-400">
                    点击卡牌选择，然后点击&ldquo;放置到牌阵&rdquo;按钮将其放入牌阵中。卡牌以背面展示，模拟真实抽牌体验。
                  </p>
                  {selectedCard && (
                    <p className="text-xs text-gold-400 mt-1">
                      已选择: {selectedCard.name} - 点击上方&ldquo;放置到牌阵&rdquo;按钮完成放置
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}