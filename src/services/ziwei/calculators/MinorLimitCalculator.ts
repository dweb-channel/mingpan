/**
 * 小限计算器
 * 计算指定年份或年龄范围的小限信息
 * 
 * 小限规则：
 * - 以出生年支确定起始宫位
 * - 男顺女逆运行
 * - 每年一宫，12年一轮回
 */

import { IztroAdapter } from '../../../core/ziwei/IztroAdapter';
import { Palace, EARTHLY_BRANCHES, HEAVENLY_STEMS } from '../types';
import { calculateNominalAge } from '../../../utils/ageCalculator';

export interface MinorLimitInfo {
  age: number;
  year: number;
  palaceIndex: number;
  heavenlyStem: string;
  earthlyBranch: string;
  palaceNames?: string[];
  mutagen?: string[];
}

export class MinorLimitCalculator {
  private static readonly MINOR_LIMIT_START: Record<string, string> = {
    '寅': '辰', '午': '辰', '戌': '辰',
    '申': '戌', '子': '戌', '辰': '戌',
    '巳': '未', '酉': '未', '丑': '未',
    '亥': '丑', '卯': '丑', '未': '丑'
  };

  static calculate(
    adapter: IztroAdapter,
    birthYear: number,
    targetYear: number
  ): MinorLimitInfo | null {
    try {
      const dateStr = `${targetYear}-06-15`;
      const horoscope = adapter.getHoroscope(dateStr);
      
      if (!horoscope?.age) {
        return null;
      }

      const age = horoscope.age;
      
      return {
        age: age.nominalAge,
        year: targetYear,
        palaceIndex: age.index,
        heavenlyStem: age.heavenlyStem || '',
        earthlyBranch: age.earthlyBranch || '',
        palaceNames: age.palaceNames || [],
        mutagen: age.mutagen || []
      };
    } catch (error) {
      console.error('计算小限失败:', error);
      return null;
    }
  }

  static calculateRange(
    adapter: IztroAdapter,
    birthYear: number,
    startAge: number,
    endAge: number
  ): MinorLimitInfo[] {
    const results: MinorLimitInfo[] = [];
    
    for (let age = startAge; age <= endAge; age++) {
      const targetYear = birthYear + age - 1;
      const info = this.calculate(adapter, birthYear, targetYear);
      if (info) {
        results.push(info);
      }
    }
    
    return results;
  }

  static calculateByYearRange(
    adapter: IztroAdapter,
    birthYear: number,
    startYear: number,
    endYear: number
  ): MinorLimitInfo[] {
    const results: MinorLimitInfo[] = [];
    
    for (let year = startYear; year <= endYear; year++) {
      const info = this.calculate(adapter, birthYear, year);
      if (info) {
        results.push(info);
      }
    }
    
    return results;
  }

  static calculateAll(
    adapter: IztroAdapter,
    birthYear: number,
    maxAge: number = 96
  ): MinorLimitInfo[] {
    return this.calculateRange(adapter, birthYear, 1, maxAge);
  }

  static getStartBranch(yearBranch: string): string {
    return this.MINOR_LIMIT_START[yearBranch] || '辰';
  }

  static getMinorLimitPalaceIndex(
    yearBranch: string,
    gender: 'male' | 'female',
    age: number,
    palaces: Palace[]
  ): number {
    const startBranch = this.getStartBranch(yearBranch);
    const startIndex = EARTHLY_BRANCHES.indexOf(startBranch);
    
    if (startIndex === -1) return 0;

    const offset = (age - 1) % 12;
    let targetBranchIndex: number;
    
    if (gender === 'male') {
      targetBranchIndex = (startIndex + offset) % 12;
    } else {
      targetBranchIndex = (startIndex - offset + 12) % 12;
    }
    
    const targetBranch = EARTHLY_BRANCHES[targetBranchIndex];
    const palaceIndex = palaces.findIndex(p => p.earthlyBranch === targetBranch);
    
    return palaceIndex !== -1 ? palaceIndex : 0;
  }
}
