/**
 * 紫微斗数星曜亮度计算系统
 * 根据星曜性质和所在宫位地支计算亮度等级
 * 
 * 从 /lib/ziwei/core/brightness.ts 迁移并增强
 */

export type BrightnessLevel = '庙' | '旺' | '得' | '利' | '平' | '不' | '陷';

// 星曜在各地支的亮度表
interface StarBrightnessMap {
  [starName: string]: {
    [branch: string]: BrightnessLevel;
  };
}

export class BrightnessSystem {
  // 十四主星亮度表
  private static readonly MAJOR_STARS_BRIGHTNESS: StarBrightnessMap = {
    '紫微': {
      '子': '旺', '丑': '庙', '寅': '旺', '卯': '平',
      '辰': '庙', '巳': '旺', '午': '庙', '未': '庙',
      '申': '旺', '酉': '平', '戌': '庙', '亥': '旺'
    },
    '天机': {
      '子': '平', '丑': '旺', '寅': '利', '卯': '庙',
      '辰': '利', '巳': '平', '午': '陷', '未': '旺',
      '申': '利', '酉': '庙', '戌': '利', '亥': '平'
    },
    '太阳': {
      '子': '陷', '丑': '不', '寅': '旺', '卯': '庙',
      '辰': '旺', '巳': '旺', '午': '庙', '未': '平',
      '申': '平', '酉': '不', '戌': '不', '亥': '陷'
    },
    '武曲': {
      '子': '旺', '丑': '庙', '寅': '利', '卯': '利',
      '辰': '庙', '巳': '利', '午': '利', '未': '庙',
      '申': '庙', '酉': '旺', '戌': '庙', '亥': '旺'
    },
    '天同': {
      '子': '不', '丑': '不', '寅': '平', '卯': '庙',
      '辰': '平', '巳': '陷', '午': '庙', '未': '不',
      '申': '平', '酉': '平', '戌': '平', '亥': '平'
    },
    '廉贞': {
      '子': '平', '丑': '平', '寅': '利', '卯': '利',
      '辰': '庙', '巳': '旺', '午': '旺', '未': '利',
      '申': '庙', '酉': '平', '戌': '庙', '亥': '平'
    },
    '天府': {
      '子': '庙', '丑': '庙', '寅': '旺', '卯': '旺',
      '辰': '庙', '巳': '旺', '午': '庙', '未': '庙',
      '申': '旺', '酉': '旺', '戌': '庙', '亥': '庙'
    },
    '太阴': {
      '子': '庙', '丑': '旺', '寅': '不', '卯': '不',
      '辰': '陷', '巳': '陷', '午': '陷', '未': '不',
      '申': '不', '酉': '旺', '戌': '旺', '亥': '庙'
    },
    '贪狼': {
      '子': '旺', '丑': '陷', '寅': '庙', '卯': '平',
      '辰': '平', '巳': '陷', '午': '旺', '未': '陷',
      '申': '庙', '酉': '平', '戌': '平', '亥': '旺'
    },
    '巨门': {
      '子': '旺', '丑': '旺', '寅': '陷', '卯': '庙',
      '辰': '陷', '巳': '旺', '午': '旺', '未': '旺',
      '申': '陷', '酉': '庙', '戌': '陷', '亥': '旺'
    },
    '天相': {
      '子': '庙', '丑': '庙', '寅': '利', '卯': '利',
      '辰': '庙', '巳': '平', '午': '庙', '未': '庙',
      '申': '利', '酉': '利', '戌': '庙', '亥': '庙'
    },
    '天梁': {
      '子': '庙', '丑': '庙', '寅': '平', '卯': '平',
      '辰': '庙', '巳': '平', '午': '庙', '未': '庙',
      '申': '旺', '酉': '旺', '戌': '庙', '亥': '庙'
    },
    '七杀': {
      '子': '平', '丑': '平', '寅': '庙', '卯': '平',
      '辰': '旺', '巳': '平', '午': '旺', '未': '平',
      '申': '庙', '酉': '平', '戌': '旺', '亥': '平'
    },
    '破军': {
      '子': '庙', '丑': '旺', '寅': '庙', '卯': '陷',
      '辰': '旺', '巳': '陷', '午': '庙', '未': '旺',
      '申': '庙', '酉': '陷', '戌': '旺', '亥': '庙'
    }
  };
  
