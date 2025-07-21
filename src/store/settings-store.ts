import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SettingsState {
  // 主题设置
  theme: 'dark' | 'light' | 'auto';
  
  // 语言设置
  language: 'zh' | 'en';
  
  // 游戏设置
  autoShuffle: boolean;
  shuffleAnimation: boolean;
  cardFlipAnimation: boolean;
  soundEffects: boolean;
  
  // AI设置
  aiProvider: 'openai' | 'local' | 'mock';
  apiKey: string;
  readingStyle: 'professional' | 'casual' | 'mystical';
  
  // 界面设置
  sidebarCollapsed: boolean;
  chatPanelCollapsed: boolean;
  showCardMeanings: boolean;
  showPositionGuides: boolean;
  showAnimations: boolean;
  
  // 隐私设置
  saveHistory: boolean;
  autoDeleteOldSessions: boolean;
  sessionRetentionDays: number;
}

interface SettingsStore extends SettingsState {
  // Actions
  updateTheme: (theme: SettingsState['theme']) => void;
  updateLanguage: (language: SettingsState['language']) => void;
  updateGameSettings: (settings: Partial<Pick<SettingsState, 'autoShuffle' | 'shuffleAnimation' | 'cardFlipAnimation' | 'soundEffects'>>) => void;
  updateAISettings: (settings: Partial<Pick<SettingsState, 'aiProvider' | 'apiKey' | 'readingStyle'>>) => void;
  updateUISettings: (settings: Partial<Pick<SettingsState, 'sidebarCollapsed' | 'chatPanelCollapsed' | 'showCardMeanings' | 'showPositionGuides' | 'showAnimations'>>) => void;
  updatePrivacySettings: (settings: Partial<Pick<SettingsState, 'saveHistory' | 'autoDeleteOldSessions' | 'sessionRetentionDays'>>) => void;
  resetToDefaults: () => void;
  exportSettings: () => string;
  importSettings: (settingsJson: string) => boolean;
}

const defaultSettings: SettingsState = {
  // 主题设置
  theme: 'dark',
  
  // 语言设置
  language: 'zh',
  
  // 游戏设置
  autoShuffle: true,
  shuffleAnimation: true,
  cardFlipAnimation: true,
  soundEffects: false,
  
  // AI设置
  aiProvider: 'mock',
  apiKey: '',
  readingStyle: 'professional',
  
  // 界面设置
  sidebarCollapsed: false,
  chatPanelCollapsed: false,
  showCardMeanings: true,
  showPositionGuides: true,
  showAnimations: true,
  
  // 隐私设置
  saveHistory: true,
  autoDeleteOldSessions: false,
  sessionRetentionDays: 30
};

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set, get) => ({
      ...defaultSettings,

      // Actions
      updateTheme: (theme) => {
        set({ theme });
        // 应用主题到document
        if (typeof window !== 'undefined') {
          document.documentElement.setAttribute('data-theme', theme);
        }
      },

      updateLanguage: (language) => {
        set({ language });
        // 这里可以添加语言切换逻辑
      },

      updateGameSettings: (settings) => {
        set(state => ({ ...state, ...settings }));
      },

      updateAISettings: (settings) => {
        set(state => ({ ...state, ...settings }));
      },

      updateUISettings: (settings) => {
        set(state => ({ ...state, ...settings }));
      },

      updatePrivacySettings: (settings) => {
        set(state => ({ ...state, ...settings }));
      },

      resetToDefaults: () => {
        set(defaultSettings);
      },

      exportSettings: () => {
        const state = get();
        return JSON.stringify(state, null, 2);
      },

      importSettings: (settingsJson) => {
        try {
          const settings = JSON.parse(settingsJson);
          
          // 验证设置格式
          const validKeys = Object.keys(defaultSettings);
          const importedKeys = Object.keys(settings);
          
          const isValid = importedKeys.every(key => validKeys.includes(key));
          
          if (isValid) {
            set({ ...defaultSettings, ...settings });
            return true;
          } else {
            console.error('无效的设置格式');
            return false;
          }
        } catch (error) {
          console.error('导入设置失败:', error);
          return false;
        }
      }
    }),
    {
      name: 'tarot-ai-settings',
      version: 1,
      // 迁移函数，用于处理版本升级
      migrate: (persistedState: unknown, version: number) => {
        if (version === 0) {
          // 从版本0迁移到版本1
          return { ...defaultSettings, ...(persistedState as Partial<SettingsState>) };
        }
        return persistedState as SettingsState;
      }
    }
  )
);

// 辅助函数：获取当前主题
export function getCurrentTheme(): 'dark' | 'light' {
  const { theme } = useSettingsStore.getState();
  
  if (theme === 'auto') {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'dark';
  }
  
  return theme;
}

// 辅助函数：检查是否启用了某个功能
export function isFeatureEnabled(feature: keyof SettingsState): boolean {
  const state = useSettingsStore.getState();
  return Boolean(state[feature]);
}

// 辅助函数：获取AI配置
export function getAIConfig() {
  const { aiProvider, apiKey, readingStyle } = useSettingsStore.getState();
  return {
    provider: aiProvider,
    apiKey,
    style: readingStyle,
    isConfigured: aiProvider !== 'mock' && apiKey.length > 0
  };
}

// 辅助函数：获取隐私设置摘要
export function getPrivacySettings() {
  const { saveHistory, autoDeleteOldSessions, sessionRetentionDays } = useSettingsStore.getState();
  return {
    saveHistory,
    autoDeleteOldSessions,
    sessionRetentionDays,
    shouldSaveData: saveHistory
  };
}