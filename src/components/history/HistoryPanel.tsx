'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { GameSession } from '@/types/game';
import { ChatConversation } from '@/types/chat';
import { useHistory, useHistoryFilter } from '@/hooks/use-history';
import { useSettingsStore } from '@/store/settings-store';
import { tarotSpreads } from '@/lib/spreads';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Search, 
  Filter, 
  Trash2, 
  Download, 
  Upload, 
  Calendar, 
  Clock, 
  MessageCircle, 
  Sparkles, 
  Eye,
  Star,
  Archive
} from 'lucide-react';
import { toast } from 'react-hot-toast';

type HistoryType = 'sessions' | 'conversations' | 'all';
type SortBy = 'date' | 'name' | 'type';
type SortOrder = 'asc' | 'desc';

interface HistoryPanelProps {
  onSelectSession?: (session: GameSession) => void;
  onSelectConversation?: (conversation: ChatConversation) => void;
  className?: string;
}

export function HistoryPanel({
  onSelectSession,
  onSelectConversation,
  className
}: HistoryPanelProps) {
  const [historyType, setHistoryType] = useState<HistoryType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortBy>('date');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [showFilters, setShowFilters] = useState(false);
  
  const {
    sessions,
    conversations,
    isLoading,
    deleteSession,
    deleteConversation,
    clearAllHistory,
    exportHistory,
    importHistory,
    getStatistics
  } = useHistory();
  
  const {
    filteredSessions,
    filteredConversations,
    totalCount
  } = useHistoryFilter({
    sessions,
    conversations,
    searchQuery,
    historyType,
    sortBy,
    sortOrder
  });
  
  const { showAnimations } = useSettingsStore();
  const stats = getStatistics();
  
  const handleDeleteSession = async (sessionId: string) => {
    try {
      await deleteSession(sessionId);
      toast.success('游戏记录已删除');
    } catch (error) {
      toast.error('删除失败');
    }
  };
  
  const handleDeleteConversation = async (conversationId: string) => {
    try {
      await deleteConversation(conversationId);
      toast.success('对话记录已删除');
    } catch (error) {
      toast.error('删除失败');
    }
  };
  
  const handleClearAll = async () => {
    if (confirm('确定要清空所有历史记录吗？此操作不可恢复。')) {
      try {
        await clearAllHistory();
        toast.success('历史记录已清空');
      } catch (error) {
        toast.error('清空失败');
      }
    }
  };
  
  const handleExport = async () => {
    try {
      await exportHistory();
      toast.success('历史记录已导出');
    } catch (error) {
      toast.error('导出失败');
    }
  };
  
  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        await importHistory(file);
        toast.success('历史记录已导入');
      } catch (error) {
        toast.error('导入失败');
      }
    }
  };
  
  return (
    <div className={cn('flex flex-col h-full', className)}>
      {/* 头部控制区 */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-4 border-b border-gray-700/50 bg-gray-900/50"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white">历史记录</h2>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="text-gray-400 hover:text-white"
            >
              <Filter className="w-4 h-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleExport}
              className="text-gray-400 hover:text-white"
            >
              <Download className="w-4 h-4" />
            </Button>
            
            <label className="cursor-pointer">
              <input
                type="file"
                accept=".json"
                onChange={handleImport}
                className="hidden"
              />
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-white"
                asChild
              >
                <span>
                  <Upload className="w-4 h-4" />
                </span>
              </Button>
            </label>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearAll}
              className="text-red-400 hover:text-red-300"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
        
        {/* 搜索栏 */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="搜索历史记录..."
            className="pl-10 bg-gray-800/50 border-gray-600 text-white placeholder-gray-400"
          />
        </div>
        

        
        {/* 高级筛选 */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="border-t border-gray-700/50 pt-4"
            >
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-400">排序:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as SortBy)}
                    className="bg-gray-800 border border-gray-600 rounded px-2 py-1 text-sm text-white"
                  >
                    <option value="date">日期</option>
                    <option value="name">名称</option>
                    <option value="type">类型</option>
                  </select>
                </div>
                
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-400">顺序:</span>
                  <select
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value as SortOrder)}
                    className="bg-gray-800 border border-gray-600 rounded px-2 py-1 text-sm text-white"
                  >
                    <option value="desc">降序</option>
                    <option value="asc">升序</option>
                  </select>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* 统计信息 */}
        <div className="flex items-center justify-between text-sm text-gray-400 mt-4">
          <span>共 {totalCount} 条记录</span>
          <div className="flex items-center space-x-4">
            <span>游戏: {stats.totalSessions}</span>
            <span>对话: {stats.totalConversations}</span>
          </div>
        </div>
      </motion.div>
      
      {/* 历史记录列表 */}
      <ScrollArea className="flex-1 h-0">
        <div className="p-4 space-y-3">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <motion.div
                className="w-6 h-6 border-2 border-purple-400 border-t-transparent rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              />
            </div>
          ) : (
            <AnimatePresence>
              {/* 游戏记录 */}
              {(historyType === 'all' || historyType === 'sessions') &&
                filteredSessions.map((session, index) => (
                  <SessionItem
                    key={session.id}
                    session={session}
                    index={index}
                    onSelect={onSelectSession}
                    onDelete={handleDeleteSession}
                    showAnimations={showAnimations}
                  />
                ))
              }
              
              {/* 对话记录 */}
              {(historyType === 'all' || historyType === 'conversations') &&
                filteredConversations.map((conversation, index) => (
                  <ConversationItem
                    key={conversation.id}
                    conversation={conversation}
                    index={index + filteredSessions.length}
                    onSelect={onSelectConversation}
                    onDelete={handleDeleteConversation}
                    showAnimations={showAnimations}
                  />
                ))
              }
              
              {/* 空状态 */}
              {totalCount === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-12"
                >
                  <Archive className="w-12 h-12 mx-auto mb-4 text-gray-500 opacity-50" />
                  <p className="text-gray-500">
                    {searchQuery ? '没有找到匹配的记录' : '还没有历史记录'}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}

// 游戏记录项组件
function SessionItem({
  session,
  index,
  onSelect,
  onDelete,
  showAnimations
}: {
  session: GameSession;
  index: number;
  onSelect?: (session: GameSession) => void;
  onDelete: (sessionId: string) => void;
  showAnimations: boolean;
}) {
  const [showActions, setShowActions] = useState(false);
  
  return (
    <motion.div
      initial={showAnimations ? { opacity: 0, x: -20 } : false}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 rounded-lg p-4 border border-purple-400/20 hover:border-purple-400/40 transition-all duration-200 group cursor-pointer"
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
      onClick={() => onSelect?.(session)}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <h4 className="font-medium text-white">
              {tarotSpreads.find(s => s.id === session.spreadId)?.name || '未知牌阵'} - 游戏记录
            </h4>
            <Badge variant="outline" className="text-xs text-purple-300 border-purple-400">
              {session.drawnCards.length} 张牌
            </Badge>
          </div>
          
          <div className="text-sm text-gray-300 mb-2">
            {session.userQuestion || '塔罗牌游戏记录'}
          </div>
          
          <div className="flex items-center space-x-4 text-xs text-gray-400">
            <div className="flex items-center space-x-1">
              <Calendar className="w-3 h-3" />
              <span>{new Date(session.createdAt).toLocaleDateString()}</span>
            </div>
            
            <div className="flex items-center space-x-1">
              <Clock className="w-3 h-3" />
              <span>{new Date(session.createdAt).toLocaleTimeString()}</span>
            </div>
            
            {session.aiReading && (
              <Badge variant="secondary" className="text-xs">
                已解读
              </Badge>
            )}
          </div>
        </div>
        
        <AnimatePresence>
          {showActions && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex items-center space-x-1"
            >
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelect?.(session);
                }}
                className="w-8 h-8 p-0 text-blue-400 hover:text-blue-300 hover:bg-blue-500/20"
              >
                <Eye className="w-4 h-4" />
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  // 添加到收藏
                }}
                className="w-8 h-8 p-0 text-yellow-400 hover:text-yellow-300 hover:bg-yellow-500/20"
              >
                <Star className="w-4 h-4" />
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(session.id);
                }}
                className="w-8 h-8 p-0 text-red-400 hover:text-red-300 hover:bg-red-500/20"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

