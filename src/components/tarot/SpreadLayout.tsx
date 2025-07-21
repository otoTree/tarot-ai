'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { TarotSpread } from '@/types/tarot';
import { PositionGrid } from './CardPosition';
import { useTarotGame } from '@/hooks/use-tarot-game';
import { useSettingsStore } from '@/store/settings-store';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, EyeOff } from 'lucide-react';

interface SpreadLayoutProps {
  spread: TarotSpread;
  className?: string;
}

export function SpreadLayout({ spread, className }: SpreadLayoutProps) {
  const [showSpreadInfo, setShowSpreadInfo] = useState(false);
  
  const {
    drawnCards,
    shuffledDeck,
    handleRemoveCard,
    handleToggleReverse,
    handleRevealCard,
    generateReading,
    gameStatus
  } = useTarotGame();
  
  const {} = useSettingsStore();
  
  const removeCard = (positionId: string) => {
    handleRemoveCard(positionId);
  };
  
  const toggleReverse = (positionId: string) => {
    handleToggleReverse(positionId);
  };
  

  
  // 计算牌阵的边界框
  const getBoundingBox = () => {
    if (spread.positions.length === 0) return { width: 500, height: 400 };
    
    const xs = spread.positions.map(p => p.x);
    const ys = spread.positions.map(p => p.y);
    
    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);
    
    // 增加更多边距，确保牌阵有足够的空间
    const cardWidth = 96; // w-24 = 96px
    const cardHeight = 144; // h-36 = 144px
    const padding = 150; // 增加边距
    
    return {
      width: Math.max(500, maxX - minX + cardWidth + padding),
      height: Math.max(400, maxY - minY + cardHeight + padding)
    };
  };
  
  const boundingBox = getBoundingBox();
  
  return (
    <div className={cn('flex flex-col space-y-6', className)}>
      {/* 牌阵信息头部 */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center space-x-4">
          <div>
            <h2 className="text-2xl font-bold text-white mb-1">
              {spread.name}
            </h2>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="text-purple-300 border-purple-400">
                {spread.difficulty}
              </Badge>
              <Badge variant="outline" className="text-blue-300 border-blue-400">
                {spread.category}
              </Badge>
              <span className="text-sm text-gray-400">
                {spread.positions.length} 张牌
              </span>
            </div>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowSpreadInfo(!showSpreadInfo)}
            className="text-purple-300 hover:text-purple-200"
          >
            {showSpreadInfo ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            {showSpreadInfo ? '隐藏说明' : '显示说明'}
          </Button>
        </div>
        

      </motion.div>
      
      {/* 牌阵说明 */}
      <AnimatePresence>
        {showSpreadInfo && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-purple-900/30 rounded-lg p-4 border border-purple-400/30"
          >
            <p className="text-gray-300 mb-3">{spread.description}</p>
            
            {spread.positions.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {spread.positions.map((position) => (
                  <div key={position.id} className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0" />
                    <div>
                      <span className="font-medium text-purple-300">
                        {position.name}:
                      </span>
                      <span className="text-gray-300 ml-1">
                        {position.meaning}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* 牌阵布局区域 */}
      <motion.div
        className="relative bg-gradient-to-br from-purple-900/20 to-blue-900/20 rounded-xl p-8 border border-purple-400/20"
        style={{
          minWidth: boundingBox.width,
          minHeight: boundingBox.height
        }}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* 背景装饰 */}
        <div className="absolute inset-0 overflow-hidden rounded-xl">
          <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-purple-500/10 rounded-full blur-xl" />
          <div className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-blue-500/10 rounded-full blur-xl" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-pink-500/5 rounded-full blur-2xl" />
        </div>
        
        {/* 牌阵网格 */}
        <div className="relative z-10">
          <PositionGrid
            positions={spread.positions}
            onRemoveCard={removeCard}
            onToggleReverse={toggleReverse}
            onRevealCard={handleRevealCard}
            className="w-full h-full"
          />
        </div>
        
        {/* 中心装饰（适用于某些牌阵） */}
        {spread.id === 'celtic-cross' && (
          <motion.div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 0.3, scale: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
          >
            <div className="w-64 h-64 border border-gold-400/30 rounded-full" />
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 border border-gold-400/20 rounded-full" />
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 border border-gold-400/10 rounded-full" />
          </motion.div>
        )}
        
        {/* 牌阵进度指示器 */}
        <motion.div
          className="absolute bottom-4 right-4 bg-black/50 rounded-lg p-3"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="text-sm text-gray-300 mb-1">
            进度: {drawnCards.length} / {spread.positions.length}
          </div>
          <div className="w-24 h-2 bg-gray-700 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
              initial={{ width: 0 }}
              animate={{ 
                width: `${(drawnCards.length / spread.positions.length) * 100}%` 
              }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </motion.div>
      </motion.div>
      
      {/* 牌阵状态信息 */}
      <motion.div
        className="flex items-center justify-between text-sm text-gray-400"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <div className="flex items-center space-x-4">
          <span>已抽取: {drawnCards.length} 张</span>
          <span>剩余: {shuffledDeck.length} 张</span>
          {drawnCards.some((card) => card.isReversed) && (
            <span className="text-red-400">
              逆位: {drawnCards.filter((card) => card.isReversed).length} 张
            </span>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          {gameStatus.canGenerateReading && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="flex items-center space-x-1 text-green-400"
            >
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span>可以生成解读</span>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

// 牌阵选择器组件
export function SpreadSelector({ 
  spreads, 
  selectedSpread, 
  onSelectSpread,
  className 
}: {
  spreads: TarotSpread[];
  selectedSpread?: TarotSpread;
  onSelectSpread: (spread: TarotSpread) => void;
  className?: string;
}) {
  return (
    <div className={cn('grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4', className)}>
      {spreads.map((spread) => (
        <motion.button
          key={spread.id}
          onClick={() => onSelectSpread(spread)}
          className={cn(
            'p-4 rounded-lg border-2 text-left transition-all duration-200',
            'hover:border-purple-400 hover:bg-purple-900/20',
            selectedSpread?.id === spread.id
              ? 'border-purple-400 bg-purple-900/30'
              : 'border-gray-600 bg-gray-900/20'
          )}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-bold text-white">{spread.name}</h3>
            <Badge variant="outline" className="text-xs">
              {spread.positions.length}
            </Badge>
          </div>
          
          <p className="text-sm text-gray-300 mb-3 line-clamp-2">
            {spread.description}
          </p>
          
          <div className="flex items-center space-x-2">
            <Badge variant="secondary" className="text-xs">
              {spread.difficulty}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {spread.category}
            </Badge>
          </div>
        </motion.button>
      ))}
    </div>
  );
}