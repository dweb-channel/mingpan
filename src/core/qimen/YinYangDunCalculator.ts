/**
 * 阴阳遁与局数计算
 * Yin-Yang Dun and Ju number calculations
 */

import type { JuShu, YinYangDun, YuanType } from './types';

/**
 * 节气 -> [阳遁/阴遁, [上元局, 中元局, 下元局]]
 * 阳遁：冬至 -> 夏至前
 * 阴遁：夏至 -> 冬至前
 */
export const JIEQI_JU_MAP: Record<string, { dun: YinYangDun; ju: [JuShu, JuShu, JuShu] }> = {
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
 * 根据节气判定阴阳遁
 * @param jieQi 节气名称
 * @returns 阴阳遁
 */
export function getYinYangDun(jieQi: string): YinYangDun {
  const info = JIEQI_JU_MAP[jieQi];
  if (!info) {
    throw new Error(`未知节气: ${jieQi}`);
  }
  return info.dun;
}

/**
 * 根据节气和元获取局数
 * @param jieQi 节气名称
 * @param yuan 上中下元
 * @returns 局数 (1-9)
 */
export function getJuShu(jieQi: string, yuan: YuanType): JuShu {
  const info = JIEQI_JU_MAP[jieQi];
  if (!info) {
    throw new Error(`未知节气: ${jieQi}`);
  }
  const yuanIndex = getYuanIndex(yuan);
  return info.ju[yuanIndex];
}

/**
 * 根据元获取局数索引
 */
function getYuanIndex(yuan: YuanType): 0 | 1 | 2 {
  switch (yuan) {
    case '上元': return 0;
    case '中元': return 1;
    case '下元': return 2;
  }
}