// 对话记录项组件
function ConversationItem({
  conversation,
  index,
  onSelect,
  onDelete,
  showAnimations
}: {
  conversation: ChatConversation;
  index: number;
  onSelect?: (conversation: ChatConversation) => void;
  onDelete: (conversationId: string) => void;
  showAnimations: boolean;
}) {
  const [showActions, setShowActions] = useState(false);
  
  return (
    <motion.div
      initial={showAnimations ? { opacity: 0, x: -20 } : false}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      className="bg-gradient-to-r from-indigo-900/20 to-purple-900/20 rounded-lg p-4 border border-indigo-400/20 hover:border-indigo-400/40 transition-all duration-200 group cursor-pointer"
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
      onClick={() => onSelect?.(conversation)}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <MessageCircle className="w-4 h-4 text-indigo-400" />
            <h4 className="font-medium text-white">
              {conversation.title || '塔罗对话'}
            </h4>
            <Badge variant="outline" className="text-xs text-indigo-300 border-indigo-400">
              对话记录
            </Badge>
          </div>
          
          <div className="text-sm text-gray-300 mb-2 line-clamp-2">
            {conversation.lastMessage || '开始新的对话...'}
          </div>
          
          <div className="flex items-center space-x-4 text-xs text-gray-400">
            <div className="flex items-center space-x-1">
              <Calendar className="w-3 h-3" />
              <span>{new Date(conversation.updatedAt).toLocaleDateString()}</span>
            </div>
            
            <div className="flex items-center space-x-1">
              <Clock className="w-3 h-3" />
              <span>{new Date(conversation.updatedAt).toLocaleTimeString()}</span>
            </div>
          </div>
        </div>
        
        <AnimatePresence>
          {showActions && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex items-center space-x-1"
            >
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelect?.(conversation);
                }}
                className="w-8 h-8 p-0 text-blue-400 hover:text-blue-300 hover:bg-blue-500/20"
              >
                <Eye className="w-4 h-4" />
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  // 添加到收藏
                }}
                className="w-8 h-8 p-0 text-yellow-400 hover:text-yellow-300 hover:bg-yellow-500/20"
              >
                <Star className="w-4 h-4" />
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(conversation.id);
                }}
                className="w-8 h-8 p-0 text-red-400 hover:text-red-300 hover:bg-red-500/20"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}