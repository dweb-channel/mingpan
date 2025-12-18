/**
 * 流年计算器
 * 负责计算流年相关信息
 */

import { 
  YearlyInfo,
  Palace,
  EARTHLY_BRANCHES,
  HEAVENLY_STEMS
} from '../types';
import { calculateNominalAge } from '../../../utils/ageCalculator';

export class YearlyCalculator {
  /**
   * 已知的年份对照表（用于验证）
   */
  private static readonly KNOWN_YEARS: Record<number, { stem: string; branch: string }> = {
    2020: { stem: '庚', branch: '子' },
    2021: { stem: '辛', branch: '丑' },
    2022: { stem: '壬', branch: '寅' },
    2023: { stem: '癸', branch: '卯' },
    2024: { stem: '甲', branch: '辰' },
    2025: { stem: '乙', branch: '巳' },
    2026: { stem: '丙', branch: '午' },
    2027: { stem: '丁', branch: '未' },
    2028: { stem: '戊', branch: '申' },
    2029: { stem: '己', branch: '酉' },
    2030: { stem: '庚', branch: '戌' }
  };
  
  /**
   * 计算指定年份的流年信息
   */
  static calculate(
    year: number,
    birthYear: number,
    palaces: Palace[]
  ): YearlyInfo {
    // 计算虚岁
    const age = calculateNominalAge(birthYear, year);
    
    // 获取流年天干地支
    const { stem, branch } = this.getYearStemBranch(year);
    
    // 找到流年地支对应的宫位（流年命宫）
    const palaceIndex = palaces.findIndex(p => p.earthlyBranch === branch);
    
    return {
      year,
      age,
      heavenlyStem: stem,
      earthlyBranch: branch,
      palaceIndex: palaceIndex !== -1 ? palaceIndex : 0
    };
  }
  
  /**
   * 获取指定年份的天干地支
   */
  static getYearStemBranch(year: number): { stem: string; branch: string } {
    // 如果有已知的对照表，直接返回
    if (this.KNOWN_YEARS[year]) {
      return this.KNOWN_YEARS[year];
    }
    
    // 使用公元4年为甲子年的基准进行计算
    const offset = year - 4;
    const stemIndex = offset % 10;
    const branchIndex = offset % 12;
    
    return {
      stem: HEAVENLY_STEMS[stemIndex],
      branch: EARTHLY_BRANCHES[branchIndex]
    };
  }
  
  /**
   * 修正iztro返回的流年信息
   */
  static fixYearlyInfo(horoscopeYearly: any, targetYear: number): any {
    if (!horoscopeYearly) return null;
    
    const correct = this.getYearStemBranch(targetYear);
    
    // 检查是否需要修正
    if (horoscopeYearly.earthlyBranch !== correct.branch) {
      console.warn(
        `Fixing yearly branch: ${targetYear} should be ${correct.stem}${correct.branch}, ` +
        `but iztro returned ${horoscopeYearly.heavenlyStem || '?'}${horoscopeYearly.earthlyBranch}`
      );
      
      return {
        ...horoscopeYearly,
        heavenlyStem: correct.stem,
        earthlyBranch: correct.branch,
        _fixed: true,
        _originalBranch: horoscopeYearly.earthlyBranch
      };
    }
    
    return horoscopeYearly;
  }
  
  /**
   * 根据日期判断农历年份
   */
  static getLunarYear(date: string): number {
    const [year, month, day] = date.split('-').map(Number);
    
    // 农历新年通常在1月21日至2月20日之间
    // 简化判断：如果在1-2月，可能属于上一年
    if (month === 1 || (month === 2 && day < 20)) {
      // TODO: 需要更精确的农历转换
      return year - 1;
    }
    
    return year;
  }
  
  /**
   * 获取流年宫位名称映射
   */
  static getYearlyPalaceNames(yearlyBranch: string, palaces: Palace[]): Map<number, string> {
    const mapping = new Map<number, string>();
    
    // 找到流年地支对应的宫位作为流年命宫
    const yearlyMingIndex = palaces.findIndex(p => p.earthlyBranch === yearlyBranch);
    if (yearlyMingIndex === -1) return mapping;
    
    // 十二宫位名称
    const palaceNames = [
      '命宮', '兄弟', '夫妻', '子女', '財帛', '疾厄',
      '遷移', '交友', '官祿', '田宅', '福德', '父母'
    ];
    
    // 根据流年命宫重新排列
    for (let i = 0; i < 12; i++) {
      const currentIndex = (yearlyMingIndex + i) % 12;
      mapping.set(currentIndex, `年${palaceNames[i]}`);
    }
    
    return mapping;
  }
}