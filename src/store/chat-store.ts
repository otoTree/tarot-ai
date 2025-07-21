import { create } from 'zustand';
import { ChatMessage, ChatConversation, OpenAIMessage } from '@/types/chat';
import { db } from '@/lib/database';
import { aiService } from '@/lib/ai-service';

interface ChatState {
  conversations: ChatConversation[];
  currentConversationId: string | null;
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
}

interface ChatStore extends ChatState {
  // Actions
  createConversation: (sessionId: string, title?: string) => Promise<string>;
  loadConversation: (conversationId: string) => Promise<void>;
  sendMessage: (content: string, type?: 'text' | 'reading', cardContext?: string) => Promise<void>;
  loadConversations: () => Promise<void>;
  deleteMessage: (messageId: string) => Promise<void>;
  deleteConversation: (conversationId: string) => Promise<void>;
  clearError: () => void;
  setCurrentConversation: (conversationId: string | null) => void;
}

export const useChatStore = create<ChatStore>((set, get) => ({
  // Initial state
  conversations: [],
  currentConversationId: null,
  messages: [],
  isLoading: false,
  error: null,

  // Actions
  createConversation: async (sessionId, title = '新的对话') => {
    try {
      set({ isLoading: true, error: null });
      
      const conversation: Omit<ChatConversation, 'id'> = {
        title,
        sessionId,
        createdAt: new Date(),
        updatedAt: new Date(),
        lastMessage: ''
      };
      
      const conversationId = await db.saveConversation(conversation);
      
      const newConversation: ChatConversation = {
        ...conversation,
        id: conversationId
      };
      
      set(state => ({
        conversations: [newConversation, ...state.conversations],
        currentConversationId: conversationId,
        messages: [],
        isLoading: false
      }));
      
      return conversationId;
    } catch (error) {
      console.error('创建对话失败:', error);
      set({ error: '创建对话失败', isLoading: false });
      throw error;
    }
  },

  loadConversation: async (conversationId) => {
    try {
      set({ isLoading: true, error: null });
      
      const messages = await db.getMessagesByConversation(conversationId);
      
      set({
        currentConversationId: conversationId,
        messages,
        isLoading: false
      });
    } catch (error) {
      console.error('加载对话失败:', error);
      set({ error: '加载对话失败', isLoading: false });
    }
  },

  sendMessage: async (content, type = 'text', cardContext) => {
    const { currentConversationId } = get();
    
    if (!currentConversationId) {
      set({ error: '没有活动的对话' });
      return;
    }
    
    try {
      set({ isLoading: true, error: null });
      
      // 先构建对话历史（在添加当前用户消息之前）
      const conversationHistory: OpenAIMessage[] = get().messages
        .filter(msg => msg.conversationId === currentConversationId)
        .slice(-8) // 只保留最近8条消息作为上下文
        .map(msg => ({
          role: msg.role as 'user' | 'assistant',
          content: msg.content
        }));
      
      // 保存用户消息
      const userMessage: Omit<ChatMessage, 'id'> = {
        conversationId: currentConversationId,
        content,
        role: 'user',
        timestamp: new Date(),
        type
      };
      
      const userMessageId = await db.saveMessage(userMessage);
      const savedUserMessage: ChatMessage = {
        ...userMessage,
        id: userMessageId
      };
      
      set(state => ({
        messages: [...state.messages, savedUserMessage]
      }));
      
      // 生成AI回复（传递对话历史和卡牌上下文）
      const aiResponse = await aiService.generateChatResponse(
        content, 
        undefined, 
        conversationHistory,
        cardContext
      );
      
      // 保存AI回复
      const aiMessage: Omit<ChatMessage, 'id'> = {
        conversationId: currentConversationId,
        content: aiResponse,
        role: 'assistant',
        timestamp: new Date(),
        type: 'text'
      };
      
      const aiMessageId = await db.saveMessage(aiMessage);
      const savedAiMessage: ChatMessage = {
        ...aiMessage,
        id: aiMessageId
      };
      
      set(state => ({
        messages: [...state.messages, savedAiMessage],
        isLoading: false
      }));
      
      // 更新对话的最后消息
      const conversation = get().conversations.find(c => c.id === currentConversationId);
      if (conversation) {
        const updatedConversation = {
          ...conversation,
          lastMessage: content.substring(0, 50) + (content.length > 50 ? '...' : ''),
          updatedAt: new Date()
        };
        
        // 同时更新数据库中的对话记录
        await db.chatConversations.update(currentConversationId, {
          lastMessage: updatedConversation.lastMessage,
          updatedAt: updatedConversation.updatedAt
        });
        
        set(state => ({
          conversations: state.conversations.map(c => 
            c.id === currentConversationId ? updatedConversation : c
          )
        }));
      }
      
    } catch (error) {
      console.error('发送消息失败:', error);
      set({ error: '发送消息失败', isLoading: false });
    }
  },

  loadConversations: async () => {
    try {
      set({ isLoading: true, error: null });
      
      const conversations = await db.getAllConversations();
      
      set({
        conversations,
        isLoading: false
      });
    } catch (error) {
      console.error('加载对话列表失败:', error);
      set({ error: '加载对话列表失败', isLoading: false });
    }
  },

  deleteMessage: async (messageId) => {
    try {
      await db.deleteMessage(messageId);
      
      set(state => ({
        messages: state.messages.filter(m => m.id !== messageId)
      }));
    } catch (error) {
      console.error('删除消息失败:', error);
      set({ error: '删除消息失败' });
    }
  },

  deleteConversation: async (conversationId) => {
    try {
      await db.deleteConversation(conversationId);
      
      set(state => ({
        conversations: state.conversations.filter(c => c.id !== conversationId),
        currentConversationId: state.currentConversationId === conversationId 
          ? null 
          : state.currentConversationId,
        messages: state.currentConversationId === conversationId 
          ? [] 
          : state.messages
      }));
    } catch (error) {
      console.error('删除对话失败:', error);
      set({ error: '删除对话失败' });
    }
  },

  clearError: () => {
    set({ error: null });
  },

  setCurrentConversation: (conversationId) => {
    set({ currentConversationId: conversationId });
    if (!conversationId) {
      set({ messages: [] });
    }
  }
}));

// 辅助函数：发送塔罗牌解读消息
export async function sendReadingMessage(reading: string, sessionId: string) {
  const { createConversation, sendMessage, currentConversationId } = useChatStore.getState();
  
  try {
    let conversationId = currentConversationId;
    
    // 如果没有当前对话，创建一个新的
    if (!conversationId) {
      conversationId = await createConversation(sessionId, '塔罗牌解读');
    }
    
    // 发送解读消息
    await sendMessage(reading, 'reading');
    
  } catch (error) {
    console.error('发送解读消息失败:', error);
    throw error;
  }
}

// 辅助函数：获取当前对话摘要
export function getCurrentConversationSummary() {
  const state = useChatStore.getState();
  return {
    hasActiveConversation: !!state.currentConversationId,
    messageCount: state.messages.length,
    isLoading: state.isLoading,
    hasError: !!state.error
  };
}