import { TarotCard } from '@/types/tarot';

// 大阿卡纳牌数据
export const majorArcana: TarotCard[] = [
  {
    id: 'fool',
    name: '愚者',
    nameEn: 'The Fool',
    type: 'major',
    number: 0,
    uprightMeaning: '新的开始、纯真、自发性、自由精神、冒险',
    reversedMeaning: '鲁莽、冒险、愚蠢、缺乏方向、恐惧',
    imageUrl: '/assets/tarot-cards/major/00-fool.jpg',
    keywords: ['新开始', '冒险', '纯真', '自由', '潜力'],
    description: '愚者代表新的开始和无限的可能性，象征着纯真的心灵和对未知的勇敢探索。'
  },
  {
    id: 'magician',
    name: '魔术师',
    nameEn: 'The Magician',
    type: 'major',
    number: 1,
    uprightMeaning: '意志力、创造力、技能、专注、行动力',
    reversedMeaning: '缺乏专注、滥用权力、欺骗、操控',
    imageUrl: '/assets/tarot-cards/major/01-magician.jpg',
    keywords: ['意志力', '创造', '技能', '专注', '行动'],
    description: '魔术师象征着将想法转化为现实的能力，代表专注的意志力和创造的技能。'
  },
  {
    id: 'high-priestess',
    name: '女祭司',
    nameEn: 'The High Priestess',
    type: 'major',
    number: 2,
    uprightMeaning: '直觉、潜意识、神秘、内在智慧、静默',
    reversedMeaning: '缺乏直觉、表面化、秘密被揭露',
    imageUrl: '/assets/tarot-cards/major/02-high-priestess.jpg',
    keywords: ['直觉', '智慧', '神秘', '潜意识', '静默'],
    description: '女祭司代表内在的智慧和直觉，象征着对潜意识和神秘知识的理解。'
  },
  {
    id: 'empress',
    name: '皇后',
    nameEn: 'The Empress',
    type: 'major',
    number: 3,
    uprightMeaning: '丰饶、母性、创造力、自然、感官享受',
    reversedMeaning: '依赖、空虚、缺乏成长、创造力受阻',
    imageUrl: '/assets/tarot-cards/major/03-empress.jpg',
    keywords: ['丰饶', '母性', '创造', '自然', '感官'],
    description: '皇后象征着丰饶和创造力，代表母性的关怀和自然的生命力。'
  },
  {
    id: 'emperor',
    name: '皇帝',
    nameEn: 'The Emperor',
    type: 'major',
    number: 4,
    uprightMeaning: '权威、结构、控制、稳定、父性',
    reversedMeaning: '专制、缺乏纪律、不成熟、权力滥用',
    imageUrl: '/assets/tarot-cards/major/04-emperor.jpg',
    keywords: ['权威', '结构', '控制', '稳定', '领导'],
    description: '皇帝代表权威和秩序，象征着稳定的结构和强有力的领导。'
  },
  {
    id: 'hierophant',
    name: '教皇',
    nameEn: 'The Hierophant',
    type: 'major',
    number: 5,
    uprightMeaning: '传统、精神指导、宗教、教育、道德',
    reversedMeaning: '反叛、非传统、个人信仰、创新',
    imageUrl: '/assets/tarot-cards/major/05-hierophant.jpg',
    keywords: ['传统', '指导', '宗教', '教育', '道德'],
    description: '教皇代表传统智慧和精神指导，象征着对传统价值观的遵循。'
  },
  {
    id: 'lovers',
    name: '恋人',
    nameEn: 'The Lovers',
    type: 'major',
    number: 6,
    uprightMeaning: '爱情、关系、选择、和谐、价值观',
    reversedMeaning: '不和谐、错误选择、价值观冲突、分离',
    imageUrl: '/assets/tarot-cards/major/06-lovers.jpg',
    keywords: ['爱情', '关系', '选择', '和谐', '价值'],
    description: '恋人代表爱情和重要的选择，象征着关系中的和谐与价值观的统一。'
  },
  {
    id: 'chariot',
    name: '战车',
    nameEn: 'The Chariot',
    type: 'major',
    number: 7,
    uprightMeaning: '胜利、意志力、控制、决心、成功',
    reversedMeaning: '失控、缺乏方向、失败、自我怀疑',
    imageUrl: '/assets/tarot-cards/major/07-chariot.jpg',
    keywords: ['胜利', '意志', '控制', '决心', '成功'],
    description: '战车代表通过意志力和决心获得的胜利，象征着克服困难的能力。'
  },
  {
    id: 'strength',
    name: '力量',
    nameEn: 'Strength',
    type: 'major',
    number: 8,
    uprightMeaning: '内在力量、勇气、耐心、自控、慈悲',
    reversedMeaning: '软弱、自我怀疑、缺乏信心、残忍',
    imageUrl: '/assets/tarot-cards/major/08-strength.jpg',
    keywords: ['力量', '勇气', '耐心', '自控', '慈悲'],
    description: '力量代表内在的勇气和温柔的力量，象征着通过爱和耐心克服困难。'
  },
  {
    id: 'hermit',
    name: '隐者',
    nameEn: 'The Hermit',
    type: 'major',
    number: 9,
    uprightMeaning: '内省、寻求真理、指导、智慧、孤独',
    reversedMeaning: '孤立、拒绝帮助、迷失方向、固执',
    imageUrl: '/assets/tarot-cards/major/09-hermit.jpg',
    keywords: ['内省', '真理', '指导', '智慧', '孤独'],
    description: '隐者代表内在的寻求和智慧的指导，象征着通过内省找到真理。'
  },
  {
    id: 'wheel-of-fortune',
    name: '命运之轮',
    nameEn: 'Wheel of Fortune',
    type: 'major',
    number: 10,
    uprightMeaning: '命运、机会、变化、循环、好运',
    reversedMeaning: '厄运、失控、抗拒变化、破坏循环',
    imageUrl: '/assets/tarot-cards/major/10-wheel-of-fortune.jpg',
    keywords: ['命运', '机会', '变化', '循环', '运气'],
    description: '命运之轮代表生命的循环和变化，象征着机会和命运的转折。'
  },
  {
    id: 'justice',
    name: '正义',
    nameEn: 'Justice',
    type: 'major',
    number: 11,
    uprightMeaning: '公正、平衡、真理、法律、因果',
    reversedMeaning: '不公、偏见、缺乏责任、逃避后果',
    imageUrl: '/assets/tarot-cards/major/11-justice.jpg',
    keywords: ['公正', '平衡', '真理', '法律', '因果'],
    description: '正义代表公平和平衡，象征着真理和因果报应的法则。'
  },
  {
    id: 'hanged-man',
    name: '倒吊人',
    nameEn: 'The Hanged Man',
    type: 'major',
    number: 12,
    uprightMeaning: '牺牲、等待、新视角、放手、暂停',
    reversedMeaning: '拖延、抗拒、无意义的牺牲、停滞',
    imageUrl: '/assets/tarot-cards/major/12-hanged-man.jpg',
    keywords: ['牺牲', '等待', '视角', '放手', '暂停'],
    description: '倒吊人代表通过牺牲和等待获得新的视角，象征着放下执着的智慧。'
  },
  {
    id: 'death',
    name: '死神',
    nameEn: 'Death',
    type: 'major',
    number: 13,
    uprightMeaning: '结束、转变、重生、释放、新开始',
    reversedMeaning: '抗拒变化、停滞、恐惧、缓慢转变',
    imageUrl: '/assets/tarot-cards/major/13-death.jpg',
    keywords: ['结束', '转变', '重生', '释放', '新生'],
    description: '死神代表结束和转变，象征着旧事物的死亡和新生命的诞生。'
  },
  {
    id: 'temperance',
    name: '节制',
    nameEn: 'Temperance',
    type: 'major',
    number: 14,
    uprightMeaning: '平衡、节制、耐心、和谐、中庸',
    reversedMeaning: '不平衡、过度、缺乏耐心、冲突',
    imageUrl: '/assets/tarot-cards/major/14-temperance.jpg',
    keywords: ['平衡', '节制', '耐心', '和谐', '中庸'],
    description: '节制代表平衡和适度，象征着通过耐心和节制达到和谐。'
  },
  {
    id: 'devil',
    name: '恶魔',
    nameEn: 'The Devil',
    type: 'major',
    number: 15,
    uprightMeaning: '束缚、诱惑、物质主义、依赖、恐惧',
    reversedMeaning: '解脱、觉醒、打破束缚、自由、启示',
    imageUrl: '/assets/tarot-cards/major/15-devil.jpg',
    keywords: ['束缚', '诱惑', '物质', '依赖', '恐惧'],
    description: '恶魔代表束缚和诱惑，象征着物质欲望和恐惧的枷锁。'
  },
  {
    id: 'tower',
    name: '塔',
    nameEn: 'The Tower',
    type: 'major',
    number: 16,
    uprightMeaning: '突然变化、破坏、启示、觉醒、混乱',
    reversedMeaning: '避免灾难、内在变化、抗拒改变、延迟',
    imageUrl: '/assets/tarot-cards/major/16-tower.jpg',
    keywords: ['变化', '破坏', '启示', '觉醒', '混乱'],
    description: '塔代表突然的变化和破坏，象征着旧结构的崩塌和新的觉醒。'
  },
  {
    id: 'star',
    name: '星星',
    nameEn: 'The Star',
    type: 'major',
    number: 17,
    uprightMeaning: '希望、信仰、灵感、治愈、指导',
    reversedMeaning: '绝望、缺乏信仰、失去方向、自我怀疑',
    imageUrl: '/assets/tarot-cards/major/17-star.jpg',
    keywords: ['希望', '信仰', '灵感', '治愈', '指导'],
    description: '星星代表希望和信仰，象征着在黑暗中的指引和治愈的力量。'
  },
  {
    id: 'moon',
    name: '月亮',
    nameEn: 'The Moon',
    type: 'major',
    number: 18,
    uprightMeaning: '幻象、直觉、潜意识、恐惧、不确定',
    reversedMeaning: '释放恐惧、直觉清晰、真相显现、内在平静',
    imageUrl: '/assets/tarot-cards/major/18-moon.jpg',
    keywords: ['幻象', '直觉', '潜意识', '恐惧', '不确定'],
    description: '月亮代表幻象和潜意识，象征着内心深处的恐惧和直觉的力量。'
  },
  {
    id: 'sun',
    name: '太阳',
    nameEn: 'The Sun',
    type: 'major',
    number: 19,
    uprightMeaning: '成功、快乐、活力、乐观、成就',
    reversedMeaning: '过度乐观、延迟成功、缺乏活力、自负',
    imageUrl: '/assets/tarot-cards/major/19-sun.jpg',
    keywords: ['成功', '快乐', '活力', '乐观', '成就'],
    description: '太阳代表成功和快乐，象征着生命的活力和积极的能量。'
  },
  {
    id: 'judgement',
    name: '审判',
    nameEn: 'Judgement',
    type: 'major',
    number: 20,
    uprightMeaning: '重生、觉醒、第二次机会、宽恕、救赎',
    reversedMeaning: '自我怀疑、严厉判断、缺乏宽恕、错失机会',
    imageUrl: '/assets/tarot-cards/major/20-judgement.jpg',
    keywords: ['重生', '觉醒', '机会', '宽恕', '救赎'],
    description: '审判代表重生和觉醒，象征着第二次机会和精神的救赎。'
  },
  {
    id: 'world',
    name: '世界',
    nameEn: 'The World',
    type: 'major',
    number: 21,
    uprightMeaning: '完成、成就、旅程结束、满足、成功',
    reversedMeaning: '未完成、缺乏成就、延迟、寻求外在认可',
    imageUrl: '/assets/tarot-cards/major/21-world.jpg',
    keywords: ['完成', '成就', '结束', '满足', '成功'],
    description: '世界代表完成和成就，象征着人生旅程的圆满结束和新的开始。'
  }
];