  // 辅星亮度表（部分示例）
  private static readonly MINOR_STARS_BRIGHTNESS: StarBrightnessMap = {
    '文昌': {
      '子': '得', '丑': '庙', '寅': '平', '卯': '利',
      '辰': '庙', '巳': '平', '午': '陷', '未': '得',
      '申': '利', '酉': '庙', '戌': '得', '亥': '得'
    },
    '文曲': {
      '子': '旺', '丑': '旺', '寅': '平', '卯': '平',
      '辰': '庙', '巳': '庙', '午': '陷', '未': '旺',
      '申': '平', '酉': '平', '戌': '旺', '亥': '旺'
    },
    '左辅': {
      '子': '庙', '丑': '庙', '寅': '庙', '卯': '庙',
      '辰': '庙', '巳': '庙', '午': '庙', '未': '庙',
      '申': '庙', '酉': '庙', '戌': '庙', '亥': '庙'
    },
    '右弼': {
      '子': '庙', '丑': '庙', '寅': '庙', '卯': '庙',
      '辰': '庙', '巳': '庙', '午': '庙', '未': '庙',
      '申': '庙', '酉': '庙', '戌': '庙', '亥': '庙'
    },
    '天魁': {
      '子': '旺', '丑': '旺', '寅': '得', '卯': '利',
      '辰': '得', '巳': '利', '午': '旺', '未': '旺',
      '申': '得', '酉': '利', '戌': '得', '亥': '旺'
    },
    '天钺': {
      '子': '旺', '丑': '旺', '寅': '利', '卯': '得',
      '辰': '利', '巳': '得', '午': '旺', '未': '旺',
      '申': '利', '酉': '得', '戌': '利', '亥': '旺'
    }
  };
  
  /**
   * 计算星曜亮度
   * @param starName 星曜名称
   * @param branch 所在宫位地支
   * @returns 亮度等级
   */
  static calculateBrightness(starName: string, branch: string): BrightnessLevel {
    // 标准化星曜名称（处理繁简体）
    const normalizedStar = this.normalizeStarName(starName);
    
    // 先查找主星亮度表
    if (this.MAJOR_STARS_BRIGHTNESS[normalizedStar]) {
      const brightness = this.MAJOR_STARS_BRIGHTNESS[normalizedStar][branch];
      if (brightness) return brightness;
    }
    
    // 再查找辅星亮度表
    if (this.MINOR_STARS_BRIGHTNESS[normalizedStar]) {
      const brightness = this.MINOR_STARS_BRIGHTNESS[normalizedStar][branch];
      if (brightness) return brightness;
    }
    
    // 默认返回平
    return '平';
  }
  
  /**
   * 获取亮度的数值评分（用于分析）
   */
  static getBrightnessScore(level: BrightnessLevel): number {
    const scores: Record<BrightnessLevel, number> = {
      '庙': 100,
      '旺': 85,
      '得': 70,
      '利': 60,
      '平': 50,
      '不': 30,
      '陷': 10
    };
    return scores[level] || 50;
  }
  
