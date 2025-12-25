/**
 * 奇门遁甲常量数据
 */

import type {
  TianGan,
  DiZhi,
  GongWei,
  JuShu,
  BaMen,
  JiuXing,
  BaShen,
  WuXing,
  YuanType,
} from '../types';

// ============= 天干地支序列 =============

/** 十天干 */
export const TIAN_GAN: TianGan[] = [
  '甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'
];

/** 十二地支 */
export const DI_ZHI: DiZhi[] = [
  '子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'
];

// ============= 三奇六仪 =============

/**
 * 三奇六仪顺序 (戊-癸-壬-辛-庚-己-丁-丙-乙)
 * 甲遁于戊下，所以顺序从戊开始
 */
export const SAN_QI_LIU_YI: TianGan[] = [
  '戊', '己', '庚', '辛', '壬', '癸', '丁', '丙', '乙'
];

/**
 * 六仪（甲子戊、甲戌己、甲申庚、甲午辛、甲辰壬、甲寅癸）
 * 旬首 -> 对应的遁甲干
 */
export const LIU_YI_MAP: Record<string, TianGan> = {
  '甲子': '戊',
  '甲戌': '己',
  '甲申': '庚',
  '甲午': '辛',
  '甲辰': '壬',
  '甲寅': '癸',
};

/**
 * 六十甲子表
 */
export const JIA_ZI_60: string[] = [
  '甲子', '乙丑', '丙寅', '丁卯', '戊辰', '己巳', '庚午', '辛未', '壬申', '癸酉',
  '甲戌', '乙亥', '丙子', '丁丑', '戊寅', '己卯', '庚辰', '辛巳', '壬午', '癸未',
  '甲申', '乙酉', '丙戌', '丁亥', '戊子', '己丑', '庚寅', '辛卯', '壬辰', '癸巳',
  '甲午', '乙未', '丙申', '丁酉', '戊戌', '己亥', '庚子', '辛丑', '壬寅', '癸卯',
  '甲辰', '乙巳', '丙午', '丁未', '戊申', '己酉', '庚戌', '辛亥', '壬子', '癸丑',
  '甲寅', '乙卯', '丙辰', '丁巳', '戊午', '己未', '庚申', '辛酉', '壬戌', '癸亥',
];

/**
 * 旬空表（每旬的空亡地支）
 */
export const XUN_KONG: Record<string, [DiZhi, DiZhi]> = {
  '甲子': ['戌', '亥'],
  '甲戌': ['申', '酉'],
  '甲申': ['午', '未'],
  '甲午': ['辰', '巳'],
  '甲辰': ['寅', '卯'],
  '甲寅': ['子', '丑'],
};

// ============= 九宫信息 =============

/**
 * 九宫名称 (洛书顺序)
 * 1-坎、2-坤、3-震、4-巽、5-中、6-乾、7-兑、8-艮、9-离
 */
export const GONG_NAMES: Record<GongWei, string> = {
  1: '坎',
  2: '坤',
  3: '震',
  4: '巽',
  5: '中',
  6: '乾',
  7: '兑',
  8: '艮',
  9: '离',
};

/**
 * 九宫五行
 */
export const GONG_WUXING: Record<GongWei, WuXing> = {
  1: '水', // 坎
  2: '土', // 坤
  3: '木', // 震
  4: '木', // 巽
  5: '土', // 中
  6: '金', // 乾
  7: '金', // 兑
  8: '土', // 艮
  9: '火', // 离
};

/**
 * 洛书飞布顺序 (顺飞)
 * 从任意宫开始，按此顺序飞布
 */
export const LUOSHU_ORDER: GongWei[] = [1, 8, 3, 4, 9, 2, 7, 6];

/**
 * 中宫寄宫 (天禽寄坤二)
 */
export const ZHONG_GONG_JI: GongWei = 2;

// ============= 八门 =============

/**
 * 八门原始宫位
 * 休门居坎1、生门居艮8、伤门居震3、杜门居巽4
 * 景门居离9、死门居坤2、惊门居兑7、开门居乾6
 */
export const BA_MEN_GONG: Record<BaMen, GongWei> = {
  '休': 1,
  '生': 8,
  '伤': 3,
  '杜': 4,
  '景': 9,
  '死': 2,
  '惊': 7,
  '开': 6,
};

