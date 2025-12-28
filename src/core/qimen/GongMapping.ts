/**
 * 九宫映射常量
 * Gong (palace) mapping constants for Qimen calculations
 */

import type { GongWei, DiZhi, WuXing, TianGan } from './types';

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
 * 宫位冲对映射表
 * 坎(1)↔离(9), 震(3)↔兑(7), 巽(4)↔乾(6), 坤(2)↔艮(8)
 */
export const CHONG_GONG_MAP: Record<GongWei, GongWei> = {
  1: 9, // 坎 ↔ 离
  9: 1,
  3: 7, // 震 ↔ 兑
  7: 3,
  4: 6, // 巽 ↔ 乾
  6: 4,
  2: 8, // 坤 ↔ 艮
  8: 2,
  5: 5, // 中宫无对冲
};

/**
 * 天干五合映射表（奇仪相合）
 * 甲己合不在此表中，因为甲遁于六仪，不会出现在盘面上
 */
export const GAN_HE_MAP: Partial<Record<TianGan, TianGan>> = {
  '乙': '庚',
  '庚': '乙',
  '丙': '辛',
  '辛': '丙',
  '丁': '壬',
  '壬': '丁',
  '戊': '癸',
  '癸': '戊',
};