  /**
   * 获取亮度等级的描述（多语言支持）
   */
  static getBrightnessDescription(level: BrightnessLevel, language: string = 'zh-CN'): string {
    const descriptions: Record<string, Record<BrightnessLevel, string>> = {
      'zh-CN': {
        '庙': '最佳状态，星曜力量完全发挥',
        '旺': '良好状态，星曜力量强劲',
        '得': '得地，星曜表现正常偏好',
        '利': '有利，星曜略有助益',
        '平': '平和，星曜力量一般',
        '不': '不利，星曜力量受限',
        '陷': '落陷，星曜力量最弱'
      },
      'zh-TW': {
        '庙': '最佳狀態，星曜力量完全發揮',
        '旺': '良好狀態，星曜力量強勁',
        '得': '得地，星曜表現正常偏好',
        '利': '有利，星曜略有助益',
        '平': '平和，星曜力量一般',
        '不': '不利，星曜力量受限',
        '陷': '落陷，星曜力量最弱'
      },
      'en': {
        '庙': 'Temple - Star at full power',
        '旺': 'Prosperous - Star is strong',
        '得': 'Gain - Star performs well',
        '利': 'Benefit - Star has slight advantage',
        '平': 'Neutral - Star at average power',
        '不': 'Unfavorable - Star power limited',
        '陷': 'Fallen - Star at weakest'
      },
      'ja': {
        '庙': '廟 - 星の力が完全に発揮',
        '旺': '旺 - 星の力が強い',
        '得': '得 - 星の表現が良好',
        '利': '利 - 星がやや有利',
        '平': '平 - 星の力が普通',
        '不': '不 - 星の力が制限',
        '陷': '陷 - 星の力が最も弱い'
      }
    };
    
    const locale = this.normalizeLanguage(language);
    return descriptions[locale]?.[level] || descriptions['zh-CN'][level];
  }
  
  /**
   * 标准化星曜名称
   */
  private static normalizeStarName(name: string): string {
    // 处理常见的繁简体转换
    const mapping: Record<string, string> = {
      '天機': '天机',
      '太陽': '太阳',
      '廉貞': '廉贞',
      '太陰': '太阴',
      '貪狼': '贪狼',
      '巨門': '巨门',
      '七殺': '七杀',
      '破軍': '破军',
      '祿存': '禄存',
      '天馬': '天马',
      '陀羅': '陀罗',
      '鈴星': '铃星',
      '天鉞': '天钺',
      '左輔': '左辅'
    };
    
    return mapping[name] || name;
  }
  
  /**
   * 标准化语言代码
   */
  private static normalizeLanguage(language: string): string {
    const langMap: Record<string, string> = {
      'zh-CN': 'zh-CN',
      'zh-TW': 'zh-TW',
      'en-US': 'en',
      'ja-JP': 'ja',
      'en': 'en',
      'ja': 'ja'
    };
    return langMap[language] || 'zh-CN';
  }
  
  /**
   * 批量计算多个星曜的亮度
   */
  static calculateMultipleBrightness(
    stars: string[],
    branch: string
  ): Record<string, BrightnessLevel> {
    const result: Record<string, BrightnessLevel> = {};
    
    for (const star of stars) {
      result[star] = this.calculateBrightness(star, branch);
    }
    
    return result;
  }
  
  /**
   * 获取某个地支中所有星曜的最佳亮度
   */
  static getBestStarsInBranch(branch: string): string[] {
    const bestStars: string[] = [];
    
    // 检查主星
    for (const [star, brightnessMap] of Object.entries(this.MAJOR_STARS_BRIGHTNESS)) {
      if (brightnessMap[branch] === '庙' || brightnessMap[branch] === '旺') {
        bestStars.push(star);
      }
    }
    
    // 检查辅星
    for (const [star, brightnessMap] of Object.entries(this.MINOR_STARS_BRIGHTNESS)) {
      if (brightnessMap[branch] === '庙' || brightnessMap[branch] === '旺') {
        bestStars.push(star);
      }
    }
    
    return bestStars;
  }
  
  /**
   * 应用亮度到星曜数据
   */
  static applyBrightnessToStars(
    stars: Array<{ name: string; brightness?: string }>,
    branch: string
  ): Array<{ name: string; brightness: string }> {
    return stars.map(star => ({
      ...star,
      brightness: star.brightness || this.calculateBrightness(star.name, branch)
    }));
  }
}