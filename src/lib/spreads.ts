import { TarotSpread } from '@/types/tarot';

export const tarotSpreads: TarotSpread[] = [
  {
    id: 'three-card',
    name: '三张牌阵',
    description: '过去、现在、未来的简单解读，适合初学者',
    difficulty: 'beginner',
    category: '基础牌阵',
    positions: [
      {
        id: 'past',
        name: '过去',
        meaning: '影响当前情况的过去因素',
        x: 0,
        y: 200
      },
      {
        id: 'present',
        name: '现在',
        meaning: '当前的状况和挑战',
        x: 150,
        y: 200
      },
      {
        id: 'future',
        name: '未来',
        meaning: '可能的结果和发展趋势',
        x: 300,
        y: 200
      }
    ]
  },
  {
    id: 'single-card',
    name: '单张牌阵',
    description: '最简单的一张牌解读，适合日常指导',
    difficulty: 'beginner',
    category: '基础牌阵',
    positions: [
      {
        id: 'guidance',
        name: '指导',
        meaning: '今日的指导和建议',
        x: 150,
        y: 200
      }
    ]
  },
  {
    id: 'love-triangle',
    name: '爱情三角',
    description: '专门用于爱情问题的三张牌阵',
    difficulty: 'beginner',
    category: '爱情牌阵',
    positions: [
      {
        id: 'you',
        name: '你的状态',
        meaning: '你在这段关系中的状态和感受',
        x: 75,
        y: 0
      },
      {
        id: 'partner',
        name: '对方状态',
        meaning: '对方在这段关系中的状态和感受',
        x: 225,
        y: 0
      },
      {
        id: 'relationship',
        name: '关系发展',
        meaning: '这段关系的发展方向和建议',
        x: 150,
        y: 200
      }
    ]
  },
  {
    id: 'career-cross',
    name: '事业十字',
    description: '专门用于事业发展的四张牌阵',
    difficulty: 'intermediate',
    category: '事业牌阵',
    positions: [
      {
        id: 'current-situation',
        name: '当前状况',
        meaning: '你目前的事业状况',
        x: 150,
        y: 200
      },
      {
        id: 'challenge',
        name: '面临挑战',
        meaning: '事业发展中面临的主要挑战',
        x: 150,
        y: 0
      },
      {
        id: 'opportunity',
        name: '发展机会',
        meaning: '可以把握的机会和优势',
        x: 300,
        y: 200
      },
      {
        id: 'advice',
        name: '行动建议',
        meaning: '为了事业发展应该采取的行动',
        x: 150,
        y: 400
      }
    ]
  },
  {
    id: 'celtic-cross',
    name: '凯尔特十字',
    description: '最经典和全面的十张牌综合解读',
    difficulty: 'advanced',
    category: '经典牌阵',
    positions: [
      {
        id: 'present',
        name: '当前状况',
        meaning: '你目前所处的状况',
        x: 150,
        y: 200
      },
      {
        id: 'challenge',
        name: '挑战/阻碍',
        meaning: '横在你面前的挑战或阻碍',
        x: 300,
        y: 200
      },
      {
        id: 'distant-past',
        name: '遥远过去',
        meaning: '影响现状的遥远过去因素',
        x: 150,
        y: 0
      },
      {
        id: 'recent-past',
        name: '近期过去',
        meaning: '最近发生的相关事件',
        x: 0,
        y: 200
      },
      {
        id: 'possible-outcome',
        name: '可能结果',
        meaning: '如果按现在的路径发展的可能结果',
        x: 150,
        y: 400
      },
      {
        id: 'near-future',
        name: '近期未来',
        meaning: '即将发生的事件',
        x: 450,
        y: 200
      },
      {
        id: 'your-approach',
        name: '你的方法',
        meaning: '你处理这个情况的方法',
        x: 600,
        y: 600
      },
      {
        id: 'external-influences',
        name: '外部影响',
        meaning: '外部环境和他人的影响',
        x: 600,
        y: 400
      },
      {
        id: 'hopes-fears',
        name: '希望与恐惧',
        meaning: '你内心的希望和恐惧',
        x: 600,
        y: 200
      },
      {
        id: 'final-outcome',
        name: '最终结果',
        meaning: '综合所有因素后的最终结果',
        x: 600,
        y: 0
      }
    ]
  },
  {
    id: 'horseshoe',
    name: '马蹄铁牌阵',
    description: '七张牌的综合分析，平衡详细度和复杂度',
    difficulty: 'intermediate',
    category: '经典牌阵',
    positions: [
      {
        id: 'past',
        name: '过去',
        meaning: '影响现状的过去因素',
        x: 0,
        y: 200
      },
      {
        id: 'present',
        name: '现在',
        meaning: '当前的状况',
        x: 75,
        y: 200
      },
      {
        id: 'hidden-influences',
        name: '隐藏影响',
        meaning: '你可能没有意识到的影响因素',
        x: 225,
        y: 0
      },
      {
        id: 'advice',
        name: '建议',
        meaning: '应该采取的行动或态度',
        x: 375,
        y: 0
      },
      {
        id: 'external-influences',
        name: '外部影响',
        meaning: '周围环境和他人的影响',
        x: 525,
        y: 200
      },
      {
        id: 'hopes',
        name: '希望',
        meaning: '你的希望和期待',
        x: 600,
        y: 200
      },
      {
        id: 'outcome',
        name: '结果',
        meaning: '最可能的结果',
        x: 300,
        y: 400
      }
    ]
  }
];

// 根据难度获取牌阵
export function getSpreadsByDifficulty(difficulty: 'beginner' | 'intermediate' | 'advanced'): TarotSpread[] {
  return tarotSpreads.filter(spread => spread.difficulty === difficulty);
}

// 根据类别获取牌阵
export function getSpreadsByCategory(category: string): TarotSpread[] {
  return tarotSpreads.filter(spread => spread.category === category);
}

// 获取所有类别
export function getAllCategories(): string[] {
  return [...new Set(tarotSpreads.map(spread => spread.category))];
}

// 根据ID获取牌阵
export function getSpreadById(id: string): TarotSpread | undefined {
  return tarotSpreads.find(spread => spread.id === id);
}

// 获取所有牌阵
export function getAllSpreads(): TarotSpread[] {
  return tarotSpreads;
}