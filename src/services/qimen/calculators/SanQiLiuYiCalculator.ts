/**
 * 三奇六仪计算器
 * 计算天盘布局（时干/日干带动的天盘飞布）
 */

import type { GongWei, TianGan, YinYangDun } from '../types';
import {
  SAN_QI_LIU_YI,
  LUOSHU_ORDER,
  ZHONG_GONG_JI,
  getLuoShuIndex,
  getLuoShuGong,
  getXunShou,
  getLiuYiGan,
} from '../data/constants';

export interface TianPanResult {
  /** 各宫天盘干 (宫位 -> 干) */
  gongGan: Record<GongWei, TianGan>;
  /** 干找宫位映射 (干 -> 宫位) */
  ganGong: Record<TianGan, GongWei>;
}

/**
 * 三奇六仪计算器
 * 负责计算天盘布局
 */
export class SanQiLiuYiCalculator {
  /**
   * 计算天盘布局
   * @param diPanGanGong 地盘干->宫位映射
   * @param hourGanZhi 时干支（时盘）或日干支（日盘）
   * @param yinYangDun 阴阳遁
   * @returns 天盘各宫的干
   *
   * 原理：
   * 1. 找到时干（或日干）在地盘的落宫
   * 2. 以该宫为起点，将三奇六仪按洛书顺序飞布
   * 3. 阳遁顺飞，阴遁逆飞
   *
   * 例如：
   * - 阳遁一局，时干为庚
   * - 庚在地盘震三宫
   * - 则天盘从震三宫开始顺布：戊-震3, 己-巽4, 庚-离9...
   */
  static calculate(
    diPanGanGong: Record<TianGan, GongWei>,
    hourGanZhi: string,
    yinYangDun: YinYangDun
  ): TianPanResult {
    const isYang = yinYangDun === '阳遁';
    const hourGan = hourGanZhi.charAt(0) as TianGan;

    // 时干对应的遁甲干
    // 如果时干是甲，需要找到该甲的旬首，然后找到对应的六仪
    const dunGan = this.getDunGan(hourGan, hourGanZhi);

    // 找到遁甲干在地盘的落宫
    let startGong = diPanGanGong[dunGan];
    if (startGong === 5) {
      startGong = ZHONG_GONG_JI; // 中宫寄坤二
    }

    const gongGan: Record<GongWei, TianGan> = {} as Record<GongWei, TianGan>;
    const ganGong: Record<TianGan, GongWei> = {} as Record<TianGan, GongWei>;

    // 从起始宫开始，依次布入三奇六仪
    for (let i = 0; i < 9; i++) {
      const gan = SAN_QI_LIU_YI[i];
      let gong: GongWei;

      if (i === 8) {
        // 第9个干（乙）在中宫位置
        gong = 5;
        gongGan[5] = gan;
        ganGong[gan] = 5;
      } else {
        gong = this.getGongByStep(startGong, i, isYang);
        gongGan[gong] = gan;
        ganGong[gan] = gong;
      }
    }

    return { gongGan, ganGong };
  }

  /**
   * 获取遁甲干
   * 甲遁于六仪之下，需要根据时干支确定
   */
  private static getDunGan(hourGan: TianGan, hourGanZhi: string): TianGan {
    if (hourGan !== '甲') {
      // 非甲时，直接返回时干
      return hourGan;
    }

    // 甲时，需要找到旬首对应的六仪
    const xunShou = getXunShou(hourGanZhi);
    return getLiuYiGan(xunShou);
  }

  /**
   * 根据起始宫位和步数计算目标宫位
   */
  private static getGongByStep(startGong: GongWei, steps: number, isYang: boolean): GongWei {
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
   * 根据天干找天盘落宫
   */
  static findGongByGan(ganGong: Record<TianGan, GongWei>, gan: TianGan): GongWei {
    const gong = ganGong[gan];
    return gong === 5 ? ZHONG_GONG_JI : gong;
  }
}
