'use client';

import { motion, AnimatePresence } from 'framer-motion';
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { ChatMessage, ChatConversation } from '@/types/chat';
import { useChat } from '@/hooks/use-chat';
import { useSettingsStore } from '@/store/settings-store';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { 
  Send, 
  Bot, 
  User, 
  MessageCircle, 
  Trash2, 
  Copy, 
  ThumbsUp, 
  ThumbsDown,
  MoreVertical,
  Clock,
  Sparkles
} from 'lucide-react';
import { toast } from 'react-hot-toast';

interface ChatInterfaceProps {
  conversation?: ChatConversation;
  className?: string;
  cardContext?: string;
}

export function ChatInterface({ conversation, className, cardContext }: ChatInterfaceProps) {
  const [message, setMessage] = useState('');
  const [isComposing, setIsComposing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  const {
    messages,
    isLoading,
    sendMessage,
    deleteMessage: handleDeleteMessageFromHook,
    currentConversation,
    createConversation
  } = useChat();
  
  const { showAnimations } = useSettingsStore();
  
  const activeConversation = conversation || currentConversation;
  const conversationMessages = useMemo(() => {
    return activeConversation 
      ? messages.filter(m => m.conversationId === activeConversation.id)
      : [];
  }, [activeConversation, messages]);
  
  useEffect(() => {
    scrollToBottom();
  }, [conversationMessages, isLoading]);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const handleSendMessage = async () => {
    if (!message.trim() || !activeConversation || isLoading) return;
    
    const messageText = message.trim();
    setMessage('');
    
    try {
      // 如果是第一条消息且有卡牌上下文，传递卡牌信息
      const isFirstMessage = conversationMessages.length === 0;
      await sendMessage(messageText, isFirstMessage ? cardContext : undefined);
    } catch {
      toast.error('发送消息失败');
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  const handleCopyMessage = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      toast.success('消息已复制');
    } catch {
      toast.error('复制失败');
    }
  };
  
  const handleDeleteMessage = async (messageId: string) => {
    try {
      await handleDeleteMessageFromHook(messageId);
      toast.success('消息已删除');
    } catch {
      toast.error('删除失败');
    }
  };
  
  if (!activeConversation) {
    return (
      <div className={cn('flex items-center justify-center h-full', className)}>
        <div className="text-center text-gray-400">
          <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p className="mb-4">还没有活动的对话</p>
          <Button
            onClick={async () => {
              try {
                const conversationId = await createConversation('default-session', '新的塔罗对话');
                if (conversationId) {
                  toast.success('对话已创建');
                }
              } catch {
                toast.error('创建对话失败');
              }
            }}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500"
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            开始新对话
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className={cn('flex flex-col h-full', className)}>
      {/* 对话头部 */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between p-4 border-b border-gray-700/50 bg-gray-900/50"
      >
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          
          <div>
            <h3 className="font-bold text-white">
              {activeConversation.title || '塔罗对话'}
            </h3>
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <Clock className="w-3 h-3" />
              <span>
                {new Date(activeConversation.createdAt).toLocaleDateString()}
              </span>
              <Badge variant="outline" className="text-xs">
                {conversationMessages.length} 条消息
              </Badge>
            </div>
          </div>
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          className="text-gray-400 hover:text-white"
        >
          <MoreVertical className="w-4 h-4" />
        </Button>
      </motion.div>
      
      {/* 消息列表 */}
      <ScrollArea className="flex-1 p-4 h-0">
        <div className="space-y-4">
          <AnimatePresence>
            {conversationMessages.map((msg, index) => (
              <ChatMessageItem
                key={msg.id}
                message={msg}
                index={index}
                onCopy={handleCopyMessage}
                onDelete={handleDeleteMessage}
                showAnimations={showAnimations}
              />
            ))}
          </AnimatePresence>
          
          {/* 加载指示器 */}
          {isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-start space-x-3"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4 text-white" />
              </div>
              
              <div className="bg-gray-800/50 rounded-lg p-3 max-w-xs">
                <div className="flex items-center space-x-2">
                  <motion.div
                    className="w-2 h-2 bg-purple-400 rounded-full"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1, repeat: Infinity, delay: 0 }}
                  />
                  <motion.div
                    className="w-2 h-2 bg-purple-400 rounded-full"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                  />
                  <motion.div
                    className="w-2 h-2 bg-purple-400 rounded-full"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
                  />
                  <span className="text-sm text-gray-400 ml-2">AI 正在思考...</span>
                </div>
              </div>
            </motion.div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>
      
      {/* 输入区域 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-4 border-t border-gray-700/50 bg-gray-900/30"
      >
        <div className="flex items-end space-x-3">
          <div className="flex-1">
            <Textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              onCompositionStart={() => setIsComposing(true)}
              onCompositionEnd={() => setIsComposing(false)}
              placeholder="输入你的问题...（Ctrl+Enter 发送）"
              className="bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 resize-none min-h-[60px] max-h-[120px]"
              rows={2}
            />
            
            <div className="flex items-center justify-between mt-2">
              <span className="text-xs text-gray-500">
                {message.length}/1000
              </span>
              
              <div className="flex items-center space-x-2">
                <span className="text-xs text-gray-500">
                  Ctrl+Enter 发送
                </span>
              </div>
            </div>
          </div>
          
          <Button
            onClick={handleSendMessage}
            disabled={!message.trim() || isLoading || isComposing}
            className={cn(
              'bg-gradient-to-r from-purple-600 to-pink-600',
              'hover:from-purple-500 hover:to-pink-500',
              'disabled:from-gray-600 disabled:to-gray-600',
              'px-6 py-3'
            )}
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </motion.div>
    </div>
  );
}

// 单条消息组件
function ChatMessageItem({
  message,
  index,
  onCopy,
  onDelete,
  showAnimations
}: {
  message: ChatMessage;
  index: number;
  onCopy: (content: string) => void;
  onDelete: (messageId: string) => void;
  showAnimations: boolean;
}) {
  const [showActions, setShowActions] = useState(false);
  const [feedback, setFeedback] = useState<'like' | 'dislike' | null>(null);
  
  const isUser = message.role === 'user';
  
  const handleFeedback = (type: 'like' | 'dislike') => {
    setFeedback(feedback === type ? null : type);
    // 这里可以发送反馈到服务器
  };
  
  return (
    <motion.div
      initial={showAnimations ? { opacity: 0, y: 20, scale: 0.95 } : false}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: index * 0.1, duration: 0.3 }}
      className={cn(
        'flex items-start space-x-3',
        isUser ? 'flex-row-reverse space-x-reverse' : ''
      )}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {/* 头像 */}
      <div className={cn(
        'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0',
        isUser 
          ? 'bg-gradient-to-br from-blue-500 to-indigo-500'
          : 'bg-gradient-to-br from-indigo-500 to-purple-500'
      )}>
        {isUser ? (
          <User className="w-4 h-4 text-white" />
        ) : (
          <Bot className="w-4 h-4 text-white" />
        )}
      </div>
      
      {/* 消息内容 */}
      <div className={cn(
        'flex-1 max-w-[70%]',
        isUser ? 'flex flex-col items-end' : ''
      )}>
        <div className={cn(
          'rounded-lg p-3 relative',
          isUser 
            ? 'bg-gradient-to-br from-blue-600 to-indigo-600 text-white'
            : 'bg-gray-800/50 text-gray-100'
        )}>
          <div className="whitespace-pre-wrap leading-relaxed">
            {message.content}
          </div>
          
          {/* 时间戳和操作按钮 */}
          <div className="flex items-center justify-between mt-2">
            <div className={cn(
              'text-xs opacity-70',
              isUser ? 'text-blue-100' : 'text-gray-400'
            )}>
              {new Date(message.timestamp).toLocaleTimeString()}
            </div>
            
            {/* 消息操作按钮 */}
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
                    onClick={() => onCopy(message.content)}
                    className="w-6 h-6 p-0 hover:bg-white/20"
                  >
                    <Copy className="w-3 h-3" />
                  </Button>
                  
                  {!isUser && (
                    <>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleFeedback('like')}
                        className={cn(
                          'w-6 h-6 p-0 hover:bg-white/20',
                          feedback === 'like' && 'bg-green-500/20 text-green-400'
                        )}
                      >
                        <ThumbsUp className="w-3 h-3" />
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleFeedback('dislike')}
                        className={cn(
                          'w-6 h-6 p-0 hover:bg-white/20',
                          feedback === 'dislike' && 'bg-red-500/20 text-red-400'
                        )}
                      >
                        <ThumbsDown className="w-3 h-3" />
                      </Button>
                    </>
                  )}
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(message.id)}
                    className="w-6 h-6 p-0 hover:bg-red-500/20 text-red-400"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// 对话列表组件
export function ConversationList({
  conversations,
  currentConversation,
  onSelectConversation,
  onDeleteConversation,
  className
}: {
  conversations: ChatConversation[];
  currentConversation?: ChatConversation;
  onSelectConversation: (conversation: ChatConversation) => void;
  onDeleteConversation: (conversationId: string) => void;
  className?: string;
}) {
  return (
    <div className={cn('space-y-2', className)}>
      {conversations.map((conversation) => (
        <motion.button
          key={conversation.id}
          onClick={() => onSelectConversation(conversation)}
          className={cn(
            'w-full p-3 rounded-lg text-left transition-all duration-200',
            'hover:bg-gray-800/50 group',
            currentConversation?.id === conversation.id
              ? 'bg-purple-900/30 border border-purple-400/30'
              : 'bg-gray-900/30 border border-gray-700/30'
          )}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-white truncate">
                {conversation.title || '新对话'}
              </h4>
              <p className="text-sm text-gray-400 truncate mt-1">
                {conversation.lastMessage || '开始新的对话...'}
              </p>
              <div className="flex items-center space-x-2 mt-2">
                <span className="text-xs text-gray-500">
                  {new Date(conversation.updatedAt).toLocaleDateString()}
                </span>
                <Badge variant="outline" className="text-xs">
                  {conversation.messageCount || 0}
                </Badge>
              </div>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onDeleteConversation(conversation.id);
              }}
              className="opacity-0 group-hover:opacity-100 transition-opacity text-red-400 hover:text-red-300 hover:bg-red-500/20"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </motion.button>
      ))}
      
      {conversations.length === 0 && (
        <div className="text-center text-gray-500 py-8">
          <MessageCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p>还没有对话记录</p>
        </div>
      )}
    </div>
  );
}