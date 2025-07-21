'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import { useSettingsStore } from '@/store/settings-store';
import { db } from '@/lib/database';
import { GamePage } from '@/components/pages/GamePage';
import { Sparkles, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { theme, language, showAnimations } = useSettingsStore();
  
  useEffect(() => {
    // 初始化应用
    const initializeApp = async () => {
      try {
        // 初始化数据库
        await db.open();
        
        // 加载设置
        const settings = useSettingsStore.getState();
        
        // 应用主题
        document.documentElement.setAttribute('data-theme', settings.theme);
        document.documentElement.setAttribute('lang', settings.language);
        
        // 设置页面标题
        document.title = settings.language === 'zh' ? '塔罗 AI - 智能塔罗牌占卜' : 'Tarot AI - Intelligent Tarot Reading';
        
        // 模拟加载时间（可选）
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setIsLoading(false);
      } catch (err) {
        console.error('Failed to initialize app:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
        setIsLoading(false);
      }
    };
    
    initializeApp();
  }, []);
  
  useEffect(() => {
    // 监听主题变化
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);
  
  useEffect(() => {
    // 监听语言变化
    document.documentElement.setAttribute('lang', language);
  }, [language]);
  
  if (isLoading) {
    return <LoadingScreen showAnimations={showAnimations} />;
  }
  
  if (error) {
    return <ErrorScreen error={error} onRetry={() => window.location.reload()} />;
  }
  
  return (
    <div className={cn(
      'min-h-screen bg-background text-foreground',
      theme === 'dark' && 'dark'
    )}>
      {/* 主应用内容 */}
      <GamePage />
      
      {/* 全局通知 */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: theme === 'dark' ? '#1f2937' : '#ffffff',
            color: theme === 'dark' ? '#f9fafb' : '#111827',
            border: theme === 'dark' ? '1px solid #374151' : '1px solid #e5e7eb',
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#ffffff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#ffffff',
            },
          },
        }}
      />
      
      {/* 全局样式 */}
      <style jsx global>{`
        :root {
          --animation-duration: ${showAnimations ? '0.3s' : '0s'};
        }
        
        * {
          transition-duration: var(--animation-duration);
        }
        
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: rgba(156, 163, 175, 0.5) transparent;
        }
        
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgba(156, 163, 175, 0.5);
          border-radius: 3px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: rgba(156, 163, 175, 0.7);
        }
      `}</style>
    </div>
  );
}

// 加载屏幕组件
function LoadingScreen({ showAnimations }: { showAnimations: boolean }) {
  return (
    <div className="h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 flex items-center justify-center">
      {/* 背景装饰 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-500/5 rounded-full blur-3xl" />
      </div>
      
      <div className="relative z-10 text-center">
        {/* Logo 动画 */}
        <motion.div
          initial={showAnimations ? { scale: 0, rotate: -180 } : false}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="mb-8"
        >
          <div className="relative">
            <Sparkles className="w-16 h-16 text-purple-400 mx-auto" />
            <motion.div
              animate={showAnimations ? { rotate: 360 } : false}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              className="absolute inset-0"
            >
              <div className="w-16 h-16 border-2 border-purple-400/30 border-t-purple-400 rounded-full" />
            </motion.div>
          </div>
        </motion.div>
        
        {/* 标题 */}
        <motion.h1
          initial={showAnimations ? { opacity: 0, y: 20 } : false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-4xl font-bold text-white mb-4"
        >
          塔罗 AI
        </motion.h1>
        
        <motion.p
          initial={showAnimations ? { opacity: 0, y: 20 } : false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="text-xl text-gray-300 mb-8"
        >
          智能塔罗牌占卜系统
        </motion.p>
        
        {/* 加载指示器 */}
        <motion.div
          initial={showAnimations ? { opacity: 0 } : false}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="flex items-center justify-center space-x-2 text-gray-400"
        >
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>正在初始化...</span>
        </motion.div>
        
        {/* 加载进度条 */}
        <motion.div
          initial={showAnimations ? { width: 0 } : false}
          animate={{ width: '100%' }}
          transition={{ delay: 0.8, duration: 1.5, ease: 'easeInOut' }}
          className="mt-6 h-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full mx-auto max-w-xs"
        />
      </div>
    </div>
  );
}

// 错误屏幕组件
function ErrorScreen({ error, onRetry }: { error: string; onRetry: () => void }) {
  return (
    <div className="h-screen bg-gradient-to-br from-gray-900 via-red-900 to-gray-900 flex items-center justify-center">
      <div className="text-center max-w-md mx-auto p-6">
        <div className="mb-6">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-8 h-8 text-red-400" />
          </div>
          
          <h1 className="text-2xl font-bold text-white mb-2">
            初始化失败
          </h1>
          
          <p className="text-gray-300 mb-4">
            应用启动时遇到问题
          </p>
          
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-6">
            <p className="text-red-300 text-sm font-mono">
              {error}
            </p>
          </div>
        </div>
        
        <button
          onClick={onRetry}
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-medium py-2 px-6 rounded-lg transition-all duration-200"
        >
          重试
        </button>
      </div>
    </div>
  );
}

export default App;