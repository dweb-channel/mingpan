/**
 * 奇门遁甲核心模块导出
 * Core Qimen module exports
 */

// Types
export * from './types';

// Flying rules
export {
  LUOSHU_ORDER,
  ZHONG_GONG_JI,
  getLuoShuIndex,
  getLuoShuGong,
  flyForward,
  flyBackward,
} from './FlyingRule';

// Gong mappings
export {
  GONG_NAMES,
  GONG_WUXING,
  DI_ZHI_GONG,
  CHONG_GONG_MAP,
  GAN_HE_MAP,
} from './GongMapping';

// Yin-Yang Dun calculations
export {
  JIEQI_JU_MAP,
  getYinYangDun,
  getJuShu,
} from './YinYangDunCalculator';
