'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import { DrawnCard, TarotSpread } from '@/types/tarot';
import { ChatMessage } from '@/types/chat';
import { TarotCard } from './TarotCard';
import { useChatStore } from '@/store/chat-store';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { 
  Sparkles, 
  Copy, 
  Share2, 
  Save, 
  MessageCircle, 
  ChevronDown, 
  ChevronUp,
  Star,
  Clock,
  User,
  Bot
} from 'lucide-react';
import { toast } from 'react-hot-toast';

interface ReadingDisplayProps {
  drawnCards: DrawnCard[];
  spread: TarotSpread;
  reading?: ChatMessage;
  isGenerating?: boolean;
  onRegenerateReading?: () => void;
  onStartChat?: () => void;
  className?: string;
}

export function ReadingDisplay({
  drawnCards,
  spread,
  reading,
  isGenerating,
  onRegenerateReading,
  onStartChat,
  className
}: ReadingDisplayProps) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['overview']));
  const [userQuestion, setUserQuestion] = useState('');
  const [showCardDetails, setShowCardDetails] = useState(false);
  

  const { sendMessage, currentConversationId } = useChatStore();
  const readingRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (reading && readingRef.current) {
      readingRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [reading]);
  
  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };
  
  const handleCopyReading = async () => {
    if (reading) {
      try {
        await navigator.clipboard.writeText(reading.content);
        toast.success('解读已复制到剪贴板');
      } catch {
        toast.error('复制失败');
      }
    }
  };
  
  const handleShareReading = async () => {
    if (reading && navigator.share) {
      try {
        await navigator.share({
          title: `${spread.name} - 塔罗牌解读`,
          text: reading.content
        });
      } catch {
        toast.error('分享失败');
      }
    } else {
      handleCopyReading();
    }
  };
  
  const handleSaveReading = () => {
    // 这里可以实现保存到收藏夹的功能
    toast.success('解读已保存');
  };
  
  const handleAskQuestion = async () => {
    if (userQuestion.trim() && currentConversationId) {
      await sendMessage(userQuestion.trim());
      setUserQuestion('');
      if (onStartChat) {
        onStartChat();
      }
    }
  };
  
  // 解析解读内容的不同部分
  const parseReadingContent = (content: string) => {
    const sections = {
      overview: '',
      cardMeanings: '',
      synthesis: '',
      advice: ''
    };
    
    // 简单的内容分割逻辑，实际可能需要更复杂的解析
    const lines = content.split('\n');
    let currentSection = 'overview';
    
    for (const line of lines) {
      const trimmedLine = line.trim();
      if (trimmedLine.includes('牌面含义') || trimmedLine.includes('卡牌解释')) {
        currentSection = 'cardMeanings';
      } else if (trimmedLine.includes('综合分析') || trimmedLine.includes('整体解读')) {
        currentSection = 'synthesis';
      } else if (trimmedLine.includes('建议') || trimmedLine.includes('指导')) {
        currentSection = 'advice';
      } else if (trimmedLine) {
        sections[currentSection as keyof typeof sections] += line + '\n';
      }
    }
    
    return sections;
  };
  
  const readingSections = reading ? parseReadingContent(reading.content) : null;
  
  return (
    <div className={cn('space-y-6', className)} ref={readingRef}>
      {/* 抽取的卡牌展示 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-purple-900/30 to-blue-900/30 rounded-xl p-6 border border-purple-400/20"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-white flex items-center">
            <Sparkles className="w-5 h-5 mr-2 text-gold-400" />
            抽取的卡牌
          </h3>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowCardDetails(!showCardDetails)}
            className="text-purple-300 hover:text-purple-200"
          >
            {showCardDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            {showCardDetails ? '隐藏详情' : '显示详情'}
          </Button>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {drawnCards.map((drawnCard, index) => {
            const position = spread.positions.find(p => p.id === drawnCard.position);
            
            return (
              <motion.div
                key={`${drawnCard.card.id}-${drawnCard.position}`}
                initial={{ opacity: 0, scale: 0.8, rotateY: -90 }}
                animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                className="text-center"
              >
                <div className="relative mb-2">
                  <TarotCard
                    drawnCard={drawnCard}
                    isRevealed={true}
                    size="small"
                  />
                  
                  {drawnCard.isReversed && (
                    <Badge 
                      variant="destructive" 
                      className="absolute -top-2 -right-2 text-xs"
                    >
                      逆位
                    </Badge>
                  )}
                </div>
                
                <div className="text-xs text-gray-300">
                  <div className="font-medium text-purple-300 mb-1">
                    {position?.name}
                  </div>
                  <div className="text-gray-400">
                    {drawnCard.card.name}
                  </div>
                </div>
                
                <AnimatePresence>
                  {showCardDetails && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-2 p-2 bg-black/30 rounded text-xs text-gray-300"
                    >
                      <div className="mb-1">
                        <span className="text-purple-300">含义:</span>
                        <br />
                        {position?.meaning}
                      </div>
                      
                      <div className="flex flex-wrap gap-1 mt-1">
                        {(drawnCard.isReversed 
                          ? drawnCard.card.keywords 
                          : drawnCard.card.keywords
                        ).slice(0, 3).map((keyword: string, i: number) => (
                          <span 
                            key={i}
                            className="bg-purple-600/50 px-1 py-0.5 rounded text-xs"
                          >
                            {keyword}
                          </span>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
      
      {/* AI解读内容 */}
      <AnimatePresence>
        {(reading || isGenerating) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-gradient-to-br from-indigo-900/30 to-purple-900/30 rounded-xl border border-indigo-400/20 overflow-hidden"
          >
            {/* 解读头部 */}
            <div className="p-6 border-b border-indigo-400/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-bold text-white">
                      AI 塔罗解读
                    </h3>
                    <div className="flex items-center space-x-2 text-sm text-gray-400">
                      <Clock className="w-4 h-4" />
                      <span>
                        {reading ? new Date(reading.timestamp).toLocaleString() : '生成中...'}
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {spread.name}
                      </Badge>
                    </div>
                  </div>
                </div>
                
                {reading && (
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleCopyReading}
                      className="text-gray-400 hover:text-white"
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleShareReading}
                      className="text-gray-400 hover:text-white"
                    >
                      <Share2 className="w-4 h-4" />
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleSaveReading}
                      className="text-gray-400 hover:text-white"
                    >
                      <Save className="w-4 h-4" />
                    </Button>
                    
                    {onRegenerateReading && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={onRegenerateReading}
                        className="border-purple-400 text-purple-300 hover:bg-purple-600"
                      >
                        <Sparkles className="w-4 h-4 mr-1" />
                        重新生成
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </div>
            
            {/* 解读内容 */}
            <div className="p-6">
              {isGenerating ? (
                <motion.div
                  className="flex items-center justify-center py-8"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <div className="flex items-center space-x-3">
                    <motion.div
                      className="w-6 h-6 border-2 border-purple-400 border-t-transparent rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    />
                    <span className="text-gray-300">AI 正在解读中...</span>
                  </div>
                </motion.div>
              ) : reading && readingSections ? (
                <div className="space-y-4">
                  {/* 总体概述 */}
                  {readingSections.overview && (
                    <ReadingSection
                      id="overview"
                      title="总体概述"
                      content={readingSections.overview}
                      isExpanded={expandedSections.has('overview')}
                      onToggle={toggleSection}
                      icon={<Star className="w-4 h-4" />}
                    />
                  )}
                  
                  {/* 牌面含义 */}
                  {readingSections.cardMeanings && (
                    <ReadingSection
                      id="cardMeanings"
                      title="牌面含义"
                      content={readingSections.cardMeanings}
                      isExpanded={expandedSections.has('cardMeanings')}
                      onToggle={toggleSection}
                      icon={<Sparkles className="w-4 h-4" />}
                    />
                  )}
                  
                  {/* 综合分析 */}
                  {readingSections.synthesis && (
                    <ReadingSection
                      id="synthesis"
                      title="综合分析"
                      content={readingSections.synthesis}
                      isExpanded={expandedSections.has('synthesis')}
                      onToggle={toggleSection}
                      icon={<MessageCircle className="w-4 h-4" />}
                    />
                  )}
                  
                  {/* 建议指导 */}
                  {readingSections.advice && (
                    <ReadingSection
                      id="advice"
                      title="建议指导"
                      content={readingSections.advice}
                      isExpanded={expandedSections.has('advice')}
                      onToggle={toggleSection}
                      icon={<User className="w-4 h-4" />}
                    />
                  )}
                  
                  {/* 如果没有分段，显示完整内容 */}
                  {!readingSections.overview && !readingSections.cardMeanings && (
                    <div className="prose prose-invert max-w-none">
                      <div className="whitespace-pre-wrap text-gray-300 leading-relaxed">
                        {reading.content}
                      </div>
                    </div>
                  )}
                </div>
              ) : null}
            </div>
            
            {/* 提问区域 */}
            {reading && (
              <div className="p-6 border-t border-indigo-400/20 bg-indigo-900/20">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  
                  <div className="flex-1">
                    <Textarea
                      value={userQuestion}
                      onChange={(e) => setUserQuestion(e.target.value)}
                      placeholder="对这次解读有什么疑问吗？可以继续提问..."
                      className="bg-black/30 border-gray-600 text-white placeholder-gray-400 resize-none"
                      rows={3}
                    />
                    
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-xs text-gray-400">
                        按 Ctrl+Enter 快速发送
                      </span>
                      
                      <div className="flex items-center space-x-2">
                        {onStartChat && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={onStartChat}
                            className="text-purple-300 hover:text-purple-200"
                          >
                            <MessageCircle className="w-4 h-4 mr-1" />
                            进入对话
                          </Button>
                        )}
                        
                        <Button
                          onClick={handleAskQuestion}
                          disabled={!userQuestion.trim()}
                          size="sm"
                          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500"
                        >
                          发送提问
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// 解读章节组件
function ReadingSection({
  id,
  title,
  content,
  isExpanded,
  onToggle,
  icon
}: {
  id: string;
  title: string;
  content: string;
  isExpanded: boolean;
  onToggle: (id: string) => void;
  icon: React.ReactNode;
}) {
  return (
    <div className="border border-gray-600/30 rounded-lg overflow-hidden">
      <button
        onClick={() => onToggle(id)}
        className="w-full p-4 bg-gray-800/30 hover:bg-gray-700/30 transition-colors flex items-center justify-between text-left"
      >
        <div className="flex items-center space-x-2">
          <div className="text-purple-400">{icon}</div>
          <h4 className="font-medium text-white">{title}</h4>
        </div>
        
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-4 h-4 text-gray-400" />
        </motion.div>
      </button>
      
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="p-4 prose prose-invert max-w-none">
              <div className="whitespace-pre-wrap text-gray-300 leading-relaxed">
                {content}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}