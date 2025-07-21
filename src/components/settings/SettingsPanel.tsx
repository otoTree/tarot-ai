'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { useSettingsStore } from '@/store/settings-store';
import { getAIConfigStatus } from '@/lib/ai-service';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Settings, 
  Palette, 
  Globe, 
  Gamepad2, 
  Bot, 
  Eye, 
  Shield, 
  Volume2, 
  Monitor, 
  Moon, 
  Sun, 

  Save,
  RotateCcw,
  Download,
  Upload,
  ChevronRight,
  Check,
  X
} from 'lucide-react';
import { toast } from 'react-hot-toast';

// 设置类型定义
interface GameSettings {
  autoShuffle: boolean;
  allowReversed: boolean;
  reversedProbability: number;
  autoSave: boolean;
  soundEnabled: boolean;
  soundVolume: number;
}

interface AISettings {
  readingStyle: string;
  readingLength: number;
  autoGenerate: boolean;
  conversationMemory: boolean;
}

interface UISettings {
  showAnimations: boolean;
  showPositionGuides: boolean;
  showCardMeanings: boolean;
  compactMode: boolean;
  sidebarPosition: string;
}

interface PrivacySettings {
  saveHistory: boolean;
  analytics: boolean;
  crashReports: boolean;
  enableLocalStorage: boolean;
  enableAnalytics: boolean;
  autoCleanupDays: number;
}

type SettingsSection = 'appearance' | 'language' | 'game' | 'ai' | 'ui' | 'privacy' | 'advanced';

interface SettingsPanelProps {
  className?: string;
}

