import { useCallback, useEffect, useRef } from 'react';
import { useChatStore } from '@/store/chat-store';
import { useSettingsStore } from '@/store/settings-store';
import { ChatConversation } from '@/types/chat';
import { toast } from 'sonner';

export function useChat() {
  const {
    conversations,
    currentConversationId,
    messages,
    isLoading,
    error,
    createConversation,
    loadConversation,
    sendMessage,
    loadConversations,
    deleteMessage,
    deleteConversation,
    clearError,
    setCurrentConversation
  } = useChatStore();

  const { saveHistory } = useSettingsStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 滚动到消息底部
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  // 当有新消息时自动滚动
  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // 发送消息
  const handleSendMessage = useCallback(async (content: string, cardContext?: string) => {
    if (!content.trim()) {
      toast.error('请输入消息内容');
      return;
    }

    if (!saveHistory) {
      toast.error('当前设置不允许保存聊天记录');
      return;
    }

    try {
      await sendMessage(content.trim(), 'text', cardContext);
    } catch (error) {
      console.error('发送消息失败:', error);
      toast.error('发送消息失败，请重试');
    }
  }, [sendMessage, saveHistory]);

  // 创建新对话
  const handleCreateConversation = useCallback(async (sessionId: string, title?: string) => {
    if (!saveHistory) {
      toast.error('当前设置不允许保存聊天记录');
      return null;
    }

    try {
      const conversationId = await createConversation(sessionId, title);
      toast.success('新对话已创建');
      return conversationId;
    } catch (error) {
      console.error('创建对话失败:', error);
      toast.error('创建对话失败，请重试');
      return null;
    }
  }, [createConversation, saveHistory]);

  // 切换对话
  const handleSwitchConversation = useCallback(async (conversationId: string) => {
    try {
      await loadConversation(conversationId);
    } catch (error) {
      console.error('切换对话失败:', error);
      toast.error('切换对话失败，请重试');
    }
  }, [loadConversation]);

  // 删除消息
  const handleDeleteMessage = useCallback(async (messageId: string) => {
    try {
      await deleteMessage(messageId);
      toast.success('消息已删除');
    } catch (error) {
      console.error('删除消息失败:', error);
      toast.error('删除消息失败，请重试');
    }
  }, [deleteMessage]);

  // 删除对话
  const handleDeleteConversation = useCallback(async (conversationId: string) => {
    try {
      await deleteConversation(conversationId);
      toast.success('对话已删除');
    } catch (error) {
      console.error('删除对话失败:', error);
      toast.error('删除对话失败，请重试');
    }
  }, [deleteConversation]);

  // 清除当前对话
  const handleClearConversation = useCallback(() => {
    setCurrentConversation(null);
  }, [setCurrentConversation]);

  // 重新加载对话列表
  const handleRefreshConversations = useCallback(async () => {
    try {
      await loadConversations();
    } catch (error) {
      console.error('刷新对话列表失败:', error);
      toast.error('刷新对话列表失败');
    }
  }, [loadConversations]);

  // 清除错误
  const handleClearError = useCallback(() => {
    clearError();
  }, [clearError]);

  // 获取当前对话信息
  const currentConversation = conversations.find(c => c.id === currentConversationId);

  // 聊天状态
  const chatStatus = {
    hasActiveConversation: !!currentConversationId,
    hasMessages: messages.length > 0,
    hasConversations: conversations.length > 0,
    canSendMessage: !!currentConversationId && !isLoading && saveHistory,
    isTyping: isLoading
  };

  // 消息统计
  const messageStats = {
    total: messages.length,
    userMessages: messages.filter(m => m.role === 'user').length,
    aiMessages: messages.filter(m => m.role === 'assistant').length,
    readingMessages: messages.filter(m => m.type === 'reading').length
  };

  return {
    // 状态
    conversations,
    currentConversation,
    currentConversationId,
    messages,
    isLoading,
    error,
    chatStatus,
    messageStats,
    messagesEndRef,
    
    // 操作
    sendMessage: handleSendMessage,
    createConversation: handleCreateConversation,
    switchConversation: handleSwitchConversation,
    deleteMessage: handleDeleteMessage,
    deleteConversation: handleDeleteConversation,
    clearConversation: handleClearConversation,
    refreshConversations: handleRefreshConversations,
    clearError: handleClearError,
    scrollToBottom
  };
}

// 辅助hook：消息格式化
export function useMessageFormatter() {
  const formatTimestamp = useCallback((timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) {
      return '刚刚';
    } else if (minutes < 60) {
      return `${minutes}分钟前`;
    } else if (hours < 24) {
      return `${hours}小时前`;
    } else if (days < 7) {
      return `${days}天前`;
    } else {
      return timestamp.toLocaleDateString('zh-CN');
    }
  }, []);

  const formatMessageContent = useCallback((content: string, type?: string) => {
    if (type === 'reading') {
      // 为解读消息添加特殊格式
      return content.replace(/###\s*(.*?)\n/g, '<h3>$1</h3>');
    }
    
    // 处理普通文本消息
    return content.replace(/\n/g, '<br />');
  }, []);

  const getMessageIcon = useCallback((role: string, type?: string) => {
    if (role === 'assistant') {
      return type === 'reading' ? '🔮' : '🤖';
    }
    return '👤';
  }, []);

  return {
    formatTimestamp,
    formatMessageContent,
    getMessageIcon
  };
}

// 辅助hook：对话搜索
export function useConversationSearch() {
  const { conversations } = useChatStore();

  const searchConversations = useCallback((query: string) => {
    if (!query.trim()) {
      return conversations;
    }

    const lowercaseQuery = query.toLowerCase();
    return conversations.filter(conversation => 
      conversation.title.toLowerCase().includes(lowercaseQuery) ||
      conversation.lastMessage?.toLowerCase().includes(lowercaseQuery)
    );
  }, [conversations]);

  const sortConversations = useCallback((conversations: ChatConversation[], sortBy: 'date' | 'title') => {
    return [...conversations].sort((a, b) => {
      if (sortBy === 'date') {
        return b.updatedAt.getTime() - a.updatedAt.getTime();
      } else {
        return a.title.localeCompare(b.title);
      }
    });
  }, []);

  return {
    searchConversations,
    sortConversations
  };
}