/** 八门顺序（按宫位顺序） */
export const BA_MEN_ORDER: BaMen[] = ['休', '生', '伤', '杜', '景', '死', '惊', '开'];

/** 八门全称 */
export const BA_MEN_FULL: Record<BaMen, string> = {
  '休': '休门',
  '生': '生门',
  '伤': '伤门',
  '杜': '杜门',
  '景': '景门',
  '死': '死门',
  '惊': '惊门',
  '开': '开门',
};

// ============= 九星 =============

/**
 * 九星原始宫位
 * 天蓬居坎1、天芮居坤2、天冲居震3、天辅居巽4
 * 天禽居中5、天心居乾6、天柱居兑7、天任居艮8、天英居离9
 */
export const JIU_XING_GONG: Record<JiuXing, GongWei> = {
  '蓬': 1,
  '芮': 2,
  '冲': 3,
  '辅': 4,
  '禽': 5,
  '心': 6,
  '柱': 7,
  '任': 8,
  '英': 9,
};

/** 九星顺序（按宫位顺序） */
export const JIU_XING_ORDER: JiuXing[] = ['蓬', '芮', '冲', '辅', '禽', '心', '柱', '任', '英'];

/** 九星全称 */
export const JIU_XING_FULL: Record<JiuXing, string> = {
  '蓬': '天蓬',
  '芮': '天芮',
  '冲': '天冲',
  '辅': '天辅',
  '禽': '天禽',
  '心': '天心',
  '柱': '天柱',
  '任': '天任',
  '英': '天英',
};

// ============= 八神 =============

/**
 * 八神顺序
 * 阳遁：值符-腾蛇-太阴-六合-白虎-玄武-九地-九天（顺时针）
 * 阴遁：值符-腾蛇-太阴-六合-白虎-玄武-九地-九天（逆时针）
 */
export const BA_SHEN_ORDER: BaShen[] = ['符', '蛇', '阴', '合', '虎', '武', '地', '天'];

/** 八神全称 */
export const BA_SHEN_FULL: Record<BaShen, string> = {
  '符': '值符',
  '蛇': '腾蛇',
  '阴': '太阴',
  '合': '六合',
  '虎': '白虎',
  '武': '玄武',
  '地': '九地',
  '天': '九天',
};

// ============= 节气局数映射 =============

/**
 * 节气 -> [阳遁/阴遁, [上元局, 中元局, 下元局]]
 * 阳遁：冬至 -> 夏至前
 * 阴遁：夏至 -> 冬至前
 */
export const JIEQI_JU_MAP: Record<string, { dun: '阳遁' | '阴遁'; ju: [JuShu, JuShu, JuShu] }> = {
  // 阳遁（冬至后）
  '冬至': { dun: '阳遁', ju: [1, 7, 4] },
  '小寒': { dun: '阳遁', ju: [2, 8, 5] },
  '大寒': { dun: '阳遁', ju: [3, 9, 6] },
  '立春': { dun: '阳遁', ju: [8, 5, 2] },
  '雨水': { dun: '阳遁', ju: [9, 6, 3] },
  '惊蛰': { dun: '阳遁', ju: [1, 7, 4] },
  '春分': { dun: '阳遁', ju: [3, 9, 6] },
  '清明': { dun: '阳遁', ju: [4, 1, 7] },
  '谷雨': { dun: '阳遁', ju: [5, 2, 8] },
  '立夏': { dun: '阳遁', ju: [4, 1, 7] },
  '小满': { dun: '阳遁', ju: [5, 2, 8] },
  '芒种': { dun: '阳遁', ju: [6, 3, 9] },
  // 阴遁（夏至后）
  '夏至': { dun: '阴遁', ju: [9, 3, 6] },
  '小暑': { dun: '阴遁', ju: [8, 2, 5] },
  '大暑': { dun: '阴遁', ju: [7, 1, 4] },
  '立秋': { dun: '阴遁', ju: [2, 5, 8] },
  '处暑': { dun: '阴遁', ju: [1, 4, 7] },
  '白露': { dun: '阴遁', ju: [9, 3, 6] },
  '秋分': { dun: '阴遁', ju: [7, 1, 4] },
  '寒露': { dun: '阴遁', ju: [6, 9, 3] },
  '霜降': { dun: '阴遁', ju: [5, 8, 2] },
  '立冬': { dun: '阴遁', ju: [6, 9, 3] },
  '小雪': { dun: '阴遁', ju: [5, 8, 2] },
  '大雪': { dun: '阴遁', ju: [4, 7, 1] },
};