// 小阿卡纳牌数据 - 权杖花色
export const wands: TarotCard[] = [
  {
    id: 'ace-wands',
    name: '权杖王牌',
    nameEn: 'Ace of Wands',
    suit: 'wands',
    number: 1,
    type: 'minor',
    uprightMeaning: '创造力、灵感、新项目、潜力、成长',
    reversedMeaning: '缺乏能量、延迟、缺乏方向、创造力受阻',
    imageUrl: '/assets/tarot-cards/wands/ace-wands.jpg',
    keywords: ['创造', '灵感', '开始', '潜力', '能量'],
    description: '权杖王牌代表创造力的火花和新项目的开始。'
  },
  {
    id: 'two-wands',
    name: '权杖二',
    nameEn: 'Two of Wands',
    suit: 'wands',
    number: 2,
    type: 'minor',
    uprightMeaning: '规划、决策、个人力量、控制、未来规划',
    reversedMeaning: '缺乏规划、恐惧、缺乏控制、延迟决策',
    imageUrl: '/assets/tarot-cards/wands/two-wands.jpg',
    keywords: ['规划', '决策', '力量', '控制', '未来'],
    description: '权杖二代表个人力量和未来规划的重要性。'
  },
  {
    id: 'three-wands',
    name: '权杖三',
    nameEn: 'Three of Wands',
    suit: 'wands',
    number: 3,
    type: 'minor',
    uprightMeaning: '扩展、远见、领导力、机会、进步',
    reversedMeaning: '缺乏远见、延迟、个人挫折、缺乏进步',
    imageUrl: '/assets/tarot-cards/wands/three-wands.jpg',
    keywords: ['扩展', '远见', '领导', '机会', '进步'],
    description: '权杖三代表扩展视野和寻求新机会的时机。'
  },
  {
    id: 'four-wands',
    name: '权杖四',
    nameEn: 'Four of Wands',
    suit: 'wands',
    number: 4,
    type: 'minor',
    uprightMeaning: '庆祝、和谐、家庭、稳定、成就',
    reversedMeaning: '家庭冲突、缺乏支持、不稳定、延迟庆祝',
    imageUrl: '/assets/tarot-cards/wands/four-wands.jpg',
    keywords: ['庆祝', '和谐', '家庭', '稳定', '成就'],
    description: '权杖四代表庆祝成就和家庭和谐的时刻。'
  },
  {
    id: 'five-wands',
    name: '权杖五',
    nameEn: 'Five of Wands',
    suit: 'wands',
    number: 5,
    type: 'minor',
    uprightMeaning: '冲突、竞争、紧张、分歧、挑战',
    reversedMeaning: '避免冲突、内在冲突、缺乏多样性、协议',
    imageUrl: '/assets/tarot-cards/wands/five-wands.jpg',
    keywords: ['冲突', '竞争', '紧张', '分歧', '挑战'],
    description: '权杖五代表竞争和冲突，需要找到解决分歧的方法。'
  },
  {
    id: 'six-wands',
    name: '权杖六',
    nameEn: 'Six of Wands',
    suit: 'wands',
    number: 6,
    type: 'minor',
    uprightMeaning: '胜利、成功、公众认可、进步、自信',
    reversedMeaning: '私人成就、自我怀疑、缺乏认可、延迟成功',
    imageUrl: '/assets/tarot-cards/wands/six-wands.jpg',
    keywords: ['胜利', '成功', '认可', '进步', '自信'],
    description: '权杖六代表胜利和公众认可，是成功的象征。'
  },
  {
    id: 'seven-wands',
    name: '权杖七',
    nameEn: 'Seven of Wands',
    suit: 'wands',
    number: 7,
    type: 'minor',
    uprightMeaning: '防御、挑战、毅力、竞争、保护立场',
    reversedMeaning: '屈服压力、缺乏自信、放弃、压倒性挑战',
    imageUrl: '/assets/tarot-cards/wands/seven-wands.jpg',
    keywords: ['防御', '挑战', '毅力', '竞争', '保护'],
    description: '权杖七代表面对挑战时的坚持和防御立场。'
  },
  {
    id: 'eight-wands',
    name: '权杖八',
    nameEn: 'Eight of Wands',
    suit: 'wands',
    number: 8,
    type: 'minor',
    uprightMeaning: '快速行动、进展、变化、消息、旅行',
    reversedMeaning: '延迟、挫折、缺乏进展、内在变化',
    imageUrl: '/assets/tarot-cards/wands/eight-wands.jpg',
    keywords: ['快速', '行动', '进展', '变化', '消息'],
    description: '权杖八代表快速的进展和积极的变化。'
  },
  {
    id: 'nine-wands',
    name: '权杖九',
    nameEn: 'Nine of Wands',
    suit: 'wands',
    number: 9,
    type: 'minor',
    uprightMeaning: '韧性、毅力、测试、边界、最后推进',
    reversedMeaning: '固执、偏执、防御过度、缺乏能量',
    imageUrl: '/assets/tarot-cards/wands/nine-wands.jpg',
    keywords: ['韧性', '毅力', '测试', '边界', '推进'],
    description: '权杖九代表在困难中的坚持和最后的努力。'
  },
  {
    id: 'ten-wands',
    name: '权杖十',
    nameEn: 'Ten of Wands',
    suit: 'wands',
    number: 10,
    type: 'minor',
    uprightMeaning: '负担、责任、努力工作、压力、成就',
    reversedMeaning: '释放负担、委派、寻求帮助、工作过度',
    imageUrl: '/assets/tarot-cards/wands/ten-wands.jpg',
    keywords: ['负担', '责任', '努力', '压力', '成就'],
    description: '权杖十代表承担重大责任和努力工作的负担。'
  },
  {
    id: 'page-wands',
    name: '权杖侍者',
    nameEn: 'Page of Wands',
    suit: 'wands',
    number: 11,
    type: 'minor',
    uprightMeaning: '探索、兴奋、自由精神、新想法、学习',
    reversedMeaning: '缺乏方向、拖延、缺乏计划、不成熟',
    imageUrl: '/assets/tarot-cards/wands/page-wands.jpg',
    keywords: ['探索', '兴奋', '自由', '想法', '学习'],
    description: '权杖侍者代表探索新想法和自由精神的年轻能量。'
  },
  {
    id: 'knight-wands',
    name: '权杖骑士',
    nameEn: 'Knight of Wands',
    suit: 'wands',
    number: 12,
    type: 'minor',
    uprightMeaning: '行动、冲动、冒险、能量、热情',
    reversedMeaning: '鲁莽、缺乏耐心、冲动、缺乏自制',
    imageUrl: '/assets/tarot-cards/wands/knight-wands.jpg',
    keywords: ['行动', '冲动', '冒险', '能量', '热情'],
    description: '权杖骑士代表充满热情的行动和冒险精神。'
  },
  {
    id: 'queen-wands',
    name: '权杖王后',
    nameEn: 'Queen of Wands',
    suit: 'wands',
    number: 13,
    type: 'minor',
    uprightMeaning: '自信、独立、热情、决心、社交能力',
    reversedMeaning: '自私、嫉妒、缺乏自信、情绪化',
    imageUrl: '/assets/tarot-cards/wands/queen-wands.jpg',
    keywords: ['自信', '独立', '热情', '决心', '社交'],
    description: '权杖王后代表自信独立的女性能量和领导力。'
  },
  {
    id: 'king-wands',
    name: '权杖国王',
    nameEn: 'King of Wands',
    suit: 'wands',
    number: 14,
    type: 'minor',
    uprightMeaning: '领导力、愿景、企业家精神、荣誉、成功',
    reversedMeaning: '专制、冲动、缺乏耐心、滥用权力',
    imageUrl: '/assets/tarot-cards/wands/king-wands.jpg',
    keywords: ['领导', '愿景', '企业家', '荣誉', '成功'],
    description: '权杖国王代表成熟的领导力和企业家精神。'
  }
];

