/**
 * 宫位转换器
 * 处理大限、流年时的宫位名称变化和三方四正计算
 * 
 * 整合了原 ziweiPalaceService.ts 的功能
 */

import { Palace, DecadeInfo, YearlyInfo, PALACE_NAMES } from '../types';

export class PalaceTransformer {
  /**
   * 获取三方四正宫位索引
   * @param palaceIndex 宫位索引
   * @returns 三方四正的宫位索引数组
   */
  static getSurroundedIndexes(palaceIndex: number): number[] {
    // 三方四正：本宫、对宫、财帛位（+4）、官禄位（+8）
    return [
      palaceIndex,
      (palaceIndex + 6) % 12,  // 对宫
      (palaceIndex + 4) % 12,  // 财帛位
      (palaceIndex + 8) % 12   // 官禄位
    ];
  }
  
  /**
   * 判断是否为三方四正宫位
   */
  static isSurroundedPalace(targetIndex: number, baseIndex: number): boolean {
    const surroundedIndexes = this.getSurroundedIndexes(baseIndex);
    return surroundedIndexes.includes(targetIndex);
  }
  
  /**
   * 获取大限时期的宫位名称映射
   */
  static getDecadalPalaceNames(
    originalMingIndex: number,
    decadeInfo: DecadeInfo,
    isClockwise: boolean = true
  ): Map<number, string> {
    const mapping = new Map<number, string>();
    
    // 大限命宫位置直接使用 decadeInfo.palaceIndex
    const decadalMingIndex = decadeInfo.palaceIndex;
    
    // 根据大限命宫重新排列十二宫
    // 顺行和逆行都是从大限命宫开始，按顺序分配宫名
    for (let i = 0; i < 12; i++) {
      const currentIndex = (decadalMingIndex + i) % 12;
      mapping.set(currentIndex, `限${PALACE_NAMES[i]}`);
    }
    
    return mapping;
  }
  
  /**
   * 获取流年时期的宫位名称映射
   */
  static getYearlyPalaceNames(
    yearlyInfo: YearlyInfo,
    palaces: Palace[]
  ): Map<number, string> {
    const mapping = new Map<number, string>();
    
    // 找到流年地支对应的宫位作为流年命宫
    const yearlyMingIndex = palaces.findIndex(p => p.earthlyBranch === yearlyInfo.earthlyBranch);
    if (yearlyMingIndex === -1) return mapping;
    
    // 根据流年命宫重新排列十二宫
    for (let i = 0; i < 12; i++) {
      const currentIndex = (yearlyMingIndex + i) % 12;
      mapping.set(currentIndex, `年${PALACE_NAMES[i]}`);
    }
    
    return mapping;
  }
  
  /**
   * 获取完整的宫位信息（包含本命、大限、流年）
   */
  static getCompletePalaceInfo(
    palace: Palace,
    palaceIndex: number,
    mingGongIndex: number,
    currentDecade?: DecadeInfo,
    currentYearly?: YearlyInfo,
    isClockwise: boolean = true,
    allPalaces?: Palace[]
  ): {
    original: string;
    decadal?: string;
    yearly?: string;
    isDecadalMing?: boolean;
    isYearlyMing?: boolean;
  } {
    const result: any = {
      original: palace.name
    };
    
    // 大限信息
    if (currentDecade) {
      const decadalNames = this.getDecadalPalaceNames(mingGongIndex, currentDecade, isClockwise);
      const decadalName = decadalNames.get(palaceIndex);
      if (decadalName) {
        result.decadal = decadalName;
        result.isDecadalMing = decadalName === '限命宮';
      }
    }
    
    // 流年信息
    if (currentYearly && allPalaces) {
      const yearlyNames = this.getYearlyPalaceNames(currentYearly, allPalaces);
      const yearlyName = yearlyNames.get(palaceIndex);
      if (yearlyName) {
        result.yearly = yearlyName;
        result.isYearlyMing = yearlyName === '年命宮';
      }
    }
    
    return result;
  }
  
  /**
   * 获取飞星路径
   * @param fromPalaceIndex 起始宫位
   * @param toPalaceIndex 目标宫位
   * @returns 飞星路径描述
   */
  static getFlyingStarPath(
    fromPalaceIndex: number,
    toPalaceIndex: number,
    palaces: Palace[]
  ): {
    from: string;
    to: string;
    distance: number;
    direction: 'clockwise' | 'counterclockwise';
  } {
    const fromPalace = palaces[fromPalaceIndex];
    const toPalace = palaces[toPalaceIndex];
    
    // 计算距离
    const clockwiseDistance = (toPalaceIndex - fromPalaceIndex + 12) % 12;
    const counterclockwiseDistance = (fromPalaceIndex - toPalaceIndex + 12) % 12;
    
    // 选择较短的路径
    const isClockwise = clockwiseDistance <= counterclockwiseDistance;
    const distance = isClockwise ? clockwiseDistance : counterclockwiseDistance;
    
    return {
      from: fromPalace.name,
      to: toPalace.name,
      distance,
      direction: isClockwise ? 'clockwise' : 'counterclockwise'
    };
  }
  
  /**
   * 计算宫位之间的关系
   */
  static getPalaceRelation(
    palace1Index: number,
    palace2Index: number
  ): string {
    const distance = Math.abs(palace1Index - palace2Index);
    
    switch (distance) {
      case 0:
        return '同宫';
      case 6:
        return '对宫';
      case 3:
      case 9:
        return '三合';
      case 4:
      case 8:
        return '三方';
      default:
        return '一般';
    }
  }
  
  /**
   * 判断宫位是否为空宫（无主星）
   */
  static isEmptyPalace(palace: Palace): boolean {
    return palace.majorStars.length === 0;
  }
  
  /**
   * 获取借星宫位（空宫时从对宫借星）
   */
  static getBorrowedStars(
    palace: Palace,
    palaceIndex: number,
    allPalaces: Palace[]
  ): Palace['majorStars'] {
    if (!this.isEmptyPalace(palace)) {
      return [];
    }
    
    // 从对宫借星
    const oppositeIndex = (palaceIndex + 6) % 12;
    const oppositePalace = allPalaces[oppositeIndex];
    
    return oppositePalace ? oppositePalace.majorStars : [];
  }
}