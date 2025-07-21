'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useTarotGame } from '@/hooks/use-tarot-game';
import { useChat } from '@/hooks/use-chat';
import { useSettingsStore } from '@/store/settings-store';
import { getAllSpreads } from '@/lib/spreads';
import { buildCardContext } from '@/lib/ai-service';
import { TarotSpread } from '@/types/tarot';
import { ChatMessage } from '@/types/chat';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

import { SpreadLayout, SpreadSelector } from '@/components/tarot/SpreadLayout';
import { DrawnCardsDisplay } from '@/components/tarot/DrawnCardsDisplay';
import { ReadingDisplay } from '@/components/tarot/ReadingDisplay';
import { ChatInterface } from '@/components/chat/ChatInterface';
import { HistoryPanel } from '@/components/history/HistoryPanel';
import { SettingsPanel } from '@/components/settings/SettingsPanel';
import { 
  Sparkles, 
  MessageCircle, 
  History, 
  Settings, 
  Menu, 
  X, 
  ChevronRight,
  RotateCcw
} from 'lucide-react';
import { toast } from 'react-hot-toast';

type GamePhase = 'setup' | 'playing' | 'reading' | 'chat';
type SidePanel = 'none' | 'chat' | 'history' | 'settings';

export function GamePage() {
  const [gamePhase, setGamePhase] = useState<GamePhase>('setup');
  const [sidePanel, setSidePanel] = useState<SidePanel>('none');
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  
  const {
    currentSpread,
    drawnCards,
    sessionId,
    gameStatus,
    startNewGame,
    generateReading,
    handleResetGame
  } = useTarotGame();
  
  const {
    currentConversation,
    createConversation: handleCreateConversation,
    switchConversation: handleSwitchConversation
  } = useChat();
  
  const { shuffleAnimation: showAnimations, sidebarCollapsed: compactMode } = useSettingsStore();
  
  const spreads = getAllSpreads();
  const currentReading = undefined; // TODO: 从 store 获取当前解读
  const isReadingReady = gameStatus.canGenerateReading;
  
  useEffect(() => {
    // 根据游戏状态自动切换阶段
    if (!currentSpread) {
      setGamePhase('setup');
    } else if (drawnCards.length === 0) {
      setGamePhase('playing');
    } else if (currentReading) {
      setGamePhase('reading');
    } else if (isReadingReady) {
      setGamePhase('playing');
    }
  }, [currentSpread, drawnCards.length, currentReading, isReadingReady]);
  
  const handleStartGame = (spread: TarotSpread) => {
    startNewGame(spread);
    setGamePhase('playing');
    toast.success(`开始 ${spread.name} 游戏`);
  };
  
  const handleStartChat = async () => {
    if (!currentConversation) {
      const conversationId = await handleCreateConversation(
        sessionId,
        `${currentSpread?.name} - 塔罗解读对话`
      );
      if (conversationId) {
        await handleSwitchConversation(conversationId);
      }
    }
    setSidePanel('chat');
    setGamePhase('chat');
  };
  
  const handleResetGameLocal = () => {
    handleResetGame();
    setGamePhase('setup');
    setSidePanel('none');
  };
  
  const toggleSidePanel = (panel: SidePanel) => {
    setSidePanel(sidePanel === panel ? 'none' : panel);
  };
  
  return (
    <div className="h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 overflow-hidden">
      {/* 背景装饰 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-500/5 rounded-full blur-3xl" />
      </div>
      
      {/* 主布局 */}
      <div className="relative z-10 h-full flex">
        {/* 主内容区 */}
        <div className={cn(
          'flex-1 flex flex-col transition-all duration-300',
          sidePanel !== 'none' && 'mr-96'
        )}>
          {/* 顶部导航栏 */}
          <motion.header
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              'flex items-center justify-between p-4 bg-black/20 backdrop-blur-sm border-b border-white/10',
              compactMode && 'p-2'
            )}
          >
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-6 h-6 text-purple-400" />
                <h1 className="text-xl font-bold text-white">
                  塔罗 AI
                </h1>
              </div>
              
              {currentSpread && (
                <div className="flex items-center space-x-2">
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                  <Badge variant="outline" className="text-purple-300 border-purple-400">
                    {currentSpread.name}
                  </Badge>
                  <Badge variant="secondary">
                    {drawnCards.length} / {currentSpread.positions.length}
                  </Badge>
                </div>
              )}
            </div>
            
            <div className="flex items-center space-x-2">
              {/* 游戏控制按钮 */}
              {gamePhase !== 'setup' && (
                <div className="flex items-center space-x-2">
                  {isReadingReady && (
                    <Button
                      onClick={handleStartChat}
                      className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500"
                    >
                      <Sparkles className="w-4 h-4 mr-2" />
                      开始对话
                    </Button>
                  )}
                  
                  <Button
                    onClick={handleResetGameLocal}
                    variant="outline"
                    className="border-gray-400 text-gray-300 hover:bg-gray-600"
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    重新开始
                  </Button>
                </div>
              )}
              
              {/* 侧边栏切换按钮 */}
              <div className="flex items-center space-x-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleSidePanel('chat')}
                  className={cn(
                    'text-gray-400 hover:text-white',
                    sidePanel === 'chat' && 'bg-blue-600 text-white'
                  )}
                >
                  <MessageCircle className="w-4 h-4" />
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleSidePanel('history')}
                  className={cn(
                    'text-gray-400 hover:text-white',
                    sidePanel === 'history' && 'bg-green-600 text-white'
                  )}
                >
                  <History className="w-4 h-4" />
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleSidePanel('settings')}
                  className={cn(
                    'text-gray-400 hover:text-white',
                    sidePanel === 'settings' && 'bg-purple-600 text-white'
                  )}
                >
                  <Settings className="w-4 h-4" />
                </Button>
              </div>
              
              {/* 移动端菜单按钮 */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="md:hidden text-gray-400 hover:text-white"
              >
                {showMobileMenu ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </Button>
            </div>
          </motion.header>
          
          {/* 主游戏区域 */}
          <div className="flex-1 overflow-hidden">
            <AnimatePresence mode="wait">
              {gamePhase === 'setup' && (
                <SetupPhase
                  spreads={spreads}
                  onStartGame={handleStartGame}
                  showAnimations={showAnimations}
                />
              )}
              
              {gamePhase === 'playing' && currentSpread && (
                <PlayingPhase
                  spread={currentSpread}
                  showAnimations={showAnimations}
                />
              )}
              
              {(gamePhase === 'reading' || gamePhase === 'chat') && currentSpread && (
                <ReadingPhase
                  spread={currentSpread}
                  reading={currentReading}
                  onStartChat={handleStartChat}
                  onRegenerateReading={generateReading}
                  showAnimations={showAnimations}
                />
              )}
            </AnimatePresence>
          </div>
        </div>
        
        {/* 侧边面板 */}
        <AnimatePresence>
          {sidePanel !== 'none' && (
            <motion.div
              initial={{ x: 384, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 384, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="fixed right-0 top-0 h-full w-96 bg-gray-900/95 backdrop-blur-sm border-l border-white/10 z-50"
            >
              <div className="h-full flex flex-col">
                {/* 侧边栏头部 */}
                <div className="flex items-center justify-between p-4 border-b border-gray-700/50">
                  <h3 className="font-bold text-white">
                    {sidePanel === 'chat' && '对话'}
                    {sidePanel === 'history' && '历史记录'}
                    {sidePanel === 'settings' && '设置'}
                  </h3>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSidePanel('none')}
                    className="text-gray-400 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                
                {/* 侧边栏内容 */}
                <div className="flex-1 overflow-hidden">
                  {sidePanel === 'chat' && (
                    <ChatInterface 
                      conversation={currentConversation}
                      cardContext={drawnCards.length > 0 && currentSpread ? buildCardContext(drawnCards, currentSpread.name) : undefined}
                    />
                  )}
                  
                  {sidePanel === 'history' && (
                    <HistoryPanel
                      onSelectSession={async (session) => {
                        // 基于游戏会话创建新对话
                        const conversationTitle = `${session.spreadId} - 塔罗解读对话`;
                        const conversationId = await handleCreateConversation(
                          session.id,
                          conversationTitle
                        );
                        if (conversationId) {
                          await handleSwitchConversation(conversationId);
                          setSidePanel('chat');
                          toast.success('已为该游戏记录创建对话');
                        }
                      }}
                      onSelectConversation={(conversation) => {
                         handleSwitchConversation(conversation.id);
                         setSidePanel('chat');
                       }}
                    />
                  )}
                  
                  {sidePanel === 'settings' && (
                    <SettingsPanel />
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* 移动端菜单覆盖层 */}
        <AnimatePresence>
          {showMobileMenu && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
              onClick={() => setShowMobileMenu(false)}
            >
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                className="absolute right-0 top-0 h-full w-80 bg-gray-900 border-l border-white/10"
                onClick={(e) => e.stopPropagation()}
              >
                {/* 移动端菜单内容 */}
                <div className="p-4">
                  <h3 className="font-bold text-white mb-4">菜单</h3>
                  
                  <div className="space-y-2">
                    <Button
                      variant="ghost"
                      className="w-full justify-start"
                      onClick={() => {
                        toggleSidePanel('chat');
                        setShowMobileMenu(false);
                      }}
                    >
                      <MessageCircle className="w-4 h-4 mr-2" />
                      对话
                    </Button>
                    
                    <Button
                      variant="ghost"
                      className="w-full justify-start"
                      onClick={() => {
                        toggleSidePanel('history');
                        setShowMobileMenu(false);
                      }}
                    >
                      <History className="w-4 h-4 mr-2" />
                      历史记录
                    </Button>
                    
                    <Button
                      variant="ghost"
                      className="w-full justify-start"
                      onClick={() => {
                        toggleSidePanel('settings');
                        setShowMobileMenu(false);
                      }}
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      设置
                    </Button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// 设置阶段组件
function SetupPhase({ 
  spreads, 
  onStartGame, 
  showAnimations 
}: {
  spreads: TarotSpread[];
  onStartGame: (spread: TarotSpread) => void;
  showAnimations: boolean;
}) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  
  const categories = ['all', ...new Set(spreads.map(s => s.category))];
  const difficulties = ['all', ...new Set(spreads.map(s => s.difficulty))];
  
  const filteredSpreads = spreads.filter(spread => {
    const categoryMatch = selectedCategory === 'all' || spread.category === selectedCategory;
    const difficultyMatch = selectedDifficulty === 'all' || spread.difficulty === selectedDifficulty;
    return categoryMatch && difficultyMatch;
  });
  
  return (
    <motion.div
      key="setup"
      initial={showAnimations ? { opacity: 0, y: 20 } : false}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="h-full overflow-auto p-6"
    >
      <div className="max-w-6xl mx-auto">
        {/* 欢迎区域 */}
        <div className="text-center mb-8">
          <motion.h2
            initial={showAnimations ? { opacity: 0, y: 20 } : false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-4xl font-bold text-white mb-4"
          >
            欢迎来到塔罗 AI
          </motion.h2>
          
          <motion.p
            initial={showAnimations ? { opacity: 0, y: 20 } : false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-xl text-gray-300 mb-6"
          >
            选择一个牌阵开始你的塔罗之旅
          </motion.p>
        </div>
        
        {/* 筛选器 */}
        <motion.div
          initial={showAnimations ? { opacity: 0, y: 20 } : false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-wrap items-center justify-center gap-4 mb-8"
        >
          <div className="flex items-center space-x-2">
            <span className="text-gray-300">类别:</span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-gray-800 border border-gray-600 rounded px-3 py-1 text-white"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? '全部' : category}
                </option>
              ))}
            </select>
          </div>
          
          <div className="flex items-center space-x-2">
            <span className="text-gray-300">难度:</span>
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="bg-gray-800 border border-gray-600 rounded px-3 py-1 text-white"
            >
              {difficulties.map(difficulty => (
                <option key={difficulty} value={difficulty}>
                  {difficulty === 'all' ? '全部' : difficulty}
                </option>
              ))}
            </select>
          </div>
        </motion.div>
        
        {/* 牌阵选择器 */}
        <motion.div
          initial={showAnimations ? { opacity: 0, y: 20 } : false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <SpreadSelector
            spreads={filteredSpreads}
            onSelectSpread={onStartGame}
          />
        </motion.div>
      </div>
    </motion.div>
  );
}

// 游戏阶段组件
function PlayingPhase({ 
  spread, 
  showAnimations 
}: {
  spread: TarotSpread;
  showAnimations: boolean;
}) {
  
  return (
    <motion.div
      key="playing"
      initial={showAnimations ? { opacity: 0, scale: 0.95 } : false}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      className="h-full flex flex-col"
    >
      <div className="flex-1 flex">
        {/* 牌阵区域 */}
        <div className="flex-1 p-6 overflow-auto">
          <SpreadLayout spread={spread} />
        </div>
      </div>
      
      {/* 已抽取的牌展示区域 */}
      <DrawnCardsDisplay />
    </motion.div>
  );
}

// 解读阶段组件
function ReadingPhase({ 
  spread, 
  reading, 
  onStartChat, 
  onRegenerateReading, 
  showAnimations 
}: {
  spread: TarotSpread;
  reading: ChatMessage | undefined;
  onStartChat: () => void;
  onRegenerateReading: () => void;
  showAnimations: boolean;
}) {
  const { drawnCards } = useTarotGame();
  
  return (
    <motion.div
      key="reading"
      initial={showAnimations ? { opacity: 0, y: 20 } : false}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="h-full overflow-auto p-6"
    >
      <div className="max-w-4xl mx-auto">
        <ReadingDisplay
          drawnCards={drawnCards}
          spread={spread}
          reading={reading}
          onRegenerateReading={onRegenerateReading}
          onStartChat={onStartChat}
        />
      </div>
    </motion.div>
  );
}