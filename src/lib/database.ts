import Dexie, { Table } from 'dexie';
import { GameSession } from '@/types/game';
import { ChatMessage, ChatConversation } from '@/types/chat';

class TarotDatabase extends Dexie {
  gameSessions!: Table<GameSession>;
  chatConversations!: Table<ChatConversation>;
  chatMessages!: Table<ChatMessage>;

  constructor() {
    super('TarotAI');
    
    this.version(1).stores({
      gameSessions: '++id, spreadId, createdAt',
      chatConversations: '++id, sessionId, createdAt, updatedAt',
      chatMessages: '++id, conversationId, timestamp'
    });
  }

  // 游戏会话相关方法
  async saveGameSession(session: Omit<GameSession, 'id'>): Promise<string> {
    return await this.gameSessions.add(session as GameSession);
  }

  async getGameSession(id: string): Promise<GameSession | undefined> {
    return await this.gameSessions.get(id);
  }

  async getRecentGameSessions(limit: number = 10): Promise<GameSession[]> {
    return await this.gameSessions
      .orderBy('createdAt')
      .reverse()
      .limit(limit)
      .toArray();
  }

  // 聊天对话相关方法
  async saveConversation(conversation: Omit<ChatConversation, 'id'>): Promise<string> {
    return await this.chatConversations.add(conversation as ChatConversation);
  }

  async getConversation(id: string): Promise<ChatConversation | undefined> {
    return await this.chatConversations.get(id);
  }

  async getConversationsBySession(sessionId: string): Promise<ChatConversation[]> {
    return await this.chatConversations
      .where('sessionId')
      .equals(sessionId)
      .toArray();
  }

  async getAllConversations(): Promise<ChatConversation[]> {
    return await this.chatConversations
      .orderBy('updatedAt')
      .reverse()
      .toArray();
  }

  // 聊天消息相关方法
  async saveMessage(message: Omit<ChatMessage, 'id'>): Promise<string> {
    return await this.chatMessages.add(message as ChatMessage);
  }

  async getMessagesByConversation(conversationId: string): Promise<ChatMessage[]> {
    return await this.chatMessages
      .where('conversationId')
      .equals(conversationId)
      .sortBy('timestamp');
  }

  async deleteMessage(messageId: string): Promise<void> {
    await this.chatMessages.delete(messageId);
  }

  async deleteConversation(conversationId: string): Promise<void> {
    await this.transaction('rw', this.chatConversations, this.chatMessages, async () => {
      await this.chatMessages.where('conversationId').equals(conversationId).delete();
      await this.chatConversations.delete(conversationId);
    });
  }

  async deleteGameSession(sessionId: string): Promise<void> {
    await this.transaction('rw', this.gameSessions, this.chatConversations, this.chatMessages, async () => {
      // 删除相关的对话和消息
      const conversations = await this.chatConversations.where('sessionId').equals(sessionId).toArray();
      for (const conversation of conversations) {
        await this.chatMessages.where('conversationId').equals(conversation.id).delete();
      }
      await this.chatConversations.where('sessionId').equals(sessionId).delete();
      // 删除游戏会话
      await this.gameSessions.delete(sessionId);
    });
  }

  async clearAllData(): Promise<void> {
    await this.transaction('rw', this.gameSessions, this.chatConversations, this.chatMessages, async () => {
      await this.chatMessages.clear();
      await this.chatConversations.clear();
      await this.gameSessions.clear();
    });
  }

  async deleteOldSessions(cutoffDate: Date): Promise<void> {
    await this.transaction('rw', this.gameSessions, this.chatConversations, this.chatMessages, async () => {
      // 删除过期的游戏会话
      const oldSessions = await this.gameSessions.where('createdAt').below(cutoffDate).toArray();
      for (const session of oldSessions) {
        await this.deleteGameSession(session.id!);
      }
      
      // 删除过期的对话
      const oldConversations = await this.chatConversations.where('createdAt').below(cutoffDate).toArray();
      for (const conversation of oldConversations) {
        await this.deleteConversation(conversation.id!);
      }
    });
  }
}

export const db = new TarotDatabase();