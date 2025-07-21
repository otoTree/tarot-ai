import { useCallback, useEffect, useState, useMemo } from 'react';
import { db } from '@/lib/database';
import { GameSession } from '@/types/game';
import { ChatConversation } from '@/types/chat';
import { useSettingsStore } from '@/store/settings-store';
import { tarotSpreads } from '@/lib/spreads';
import { toast } from 'react-hot-toast';

export function useHistory() {
  const [gameSessions, setGameSessions] = useState<GameSession[]>([]);
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { saveHistory, autoDeleteOldSessions, sessionRetentionDays } = useSettingsStore();

  // 加载游戏会话历史
  const loadGameSessions = useCallback(async (limit?: number) => {
    if (!saveHistory) {
      setGameSessions([]);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      const sessions = await db.getRecentGameSessions(limit);
      setGameSessions(sessions);
    } catch (error) {
      console.error('加载游戏会话失败:', error);
      setError('加载历史记录失败');
      toast.error('加载历史记录失败');
    } finally {
      setIsLoading(false);
    }
  }, [saveHistory]);

  // 加载对话历史
  const loadConversations = useCallback(async (sessionId?: string) => {
    if (!saveHistory) {
      setConversations([]);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      let conversations: ChatConversation[];
      if (sessionId) {
        conversations = await db.getConversationsBySession(sessionId);
      } else {
        conversations = await db.getAllConversations();
      }
      
      setConversations(conversations);
    } catch (error) {
      console.error('加载对话历史失败:', error);
      setError('加载对话历史失败');
      toast.error('加载对话历史失败');
    } finally {
      setIsLoading(false);
    }
  }, [saveHistory]);

  // 删除游戏会话
  const deleteGameSession = useCallback(async (sessionId: string) => {
    try {
      await db.deleteGameSession(sessionId);
      
      setGameSessions(prev => prev.filter(session => session.id !== sessionId));
      toast.success('会话已删除');
    } catch (error) {
      console.error('删除会话失败:', error);
      toast.error('删除会话失败');
    }
  }, []);

  // 删除对话
  const deleteConversation = useCallback(async (conversationId: string) => {
    try {
      await db.deleteConversation(conversationId);
      setConversations(prev => prev.filter(conv => conv.id !== conversationId));
      toast.success('对话已删除');
    } catch (error) {
      console.error('删除对话失败:', error);
      toast.error('删除对话失败');
    }
  }, []);

  // 清空所有历史记录
  const clearAllHistory = useCallback(async () => {
    try {
      await db.clearAllData();
      
      setGameSessions([]);
      setConversations([]);
      toast.success('所有历史记录已清空');
    } catch (error) {
      console.error('清空历史记录失败:', error);
      toast.error('清空历史记录失败');
    }
  }, []);

  // 导出历史记录
  const exportHistory = useCallback(async () => {
    try {
      const data = {
        gameSessions,
        conversations,
        exportDate: new Date().toISOString(),
        version: '1.0'
      };
      
      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: 'application/json'
      });
      
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `tarot-ai-history-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast.success('历史记录已导出');
    } catch (error) {
      console.error('导出历史记录失败:', error);
      toast.error('导出历史记录失败');
    }
  }, [gameSessions, conversations]);

  // 导入历史记录
  const importHistory = useCallback(async (file: File) => {
    try {
      const text = await file.text();
      const data = JSON.parse(text);
      
      if (!data.gameSessions || !data.conversations) {
        throw new Error('无效的历史记录格式');
      }
      
      // 这里需要实现批量导入的方法
      // await db.importData(data);
      
      await loadGameSessions();
      await loadConversations();
      
      toast.success('历史记录已导入');
    } catch (error) {
      console.error('导入历史记录失败:', error);
      toast.error('导入历史记录失败：格式错误或文件损坏');
    }
  }, [loadGameSessions, loadConversations]);

  // 自动清理过期记录
  const cleanupOldSessions = useCallback(async () => {
    if (!autoDeleteOldSessions) {
      return;
    }

    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - sessionRetentionDays);
      
      await db.deleteOldSessions(cutoffDate);
      
      console.log('过期记录清理完成');
    } catch (error) {
      console.error('清理过期记录失败:', error);
    }
  }, [autoDeleteOldSessions, sessionRetentionDays]);

  // 搜索历史记录
  const searchHistory = useCallback((query: string) => {
    if (!query.trim()) {
      return { sessions: gameSessions, conversations };
    }

    const lowercaseQuery = query.toLowerCase();
    
    const filteredSessions = gameSessions.filter(session => 
      session.userQuestion?.toLowerCase().includes(lowercaseQuery) ||
      session.aiReading?.toLowerCase().includes(lowercaseQuery)
    );
    
    const filteredConversations = conversations.filter(conversation =>
      conversation.title.toLowerCase().includes(lowercaseQuery) ||
      conversation.lastMessage?.toLowerCase().includes(lowercaseQuery)
    );
    
    return {
      sessions: filteredSessions,
      conversations: filteredConversations
    };
  }, [gameSessions, conversations]);

  // 获取统计信息
  const getStatistics = useCallback(() => {
    const totalSessions = gameSessions.length;
    const totalConversations = conversations.length;
    
    const sessionsBySpread = gameSessions.reduce((acc, session) => {
      acc[session.spreadId] = (acc[session.spreadId] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const recentActivity = gameSessions
      .filter(session => {
        const daysDiff = (Date.now() - session.createdAt.getTime()) / (1000 * 60 * 60 * 24);
        return daysDiff <= 7;
      })
      .length;
    
    return {
      totalSessions,
      totalConversations,
      sessionsBySpread,
      recentActivity,
      oldestSession: gameSessions[gameSessions.length - 1]?.createdAt,
      newestSession: gameSessions[0]?.createdAt
    };
  }, [gameSessions, conversations]);

  // 初始化时加载数据
  useEffect(() => {
    if (saveHistory) {
      loadGameSessions();
      loadConversations();
      cleanupOldSessions();
    }
  }, [saveHistory, loadGameSessions, loadConversations, cleanupOldSessions]);

  return {
    // 状态
    sessions: gameSessions,
    conversations,
    isLoading,
    error,
    
    // 操作
    loadGameSessions,
    loadConversations,
    deleteSession: deleteGameSession,
    deleteConversation,
    clearAllHistory,
    exportHistory,
    importHistory,
    cleanupOldSessions,
    searchHistory,
    getStatistics
  };
}

// 辅助hook：历史记录过滤和排序
export function useHistoryFilter({
  sessions = [],
  conversations = [],
  searchQuery = '',
  historyType = 'all',
  sortBy = 'date',
  sortOrder = 'desc'
}: {
  sessions?: GameSession[];
  conversations?: ChatConversation[];
  searchQuery?: string;
  historyType?: 'sessions' | 'conversations' | 'all';
  sortBy?: 'date' | 'name' | 'type';
  sortOrder?: 'asc' | 'desc';
} = {}) {
  const filteredAndSortedSessions = useMemo(() => {
    let filtered = sessions;
    
    // 搜索过滤
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(session => {
        const spread = tarotSpreads.find(s => s.id === session.spreadId);
        const spreadName = spread?.name || '';
        return session.userQuestion?.toLowerCase().includes(query) ||
               session.aiReading?.toLowerCase().includes(query) ||
               spreadName.toLowerCase().includes(query);
      });
    }
    
    // 排序
    return [...filtered].sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'date':
          comparison = a.createdAt.getTime() - b.createdAt.getTime();
          break;
        case 'name':
          const spreadA = tarotSpreads.find(s => s.id === a.spreadId);
          const spreadB = tarotSpreads.find(s => s.id === b.spreadId);
          comparison = (spreadA?.name || '').localeCompare(spreadB?.name || '');
          break;
        case 'type':
          comparison = a.spreadId.localeCompare(b.spreadId);
          break;
        default:
          comparison = 0;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });
  }, [sessions, searchQuery, sortBy, sortOrder]);
  
  const filteredAndSortedConversations = useMemo(() => {
    let filtered = conversations;
    
    // 搜索过滤
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(conversation =>
        conversation.title?.toLowerCase().includes(query) ||
        conversation.lastMessage?.toLowerCase().includes(query)
      );
    }
    
    // 排序
    return [...filtered].sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'date':
          comparison = a.updatedAt.getTime() - b.updatedAt.getTime();
          break;
        case 'name':
          comparison = (a.title || '').localeCompare(b.title || '');
          break;
        case 'type':
          comparison = 0; // 对话都是同一类型
          break;
        default:
          comparison = 0;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });
  }, [conversations, searchQuery, sortBy, sortOrder]);
  
  // 根据历史类型返回相应的数据
  const filteredSessions = historyType === 'conversations' ? [] : filteredAndSortedSessions;
  const filteredConversations = historyType === 'sessions' ? [] : filteredAndSortedConversations;
  const totalCount = filteredSessions.length + filteredConversations.length;
  
  return {
    filteredSessions,
    filteredConversations,
    totalCount
  };
}