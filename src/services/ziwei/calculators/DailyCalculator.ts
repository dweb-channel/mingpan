/**
 * 流日计算器
 * 计算指定日期的流日信息
 */

import { IztroAdapter } from '../../../core/ziwei/IztroAdapter';

export interface DailyInfo {
  year: number;
  month: number;
  day: number;
  heavenlyStem: string;
  earthlyBranch: string;
  palaceIndex: number;
  mutagen?: string[];
  palaceNames?: string[];  // 添加palaceNames字段
  date: Date;
}

export class DailyCalculator {
  /**
   * 计算指定日期的流日信息
   */
  static calculate(
    adapter: IztroAdapter,
    year: number,
    month: number,
    day: number
  ): DailyInfo | null {
    try {
      const dateStr = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
      const horoscope = adapter.getHoroscope(dateStr);
      
      if (!horoscope?.daily) {
        return null;
      }
      
      const daily = horoscope.daily;
      
      // 使用iztro返回的命宫索引
      const palaceIndex = daily.index !== undefined ? daily.index : 0;
      
      return {
        year,
        month,
        day,
        heavenlyStem: daily.heavenlyStem || '',
        earthlyBranch: daily.earthlyBranch || '',
        palaceIndex,
        mutagen: daily.mutagen || [],
        palaceNames: daily.palaceNames || [],  // 添加palaceNames
        date: new Date(year, month - 1, day)
      };
    } catch (error) {
      console.error('计算流日失败:', error);
      return null;
    }
  }
  
  /**
   * 批量计算一个月的流日信息
   */
  static calculateMonth(
    adapter: IztroAdapter,
    year: number,
    month: number
  ): DailyInfo[] {
    const days: DailyInfo[] = [];
    const daysInMonth = new Date(year, month, 0).getDate();
    
    for (let day = 1; day <= daysInMonth; day++) {
      const dailyInfo = this.calculate(adapter, year, month, day);
      if (dailyInfo) {
        days.push(dailyInfo);
      }
    }
    
    return days;
  }
}