// 小阿卡纳牌数据 - 圣杯花色
export const cups: TarotCard[] = [
  {
    id: 'ace-cups',
    name: '圣杯王牌',
    nameEn: 'Ace of Cups',
    suit: 'cups',
    number: 1,
    type: 'minor',
    uprightMeaning: '新的爱情、情感满足、直觉、精神觉醒',
    reversedMeaning: '情感封闭、失望、缺乏爱、精神空虚',
    imageUrl: '/assets/tarot-cards/cups/ace-cups.jpg',
    keywords: ['爱情', '情感', '直觉', '精神', '满足'],
    description: '圣杯王牌代表情感的新开始和精神的满足。'
  },
  {
    id: 'two-cups',
    name: '圣杯二',
    nameEn: 'Two of Cups',
    suit: 'cups',
    number: 2,
    type: 'minor',
    uprightMeaning: '伙伴关系、爱情、友谊、连接、合作',
    reversedMeaning: '关系破裂、不平衡、缺乏和谐、自爱',
    imageUrl: '/assets/tarot-cards/cups/two-cups.jpg',
    keywords: ['伙伴', '爱情', '友谊', '连接', '合作'],
    description: '圣杯二代表深刻的情感连接和伙伴关系。'
  },
  {
    id: 'three-cups',
    name: '圣杯三',
    nameEn: 'Three of Cups',
    suit: 'cups',
    number: 3,
    type: 'minor',
    uprightMeaning: '友谊、庆祝、创造力、社区、团体和谐',
    reversedMeaning: '独立、缺乏团体支持、过度放纵、孤立',
    imageUrl: '/assets/tarot-cards/cups/three-cups.jpg',
    keywords: ['友谊', '庆祝', '创造', '社区', '和谐'],
    description: '圣杯三代表友谊的庆祝和团体的和谐。'
  },
  {
    id: 'four-cups',
    name: '圣杯四',
    nameEn: 'Four of Cups',
    suit: 'cups',
    number: 4,
    type: 'minor',
    uprightMeaning: '冥想、沉思、厌倦、重新评估、内省',
    reversedMeaning: '动机、新机会、重新燃起兴趣、觉醒',
    imageUrl: '/assets/tarot-cards/cups/four-cups.jpg',
    keywords: ['冥想', '沉思', '厌倦', '评估', '内省'],
    description: '圣杯四代表内省和重新评估生活的时期。'
  },
  {
    id: 'five-cups',
    name: '圣杯五',
    nameEn: 'Five of Cups',
    suit: 'cups',
    number: 5,
    type: 'minor',
    uprightMeaning: '失望、悲伤、后悔、失落、悲痛',
    reversedMeaning: '接受、原谅、从失败中学习、向前看',
    imageUrl: '/assets/tarot-cards/cups/five-cups.jpg',
    keywords: ['失望', '悲伤', '后悔', '失落', '悲痛'],
    description: '圣杯五代表失望和悲伤，但也暗示希望的存在。'
  },
  {
    id: 'six-cups',
    name: '圣杯六',
    nameEn: 'Six of Cups',
    suit: 'cups',
    number: 6,
    type: 'minor',
    uprightMeaning: '怀旧、童年、纯真、重聚、简单快乐',
    reversedMeaning: '活在过去、理想化、缺乏现实感、幼稚',
    imageUrl: '/assets/tarot-cards/cups/six-cups.jpg',
    keywords: ['怀旧', '童年', '纯真', '重聚', '快乐'],
    description: '圣杯六代表怀旧和童年的纯真快乐。'
  },
  {
    id: 'seven-cups',
    name: '圣杯七',
    nameEn: 'Seven of Cups',
    suit: 'cups',
    number: 7,
    type: 'minor',
    uprightMeaning: '选择、幻想、愿望、机会、困惑',
    reversedMeaning: '决心、现实、专注、缺乏选择、清晰',
    imageUrl: '/assets/tarot-cards/cups/seven-cups.jpg',
    keywords: ['选择', '幻想', '愿望', '机会', '困惑'],
    description: '圣杯七代表面对多种选择时的困惑和幻想。'
  },
  {
    id: 'eight-cups',
    name: '圣杯八',
    nameEn: 'Eight of Cups',
    suit: 'cups',
    number: 8,
    type: 'minor',
    uprightMeaning: '放弃、寻求、精神之旅、失望、离开',
    reversedMeaning: '恐惧改变、避免、停滞、缺乏成长',
    imageUrl: '/assets/tarot-cards/cups/eight-cups.jpg',
    keywords: ['放弃', '寻求', '精神', '失望', '离开'],
    description: '圣杯八代表放弃不满足的情况，寻求更深层的意义。'
  },
  {
    id: 'nine-cups',
    name: '圣杯九',
    nameEn: 'Nine of Cups',
    suit: 'cups',
    number: 9,
    type: 'minor',
    uprightMeaning: '满足、快乐、愿望实现、成功、丰盛',
    reversedMeaning: '内在快乐、物质主义、贪婪、不满足',
    imageUrl: '/assets/tarot-cards/cups/nine-cups.jpg',
    keywords: ['满足', '快乐', '愿望', '成功', '丰盛'],
    description: '圣杯九代表愿望的实现和情感的满足。'
  },
  {
    id: 'ten-cups',
    name: '圣杯十',
    nameEn: 'Ten of Cups',
    suit: 'cups',
    number: 10,
    type: 'minor',
    uprightMeaning: '家庭幸福、和谐、满足、情感完整、快乐',
    reversedMeaning: '家庭冲突、破碎关系、缺乏和谐、价值观分歧',
    imageUrl: '/assets/tarot-cards/cups/ten-cups.jpg',
    keywords: ['家庭', '幸福', '和谐', '满足', '完整'],
    description: '圣杯十代表家庭的幸福和情感的完整满足。'
  },
  {
    id: 'page-cups',
    name: '圣杯侍者',
    nameEn: 'Page of Cups',
    suit: 'cups',
    number: 11,
    type: 'minor',
    uprightMeaning: '创造性消息、直觉、新关系、艺术灵感',
    reversedMeaning: '情感不成熟、创造力受阻、缺乏目标',
    imageUrl: '/assets/tarot-cards/cups/page-cups.jpg',
    keywords: ['创造', '消息', '直觉', '关系', '灵感'],
    description: '圣杯侍者代表创造性的消息和新的情感开始。'
  },
  {
    id: 'knight-cups',
    name: '圣杯骑士',
    nameEn: 'Knight of Cups',
    suit: 'cups',
    number: 12,
    type: 'minor',
    uprightMeaning: '浪漫、魅力、跟随内心、艺术、理想主义',
    reversedMeaning: '情绪化、不现实、缺乏目标、情感操控',
    imageUrl: '/assets/tarot-cards/cups/knight-cups.jpg',
    keywords: ['浪漫', '魅力', '内心', '艺术', '理想'],
    description: '圣杯骑士代表浪漫的理想主义和跟随内心的勇气。'
  },
  {
    id: 'queen-cups',
    name: '圣杯王后',
    nameEn: 'Queen of Cups',
    suit: 'cups',
    number: 13,
    type: 'minor',
    uprightMeaning: '同情心、直觉、情感成熟、治愈、关怀',
    reversedMeaning: '情感依赖、缺乏边界、情绪不稳、自怜',
    imageUrl: '/assets/tarot-cards/cups/queen-cups.jpg',
    keywords: ['同情', '直觉', '成熟', '治愈', '关怀'],
    description: '圣杯王后代表情感的成熟和深刻的同情心。'
  },
  {
    id: 'king-cups',
    name: '圣杯国王',
    nameEn: 'King of Cups',
    suit: 'cups',
    number: 14,
    type: 'minor',
    uprightMeaning: '情感平衡、慈悲、外交、冷静、智慧',
    reversedMeaning: '情感操控、情绪化、缺乏同情、冷漠',
    imageUrl: '/assets/tarot-cards/cups/king-cups.jpg',
    keywords: ['平衡', '慈悲', '外交', '冷静', '智慧'],
    description: '圣杯国王代表情感的平衡和成熟的智慧。'
  }
];