export function SettingsPanel({ className }: SettingsPanelProps) {
  const [activeSection, setActiveSection] = useState<SettingsSection>('appearance');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  
  const {
    theme,
    language,
    updateTheme,
    updateLanguage
  } = useSettingsStore();
  
  // 模拟设置数据（实际应该从store获取）
  const [gameSettings, setGameSettings] = useState<GameSettings>({
    autoShuffle: true,
    allowReversed: true,
    reversedProbability: 30,
    autoSave: true,
    soundEnabled: true,
    soundVolume: 50
  });
  
  const [aiSettings, setAISettings] = useState<AISettings>({
    readingStyle: 'balanced',
    readingLength: 2,
    autoGenerate: true,
    conversationMemory: true
  });
  
  const [uiSettings, setUISettings] = useState<UISettings>({
    showAnimations: true,
    showPositionGuides: true,
    showCardMeanings: true,
    compactMode: false,
    sidebarPosition: 'left'
  });
  
  const [privacySettings, setPrivacySettings] = useState<PrivacySettings>({
    saveHistory: true,
    analytics: false,
    crashReports: false,
    enableLocalStorage: true,
    enableAnalytics: false,
    autoCleanupDays: 30
  });
  
  const sections = [
    { id: 'appearance', label: '外观主题', icon: Palette },
    { id: 'language', label: '语言设置', icon: Globe },
    { id: 'game', label: '游戏设置', icon: Gamepad2 },
    { id: 'ai', label: 'AI 设置', icon: Bot },
    { id: 'ui', label: '界面设置', icon: Eye },
    { id: 'privacy', label: '隐私设置', icon: Shield },
    { id: 'advanced', label: '高级设置', icon: Settings }
  ];
  
  const handleSaveSettings = async () => {
    try {
      // 这里应该调用实际的保存逻辑
      await new Promise(resolve => setTimeout(resolve, 1000));
      setHasUnsavedChanges(false);
      toast.success('设置已保存');
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : '未知错误';
      toast.error(`保存失败: ${errorMessage}`);
    }
  };
  
  const handleResetSettings = () => {
    if (confirm('确定要重置所有设置吗？此操作不可恢复。')) {
      // 重置所有设置到默认值
      setGameSettings({
        autoShuffle: true,
        allowReversed: true,
        reversedProbability: 30,
        autoSave: true,
        soundEnabled: true,
        soundVolume: 50
      });
      setAISettings({
        readingStyle: 'balanced',
        readingLength: 2,
        autoGenerate: true,
        conversationMemory: true
      });
      setUISettings({
        showAnimations: true,
        showPositionGuides: true,
        showCardMeanings: true,
        compactMode: false,
        sidebarPosition: 'left'
      });
      setPrivacySettings({
        saveHistory: true,
        analytics: false,
        crashReports: false,
        enableLocalStorage: true,
        enableAnalytics: false,
        autoCleanupDays: 30
      });
      setHasUnsavedChanges(false);
      toast.success('设置已重置');
    }
  };
  
  const handleExportSettings = async () => {
    try {
      const settings = {
        theme,
        language,
        gameSettings,
        aiSettings,
        uiSettings,
        privacySettings
      };
      const blob = new Blob([JSON.stringify(settings, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'tarot-settings.json';
      a.click();
      URL.revokeObjectURL(url);
      toast.success('设置已导出');
    } catch (error) {
      toast.error('导出失败');
    }
  };
  
  const handleImportSettings = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        const text = await file.text();
        const settings = JSON.parse(text);
        if (settings.gameSettings) setGameSettings(settings.gameSettings);
        if (settings.aiSettings) setAISettings(settings.aiSettings);
        if (settings.uiSettings) setUISettings(settings.uiSettings);
        if (settings.privacySettings) setPrivacySettings(settings.privacySettings);
        toast.success('设置已导入');
      } catch (error: unknown) {
          const errorMessage = error instanceof Error ? error.message : '导入失败';
          toast.error(errorMessage);
        }
    }
  };
  
  return (
    <div className={cn('flex h-full', className)}>
      {/* 侧边栏 */}
      <div className="w-64 bg-gray-900/50 border-r border-gray-700/50">
        <div className="p-4 border-b border-gray-700/50">
          <h2 className="text-xl font-bold text-white flex items-center">
            <Settings className="w-5 h-5 mr-2" />
            设置
          </h2>
        </div>
        
        <ScrollArea className="flex-1">
          <div className="p-2">
            {sections.map(({ id, label, icon: Icon }) => (
              <motion.button
                key={id}
                onClick={() => setActiveSection(id as SettingsSection)}
                className={cn(
                  'w-full flex items-center justify-between p-3 rounded-lg text-left transition-all duration-200 mb-1',
                  activeSection === id
                    ? 'bg-purple-600 text-white'
                    : 'text-gray-300 hover:bg-gray-800/50 hover:text-white'
                )}
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center space-x-3">
                  <Icon className="w-4 h-4" />
                  <span className="font-medium">{label}</span>
                </div>
                
                <ChevronRight className={cn(
                  'w-4 h-4 transition-transform',
                  activeSection === id && 'rotate-90'
                )} />
              </motion.button>
            ))}
          </div>
        </ScrollArea>
        
        {/* 底部操作按钮 */}
        <div className="p-4 border-t border-gray-700/50 space-y-2">
          {hasUnsavedChanges && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center space-x-2"
            >
              <Button
                onClick={handleSaveSettings}
                size="sm"
                className="flex-1 bg-green-600 hover:bg-green-500"
              >
                <Save className="w-4 h-4 mr-1" />
                保存
              </Button>
              
              <Button
                onClick={() => setHasUnsavedChanges(false)}
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </Button>
            </motion.div>
          )}
          
          <div className="flex items-center space-x-2">
            <Button
              onClick={handleExportSettings}
              variant="outline"
              size="sm"
              className="flex-1"
            >
              <Download className="w-4 h-4 mr-1" />
              导出
            </Button>
            
            <label className="flex-1">
              <input
                type="file"
                accept=".json"
                onChange={handleImportSettings}
                className="hidden"
              />
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                asChild
              >
                <span>
                  <Upload className="w-4 h-4 mr-1" />
                  导入
                </span>
              </Button>
            </label>
          </div>
          
          <Button
            onClick={handleResetSettings}
            variant="ghost"
            size="sm"
            className="w-full text-red-400 hover:text-red-300 hover:bg-red-500/20"
          >
            <RotateCcw className="w-4 h-4 mr-1" />
            重置设置
          </Button>
        </div>
      </div>
      
      {/* 主内容区 */}
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="p-6">
            <AnimatePresence mode="wait">
              {activeSection === 'appearance' && (
                <AppearanceSettings
                  theme={theme}
                  onThemeChange={updateTheme}
                  onChange={() => setHasUnsavedChanges(true)}
                />
              )}
              
              {activeSection === 'language' && (
              <LanguageSettings 
                language={language} 
                onLanguageChange={(lang: 'zh' | 'en') => updateLanguage(lang)}
                onChange={() => setHasUnsavedChanges(true)}
              />
            )}
              
              {activeSection === 'game' && (
              <GameSettings 
                settings={gameSettings} 
                onSettingsChange={setGameSettings}
                onChange={() => setHasUnsavedChanges(true)}
              />
            )}
              
              {activeSection === 'ai' && (
              <AISettings 
                settings={aiSettings} 
                onSettingsChange={setAISettings}
                onChange={() => setHasUnsavedChanges(true)}
              />
            )}
              
              {activeSection === 'ui' && (
              <UISettings 
                settings={uiSettings} 
                onSettingsChange={setUISettings}
                onChange={() => setHasUnsavedChanges(true)}
              />
            )}
              
              {activeSection === 'privacy' && (
              <PrivacySettings 
                settings={privacySettings} 
                onSettingsChange={setPrivacySettings}
                onChange={() => setHasUnsavedChanges(true)}
              />
            )}
              
              {activeSection === 'advanced' && (
                <AdvancedSettings
                  onChange={() => setHasUnsavedChanges(true)}
                />
              )}
            </AnimatePresence>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}

