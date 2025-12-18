/**
 * 紫微斗数四化核心系统
 * 统一管理四化星的计算和匹配
 * 
 * 从 /lib/ziwei/core/mutagenSystem.ts 迁移并增强
 */

import { MutagenInfo } from '../../services/ziwei/types';


// 星曜名称的所有变体映射 - 使用繁体字作为标准键
const STAR_NAME_VARIANTS: Map<string, string[]> = new Map([
  // 十四主星
  ['紫微', ['紫微']],
  ['天機', ['天机', '天機']],
  ['太陽', ['太阳', '太陽']],
  ['武曲', ['武曲']],
  ['天同', ['天同']],
  ['廉貞', ['廉贞', '廉貞']],
  ['天府', ['天府']],
  ['太陰', ['太阴', '太陰']],
  ['貪狼', ['贪狼', '貪狼']],
  ['巨門', ['巨门', '巨門']],
  ['天相', ['天相']],
  ['天梁', ['天梁']],
  ['七殺', ['七杀', '七殺']],
  ['破軍', ['破军', '破軍']],
  
  // 辅星
  ['文昌', ['文昌']],
  ['文曲', ['文曲']],
  ['左輔', ['左辅', '左輔']],
  ['右弼', ['右弼']],
  ['天魁', ['天魁']],
  ['天鉞', ['天钺', '天鉞']],
  ['祿存', ['禄存', '祿存']],
  ['天馬', ['天马', '天馬']],
  ['擎羊', ['擎羊']],
  ['陀羅', ['陀罗', '陀羅']],
  ['火星', ['火星']],
  ['鈴星', ['铃星', '鈴星']],
  ['地空', ['地空']],
  ['地劫', ['地劫']],
  ['化祿', ['化禄', '化祿']],
  ['化權', ['化权', '化權']],
  ['化科', ['化科']],
  ['化忌', ['化忌']]
]);

export class MutagenCore {
  // 四化表：天干对应的四化星
  private static readonly MUTAGEN_TABLE: Map<string, MutagenInfo> = new Map([
    ['甲', { lu: '廉貞', quan: '破軍', ke: '武曲', ji: '太陽' }],
    ['乙', { lu: '天機', quan: '天梁', ke: '紫微', ji: '太陰' }],
    ['丙', { lu: '天同', quan: '天機', ke: '文昌', ji: '廉貞' }],
    ['丁', { lu: '太陰', quan: '天同', ke: '天機', ji: '巨門' }],
    ['戊', { lu: '貪狼', quan: '太陰', ke: '右弼', ji: '天機' }],
    ['己', { lu: '武曲', quan: '貪狼', ke: '天梁', ji: '文曲' }],
    ['庚', { lu: '太陽', quan: '武曲', ke: '太陰', ji: '天同' }],
    ['辛', { lu: '巨門', quan: '太陽', ke: '文曲', ji: '文昌' }],
    ['壬', { lu: '天梁', quan: '紫微', ke: '左輔', ji: '武曲' }],
    ['癸', { lu: '破軍', quan: '巨門', ke: '太陰', ji: '貪狼' }]
  ]);
  
  /**
   * 获取天干对应的四化星
   */
  static getMutagen(heavenlyStem: string): MutagenInfo | null {
    const mutagen = this.MUTAGEN_TABLE.get(heavenlyStem);
    if (!mutagen) return null;
    
    // 返回标准化的星曜名称
    return {
      lu: this.normalizeStarName(mutagen.lu || ''),
      quan: this.normalizeStarName(mutagen.quan || ''),
      ke: this.normalizeStarName(mutagen.ke || ''),
      ji: this.normalizeStarName(mutagen.ji || '')
    };
  }
  
  /**
   * 获取某个星曜的四化类型
   * @param heavenlyStem 天干
   * @param starName 星曜名称
   * @returns 四化类型（禄、权、科、忌）或 null
   */
  static getMutagenType(
    heavenlyStem: string,
    starName: string,
    language: string = 'zh-CN'
  ): string | null {
    const mutagen = this.getMutagen(heavenlyStem);
    if (!mutagen) return null;
    
    const normalizedStar = this.normalizeStarName(starName);
    
    // 四化类型的多语言支持
    const types = this.getMutagenTypeNames(language);
    
    if (this.normalizeStarName(mutagen.lu || '') === normalizedStar) return types.lu;
    if (this.normalizeStarName(mutagen.quan || '') === normalizedStar) return types.quan;
    if (this.normalizeStarName(mutagen.ke || '') === normalizedStar) return types.ke;
    if (this.normalizeStarName(mutagen.ji || '') === normalizedStar) return types.ji;
    
    return null;
  }
  
  /**
   * 获取四化类型名称（多语言）
   */
  static getMutagenTypeNames(language: string = 'zh-CN'): {
    lu: string;
    quan: string;
    ke: string;
    ji: string;
  } {
    const typeNames: Record<string, { lu: string; quan: string; ke: string; ji: string }> = {
      'zh-CN': { lu: '禄', quan: '权', ke: '科', ji: '忌' },
      'zh-TW': { lu: '祿', quan: '權', ke: '科', ji: '忌' },
      'en': { lu: 'Lu', quan: 'Quan', ke: 'Ke', ji: 'Ji' },
      'ja': { lu: '禄', quan: '権', ke: '科', ji: '忌' }
    };
    
    const locale = this.normalizeLanguage(language);
    return typeNames[locale] || typeNames['zh-CN'];
  }
  