// 小阿卡纳牌数据 - 宝剑花色
export const swords: TarotCard[] = [
  {
    id: 'ace-swords',
    name: '宝剑王牌',
    nameEn: 'Ace of Swords',
    suit: 'swords',
    number: 1,
    type: 'minor',
    uprightMeaning: '新想法、心智清晰、突破、真理、正义',
    reversedMeaning: '困惑、缺乏清晰、错误信息、暴力',
    imageUrl: '/assets/tarot-cards/swords/ace-swords.jpg',
    keywords: ['想法', '清晰', '突破', '真理', '正义'],
    description: '宝剑王牌代表新想法的诞生和心智的清晰。'
  },
  {
    id: 'two-swords',
    name: '宝剑二',
    nameEn: 'Two of Swords',
    suit: 'swords',
    number: 2,
    type: 'minor',
    uprightMeaning: '困难决定、权衡、僵局、回避、平衡',
    reversedMeaning: '优柔寡断、信息过载、犹豫不决、混乱',
    imageUrl: '/assets/tarot-cards/swords/two-swords.jpg',
    keywords: ['决定', '权衡', '僵局', '回避', '平衡'],
    description: '宝剑二代表面临困难决定时的犹豫和权衡。'
  },
  {
    id: 'three-swords',
    name: '宝剑三',
    nameEn: 'Three of Swords',
    suit: 'swords',
    number: 3,
    type: 'minor',
    uprightMeaning: '心碎、悲伤、背叛、分离、痛苦',
    reversedMeaning: '治愈、原谅、恢复、释放痛苦、乐观',
    imageUrl: '/assets/tarot-cards/swords/three-swords.jpg',
    keywords: ['心碎', '悲伤', '背叛', '分离', '痛苦'],
    description: '宝剑三代表心碎和情感上的痛苦。'
  },
  {
    id: 'four-swords',
    name: '宝剑四',
    nameEn: 'Four of Swords',
    suit: 'swords',
    number: 4,
    type: 'minor',
    uprightMeaning: '休息、恢复、冥想、沉思、平静',
    reversedMeaning: '精疲力竭、倦怠、停滞、缺乏进展',
    imageUrl: '/assets/tarot-cards/swords/four-swords.jpg',
    keywords: ['休息', '恢复', '冥想', '沉思', '平静'],
    description: '宝剑四代表需要休息和恢复的时期。'
  },
  {
    id: 'five-swords',
    name: '宝剑五',
    nameEn: 'Five of Swords',
    suit: 'swords',
    number: 5,
    type: 'minor',
    uprightMeaning: '冲突、失败、背叛、胜利代价、不公平',
    reversedMeaning: '和解、原谅、从冲突中学习、妥协',
    imageUrl: '/assets/tarot-cards/swords/five-swords.jpg',
    keywords: ['冲突', '失败', '背叛', '代价', '不公'],
    description: '宝剑五代表冲突和胜利的代价。'
  },
  {
    id: 'six-swords',
    name: '宝剑六',
    nameEn: 'Six of Swords',
    suit: 'swords',
    number: 6,
    type: 'minor',
    uprightMeaning: '过渡、改变、离开、向前、恢复',
    reversedMeaning: '抗拒改变、困在过去、缺乏进展、动荡',
    imageUrl: '/assets/tarot-cards/swords/six-swords.jpg',
    keywords: ['过渡', '改变', '离开', '向前', '恢复'],
    description: '宝剑六代表从困难中过渡到更好的状况。'
  },
  {
    id: 'seven-swords',
    name: '宝剑七',
    nameEn: 'Seven of Swords',
    suit: 'swords',
    number: 7,
    type: 'minor',
    uprightMeaning: '欺骗、策略、偷窃、逃避、不诚实',
    reversedMeaning: '坦白、诚实、归还、承认错误、良心',
    imageUrl: '/assets/tarot-cards/swords/seven-swords.jpg',
    keywords: ['欺骗', '策略', '偷窃', '逃避', '不诚实'],
    description: '宝剑七代表欺骗和不诚实的行为。'
  },
  {
    id: 'eight-swords',
    name: '宝剑八',
    nameEn: 'Eight of Swords',
    suit: 'swords',
    number: 8,
    type: 'minor',
    uprightMeaning: '束缚、限制、受困、无助、受害者心态',
    reversedMeaning: '自由、释放、新视角、自我赋权、突破',
    imageUrl: '/assets/tarot-cards/swords/eight-swords.jpg',
    keywords: ['束缚', '限制', '受困', '无助', '受害'],
    description: '宝剑八代表感到被束缚和限制的状态。'
  },
  {
    id: 'nine-swords',
    name: '宝剑九',
    nameEn: 'Nine of Swords',
    suit: 'swords',
    number: 9,
    type: 'minor',
    uprightMeaning: '焦虑、恐惧、噩梦、担忧、绝望',
    reversedMeaning: '希望、治愈、恢复、释放恐惧、内在力量',
    imageUrl: '/assets/tarot-cards/swords/nine-swords.jpg',
    keywords: ['焦虑', '恐惧', '噩梦', '担忧', '绝望'],
    description: '宝剑九代表深度的焦虑和恐惧。'
  },
  {
    id: 'ten-swords',
    name: '宝剑十',
    nameEn: 'Ten of Swords',
    suit: 'swords',
    number: 10,
    type: 'minor',
    uprightMeaning: '背叛、痛苦结束、失败、毁灭、触底',
    reversedMeaning: '恢复、重生、治愈、新开始、希望',
    imageUrl: '/assets/tarot-cards/swords/ten-swords.jpg',
    keywords: ['背叛', '结束', '失败', '毁灭', '触底'],
    description: '宝剑十代表痛苦的结束和新开始的可能。'
  },
  {
    id: 'page-swords',
    name: '宝剑侍者',
    nameEn: 'Page of Swords',
    suit: 'swords',
    number: 11,
    type: 'minor',
    uprightMeaning: '好奇心、新想法、警觉、监视、学习',
    reversedMeaning: '缺乏计划、冲动、八卦、间谍、欺骗',
    imageUrl: '/assets/tarot-cards/swords/page-swords.jpg',
    keywords: ['好奇', '想法', '警觉', '监视', '学习'],
    description: '宝剑侍者代表好奇心和新想法的探索。'
  },
  {
    id: 'knight-swords',
    name: '宝剑骑士',
    nameEn: 'Knight of Swords',
    suit: 'swords',
    number: 12,
    type: 'minor',
    uprightMeaning: '行动、冲动、勇敢、决心、急躁',
    reversedMeaning: '鲁莽、缺乏方向、冲动、侵略性、不耐烦',
    imageUrl: '/assets/tarot-cards/swords/knight-swords.jpg',
    keywords: ['行动', '冲动', '勇敢', '决心', '急躁'],
    description: '宝剑骑士代表快速的行动和冲动的决定。'
  },
  {
    id: 'queen-swords',
    name: '宝剑王后',
    nameEn: 'Queen of Swords',
    suit: 'swords',
    number: 13,
    type: 'minor',
    uprightMeaning: '独立、直接、诚实、智慧、清晰思维',
    reversedMeaning: '冷酷、严厉、缺乏同情、偏见、怨恨',
    imageUrl: '/assets/tarot-cards/swords/queen-swords.jpg',
    keywords: ['独立', '直接', '诚实', '智慧', '清晰'],
    description: '宝剑王后代表独立的思维和直接的沟通。'
  },
  {
    id: 'king-swords',
    name: '宝剑国王',
    nameEn: 'King of Swords',
    suit: 'swords',
    number: 14,
    type: 'minor',
    uprightMeaning: '权威、理性、智慧、公正、领导力',
    reversedMeaning: '专制、操控、滥用权力、缺乏同情、严厉',
    imageUrl: '/assets/tarot-cards/swords/king-swords.jpg',
    keywords: ['权威', '理性', '智慧', '公正', '领导'],
    description: '宝剑国王代表理性的权威和公正的领导。'
  }
];

