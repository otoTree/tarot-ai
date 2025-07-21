'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { TarotCard } from './TarotCard';
import { CardPosition as CardPositionType } from '@/types/tarot';
import { useCardPosition, useCardDetails } from '@/hooks/use-tarot-game';
import { useSettingsStore } from '@/store/settings-store';
import { cn } from '@/lib/utils';
import { X, RotateCcw, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

interface CardPositionProps {
  position: CardPositionType;
  onRemoveCard?: (positionId: string) => void;
  onToggleReverse?: (positionId: string) => void;
  onRevealCard?: (positionId: string) => void;
  className?: string;
}

export function CardPosition({ 
  position, 
  onRemoveCard, 
  onToggleReverse,
  onRevealCard,
  className 
}: CardPositionProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const [showControls, setShowControls] = useState(false);
  
  const { drawnCard, hasCard } = useCardPosition(position.id);
  const cardDetails = useCardDetails(position.id);
  const { showPositionGuides, showCardMeanings } = useSettingsStore();
  
  const handleRemoveCard = () => {
    if (hasCard && onRemoveCard) {
      onRemoveCard(position.id);
    }
  };
  
  const handleToggleReverse = () => {
    if (hasCard && onToggleReverse) {
      onToggleReverse(position.id);
    }
  };
  
  const handleRevealCard = () => {
    if (hasCard && onRevealCard) {
      onRevealCard(position.id);
    }
  };
  
  return (
    <motion.div
      className={cn(
        'absolute group',
        className
      )}
      style={{
        left: position.x,
        top: position.y
      }}
      onHoverStart={() => setShowControls(true)}
      onHoverEnd={() => setShowControls(false)}
      layout
    >
      {/* 位置指示器 */}
      {showPositionGuides && (
        <motion.div
          className="absolute -top-8 left-1/2 transform -translate-x-1/2 z-10"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
        >
          <div className="bg-black/80 text-white px-2 py-1 rounded text-xs whitespace-nowrap">
            {position.name}
          </div>
        </motion.div>
      )}
      
      {/* 牌位区域 */}
      <motion.div
        className={cn(
          'relative w-24 h-36 rounded-lg transition-all duration-200',
          hasCard && 'cursor-pointer'
        )}
      >
        <AnimatePresence mode="wait">
          {hasCard && drawnCard ? (
            <motion.div
              key="card"
              initial={{ opacity: 0, scale: 0.8, rotateY: -90 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              exit={{ opacity: 0, scale: 0.8, rotateY: 90 }}
              transition={{ duration: 0.6 }}
              onHoverStart={() => setShowTooltip(true)}
              onHoverEnd={() => setShowTooltip(false)}
              onClick={!drawnCard.isRevealed ? handleRevealCard : undefined}
              className={!drawnCard.isRevealed ? 'cursor-pointer' : ''}
            >
              <TarotCard
                drawnCard={drawnCard}
                isRevealed={drawnCard.isRevealed}
                size="medium"
              />
              
              {/* 未翻开时的点击提示 */}
              {!drawnCard.isRevealed && (
                <motion.div
                  className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-lg"
                  animate={{
                    opacity: [0.5, 1, 0.5]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity
                  }}
                >
                  <span className="text-white text-xs font-medium bg-black/60 px-2 py-1 rounded">
                    点击翻开
                  </span>
                </motion.div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="placeholder"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={cn(
                'w-full h-full border-2 border-dashed rounded-lg',
                'flex flex-col items-center justify-center',
                'transition-colors duration-200',
                'border-purple-400/50 bg-purple-900/20 text-purple-400/60'
              )}
            >
              <div className="text-center px-2">
                <div className="text-xs font-medium mb-1">
                  {position.name}
                </div>
                <div className="text-xs opacity-60">
                  等待抽牌
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* 卡牌控制按钮 */}
        <AnimatePresence>
          {hasCard && showControls && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute -top-2 -right-2 flex space-x-1 z-20"
            >
              <Button
                size="sm"
                variant="outline"
                className="w-6 h-6 p-0 bg-blue-600 border-blue-500 hover:bg-blue-500"
                onClick={handleToggleReverse}
                title="翻转牌面"
              >
                <RotateCcw className="w-3 h-3" />
              </Button>
              
              <Button
                size="sm"
                variant="outline"
                className="w-6 h-6 p-0 bg-red-600 border-red-500 hover:bg-red-500"
                onClick={handleRemoveCard}
                title="移除卡牌"
              >
                <X className="w-3 h-3" />
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* 位置信息按钮 */}
        {showPositionGuides && (
          <motion.button
            className="absolute -bottom-2 -left-2 w-5 h-5 bg-purple-600 rounded-full flex items-center justify-center text-white hover:bg-purple-500 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowTooltip(!showTooltip)}
          >
            <Info className="w-3 h-3" />
          </motion.button>
        )}
      </motion.div>
      
      {/* 位置含义提示 */}
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 z-30"
          >
            <div className="bg-black/90 text-white p-3 rounded-lg shadow-xl max-w-xs">
              <h4 className="font-bold text-sm mb-1">{position.name}</h4>
              <p className="text-xs text-gray-300 mb-2">{position.meaning}</p>
              
              {cardDetails && showCardMeanings && (
                <div className="border-t border-gray-600 pt-2">
                  <p className="text-xs font-medium mb-1">
                    {cardDetails.card.name} ({cardDetails.orientation})
                  </p>
                  <p className="text-xs text-gray-300 mb-2">
                    {cardDetails.meaning}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {cardDetails.keywords.map((keyword, index) => (
                      <span 
                        key={index}
                        className="bg-purple-600 text-xs px-1 py-0.5 rounded"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* 连接线（用于某些牌阵） */}
      {position.id === 'present' && (
        <svg 
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"
          width="200" 
          height="200"
          style={{ zIndex: -1 }}
        >
          <defs>
            <radialGradient id="connectionGradient" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0" />
            </radialGradient>
          </defs>
          <circle 
            cx="100" 
            cy="100" 
            r="80" 
            fill="url(#connectionGradient)"
            className="animate-pulse"
          />
        </svg>
      )}
    </motion.div>
  );
}

// 牌位网格组件
export function PositionGrid({ 
  positions, 
  onRemoveCard, 
  onToggleReverse,
  onRevealCard,
  className 
}: {
  positions: CardPositionType[];
  onRemoveCard?: (positionId: string) => void;
  onToggleReverse?: (positionId: string) => void;
  onRevealCard?: (positionId: string) => void;
  className?: string;
}) {
  // 计算位置偏移，使牌阵居中
  const getPositionOffset = () => {
    if (positions.length === 0) return { offsetX: 0, offsetY: 0 };
    
    const xs = positions.map(p => p.x);
    const ys = positions.map(p => p.y);
    
    const minX = Math.min(...xs);
    const minY = Math.min(...ys);
    
    // 增加边距，让牌阵有更好的居中效果
    const offsetX = -minX + 80;
    const offsetY = -minY + 80;
    
    return { offsetX, offsetY };
  };
  
  const { offsetX, offsetY } = getPositionOffset();
  
  return (
    <div className={cn('relative', className)}>
      {positions.map((position) => (
        <CardPosition
          key={position.id}
          position={{
            ...position,
            x: position.x + offsetX,
            y: position.y + offsetY
          }}
          onRemoveCard={onRemoveCard}
          onToggleReverse={onToggleReverse}
          onRevealCard={onRevealCard}
        />
      ))}
    </div>
  );
}

// 牌位状态指示器
export function PositionStatus({ positionId }: { positionId: string }) {
  const { hasCard, drawnCard } = useCardPosition(positionId);
  
  return (
    <div className="flex items-center space-x-2">
      <div className={cn(
        'w-3 h-3 rounded-full',
        hasCard ? 'bg-green-500' : 'bg-gray-500'
      )} />
      <span className="text-sm text-gray-300">
        {hasCard ? drawnCard?.card.name : '空位'}
      </span>
      {hasCard && drawnCard?.isReversed && (
        <span className="text-xs text-red-400">(逆位)</span>
      )}
    </div>
  );
}