  /**
   * 获取星曜的所有四化信息
   * @param starName 星曜名称
   * @param natalStem 本命天干
   * @param decadeStem 大限天干（可选）
   * @param yearlyStem 流年天干（可选）
   * @param language 语言
   * @returns 四化信息数组
   */
  static getStarMutagens(
    starName: string,
    natalStem: string,
    decadeStem?: string,
    yearlyStem?: string,
    language: string = 'zh-CN'
  ): string[] {
    const mutagens: string[] = [];
    const prefixes = this.getMutagenPrefixes(language);
    
    // 本命四化
    const natalType = this.getMutagenType(natalStem, starName, language);
    if (natalType) {
      mutagens.push(`${prefixes.natal}${natalType}`);
    }
    
    // 大限四化
    if (decadeStem) {
      const decadeType = this.getMutagenType(decadeStem, starName, language);
      if (decadeType) {
        mutagens.push(`${prefixes.decade}${decadeType}`);
      }
    }
    
    // 流年四化
    if (yearlyStem) {
      const yearlyType = this.getMutagenType(yearlyStem, starName, language);
      if (yearlyType) {
        mutagens.push(`${prefixes.yearly}${yearlyType}`);
      }
    }
    
    return mutagens;
  }
  
  /**
   * 获取四化前缀（多语言）
   */
  static getMutagenPrefixes(language: string = 'zh-CN'): {
    natal: string;
    decade: string;
    yearly: string;
  } {
    const prefixes: Record<string, { natal: string; decade: string; yearly: string }> = {
      'zh-CN': { natal: '本', decade: '限', yearly: '年' },
      'zh-TW': { natal: '本', decade: '限', yearly: '年' },
      'en': { natal: 'N-', decade: 'D-', yearly: 'Y-' },
      'ja': { natal: '本', decade: '限', yearly: '年' }
    };
    
    const locale = this.normalizeLanguage(language);
    return prefixes[locale] || prefixes['zh-CN'];
  }
  
  /**
   * 标准化星曜名称
   * 将各种变体统一为标准名称
   */
  static normalizeStarName(name: string): string {
    if (!name) return '';
    
    // 遍历所有标准名称
    for (const [standard, variants] of STAR_NAME_VARIANTS.entries()) {
      if (variants.includes(name)) {
        return standard;
      }
    }
    
    // 如果找不到，返回原名称
    return name;
  }
  
  /**
   * 判断两个星曜名称是否相同（考虑变体）
   */
  static isSameStar(name1: string, name2: string): boolean {
    return this.normalizeStarName(name1) === this.normalizeStarName(name2);
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
   * 获取完整的四化信息（包含星曜名称）
   */
  static getCompleteMutagenInfo(
    natalStem: string,
    decadeStem?: string,
    yearlyStem?: string
  ): {
    natal?: MutagenInfo;
    decade?: MutagenInfo;
    yearly?: MutagenInfo;
  } {
    const result: any = {};
    
    if (natalStem) {
      result.natal = this.getMutagen(natalStem);
    }
    
    if (decadeStem) {
      result.decade = this.getMutagen(decadeStem);
    }
    
    if (yearlyStem) {
      result.yearly = this.getMutagen(yearlyStem);
    }
    
    return result;
  }
  
  /**
   * 生成四化飞星路径
   * @param fromPalaceIndex 起始宫位索引
   * @param mutagenType 四化类型
   * @returns 飞星路径
   */
  static generateMutagenPath(
    fromPalaceIndex: number,
    mutagenType: 'lu' | 'quan' | 'ke' | 'ji'
  ): number[] {
    // 四化飞星的基本规则
    const paths: Record<string, number[]> = {
      lu: [4, 8],    // 化禄飞向财帛、官禄
      quan: [8, 0],  // 化权飞向官禄、命宫
      ke: [1, 5],    // 化科飞向兄弟、疾厄
      ji: [6, 10]    // 化忌飞向迁移、福德
    };
    
    const basePath = paths[mutagenType] || [];
    
    // 根据起始宫位调整路径
    return basePath.map(targetOffset => (fromPalaceIndex + targetOffset) % 12);
  }
  
  /**
   * 判断星曜是否为四化星
   */
  static isMutagenStar(starName: string): boolean {
    const normalizedName = this.normalizeStarName(starName);
    
    // 检查是否在任何天干的四化表中
    for (const [, mutagen] of this.MUTAGEN_TABLE) {
      if (
        normalizedName === this.normalizeStarName(mutagen.lu || '') ||
        normalizedName === this.normalizeStarName(mutagen.quan || '') ||
        normalizedName === this.normalizeStarName(mutagen.ke || '') ||
        normalizedName === this.normalizeStarName(mutagen.ji || '')
      ) {
        return true;
      }
    }
    
    return false;
  }
}