/**
 * 符头表：根据日干支确定属于哪个旬
 */
export const FU_TOU_MAP: Record<string, string> = (() => {
  const map: Record<string, string> = {};
  const xunShous = ['甲子', '甲戌', '甲申', '甲午', '甲辰', '甲寅'];

  for (const xunShou of xunShous) {
    const startIdx = JIA_ZI_60.indexOf(xunShou);
    for (let i = 0; i < 10; i++) {
      const ganZhi = JIA_ZI_60[(startIdx + i) % 60];
      map[ganZhi] = xunShou;
    }
  }

  return map;
})();

/**
 * 地支 -> 宫位映射
 */
export const DI_ZHI_GONG: Record<DiZhi, GongWei> = {
  '子': 1,
  '丑': 8,
  '寅': 8,
  '卯': 3,
  '辰': 4,
  '巳': 4,
  '午': 9,
  '未': 2,
  '申': 2,
  '酉': 7,
  '戌': 6,
  '亥': 6,
};

/**
 * 天干五行
 */
export const TIAN_GAN_WUXING: Record<TianGan, WuXing> = {
  '甲': '木',
  '乙': '木',
  '丙': '火',
  '丁': '火',
  '戊': '土',
  '己': '土',
  '庚': '金',
  '辛': '金',
  '壬': '水',
  '癸': '水',
};

/**
 * 马星地支
 * 日支 -> 马星所在地支
 */
export const MA_XING: Record<DiZhi, DiZhi> = {
  '申': '寅',
  '子': '寅',
  '辰': '寅',
  '寅': '申',
  '午': '申',
  '戌': '申',
  '亥': '巳',
  '卯': '巳',
  '未': '巳',
  '巳': '亥',
  '酉': '亥',
  '丑': '亥',
};

// ============= 辅助函数 =============

/**
 * 根据宫位获取飞布顺序中的索引
 */
export function getLuoShuIndex(gong: GongWei): number {
  if (gong === 5) return -1; // 中宫不在飞布顺序中
  return LUOSHU_ORDER.indexOf(gong);
}

/**
 * 根据索引获取飞布宫位
 */
export function getLuoShuGong(index: number): GongWei {
  const normalizedIndex = ((index % 8) + 8) % 8;
  return LUOSHU_ORDER[normalizedIndex];
}

/**
 * 顺飞：从某宫开始顺时针飞布
 */
export function flyForward(startGong: GongWei, steps: number): GongWei {
  if (startGong === 5) startGong = ZHONG_GONG_JI; // 中宫寄坤二
  const startIdx = getLuoShuIndex(startGong);
  return getLuoShuGong(startIdx + steps);
}

/**
 * 逆飞：从某宫开始逆时针飞布
 */
export function flyBackward(startGong: GongWei, steps: number): GongWei {
  if (startGong === 5) startGong = ZHONG_GONG_JI; // 中宫寄坤二
  const startIdx = getLuoShuIndex(startGong);
  return getLuoShuGong(startIdx - steps);
}

/**
 * 根据干支获取旬首
 */
export function getXunShou(ganZhi: string): string {
  return FU_TOU_MAP[ganZhi] || '甲子';
}

/**
 * 获取旬空
 */
export function getXunKong(xunShou: string): [DiZhi, DiZhi] {
  return XUN_KONG[xunShou] || ['戌', '亥'];
}

/**
 * 获取六仪遁干
 */
export function getLiuYiGan(xunShou: string): TianGan {
  return LIU_YI_MAP[xunShou] || '戊';
}

/**
 * 根据元获取局数索引
 */
export function getYuanIndex(yuan: YuanType): 0 | 1 | 2 {
  switch (yuan) {
    case '上元': return 0;
    case '中元': return 1;
    case '下元': return 2;
  }
}
