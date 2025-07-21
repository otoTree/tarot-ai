import { AIReadingRequest, OpenAIMessage, OpenAIRequest, OpenAIResponse, AIConfigStatus } from '@/types/chat';
import { DrawnCard } from '@/types/tarot';

export class AIService {
  private apiKey: string;
  private baseUrl: string;
  private model: string;
  
  constructor() {
    this.apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY || '';
    this.baseUrl = process.env.NEXT_PUBLIC_OPENAI_BASE_URL || 'https://api.openai.com/v1';
    this.model = process.env.NEXT_PUBLIC_OPENAI_MODEL || 'gpt-3.5-turbo';
  }
  
  async generateReading(request: AIReadingRequest): Promise<string> {
    const prompt = this.buildPrompt(request);
    
    if (!this.apiKey || this.apiKey === 'your_openai_api_key_here') {
      throw new Error('API密钥未配置，请在环境变量中设置NEXT_PUBLIC_OPENAI_API_KEY');
    }
    
    const messages: OpenAIMessage[] = [
      {
        role: 'system',
        content: '你是一位专业的塔罗牌解读师，具有深厚的塔罗牌知识和丰富的解读经验。请用温和、专业的语调提供准确的解读，避免过于绝对的预测，注重给予积极的指导。'
      },
      {
        role: 'user',
        content: prompt
      }
    ];
    
    const requestBody: OpenAIRequest = {
      model: this.model,
      messages,
      temperature: 0.7,
      max_tokens: 2000
    };
    
    const response = await fetch(`${this.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`
      },
      body: JSON.stringify(requestBody)
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API请求失败: ${response.status} - ${errorText}`);
    }
    
    const data: OpenAIResponse = await response.json();
    return data.choices[0].message.content;
  }
  
  // 构建卡牌上下文信息（用于对话）
  buildCardContext(drawnCards: DrawnCard[], spreadName: string): string {
    let context = `这是用户抽取到的塔罗牌\n\n 牌阵类型：${spreadName}\n\n`;
    
    drawnCards.forEach((drawnCard, index) => {
      const { card, isReversed, position } = drawnCard;
      context += `${index + 1}. ${position}位置：${card.name}${isReversed ? '（逆位）' : '（正位）'}\n`;
      context += `   含义：${isReversed ? card.reversedMeaning : card.uprightMeaning}\n`;
      context += `   关键词：${card.keywords.join('、')}\n\n`;
    });

    console.log('buildCardContext:', context)
    
    return context;
  }

  private buildPrompt(request: AIReadingRequest): string {
    const { drawnCards, spreadName, userQuestion } = request;
    
    let prompt = `作为一位专业的塔罗牌解读师，请为以下${spreadName}进行详细解读：\n\n`;
    
    drawnCards.forEach((drawnCard, index) => {
      const { card, isReversed, position } = drawnCard;
      prompt += `${index + 1}. ${position} 位置：${card.name}${isReversed ? '（逆位）' : '（正位）'}\n`;
      prompt += `   含义：${isReversed ? card.reversedMeaning : card.uprightMeaning}\n`;
      prompt += `   关键词：${card.keywords.join('、')}\n\n`;
    });
    
    if (userQuestion) {
      prompt += `用户问题：${userQuestion}\n\n`;
    }
    
    prompt += `请提供：
1. 整体解读和建议
2. 各张牌之间的关联性分析
3. 针对用户问题的具体指导（如有）
4. 实用的行动建议

请用温和、专业的语调，避免过于绝对的预测，注重给予积极的指导。`;
    
    return prompt;
  }
  

  
  // 生成对话回复
  async generateChatResponse(userMessage: string, context?: string, conversationHistory?: OpenAIMessage[], cardContext?: string): Promise<string> {
    if (!this.apiKey || this.apiKey === 'your_openai_api_key_here') {
      throw new Error('API密钥未配置，请在环境变量中设置NEXT_PUBLIC_OPENAI_API_KEY');
    }

    
    // 构建系统提示词
    let systemPrompt = '你是一位专业的塔罗牌解读师和心灵导师。你具有深厚的塔罗牌知识、心理学洞察力和丰富的人生阅历。请用温和、理解和支持的语调与用户对话，提供有价值的指导和建议。避免过于绝对的预测，注重启发用户的内在智慧。';
    
    // 如果有卡牌上下文，添加到系统提示词中
    //console.log('generateChatResponse cardContext:', cardContext)
    if (cardContext) {
      systemPrompt += '\n\n当前塔罗牌阵信息：\n' + cardContext + '\n\n请基于这些卡牌信息为用户提供解读和指导。';
    }
    
    // 构建消息历史
    //console.log('Final systemPrompt:', systemPrompt)
    const messages: OpenAIMessage[] = [
      {
        role: 'system',
        content: systemPrompt
      }
    ];
    
    // 添加对话历史（如果有）
    if (conversationHistory && conversationHistory.length > 0) {
      messages.push(...conversationHistory.slice(-10)); // 只保留最近10条消息
    }
    
    // 添加当前消息
    //console.log('generateChatResponse context:', context)
    messages.push({
      role: 'user',
      content: context ? `${context}\n\n用户消息: ${userMessage}` : userMessage
    });
    
    const requestBody: OpenAIRequest = {
      model: this.model,
      messages,
      temperature: 0.8,
      max_tokens: 1000
    };
    //console.log(messages)
    
    const response = await fetch(`${this.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`
      },
      body: JSON.stringify(requestBody)
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API请求失败: ${response.status} - ${errorText}`);
    }
    
    const data: OpenAIResponse = await response.json();
    return data.choices[0].message.content;
  }
  

}

// 创建默认的AI服务实例
export const aiService = new AIService();

// 导出buildCardContext函数
export const buildCardContext = (drawnCards: DrawnCard[], spreadName: string): string => {
  return new AIService().buildCardContext(drawnCards, spreadName);
};

// 检查是否配置了API密钥
export function isAIConfigured(): boolean {
  const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY;
  return apiKey !== undefined && apiKey !== '' && apiKey !== 'your_openai_api_key_here';
}

// 获取API配置状态
export function getAIConfigStatus(): AIConfigStatus {
  const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY || '';
  const baseUrl = process.env.NEXT_PUBLIC_OPENAI_BASE_URL || '';
  const model = process.env.NEXT_PUBLIC_OPENAI_MODEL || 'gpt-3.5-turbo';
  
  const hasApiKey = apiKey && apiKey !== 'your_openai_api_key_here';
  const hasBaseUrl = baseUrl && baseUrl !== '';
  const hasModel = model && model !== '';
  const isConfigured: boolean = !!(hasApiKey && hasBaseUrl);
  
  return {
    isConfigured,
    hasApiKey: !!hasApiKey,
    hasBaseUrl: !!hasBaseUrl,
    hasModel: !!hasModel,
    model,
    isUsingMockData: false
  };
}