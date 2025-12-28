/**
 * 奇门遁甲常量数据
 *
 * 注意：飞宫规则、九宫映射、阴阳遁计算等核心逻辑已迁移到 core/qimen/
 * 本文件重新导出核心常量，并保留奇门业务专用常量
 */

import type {
  TianGan,
  DiZhi,
  GongWei,
  BaMen,
  JiuXing,
  BaShen,
  WuXing,
  YuanType,
} from '../types';

// ============= 从 core/qimen 重新导出 =============

export {
  // Flying rules
  LUOSHU_ORDER,
  ZHONG_GONG_JI,
  getLuoShuIndex,
  getLuoShuGong,
  flyForward,
  flyBackward,
  // Gong mappings
  GONG_NAMES,
  GONG_WUXING,
  DI_ZHI_GONG,
  CHONG_GONG_MAP,
  GAN_HE_MAP,
  // Yin-Yang Dun
  JIEQI_JU_MAP,
  getYinYangDun,
  getJuShu,
} from '../../../core/qimen';

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

// ============= 其他奇门专用常量 =============

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