// 小阿卡纳牌数据 - 星币花色
export const pentacles: TarotCard[] = [
  {
    id: 'ace-pentacles',
    name: '星币王牌',
    nameEn: 'Ace of Pentacles',
    suit: 'pentacles',
    number: 1,
    type: 'minor',
    uprightMeaning: '新机会、财务开始、物质显化、实用性',
    reversedMeaning: '错失机会、缺乏规划、贪婪、物质主义',
    imageUrl: '/assets/tarot-cards/pentacles/ace-pentacles.jpg',
    keywords: ['机会', '财务', '物质', '实用', '显化'],
    description: '星币王牌代表物质世界的新机会和财务的开始。'
  },
  {
    id: 'two-pentacles',
    name: '星币二',
    nameEn: 'Two of Pentacles',
    suit: 'pentacles',
    number: 2,
    type: 'minor',
    uprightMeaning: '平衡、适应性、时间管理、优先级、灵活性',
    reversedMeaning: '失衡、过度承诺、缺乏组织、混乱',
    imageUrl: '/assets/tarot-cards/pentacles/two-pentacles.jpg',
    keywords: ['平衡', '适应', '管理', '优先', '灵活'],
    description: '星币二代表在多重责任中寻找平衡。'
  },
  {
    id: 'three-pentacles',
    name: '星币三',
    nameEn: 'Three of Pentacles',
    suit: 'pentacles',
    number: 3,
    type: 'minor',
    uprightMeaning: '团队合作、协作、学习、技能建设',
    reversedMeaning: '缺乏团队合作、竞争、技能不足、孤立工作',
    imageUrl: '/assets/tarot-cards/pentacles/three-pentacles.jpg',
    keywords: ['团队', '协作', '学习', '技能', '建设'],
    description: '星币三代表通过团队合作实现目标。'
  },
  {
    id: 'four-pentacles',
    name: '星币四',
    nameEn: 'Four of Pentacles',
    suit: 'pentacles',
    number: 4,
    type: 'minor',
    uprightMeaning: '安全感、保守、储蓄、控制、稳定',
    reversedMeaning: '贪婪、物质主义、慷慨、释放控制',
    imageUrl: '/assets/tarot-cards/pentacles/four-pentacles.jpg',
    keywords: ['安全', '保守', '储蓄', '控制', '稳定'],
    description: '星币四代表对安全和稳定的渴望。'
  },
  {
    id: 'five-pentacles',
    name: '星币五',
    nameEn: 'Five of Pentacles',
    suit: 'pentacles',
    number: 5,
    type: 'minor',
    uprightMeaning: '财务困难、贫困、失业、缺乏、孤立',
    reversedMeaning: '财务恢复、就业、改善、支持、希望',
    imageUrl: '/assets/tarot-cards/pentacles/five-pentacles.jpg',
    keywords: ['困难', '贫困', '失业', '缺乏', '孤立'],
    description: '星币五代表财务困难和物质匮乏。'
  },
  {
    id: 'six-pentacles',
    name: '星币六',
    nameEn: 'Six of Pentacles',
    suit: 'pentacles',
    number: 6,
    type: 'minor',
    uprightMeaning: '慷慨、分享、给予、接受、平衡交换',
    reversedMeaning: '自私、债务、不平等、单方面给予',
    imageUrl: '/assets/tarot-cards/pentacles/six-pentacles.jpg',
    keywords: ['慷慨', '分享', '给予', '接受', '交换'],
    description: '星币六代表慷慨的给予和接受的平衡。'
  },
  {
    id: 'seven-pentacles',
    name: '星币七',
    nameEn: 'Seven of Pentacles',
    suit: 'pentacles',
    number: 7,
    type: 'minor',
    uprightMeaning: '投资、耐心、长期目标、评估、等待',
    reversedMeaning: '缺乏耐心、短期思维、投资不当、焦虑',
    imageUrl: '/assets/tarot-cards/pentacles/seven-pentacles.jpg',
    keywords: ['投资', '耐心', '目标', '评估', '等待'],
    description: '星币七代表对长期投资的耐心等待。'
  },
  {
    id: 'eight-pentacles',
    name: '星币八',
    nameEn: 'Eight of Pentacles',
    suit: 'pentacles',
    number: 8,
    type: 'minor',
    uprightMeaning: '技能发展、勤奋、专注、学徒、精通',
    reversedMeaning: '缺乏专注、质量差、急于求成、技能不足',
    imageUrl: '/assets/tarot-cards/pentacles/eight-pentacles.jpg',
    keywords: ['技能', '勤奋', '专注', '学徒', '精通'],
    description: '星币八代表通过勤奋工作发展技能。'
  },
  {
    id: 'nine-pentacles',
    name: '星币九',
    nameEn: 'Nine of Pentacles',
    suit: 'pentacles',
    number: 9,
    type: 'minor',
    uprightMeaning: '独立、自给自足、奢华、成就、享受',
    reversedMeaning: '依赖他人、财务不安全、过度工作、孤独',
    imageUrl: '/assets/tarot-cards/pentacles/nine-pentacles.jpg',
    keywords: ['独立', '自足', '奢华', '成就', '享受'],
    description: '星币九代表通过努力获得的独立和成就。'
  },
  {
    id: 'ten-pentacles',
    name: '星币十',
    nameEn: 'Ten of Pentacles',
    suit: 'pentacles',
    number: 10,
    type: 'minor',
    uprightMeaning: '财富、家族遗产、传统、安全、长期成功',
    reversedMeaning: '财务损失、家族冲突、缺乏传统、不稳定',
    imageUrl: '/assets/tarot-cards/pentacles/ten-pentacles.jpg',
    keywords: ['财富', '遗产', '传统', '安全', '成功'],
    description: '星币十代表家族财富和长期的物质成功。'
  },
  {
    id: 'page-pentacles',
    name: '星币侍者',
    nameEn: 'Page of Pentacles',
    suit: 'pentacles',
    number: 11,
    type: 'minor',
    uprightMeaning: '学习机会、新项目、实用性、勤奋、专注',
    reversedMeaning: '缺乏进展、拖延、不切实际、缺乏专注',
    imageUrl: '/assets/tarot-cards/pentacles/page-pentacles.jpg',
    keywords: ['学习', '机会', '项目', '实用', '勤奋'],
    description: '星币侍者代表学习新技能和实用的机会。'
  },
  {
    id: 'knight-pentacles',
    name: '星币骑士',
    nameEn: 'Knight of Pentacles',
    suit: 'pentacles',
    number: 12,
    type: 'minor',
    uprightMeaning: '勤奋、可靠、责任感、坚持、效率',
    reversedMeaning: '懒惰、不可靠、停滞、完美主义、无聊',
    imageUrl: '/assets/tarot-cards/pentacles/knight-pentacles.jpg',
    keywords: ['勤奋', '可靠', '责任', '坚持', '效率'],
    description: '星币骑士代表稳定可靠的努力和坚持。'
  },
  {
    id: 'queen-pentacles',
    name: '星币王后',
    nameEn: 'Queen of Pentacles',
    suit: 'pentacles',
    number: 13,
    type: 'minor',
    uprightMeaning: '实用性、安全感、慷慨、关怀、丰盛',
    reversedMeaning: '自私、嫉妒、不安全感、物质主义',
    imageUrl: '/assets/tarot-cards/pentacles/queen-pentacles.jpg',
    keywords: ['实用', '安全', '慷慨', '关怀', '丰盛'],
    description: '星币王后代表实用的智慧和慷慨的关怀。'
  },
  {
    id: 'king-pentacles',
    name: '星币国王',
    nameEn: 'King of Pentacles',
    suit: 'pentacles',
    number: 14,
    type: 'minor',
    uprightMeaning: '财务成功、领导力、安全感、慷慨、可靠',
    reversedMeaning: '贪婪、物质主义、财务不稳定、顽固',
    imageUrl: '/assets/tarot-cards/pentacles/king-pentacles.jpg',
    keywords: ['成功', '领导', '安全', '慷慨', '可靠'],
    description: '星币国王代表财务上的成功和可靠的领导力。'
  }
];

// 合并所有塔罗牌
export const allCards: TarotCard[] = [
  ...majorArcana,
  ...wands,
  ...cups,
  ...swords,
  ...pentacles
];

// 洗牌函数
export function shuffleCards(cards: TarotCard[]): TarotCard[] {
  const shuffled = [...cards];
  const seed = Date.now() + performance.now();
  
  for (let i = shuffled.length - 1; i > 0; i--) {
    const randomValue = Math.sin(seed * (i + 1)) * 10000;
    const j = Math.floor((randomValue - Math.floor(randomValue)) * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  
  return shuffled;
}

// 获取随机牌（考虑正逆位）
export function drawRandomCard(deck: TarotCard[]): { card: TarotCard; isReversed: boolean } | null {
  if (deck.length === 0) return null;
  
  const card = deck[0];
  const isReversed = Math.random() < 0.5; // 50% 概率逆位
  
  return { card, isReversed };
}