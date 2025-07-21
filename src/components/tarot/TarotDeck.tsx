'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { TarotCard } from './TarotCard';
import { useGameStore } from '@/store/game-store';
import { useSettingsStore } from '@/store/settings-store';
import { useTarotGame } from '@/hooks/use-tarot-game';
import { MousePointer } from 'lucide-react';

import { cn } from '@/lib/utils';
import { useState } from 'react';

interface TarotDeckProps {
  className?: string;
  onCardDraw?: () => void;
}

export function TarotDeck({ className, onCardDraw }: TarotDeckProps) {
  const { 
    shuffledDeck, 
    isShuffling, 
    gamePhase,
    currentSpread,
    drawnCards,
  } = useGameStore();
  
  const { shuffleAnimation } = useSettingsStore();
  const { handleDrawCard } = useTarotGame();
  const [isDrawing, setIsDrawing] = useState(false);
  

  
  // 点击抽牌
  const handleClickDraw = async () => {
    if (!currentSpread || shuffledDeck.length === 0 || isShuffling) return;
    
    // 找到下一个空的牌位
    const nextEmptyPosition = currentSpread.positions.find(pos => 
      !drawnCards.some(card => card.position === pos.id)
    );
    
    if (nextEmptyPosition) {
      setIsDrawing(true);
      await new Promise(resolve => setTimeout(resolve, 300)); // 抽牌动画
      handleDrawCard(nextEmptyPosition.id);
      setIsDrawing(false);
      onCardDraw?.();
    }
  };
  
  return (
    <div className={cn('flex flex-col items-center space-y-4', className)}>
      {/* 牌堆标题 */}
      <div className="text-center">
        <h3 className="text-lg font-semibold text-white mb-1">牌堆</h3>
        <p className="text-sm text-gray-300">
          剩余 {shuffledDeck.length} 张牌
        </p>
      </div>
      
      {/* 牌堆区域 */}
      <div className="relative">
        <AnimatePresence>
          {shuffledDeck.length > 0 ? (
            <motion.div
              className="relative cursor-pointer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleClickDraw}
            >
              {/* 牌堆效果 - 多层卡牌 */}
              <div className="relative">
                {/* 底层卡牌 */}
                {[...Array(Math.min(5, shuffledDeck.length))].map((_, index) => (
                  <motion.div
                    key={index}
                    className="absolute"
                    style={{
                      zIndex: index,
                      transform: `translate(${index * 2}px, ${index * 2}px) rotate(${index * 2 - 4}deg)`
                    }}
                    animate={isShuffling && shuffleAnimation ? {
                      rotate: [index * 2 - 4, index * 2 - 4 + 360],
                      scale: [1, 1.1, 1]
                    } : isDrawing ? {
                      y: [-10, 0],
                      scale: [1.1, 1]
                    } : {}}
                    transition={{
                      duration: isShuffling ? 1.5 : 0.3,
                      repeat: isShuffling ? Infinity : 0,
                      ease: 'easeInOut'
                    }}
                  >
                    <TarotCard 
                      size="medium"
                    />
                  </motion.div>
                ))}
                
                {/* 顶层可点击卡牌 */}
                <TarotCard 
                  size="medium"
                  className="relative z-10"
                />
              </div>
              
              {/* 点击提示 */}
              {!isDrawing && shuffledDeck.length > 0 && gamePhase === 'drawing' && (
                <motion.div
                  className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs text-gold-400 whitespace-nowrap flex items-center gap-1"
                  animate={{
                    opacity: [0.5, 1, 0.5]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity
                  }}
                >
                  <MousePointer className="w-3 h-3" />
                  点击抽牌
                </motion.div>
              )}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-24 h-36 border-2 border-dashed border-gray-500 rounded-lg flex items-center justify-center"
            >
              <span className="text-gray-500 text-xs text-center">
                牌堆为空
              </span>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* 洗牌动画效果 */}
        {isShuffling && (
          <motion.div
            className="absolute inset-0 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {[...Array(8)].map((_, index) => (
              <motion.div
                key={index}
                className="absolute w-6 h-9 bg-purple-400 rounded opacity-60"
                animate={{
                  x: [0, Math.cos(index * Math.PI / 4) * 40, 0],
                  y: [0, Math.sin(index * Math.PI / 4) * 40, 0],
                  rotate: [0, 360, 0],
                  scale: [0, 1, 0]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: index * 0.1
                }}
                style={{
                  left: '50%',
                  top: '50%',
                  marginLeft: '-12px',
                  marginTop: '-18px'
                }}
              />
            ))}
          </motion.div>
        )}
      </div>
      

      
      {/* 游戏状态提示 */}
      <div className="text-center">
        {gamePhase === 'setup' && (
          <p className="text-sm text-gray-400">
            请先选择牌阵
          </p>
        )}
        {gamePhase === 'drawing' && shuffledDeck.length === 0 && (
          <p className="text-sm text-yellow-400">
            请先洗牌
          </p>
        )}
        {gamePhase === 'drawing' && shuffledDeck.length > 0 && (
          <p className="text-sm text-green-400">
            可以开始抽牌
          </p>
        )}
        {gamePhase === 'reading' && (
          <p className="text-sm text-blue-400">
            抽牌完成，可以开始解读
          </p>
        )}
      </div>
    </div>
  );
}

// 牌堆统计信息组件
export function DeckStats() {
  const { shuffledDeck, drawnCards, currentSpread } = useGameStore();
  
  const totalCards = 78;
  const remainingCards = shuffledDeck.length;
  const drawnCount = drawnCards.length;
  const requiredCards = currentSpread?.positions.length || 0;
  
  return (
    <div className="bg-black/30 rounded-lg p-3 space-y-2">
      <h4 className="text-sm font-semibold text-white">牌堆统计</h4>
      
      <div className="space-y-1 text-xs">
        <div className="flex justify-between text-gray-300">
          <span>总牌数:</span>
          <span>{totalCards}</span>
        </div>
        
        <div className="flex justify-between text-gray-300">
          <span>剩余:</span>
          <span className={remainingCards === 0 ? 'text-red-400' : 'text-green-400'}>
            {remainingCards}
          </span>
        </div>
        
        <div className="flex justify-between text-gray-300">
          <span>已抽取:</span>
          <span className="text-blue-400">{drawnCount}</span>
        </div>
        
        {currentSpread && (
          <div className="flex justify-between text-gray-300">
            <span>需要:</span>
            <span className={drawnCount >= requiredCards ? 'text-green-400' : 'text-yellow-400'}>
              {drawnCount}/{requiredCards}
            </span>
          </div>
        )}
      </div>
      
      {/* 进度条 */}
      {currentSpread && (
        <div className="mt-2">
          <div className="w-full bg-gray-700 rounded-full h-2">
            <motion.div
              className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ 
                width: `${(drawnCount / requiredCards) * 100}%` 
              }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <p className="text-xs text-gray-400 mt-1 text-center">
            进度: {Math.round((drawnCount / requiredCards) * 100)}%
          </p>
        </div>
      )}
    </div>
  );
}