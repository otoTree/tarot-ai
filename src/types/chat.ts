export interface ChatMessage {
  id: string;
  conversationId: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  type?: 'text' | 'reading' | 'system';
}

export interface ChatConversation {
  id: string;
  title: string;
  sessionId: string;
  createdAt: Date;
  updatedAt: Date;
  lastMessage?: string;
  messageCount?: number;
}

export interface AIReadingRequest {
  drawnCards: import('./tarot').DrawnCard[];
  spreadName: string;
  userQuestion?: string;
}

// OpenAI API相关类型
export interface OpenAIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface OpenAIRequest {
  model: string;
  messages: OpenAIMessage[];
  temperature?: number;
  max_tokens?: number;
  stream?: boolean;
}

export interface OpenAIResponse {
  choices: {
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }[];
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

// AI配置状态
export interface AIConfigStatus {
  isConfigured: boolean;
  hasApiKey: boolean;
  hasBaseUrl: boolean;
  hasModel: boolean;
  model: string;
  isUsingMockData: boolean;
}