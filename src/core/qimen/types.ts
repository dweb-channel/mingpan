/**
 * 奇门遁甲核心类型定义
 * Core layer types for Qimen calculations
 */

/** 十天干 */
export type TianGan = '甲' | '乙' | '丙' | '丁' | '戊' | '己' | '庚' | '辛' | '壬' | '癸';

/** 十二地支 */
export type DiZhi = '子' | '丑' | '寅' | '卯' | '辰' | '巳' | '午' | '未' | '申' | '酉' | '戌' | '亥';

/** 五行 */
export type WuXing = '木' | '火' | '土' | '金' | '水';

/** 宫位 (1-9，对应洛书九宫) */
export type GongWei = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

/** 局数 (1-9) */
export type JuShu = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

/** 阴阳遁 */
export type YinYangDun = '阳遁' | '阴遁';

/** 上中下元 */
export type YuanType = '上元' | '中元' | '下元';
