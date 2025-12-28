/**
 * 九宫计算器
 * 计算地盘布局（三奇六仪在九宫中的分布）
 */

import type { GongWei, JuShu, TianGan, YinYangDun } from '../types';
import {
  SAN_QI_LIU_YI,
  LUOSHU_ORDER,
  ZHONG_GONG_JI,
  getLuoShuIndex,
  getLuoShuGong,
} from '../data/constants';

export interface DiPanResult {
  /** 各宫地盘干 (宫位 -> 干) */
  gongGan: Record<GongWei, TianGan>;
  /** 干找宫位映射 (干 -> 宫位) */
  ganGong: Record<TianGan, GongWei>;
}

/**
 * 九宫计算器
 * 负责计算地盘布局（三奇六仪的分布）
 */
export class JiuGongCalculator {
  /**
   * 计算地盘布局
   * @param juShu 局数 (1-9)
   * @param yinYangDun 阴阳遁
   * @returns 地盘各宫的干
   *
   * 原理：
   * - 阳遁：从局数对应的宫位开始，按洛书顺序顺布戊己庚辛壬癸丁丙乙
   * - 阴遁：从局数对应的宫位开始，按洛书逆序顺布戊己庚辛壬癸丁丙乙
   *
   * 例如阳遁一局：
   * - 从坎一宫开始，顺时针布：戊-坎1, 己-艮8, 庚-震3, 辛-巽4, 壬-离9, 癸-坤2, 丁-兑7, 丙-乾6, 乙-中5(寄坤2)
   *
   * 例如阴遁九局：
   * - 从离九宫开始，逆时针布：戊-离9, 己-巽4, 庚-震3, 辛-艮8, 壬-坎1, 癸-乾6, 丁-兑7, 丙-坤2, 乙-中5(寄坤2)
   */
  static calculate(juShu: JuShu, yinYangDun: YinYangDun): DiPanResult {
    const isYang = yinYangDun === '阳遁';
    const gongGan: Record<GongWei, TianGan> = {} as Record<GongWei, TianGan>;
    const ganGong: Record<TianGan, GongWei> = {} as Record<TianGan, GongWei>;

    // 起始宫位就是局数
    const startGong: GongWei = juShu as GongWei;

    // 遍历九个干（三奇六仪），依次布入九宫
    for (let i = 0; i < 9; i++) {
      const gan = SAN_QI_LIU_YI[i];
      let gong: GongWei;

      if (i === 8) {
        // 第9个干（乙）布入中宫，但中宫寄坤二
        // 注意：实际上乙是布入"中五宫"的位置
        gong = 5;
        // 记录乙在中宫
        gongGan[5] = gan;
        ganGong[gan] = 5;
      } else {
        // 计算当前干应该布入的宫位
        gong = this.getGongByStep(startGong, i, isYang);
        gongGan[gong] = gan;
        ganGong[gan] = gong;
      }
    }

    return { gongGan, ganGong };
  }

  /**
   * 根据起始宫位和步数计算目标宫位
   * @param startGong 起始宫位
   * @param steps 步数 (0-7)
   * @param isYang 是否阳遁（顺飞）
   */
  private static getGongByStep(startGong: GongWei, steps: number, isYang: boolean): GongWei {
    // 如果起始宫位是中宫，需要特殊处理
    let actualStart = startGong;
    if (actualStart === 5) {
      actualStart = ZHONG_GONG_JI; // 中宫寄坤二
    }

    const startIdx = getLuoShuIndex(actualStart);

    // 阳遁顺飞，阴遁逆飞
    const targetIdx = isYang
      ? (startIdx + steps) % 8
      : ((startIdx - steps) % 8 + 8) % 8;

    return getLuoShuGong(targetIdx);
  }

  /**
   * 根据天干找落宫
   * @param diPan 地盘信息
   * @param gan 要查找的天干
   * @returns 该天干所在的宫位
   */
  static findGongByGan(ganGong: Record<TianGan, GongWei>, gan: TianGan): GongWei {
    const gong = ganGong[gan];
    // 如果在中宫，返回寄宫
    return gong === 5 ? ZHONG_GONG_JI : gong;
  }

  /**
   * 根据宫位找天干
   * @param gongGan 地盘各宫的干
   * @param gong 宫位
   * @returns 该宫位的天干
   */
  static findGanByGong(gongGan: Record<GongWei, TianGan>, gong: GongWei): TianGan {
    return gongGan[gong];
  }
}
