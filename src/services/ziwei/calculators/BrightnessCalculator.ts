/**
 * 亮度计算器
 * 负责计算和应用星曜亮度
 */

import { Palace, StarWithMutagen } from '../types';
import { BrightnessSystem, BrightnessLevel } from '../../../core/ziwei/BrightnessSystem';

export class BrightnessCalculator {
  /**
   * 为宫位中的所有星曜计算亮度
   */
  static calculateForPalace(palace: Palace): Palace {
    // 计算主星亮度
    const majorStars = palace.majorStars.map(star => ({
      ...star,
      brightness: star.brightness || BrightnessSystem.calculateBrightness(star.name, palace.earthlyBranch)
    }));
    
    // 计算辅星亮度
    const minorStars = palace.minorStars.map(star => ({
      ...star,
      brightness: star.brightness || BrightnessSystem.calculateBrightness(star.name, palace.earthlyBranch)
    }));
    
    return {
      ...palace,
      majorStars,
      minorStars
    };
  }
  
  /**
   * 批量计算所有宫位的星曜亮度
   */
  static calculateForAllPalaces(palaces: Palace[]): Palace[] {
    return palaces.map(palace => this.calculateForPalace(palace));
  }
  
  /**
   * 获取宫位中最亮的星曜
   */
  static getBrightest(palace: Palace): StarWithMutagen[] {
    const allStars = [...palace.majorStars, ...palace.minorStars];
    
    return allStars.filter(star => {
      const brightness = star.brightness as BrightnessLevel;
      return brightness === '庙' || brightness === '旺';
    });
  }
  
  /**
   * 计算宫位的整体亮度分数
   */
  static calculatePalaceScore(palace: Palace): number {
    let totalScore = 0;
    let starCount = 0;
    
    // 主星权重更高
    palace.majorStars.forEach(star => {
      if (star.brightness) {
        totalScore += BrightnessSystem.getBrightnessScore(star.brightness as BrightnessLevel) * 1.5;
        starCount += 1.5;
      }
    });
    
    // 辅星正常权重
    palace.minorStars.forEach(star => {
      if (star.brightness) {
        totalScore += BrightnessSystem.getBrightnessScore(star.brightness as BrightnessLevel);
        starCount += 1;
      }
    });
    
    return starCount > 0 ? Math.round(totalScore / starCount) : 50;
  }
  
  /**
   * 获取亮度描述（支持多语言）
   */
  static getBrightnessDescription(level: BrightnessLevel, language: string = 'zh-CN'): string {
    return BrightnessSystem.getBrightnessDescription(level, language);
  }
  
  /**
   * 分析宫位亮度对运势的影响
   */
  static analyzeBrightnessImpact(palace: Palace, language: string = 'zh-CN'): {
    score: number;
    level: string;
    description: string;
    suggestions: string[];
  } {
    const score = this.calculatePalaceScore(palace);
    
    // 根据分数判断等级和描述
    let level: string;
    let description: string;
    let suggestions: string[] = [];
    
    if (language === 'zh-CN' || language === 'zh-TW') {
      if (score >= 80) {
        level = '极佳';
        description = '此宫位星曜配置极佳，能量充沛，事业顺遂';
        suggestions = ['把握机遇，积极进取', '可以承担更大责任'];
      } else if (score >= 60) {
        level = '良好';
        description = '此宫位星曜配置良好，整体运势平稳向上';
        suggestions = ['稳中求进，循序渐进', '注意细节，精益求精'];
      } else if (score >= 40) {
        level = '中等';
        description = '此宫位星曜配置一般，需要付出更多努力';
        suggestions = ['脚踏实地，勤能补拙', '寻求贵人相助'];
      } else {
        level = '偏弱';
        description = '此宫位星曜配置较弱，需要谨慎行事';
        suggestions = ['低调行事，避免冲动', '加强学习，提升能力'];
      }
    } else if (language === 'en' || language === 'en-US') {
      if (score >= 80) {
        level = 'Excellent';
        description = 'This palace has excellent star configuration with abundant energy';
        suggestions = ['Seize opportunities actively', 'Ready for greater responsibilities'];
      } else if (score >= 60) {
        level = 'Good';
        description = 'This palace has good star configuration with stable fortune';
        suggestions = ['Progress steadily', 'Pay attention to details'];
      } else if (score >= 40) {
        level = 'Average';
        description = 'This palace has average configuration, requiring more effort';
        suggestions = ['Work diligently', 'Seek help from mentors'];
      } else {
        level = 'Weak';
        description = 'This palace has weak configuration, caution advised';
        suggestions = ['Keep a low profile', 'Focus on self-improvement'];
      }
    } else {
      // 日语或其他语言的处理
      level = score >= 60 ? '良好' : '普通';
      description = `宮位の明るさスコア: ${score}`;
      suggestions = [];
    }
    
    return {
      score,
      level,
      description,
      suggestions
    };
  }
}