/**
 * 四化计算器
 * 负责计算本命、大限、流年的四化信息
 */

import {
  MutagenInfo,
  CompleteMutagenInfo,
  Palace
} from '../types';
import { MutagenCore } from '../../../core/ziwei/MutagenCore';

export class MutagenCalculator {
  /**
   * 根据天干获取四化（代理到核心系统）
   */
  static getMutagenByStem(stem: string): MutagenInfo {
    return MutagenCore.getMutagen(stem) || { lu: '', quan: '', ke: '', ji: '' };
  }

  /**
   * 计算完整的四化信息
   */
  static calculateCompleteMutagen(
    natalStem: string,
    decadalStem?: string,
    yearlyStem?: string,
    language: string = 'zh-CN',
    monthlyStem?: string,
    dailyStem?: string,
    hourlyStem?: string
  ): CompleteMutagenInfo {
    // 获取四化基本信息
    const mutagenData = MutagenCore.getCompleteMutagenInfo(natalStem, decadalStem, yearlyStem);

    // 计算流月、流日、流时的四化
    const monthlyMutagen = monthlyStem ? this.getMutagenByStem(monthlyStem) : undefined;
    const dailyMutagen = dailyStem ? this.getMutagenByStem(dailyStem) : undefined;
    const hourlyMutagen = hourlyStem ? this.getMutagenByStem(hourlyStem) : undefined;

    // 获取语言相关的名称
    const prefixes = MutagenCore.getMutagenPrefixes(language);
    const typeNames = MutagenCore.getMutagenTypeNames(language);

    // 扩展prefixes以支持流月、流日、流时
    const extendedPrefixes = {
      ...prefixes,
      monthly: language === 'zh-CN' || language === 'zh-TW' ? '月' : 'M-',
      daily: language === 'zh-CN' || language === 'zh-TW' ? '日' : 'D-',
      hourly: language === 'zh-CN' || language === 'zh-TW' ? '時' : 'H-'
    };

    // 合并四化信息
    const combined = new Map<string, string[]>();

    // 添加四化信息到map
    const addMutagen = (mutagenInfo: MutagenInfo | undefined, prefix: string) => {
      if (!mutagenInfo) return;

      if (mutagenInfo.lu) {
        const existing = combined.get(mutagenInfo.lu) || [];
        combined.set(mutagenInfo.lu, [...existing, `${prefix}${typeNames.lu}`]);
      }
      if (mutagenInfo.quan) {
        const existing = combined.get(mutagenInfo.quan) || [];
        combined.set(mutagenInfo.quan, [...existing, `${prefix}${typeNames.quan}`]);
      }
      if (mutagenInfo.ke) {
        const existing = combined.get(mutagenInfo.ke) || [];
        combined.set(mutagenInfo.ke, [...existing, `${prefix}${typeNames.ke}`]);
      }
      if (mutagenInfo.ji) {
        const existing = combined.get(mutagenInfo.ji) || [];
        combined.set(mutagenInfo.ji, [...existing, `${prefix}${typeNames.ji}`]);
      }
    };

    // 添加各层级四化
    addMutagen(mutagenData.natal, prefixes.natal);
    if (mutagenData.decade) addMutagen(mutagenData.decade, prefixes.decade);
    if (mutagenData.yearly) addMutagen(mutagenData.yearly, prefixes.yearly);
    if (monthlyMutagen) addMutagen(monthlyMutagen, extendedPrefixes.monthly);
    if (dailyMutagen) addMutagen(dailyMutagen, extendedPrefixes.daily);
    if (hourlyMutagen) addMutagen(hourlyMutagen, extendedPrefixes.hourly);

    return {
      natal: mutagenData.natal!,
      decadal: mutagenData.decade,
      yearly: mutagenData.yearly,
      monthly: monthlyMutagen,
      daily: dailyMutagen,
      hourly: hourlyMutagen,
      combined
    };
  }

  /**
   * 为宫位中的星曜添加四化标记
   */
  static applyMutagenToPalaces(
    palaces: Palace[],
    mutagenInfo: CompleteMutagenInfo
  ): Palace[] {
    return palaces.map((palace) => {
      // 处理主星
      const majorStars = palace.majorStars.map(star => {
        // Try to find mutagen for this star
        let mutagens = mutagenInfo.combined.get(star.name) || [];

        // Also try normalized name if no direct match
        if (mutagens.length === 0) {
          const normalizedName = MutagenCore.normalizeStarName(star.name);
          if (normalizedName !== star.name) {
            mutagens = mutagenInfo.combined.get(normalizedName) || [];
          }
        }

        return { ...star, mutagen: mutagens };
      });

      // 处理辅星
      const minorStars = palace.minorStars.map(star => {
        // Try to find mutagen for this star
        let mutagens = mutagenInfo.combined.get(star.name) || [];

        // Also try normalized name if no direct match
        if (mutagens.length === 0) {
          const normalizedName = MutagenCore.normalizeStarName(star.name);
          if (normalizedName !== star.name) {
            mutagens = mutagenInfo.combined.get(normalizedName) || [];
          }
        }

        return { ...star, mutagen: mutagens };
      });

      return {
        ...palace,
        majorStars,
        minorStars
      };
    });
  }
}
