/**
 * 八神计算器
 * 计算八神在九宫中的分布
 */

import type { BaShen, GongWei, YinYangDun } from '../types';
import {
  BA_SHEN_ORDER,
  LUOSHU_ORDER,
  ZHONG_GONG_JI,
  getLuoShuIndex,
  getLuoShuGong,
} from '../data/constants';

export interface BaShenResult {
  /** 各宫八神 (宫位 -> 神) */
  gongShen: Record<GongWei, BaShen>;
}

/**
 * 八神计算器
 * 负责计算八神的排布
 */
export class BaShenCalculator {
  /**
   * 计算八神布局
   * @param zhiFuLuoGong 值符星落宫
   * @param yinYangDun 阴阳遁
   * @returns 八神布局
   *
   * 原理：
   * 1. 值符神（第一神）永远临值符星落宫
   * 2. 阳遁：八神按洛书顺序顺布
   * 3. 阴遁：八神按洛书顺序逆布
   *
   * 八神顺序：值符-腾蛇-太阴-六合-白虎-玄武-九地-九天
   */
  static calculate(
    zhiFuLuoGong: GongWei,
    yinYangDun: YinYangDun
  ): BaShenResult {
    const isYang = yinYangDun === '阳遁';
    const gongShen: Record<GongWei, BaShen> = {} as Record<GongWei, BaShen>;

    // 值符神落宫
    let startGong = zhiFuLuoGong;
    if (startGong === 5) {
      startGong = ZHONG_GONG_JI; // 中宫寄坤二
    }

    const startIdx = getLuoShuIndex(startGong);

    // 依次排列八神
    for (let i = 0; i < 8; i++) {
      const shen = BA_SHEN_ORDER[i];

      const gongIdx = isYang
        ? (startIdx + i) % 8
        : ((startIdx - i) % 8 + 8) % 8;

      const gong = getLuoShuGong(gongIdx);
      gongShen[gong] = shen;
    }

    // 中宫寄坤二，使用坤二的神
    gongShen[5] = gongShen[ZHONG_GONG_JI];

    return { gongShen };
  }

  /**
   * 根据宫位找神
   */
  static findShenByGong(gongShen: Record<GongWei, BaShen>, gong: GongWei): BaShen {
    return gongShen[gong === 5 ? ZHONG_GONG_JI : gong];
  }
}