// 外观设置组件
function AppearanceSettings({ theme, onThemeChange, onChange }: {
  theme: any;
  onThemeChange: (theme: any) => void;
  onChange: () => void;
}) {
  const themes = [
    { id: 'dark', name: '深色主题', icon: Moon, colors: ['#1a1a2e', '#16213e', '#0f3460'] },
    { id: 'light', name: '浅色主题', icon: Sun, colors: ['#ffffff', '#f8f9fa', '#e9ecef'] },
    { id: 'auto', name: '跟随系统', icon: Monitor, colors: ['#1a1a2e', '#ffffff', '#8b5cf6'] }
  ];
  
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div>
        <h3 className="text-2xl font-bold text-white mb-2">外观主题</h3>
        <p className="text-gray-400">自定义应用的外观和主题色彩</p>
      </div>
      
      {/* 主题选择 */}
      <div className="space-y-4">
        <Label className="text-white font-medium">主题模式</Label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {themes.map(({ id, name, icon: Icon, colors }) => (
            <motion.button
              key={id}
              onClick={() => {
                onThemeChange({ ...theme, mode: id });
                onChange();
              }}
              className={cn(
                'p-4 rounded-lg border-2 transition-all duration-200',
                theme.mode === id
                  ? 'border-purple-400 bg-purple-900/30'
                  : 'border-gray-600 bg-gray-900/20 hover:border-gray-500'
              )}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center space-x-3 mb-3">
                <Icon className="w-5 h-5 text-white" />
                <span className="font-medium text-white">{name}</span>
                {theme.mode === id && (
                  <Check className="w-4 h-4 text-green-400 ml-auto" />
                )}
              </div>
              
              <div className="flex space-x-2">
                {colors.map((color, index) => (
                  <div
                    key={index}
                    className="w-8 h-8 rounded-full border border-gray-600"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </motion.button>
          ))}
        </div>
      </div>
      
      {/* 主色调 */}
      <div className="space-y-4">
        <Label className="text-white font-medium">主色调</Label>
        <div className="grid grid-cols-6 gap-3">
          {[
            '#8b5cf6', '#3b82f6', '#10b981', '#f59e0b',
            '#ef4444', '#ec4899', '#6366f1', '#14b8a6'
          ].map((color) => (
            <motion.button
              key={color}
              onClick={() => {
                onThemeChange({ ...theme, primaryColor: color });
                onChange();
              }}
              className={cn(
                'w-12 h-12 rounded-lg border-2 transition-all duration-200',
                theme.primaryColor === color
                  ? 'border-white scale-110'
                  : 'border-gray-600 hover:border-gray-400'
              )}
              style={{ backgroundColor: color }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              {theme.primaryColor === color && (
                <Check className="w-6 h-6 text-white mx-auto" />
              )}
            </motion.button>
          ))}
        </div>
      </div>
      
      {/* 字体大小 */}
      <div className="space-y-4">
        <Label className="text-white font-medium">字体大小</Label>
        <div className="space-y-2">
          <Slider
            value={[theme.fontSize || 16]}
            onValueChange={([value]) => {
              onThemeChange({ ...theme, fontSize: value });
              onChange();
            }}
            min={12}
            max={20}
            step={1}
            className="w-full"
          />
          <div className="flex justify-between text-sm text-gray-400">
            <span>小 (12px)</span>
            <span>当前: {theme.fontSize || 16}px</span>
            <span>大 (20px)</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// 语言设置组件
function LanguageSettings({ language, onLanguageChange, onChange }: {
  language: string;
  onLanguageChange: (language: 'zh' | 'en') => void;
  onChange: () => void;
}) {
  const languages: Array<{ code: 'zh' | 'en'; name: string; flag: string }> = [
    { code: 'zh', name: '简体中文', flag: '🇨🇳' },
    { code: 'en', name: 'English', flag: '🇺🇸' }
  ];
  
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div>
        <h3 className="text-2xl font-bold text-white mb-2">语言设置</h3>
        <p className="text-gray-400">选择应用界面的显示语言</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {languages.map(({ code, name, flag }) => (
          <motion.button
            key={code}
            onClick={() => {
                onLanguageChange(code);
                onChange();
              }}
            className={cn(
              'p-4 rounded-lg border-2 transition-all duration-200 text-left',
              language === code
                ? 'border-purple-400 bg-purple-900/30'
                : 'border-gray-600 bg-gray-900/20 hover:border-gray-500'
            )}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{flag}</span>
                <span className="font-medium text-white">{name}</span>
              </div>
              
              {language === code && (
                <Check className="w-5 h-5 text-green-400" />
              )}
            </div>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}

// 游戏设置组件
function GameSettings({ settings, onSettingsChange, onChange }: {
  settings: GameSettings;
  onSettingsChange: (settings: GameSettings) => void;
  onChange: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div>
        <h3 className="text-2xl font-bold text-white mb-2">游戏设置</h3>
        <p className="text-gray-400">配置塔罗牌游戏的行为和体验</p>
      </div>
      
      <div className="space-y-6">
        {/* 自动洗牌 */}
        <div className="flex items-center justify-between">
          <div>
            <Label className="text-white font-medium">自动洗牌</Label>
            <p className="text-sm text-gray-400">开始新游戏时自动洗牌</p>
          </div>
          <Switch
            checked={settings.autoShuffle}
            onCheckedChange={(checked) => {
              onSettingsChange({ ...settings, autoShuffle: checked });
              onChange();
            }}
          />
        </div>
        
        {/* 允许逆位 */}
        <div className="flex items-center justify-between">
          <div>
            <Label className="text-white font-medium">允许逆位牌</Label>
            <p className="text-sm text-gray-400">抽牌时可能出现逆位</p>
          </div>
          <Switch
            checked={settings.allowReversed}
            onCheckedChange={(checked) => {
              onSettingsChange({ ...settings, allowReversed: checked });
              onChange();
            }}
          />
        </div>
        
        {/* 逆位概率 */}
        {settings.allowReversed && (
          <div className="space-y-2">
            <Label className="text-white font-medium">逆位概率</Label>
            <Slider
              value={[settings.reversedProbability || 30]}
              onValueChange={([value]) => {
                onSettingsChange({ ...settings, reversedProbability: value });
                onChange();
              }}
              min={0}
              max={50}
              step={5}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-gray-400">
              <span>0%</span>
              <span>当前: {settings.reversedProbability || 30}%</span>
              <span>50%</span>
            </div>
          </div>
        )}
        
        {/* 自动保存 */}
        <div className="flex items-center justify-between">
          <div>
            <Label className="text-white font-medium">自动保存游戏</Label>
            <p className="text-sm text-gray-400">自动保存游戏进度</p>
          </div>
          <Switch
            checked={settings.autoSave}
            onCheckedChange={(checked) => {
              onSettingsChange({ ...settings, autoSave: checked });
              onChange();
            }}
          />
        </div>
        
        {/* 音效 */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-white font-medium">游戏音效</Label>
              <p className="text-sm text-gray-400">播放抽牌和翻牌音效</p>
            </div>
            <Switch
              checked={settings.soundEnabled}
              onCheckedChange={(checked) => {
                onSettingsChange({ ...settings, soundEnabled: checked });
                onChange();
              }}
            />
          </div>
          
          {settings.soundEnabled && (
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Volume2 className="w-4 h-4 text-gray-400" />
                <Label className="text-white font-medium">音量</Label>
              </div>
              <Slider
                value={[settings.soundVolume || 50]}
                onValueChange={([value]) => {
                  onSettingsChange({ ...settings, soundVolume: value });
                  onChange();
                }}
                min={0}
                max={100}
                step={10}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-gray-400">
                <span>静音</span>
                <span>{settings.soundVolume || 50}%</span>
                <span>最大</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// AI设置组件
function AISettings({ settings, onSettingsChange, onChange }: {
  settings: AISettings;
  onSettingsChange: (settings: AISettings) => void;
  onChange: () => void;
}) {
  const configStatus = getAIConfigStatus();
  
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div>
        <h3 className="text-2xl font-bold text-white mb-2">AI 设置</h3>
        <p className="text-gray-400">配置 AI 解读和对话功能</p>
      </div>
      
      <div className="space-y-6">
        {/* API 配置状态 */}
        <div className="p-4 rounded-lg border border-gray-600 bg-gray-800/30">
          <div className="flex items-center justify-between mb-3">
            <Label className="text-white font-medium">API 配置状态</Label>
            <Badge 
              variant={configStatus.isConfigured ? "default" : "secondary"}
              className={configStatus.isConfigured ? "bg-green-600" : "bg-yellow-600"}
            >
              {configStatus.isConfigured ? "已配置" : "使用模拟数据"}
            </Badge>
          </div>
          
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-gray-400">API 密钥:</span>
              <span className={configStatus.hasApiKey ? "text-green-400" : "text-red-400"}>
                {configStatus.hasApiKey ? "✓ 已配置" : "✗ 未配置"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Base URL:</span>
              <span className={configStatus.hasBaseUrl ? "text-green-400" : "text-red-400"}>
                {configStatus.hasBaseUrl ? "✓ 已配置" : "✗ 未配置"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">AI 模型:</span>
              <span className={configStatus.hasModel ? "text-green-400" : "text-red-400"}>
                {configStatus.model || "✗ 未配置"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">当前模式:</span>
              <span className="text-blue-400">
                {configStatus.isUsingMockData ? "模拟数据" : "OpenAI API"}
              </span>
            </div>
          </div>
          
          {configStatus.isUsingMockData && (
            <div className="mt-3 p-3 rounded bg-yellow-900/30 border border-yellow-600/30">
              <p className="text-yellow-200 text-sm">
                <strong>注意:</strong> 当前使用模拟数据。要启用真实的AI功能，请在项目根目录的 <code>.env</code> 文件中配置:
              </p>
              <div className="mt-2 p-2 bg-gray-900/50 rounded text-xs font-mono text-gray-300">
                NEXT_PUBLIC_OPENAI_API_KEY=your_api_key_here<br/>
                NEXT_PUBLIC_OPENAI_BASE_URL=https://api.openai.com/v1<br/>
                NEXT_PUBLIC_OPENAI_MODEL=gpt-3.5-turbo
              </div>
            </div>
          )}
        </div>
        
        {/* API 密钥（已弃用，现在使用环境变量） */}
        <div className="space-y-2 opacity-50">
          <Label className="text-white font-medium">API 密钥 (已弃用)</Label>
          <Input
            type="password"
            value=""
            disabled
            placeholder="请在 .env 文件中配置 NEXT_PUBLIC_OPENAI_API_KEY"
            className="bg-gray-800/50 border-gray-600 text-white"
          />
          <p className="text-sm text-gray-400">
            为了安全性，API密钥现在通过环境变量配置。请参考上方的配置说明。
          </p>
        </div>
        
        {/* 解读风格 */}
        <div className="space-y-2">
          <Label className="text-white font-medium">解读风格</Label>
          <select
            value={settings.readingStyle || 'balanced'}
            onChange={(e) => {
              onSettingsChange({ ...settings, readingStyle: e.target.value });
              onChange();
            }}
            className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white"
          >
            <option value="mystical">神秘风格</option>
            <option value="balanced">平衡风格</option>
            <option value="practical">实用风格</option>
            <option value="psychological">心理分析</option>
          </select>
        </div>
        
        {/* 解读长度 */}
        <div className="space-y-2">
          <Label className="text-white font-medium">解读详细程度</Label>
          <Slider
            value={[settings.readingLength || 2]}
            onValueChange={([value]) => {
              onSettingsChange({ ...settings, readingLength: value });
              onChange();
            }}
            min={1}
            max={3}
            step={1}
            className="w-full"
          />
          <div className="flex justify-between text-sm text-gray-400">
            <span>简洁</span>
            <span>详细</span>
            <span>深入</span>
          </div>
        </div>
        
        {/* 自动生成解读 */}
        <div className="flex items-center justify-between">
          <div>
            <Label className="text-white font-medium">自动生成解读</Label>
            <p className="text-sm text-gray-400">完成抽牌后自动生成 AI 解读</p>
          </div>
          <Switch
            checked={settings.autoGenerate}
            onCheckedChange={(checked) => {
              onSettingsChange({ ...settings, autoGenerate: checked });
              onChange();
            }}
          />
        </div>
        
        {/* 对话记忆 */}
        <div className="flex items-center justify-between">
          <div>
            <Label className="text-white font-medium">对话记忆</Label>
            <p className="text-sm text-gray-400">AI 记住之前的对话内容</p>
          </div>
          <Switch
            checked={settings.conversationMemory}
            onCheckedChange={(checked) => {
              onSettingsChange({ ...settings, conversationMemory: checked });
              onChange();
            }}
          />
        </div>
      </div>
    </motion.div>
  );
}

// UI设置组件
function UISettings({ settings, onSettingsChange, onChange }: {
  settings: UISettings;
  onSettingsChange: (settings: UISettings) => void;
  onChange: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div>
        <h3 className="text-2xl font-bold text-white mb-2">界面设置</h3>
        <p className="text-gray-400">自定义用户界面的显示和行为</p>
      </div>
      
      <div className="space-y-6">
        {/* 动画效果 */}
        <div className="flex items-center justify-between">
          <div>
            <Label className="text-white font-medium">动画效果</Label>
            <p className="text-sm text-gray-400">启用界面动画和过渡效果</p>
          </div>
          <Switch
            checked={settings.showAnimations}
            onCheckedChange={(checked) => {
              onSettingsChange({ ...settings, showAnimations: checked });
              onChange();
            }}
          />
        </div>
        
        {/* 位置指引 */}
        <div className="flex items-center justify-between">
          <div>
            <Label className="text-white font-medium">位置指引</Label>
            <p className="text-sm text-gray-400">显示牌位名称和含义</p>
          </div>
          <Switch
            checked={settings.showPositionGuides}
            onCheckedChange={(checked) => {
              onSettingsChange({ ...settings, showPositionGuides: checked });
              onChange();
            }}
          />
        </div>
        
        {/* 卡牌含义 */}
        <div className="flex items-center justify-between">
          <div>
            <Label className="text-white font-medium">卡牌含义提示</Label>
            <p className="text-sm text-gray-400">悬停时显示卡牌含义</p>
          </div>
          <Switch
            checked={settings.showCardMeanings}
            onCheckedChange={(checked) => {
              onSettingsChange({ ...settings, showCardMeanings: checked });
              onChange();
            }}
          />
        </div>
        
        {/* 紧凑模式 */}
        <div className="flex items-center justify-between">
          <div>
            <Label className="text-white font-medium">紧凑模式</Label>
            <p className="text-sm text-gray-400">减少界面间距，适合小屏幕</p>
          </div>
          <Switch
            checked={settings.compactMode}
            onCheckedChange={(checked) => {
              onSettingsChange({ ...settings, compactMode: checked });
              onChange();
            }}
          />
        </div>
        
        {/* 侧边栏位置 */}
        <div className="space-y-2">
          <Label className="text-white font-medium">侧边栏位置</Label>
          <div className="grid grid-cols-2 gap-2">
            {[
              { value: 'left', label: '左侧' },
              { value: 'right', label: '右侧' }
            ].map(({ value, label }) => (
              <Button
                key={value}
                variant={settings.sidebarPosition === value ? 'default' : 'outline'}
                onClick={() => {
                  onSettingsChange({ ...settings, sidebarPosition: value });
                  onChange();
                }}
                className="justify-center"
              >
                {label}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// 隐私设置组件
function PrivacySettings({ settings, onSettingsChange, onChange }: {
  settings: PrivacySettings;
  onSettingsChange: (settings: PrivacySettings) => void;
  onChange: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div>
        <h3 className="text-2xl font-bold text-white mb-2">隐私设置</h3>
        <p className="text-gray-400">管理数据存储和隐私保护</p>
      </div>
      
      <div className="space-y-6">
        {/* 本地存储 */}
        <div className="flex items-center justify-between">
          <div>
            <Label className="text-white font-medium">本地数据存储</Label>
            <p className="text-sm text-gray-400">在设备上保存游戏和对话记录</p>
          </div>
          <Switch
            checked={settings.enableLocalStorage}
            onCheckedChange={(checked) => {
              onSettingsChange({ ...settings, enableLocalStorage: checked });
              onChange();
            }}
          />
        </div>
        
        {/* 数据分析 */}
        <div className="flex items-center justify-between">
          <div>
            <Label className="text-white font-medium">匿名数据分析</Label>
            <p className="text-sm text-gray-400">帮助改进应用体验（不包含个人信息）</p>
          </div>
          <Switch
            checked={settings.enableAnalytics}
            onCheckedChange={(checked) => {
              onSettingsChange({ ...settings, enableAnalytics: checked });
              onChange();
            }}
          />
        </div>
        
        {/* 自动清理 */}
        <div className="space-y-2">
          <Label className="text-white font-medium">自动清理历史记录</Label>
          <select
            value={settings.autoCleanupDays || 30}
            onChange={(e) => {
              onSettingsChange({ ...settings, autoCleanupDays: parseInt(e.target.value) });
              onChange();
            }}
            className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white"
          >
            <option value={7}>7 天</option>
            <option value={30}>30 天</option>
            <option value={90}>90 天</option>
            <option value={365}>1 年</option>
            <option value={0}>从不</option>
          </select>
        </div>
      </div>
    </motion.div>
  );
}

// 高级设置组件
function AdvancedSettings({ onChange }: { onChange: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div>
        <h3 className="text-2xl font-bold text-white mb-2">高级设置</h3>
        <p className="text-gray-400">开发者选项和实验性功能</p>
      </div>
      
      <div className="space-y-6">
        <div className="bg-yellow-900/20 border border-yellow-600/30 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Badge variant="outline" className="text-yellow-400 border-yellow-600">
              实验性
            </Badge>
            <span className="text-yellow-400 font-medium">开发者模式</span>
          </div>
          <p className="text-sm text-gray-300 mb-3">
            启用调试功能和实验性特性，可能影响应用稳定性
          </p>
          <Switch />
        </div>
        
        <div className="bg-red-900/20 border border-red-600/30 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Badge variant="destructive">危险</Badge>
            <span className="text-red-400 font-medium">重置所有数据</span>
          </div>
          <p className="text-sm text-gray-300 mb-3">
            清除所有本地数据，包括设置、历史记录和对话
          </p>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => {
              if (confirm('确定要重置所有数据吗？此操作不可恢复！')) {
                // 重置所有数据的逻辑
                onChange();
              }
            }}
          >
            重置所有数据
          </Button>
        </div>
      </div>
    </motion.div>
  );
}