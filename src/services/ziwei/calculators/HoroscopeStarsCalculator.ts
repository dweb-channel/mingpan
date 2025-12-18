/**
 * 流曜计算器
 * 提取大限和流年的流曜（流昌、流曲、流魁、流钺等）
 */

import { IztroAdapter } from '../../../core/ziwei/IztroAdapter';
import { HoroscopeStar } from '../types';

export class HoroscopeStarsCalculator {
  /**
   * 提取流年流曜
   */
  static extractYearlyStars(horoscope: any): HoroscopeStar[][] | undefined {
    if (!horoscope?.yearly?.stars) {
      return undefined;
    }

    const stars = horoscope.yearly.stars;
    const result: HoroscopeStar[][] = new Array(12).fill(null).map(() => []);

    // 处理每个宫位的流曜
    stars.forEach((starArray: any[], index: number) => {
      if (Array.isArray(starArray) && index < 12) {
        result[index] = starArray.map(star => ({
          name: star.name || star,
          type: star.type || 'soft',
          scope: 'yearly' as const
        }));
      }
    });

    return result;
  }

  /**
   * 提取大限流曜
   */
  static extractDecadalStars(horoscope: any): HoroscopeStar[][] | undefined {
    if (!horoscope?.decadal?.stars) {
      return undefined;
    }

    const stars = horoscope.decadal.stars;
    const result: HoroscopeStar[][] = new Array(12).fill(null).map(() => []);

    // 处理每个宫位的流曜
    stars.forEach((starArray: any[], index: number) => {
      if (Array.isArray(starArray) && index < 12) {
        result[index] = starArray.map(star => ({
          name: star.name || star,
          type: star.type || 'soft',
          scope: 'decadal' as const
        }));
      }
    });

    return result;
  }

  /**
   * 应用流曜到宫位
   */
  static applyHoroscopeStarsToPalaces(
    palaces: any[],
    yearlyStars?: HoroscopeStar[][],
    decadalStars?: HoroscopeStar[][]
  ): any[] {
    return palaces.map((palace, index) => {
      const horoscopeStars: HoroscopeStar[] = [];

      // 添加大限流曜
      if (decadalStars && decadalStars[index]) {
        horoscopeStars.push(...decadalStars[index]);
      }

      // 添加流年流曜
      if (yearlyStars && yearlyStars[index]) {
        horoscopeStars.push(...yearlyStars[index]);
      }

      return {
        ...palace,
        horoscopeStars: horoscopeStars.length > 0 ? horoscopeStars : undefined
      };
    });
  }

  /**
   * 获取流曜的完整信息（用于测试和调试）
   */
  static getHoroscopeStarsInfo(adapter: IztroAdapter, date?: string): {
    yearly?: HoroscopeStar[][];
    decadal?: HoroscopeStar[][];
  } {
    const dateStr = date || new Date().toISOString().split('T')[0];
    const horoscope = adapter.getHoroscope(dateStr);
    
    return {
      yearly: this.extractYearlyStars(horoscope),
      decadal: this.extractDecadalStars(horoscope)
    };
  }
}