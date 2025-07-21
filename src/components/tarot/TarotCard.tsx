'use client';

import { motion } from 'framer-motion';
import { TarotCard as TarotCardType, DrawnCard } from '@/types/tarot';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface TarotCardProps {
  card?: TarotCardType;
  drawnCard?: DrawnCard;
  isRevealed?: boolean;
  isDragging?: boolean;
  isPlaceholder?: boolean;
  size?: 'tiny' | 'small' | 'medium' | 'large';
  className?: string;
  onClick?: () => void;
  onDoubleClick?: () => void;
}

const sizeClasses = {
  tiny: 'w-12 h-18',
  small: 'w-16 h-24',
  medium: 'w-24 h-36',
  large: 'w-32 h-48'
};

export function TarotCard({ 
  card, 
  drawnCard, 
  isRevealed = false, 
  isDragging = false,
  isPlaceholder = false,
  size = 'medium',
  className,
  onClick,
  onDoubleClick
}: TarotCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  const displayCard = drawnCard?.card || card;
  const isReversed = drawnCard?.isReversed || false;
  
  if (isPlaceholder) {
    return (
      <motion.div
        className={cn(
          'relative cursor-pointer select-none',
          'border-2 border-dashed border-purple-400/50 rounded-lg',
          'bg-purple-900/20 backdrop-blur-sm',
          'flex items-center justify-center',
          sizeClasses[size],
          className
        )}
        whileHover={{ scale: 1.02 }}
        onClick={onClick}
      >
        <div className="text-purple-400/60 text-xs text-center px-2">
          点击抽牌
        </div>
      </motion.div>
    );
  }
  
  return (
    <motion.div
      className={cn(
        'relative cursor-pointer select-none',
        'bg-gradient-to-b from-purple-900 to-purple-700',
        'border-2 border-gold-400 rounded-lg shadow-lg',
        'transform-gpu perspective-1000',
        isDragging && 'opacity-50 scale-105 z-50',
        sizeClasses[size],
        className
      )}
      whileHover={{ scale: isHovered ? 1.05 : 1 }}
      whileTap={{ scale: 0.95 }}
      animate={{
        rotateY: isRevealed ? 180 : 0,
        rotateZ: isReversed && isRevealed ? 180 : 0
      }}
      transition={{ 
        duration: 0.6,
        ease: 'easeInOut'
      }}
      onClick={onClick}
      onDoubleClick={onDoubleClick}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      style={{
        transformStyle: 'preserve-3d'
      }}
    >
      {/* 卡牌背面 */}
      <div 
        className="absolute inset-0 backface-hidden"
        style={{ backfaceVisibility: 'hidden' }}
      >
        <div className="w-full h-full bg-gradient-to-br from-purple-800 via-indigo-900 to-purple-900 rounded-lg relative overflow-hidden">
          {/* 背面装饰图案 */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative">
              {/* 中央圆形 */}
              <div className="w-12 h-12 border-2 border-gold-400 rounded-full relative">
                <div className="absolute inset-2 border border-gold-300 rounded-full" />
                <div className="absolute inset-4 bg-gold-400 rounded-full opacity-20" />
              </div>
              
              {/* 装饰线条 */}
              <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-px h-4 bg-gold-400" />
              <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 w-px h-4 bg-gold-400" />
              <div className="absolute -left-6 top-1/2 transform -translate-y-1/2 h-px w-4 bg-gold-400" />
              <div className="absolute -right-6 top-1/2 transform -translate-y-1/2 h-px w-4 bg-gold-400" />
            </div>
          </div>
          
          {/* 角落装饰 */}
          <div className="absolute top-2 left-2 w-3 h-3 border-l-2 border-t-2 border-gold-400" />
          <div className="absolute top-2 right-2 w-3 h-3 border-r-2 border-t-2 border-gold-400" />
          <div className="absolute bottom-2 left-2 w-3 h-3 border-l-2 border-b-2 border-gold-400" />
          <div className="absolute bottom-2 right-2 w-3 h-3 border-r-2 border-b-2 border-gold-400" />
        </div>
      </div>
      
      {/* 卡牌正面 */}
      {displayCard && (
        <div 
          className="absolute inset-0 backface-hidden"
          style={{ 
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)'
          }}
        >
          <div className="w-full h-full bg-white rounded-lg relative overflow-hidden">
            {/* 卡牌图片 */}
            <div className="absolute inset-1 rounded-md overflow-hidden">
              <img 
                src={displayCard.imageUrl} 
                alt={displayCard.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  // 如果图片加载失败，显示占位符
                  const target = e.target as HTMLImageElement;
                  target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDIwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjNEMxRDk1Ii8+Cjx0ZXh0IHg9IjEwMCIgeT0iMTUwIiBmaWxsPSIjRkZENzAwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LXNpemU9IjE0Ij7lm77niYfkuI3lrZjlnKg8L3RleHQ+Cjwvc3ZnPg==';
                }}
              />
            </div>
            
            {/* 卡牌名称 */}
            <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white p-1 rounded-b-lg">
              <p className="text-xs text-center font-medium truncate">
                {displayCard.name}
                {isReversed && (
                  <span className="ml-1 text-red-400">(逆位)</span>
                )}
              </p>
            </div>
            
            {/* 逆位指示器 */}
            {isReversed && (
              <div className="absolute top-1 right-1 bg-red-500 text-white text-xs px-1 py-0.5 rounded">
                逆
              </div>
            )}
            
            {/* 牌的类型指示 */}
            <div className="absolute top-1 left-1 text-xs">
              {displayCard.type === 'major' ? (
                <span className="bg-gold-500 text-white px-1 py-0.5 rounded text-xs">
                  大
                </span>
              ) : (
                <span className="bg-blue-500 text-white px-1 py-0.5 rounded text-xs">
                  小
                </span>
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* 悬停效果 */}
      {isHovered && (
        <motion.div
          className="absolute inset-0 bg-gold-400/20 rounded-lg pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        />
      )}
      
      {/* 拖拽指示器 */}
      {isDragging && (
        <motion.div
          className="absolute -inset-1 border-2 border-gold-400 rounded-lg"
          animate={{
            opacity: [0.5, 1, 0.5]
          }}
          transition={{
            duration: 1,
            repeat: Infinity
          }}
        />
      )}
    </motion.div>
  );
}

// 卡牌详情悬浮提示组件
export function TarotCardTooltip({ card, isReversed }: { card: TarotCardType; isReversed?: boolean }) {
  return (
    <div className="bg-black/90 text-white p-3 rounded-lg shadow-xl max-w-xs">
      <h3 className="font-bold text-sm mb-1">
        {card.name} {isReversed && '(逆位)'}
      </h3>
      <p className="text-xs text-gray-300 mb-2">{card.nameEn}</p>
      <p className="text-xs mb-2">
        {isReversed ? card.reversedMeaning : card.uprightMeaning}
      </p>
      <div className="flex flex-wrap gap-1">
        {card.keywords.map((keyword, index) => (
          <span 
            key={index}
            className="bg-purple-600 text-xs px-1 py-0.5 rounded"
          >
            {keyword}
          </span>
        ))}
      </div>
    </div>
  );
}