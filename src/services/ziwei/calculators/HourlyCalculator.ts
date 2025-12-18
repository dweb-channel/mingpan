/**
 * 流时计算器
 * 计算指定时辰的流时信息
 */

import { IztroAdapter } from '../../../core/ziwei/IztroAdapter';
import { HOUR_TO_INDEX } from '../../../services/ziwei/types';

export interface HourlyInfo {
  year: number;
  month: number;
  day: number;
  hour: number; // 0-23
  heavenlyStem: string;
  earthlyBranch: string;
  palaceIndex: number;
  mutagen?: string[];
  palaceNames?: string[];  // 添加palaceNames字段
  timeRange: string; // 如"23:00-01:00"
}

export class HourlyCalculator {
  // 时辰名称
  private static HOUR_NAMES = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
  
  // 时辰时间范围
  private static HOUR_RANGES = [
    '23:00-01:00', '01:00-03:00', '03:00-05:00', '05:00-07:00',
    '07:00-09:00', '09:00-11:00', '11:00-13:00', '13:00-15:00',
    '15:00-17:00', '17:00-19:00', '19:00-21:00', '21:00-23:00'
  ];
  
  /**
   * 计算指定时辰的流时信息（使用新的流時算法）
   * 
   * 新流時法：
   * 1. 找到本命盤中「子」宮的位置（哪個宮位）
   * 2. 這個宮位就是「日斗君」
   * 3. 流日的這個宮位就是「子時命宮」
   * 4. 其他時辰順時針推算
   */
  static calculate(
    adapter: IztroAdapter,
    year: number,
    month: number,
    day: number,
    hour: number // 0-23
  ): HourlyInfo | null {
    try {
      const dateStr = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
      const hourIndex = HOUR_TO_INDEX[hour] || 0;
      
      // 獲取本命盤的所有宮位
      const palaces = adapter.getPalaces();
      if (!palaces || palaces.length === 0) {
        return null;
      }
      
      // 找到本命盤中「子」宮的位置（哪個宮位）
      const ziPalace = palaces.find(p => p.earthlyBranch === '子');
      if (!ziPalace) {
        console.error('找不到子宮');
        return null;
      }
      
      // 獲取「日斗君」- 即子宮所在的宮位名稱
      const riDouJun = ziPalace.name; // 例如：兄弟宮
      
      // 獲取流日信息
      const horoscope = adapter.getHoroscope(dateStr);
      if (!horoscope?.daily) {
        return null;
      }
      
      // 獲取流日的宮位名稱（用於顯示）
      const dailyPalaceNames = horoscope.daily.palaceNames || [];
      
      // 找到日斗君（riDouJun）在流日盤中的索引
      // riDouJun 是本命盤子宮的名稱（比如"官祿宮"）
      // 我們需要在流日盤中找到這個宮位的索引
      const riDouJunIndexInDaily = dailyPalaceNames.indexOf(riDouJun);
      
      if (riDouJunIndexInDaily === -1) {
        console.error('在流日盤中找不到日斗君宮位:', riDouJun);
        return null;
      }
      
      // 計算流時命宮索引
      // riDouJunIndexInDaily 是子時命宮的位置
      // 其他時辰順時針推算
      const hourlyPalaceIndex = (riDouJunIndexInDaily + hourIndex) % 12;
      
      // 獲取流時的天干地支
      const hourlyBranch = this.HOUR_NAMES[hourIndex];
      
      // 計算時干（需要日干來推算）
      const dayStem = horoscope.daily?.heavenlyStem || '';
      const hourlyStem = this.calculateHourlyStem(dayStem, hourIndex);
      
      // 計算流時四化
      const hourlyMutagen = adapter.getMutagenByStem(hourlyStem);
      
      const mutagenList = [
        `化祿:${hourlyMutagen.lu}`,
        `化權:${hourlyMutagen.quan}`,
        `化科:${hourlyMutagen.ke}`,
        `化忌:${hourlyMutagen.ji}`
      ];
      
      // 計算流時的宮位名稱
      // hourlyPalaceIndex 是流時命宮的位置
      const PALACE_ORDER = ['命宮', '父母宮', '福德宮', '田宅宮', '官祿宮', '僕役宮', '遷移宮', '疾厄宮', '財帛宮', '子女宮', '夫妻宮', '兄弟宮'];
      const hourlyPalaceNames: string[] = new Array(12);
      
      for (let i = 0; i < 12; i++) {
        // 從流時命宮開始，順時針排列宮位名稱
        const palaceOrderIndex = (i - hourlyPalaceIndex + 12) % 12;
        hourlyPalaceNames[i] = PALACE_ORDER[palaceOrderIndex];
      }
      
      return {
        year,
        month,
        day,
        hour,
        heavenlyStem: hourlyStem,
        earthlyBranch: hourlyBranch,
        palaceIndex: hourlyPalaceIndex,
        mutagen: mutagenList,
        palaceNames: hourlyPalaceNames,
        timeRange: this.HOUR_RANGES[hourIndex] || ''
      };
    } catch (error) {
      console.error('计算流时失败:', error);
      return null;
    }
  }
  
  /**
   * 根據日干計算時干
   * 使用五虎遁法
   */
  private static calculateHourlyStem(dayStem: string, hourIndex: number): string {
    const stemCycle = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
    
    // 五虎遁起始干支對照表
    const startStemMap: Record<string, number> = {
      '甲': 0, '己': 0,  // 甲己起甲子
      '乙': 2, '庚': 2,  // 乙庚起丙子
      '丙': 4, '辛': 4,  // 丙辛起戊子
      '丁': 6, '壬': 6,  // 丁壬起庚子
      '戊': 8, '癸': 8   // 戊癸起壬子
    };
    
    const startIndex = startStemMap[dayStem] || 0;
    const stemIndex = (startIndex + hourIndex) % 10;
    
    return stemCycle[stemIndex];
  }
  
  /**
   * 获取一天的所有时辰信息
   */
  static calculateDay(
    adapter: IztroAdapter,
    year: number,
    month: number,
    day: number
  ): HourlyInfo[] {
    const hours: HourlyInfo[] = [];
    
    // 12个时辰
    const hourMapping = [23, 1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21];
    
    for (const hour of hourMapping) {
      const hourlyInfo = this.calculate(adapter, year, month, day, hour);
      if (hourlyInfo) {
        hours.push(hourlyInfo);
      }
    }
    
    return hours;
  }
}