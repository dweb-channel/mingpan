/**
 * 八门计算器
 * 计算八门在九宫中的分布
 */

import type { BaMen, DiZhi, GongWei, TianGan, YinYangDun } from '../types';
import {
  BA_MEN_GONG,
  BA_MEN_ORDER,
  LUOSHU_ORDER,
  ZHONG_GONG_JI,
  DI_ZHI,
  getLuoShuIndex,
  getLuoShuGong,
} from '../data/constants';

export interface BaMenResult {
  /** 各宫八门 (宫位 -> 门) */
  gongMen: Record<GongWei, BaMen>;
  /** 值使门 */
  zhiShiMen: BaMen;
  /** 值使门原始宫位 */
  zhiShiGong: GongWei;
  /** 值使门落宫 */
  zhiShiLuoGong: GongWei;
}

/**
 * 八门计算器
 * 负责计算八门的飞布
 */
export class BaMenCalculator {
  /**
   * 计算八门布局
   * @param zhiFuGong 值符星落宫（旬首遁干在地盘的宫位）
   * @param hourZhi 时支
   * @param yinYangDun 阴阳遁
   * @returns 八门布局
   *
   * 原理：
   * 1. 确定值使门：值符星原始宫位对应的门就是值使门
   * 2. 值使门随时干飞布，从值符星落宫起，按时辰数飞布
   * 3. 阳遁顺飞，阴遁逆飞
   * 4. 其他七门依次排列
   */
  static calculate(
    zhiFuGong: GongWei,
    hourZhi: DiZhi,
    yinYangDun: YinYangDun
  ): BaMenResult {
    const isYang = yinYangDun === '阳遁';

    // 1. 确定值使门（值符星原始宫位对应的门）
    const zhiShiMen = this.getMenByGong(zhiFuGong);
    const zhiShiGong = BA_MEN_GONG[zhiShiMen];

    // 2. 计算时辰数（子时为1）
    const hourNum = DI_ZHI.indexOf(hourZhi) + 1;

    // 3. 计算值使门落宫
    // 值使门从值符星落宫起，按时辰数飞布
    const zhiShiLuoGong = this.flyMen(zhiFuGong, hourNum - 1, isYang);

    // 4. 计算所有八门的落宫
    const gongMen = this.calculateAllMen(zhiShiMen, zhiShiLuoGong, isYang);

    return {
      gongMen,
      zhiShiMen,
      zhiShiGong,
      zhiShiLuoGong,
    };
  }

  /**
   * 根据宫位获取原始门
   */
  private static getMenByGong(gong: GongWei): BaMen {
    // 中宫无门，寄坤二
    const actualGong = gong === 5 ? ZHONG_GONG_JI : gong;

    for (const [men, menGong] of Object.entries(BA_MEN_GONG)) {
      if (menGong === actualGong) {
        return men as BaMen;
      }
    }

    return '死'; // 坤二宫默认死门
  }

  /**
   * 飞门：从某宫开始飞布指定步数
   */
  private static flyMen(startGong: GongWei, steps: number, isYang: boolean): GongWei {
    let actualStart = startGong;
    if (actualStart === 5) {
      actualStart = ZHONG_GONG_JI;
    }

    const startIdx = getLuoShuIndex(actualStart);

    const targetIdx = isYang
      ? (startIdx + steps) % 8
      : ((startIdx - steps) % 8 + 8) % 8;

    return getLuoShuGong(targetIdx);
  }

  /**
   * 计算所有八门的落宫
   * 从值使门落宫开始，按洛书顺序排列其他七门
   */
  private static calculateAllMen(
    zhiShiMen: BaMen,
    zhiShiLuoGong: GongWei,
    isYang: boolean
  ): Record<GongWei, BaMen> {
    const gongMen: Record<GongWei, BaMen> = {} as Record<GongWei, BaMen>;

    // 找到值使门在八门顺序中的索引
    const zhiShiIdx = BA_MEN_ORDER.indexOf(zhiShiMen);

    // 获取值使门落宫在洛书中的索引
    let startIdx = getLuoShuIndex(zhiShiLuoGong === 5 ? ZHONG_GONG_JI : zhiShiLuoGong);

    // 依次排列八门
    for (let i = 0; i < 8; i++) {
      const menIdx = (zhiShiIdx + i) % 8;
      const men = BA_MEN_ORDER[menIdx];

      const gongIdx = isYang
        ? (startIdx + i) % 8
        : ((startIdx - i) % 8 + 8) % 8;

      const gong = getLuoShuGong(gongIdx);
      gongMen[gong] = men;
    }

    // 中宫寄坤二，使用坤二的门
    gongMen[5] = gongMen[ZHONG_GONG_JI];

    return gongMen;
  }

  /**
   * 根据宫位找门
   */
  static findMenByGong(gongMen: Record<GongWei, BaMen>, gong: GongWei): BaMen {
    return gongMen[gong === 5 ? ZHONG_GONG_JI : gong];
  }
}
