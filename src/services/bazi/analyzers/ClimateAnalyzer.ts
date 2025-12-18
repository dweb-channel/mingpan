/**
 * Climate Analyzer
 * Analyzes climate conditions (寒暖燥濕) in BaZi chart
 */

import { BaziChart, ClimateAnalysis } from '../types';
import { 
  EARTHLY_BRANCHES, 
  HEAVENLY_STEMS,
  FIVE_ELEMENTS_ARRAY,
  EARTHLY_BRANCHES_ARRAY
} from '../../../core/constants/bazi';

export class ClimateAnalyzer {
  /**
   * Analyze climate conditions of the chart
   */
  static analyze(chart: BaziChart, birthInfo: any): ClimateAnalysis {
    // Analyze temperature
    const temperature = this.analyzeTemperature(chart);
    
    // Analyze humidity
    const humidity = this.analyzeHumidity(chart);
    
    // Get season
    const season = this.getSeason(chart.month.branch);
    
    // Generate adjustment suggestions
    const adjustment = this.getAdjustment(temperature, humidity);
    
    // Generate specific suggestions
    const suggestions = this.generateSuggestions(temperature, humidity, chart);
    
    return {
      temperature,
      humidity,
      season,
      adjustment,
      suggestions
    };
  }
  
  /**
   * Analyze temperature of the chart
   */
  private static analyzeTemperature(chart: BaziChart): '寒' | '凉' | '中性' | '暖' | '热' {
    let score = 0;
    
    // Check stems
    const stems = [chart.year.stem, chart.month.stem, chart.day.stem, chart.hour.stem];
    stems.forEach(stem => {
      const element = this.getStemElement(stem);
      if (element === FIVE_ELEMENTS_ARRAY[1]) score += 2; // 火 (fire)
      if (element === FIVE_ELEMENTS_ARRAY[4]) score -= 2; // 水 (water)
      if (element === FIVE_ELEMENTS_ARRAY[0]) score += 0.5; // 木 (wood) generates fire
      if (element === FIVE_ELEMENTS_ARRAY[3]) score -= 0.5; // 金 (metal) is cold
    });
    
    // Check branches
    const branches = [chart.year.branch, chart.month.branch, chart.day.branch, chart.hour.branch];
    branches.forEach(branch => {
      const element = this.getBranchElement(branch);
      if (element === FIVE_ELEMENTS_ARRAY[1]) score += 1.5; // 火 (fire)
      if (element === FIVE_ELEMENTS_ARRAY[4]) score -= 1.5; // 水 (water)
      
      // Special branches - summer: 巳(5), 午(6), 未(7)
      const summerBranches = [EARTHLY_BRANCHES_ARRAY[5], EARTHLY_BRANCHES_ARRAY[6], EARTHLY_BRANCHES_ARRAY[7]];
      if (summerBranches.includes(branch as any)) score += 1;
      // Winter branches - 亥(11), 子(0), 丑(1)
      const winterBranches = [EARTHLY_BRANCHES_ARRAY[11], EARTHLY_BRANCHES_ARRAY[0], EARTHLY_BRANCHES_ARRAY[1]];
      if (winterBranches.includes(branch as any)) score -= 1;
    });
    
    // Check season
    const season = this.getSeason(chart.month.branch);
    if (season === 'summer') score += 2;
    if (season === 'winter') score -= 2;
    
    // Categorize
    if (score <= -4) return '寒';
    if (score <= -2) return '凉';
    if (score <= 2) return '中性';
    if (score <= 4) return '暖';
    return '热';
  }
  
  /**
   * Analyze humidity of the chart
   */
  private static analyzeHumidity(chart: BaziChart): '燥' | '偏燥' | '平衡' | '偏湿' | '湿' {
    let score = 0;
    
    // Check stems
    const stems = [chart.year.stem, chart.month.stem, chart.day.stem, chart.hour.stem];
    stems.forEach(stem => {
      const element = this.getStemElement(stem);
      if (element === FIVE_ELEMENTS_ARRAY[4]) score += 2; // 水 (water)
      if (element === FIVE_ELEMENTS_ARRAY[1]) score -= 2; // 火 (fire)
      if (element === FIVE_ELEMENTS_ARRAY[2]) score -= 0.5; // 土 (earth) absorbs water
      if (element === FIVE_ELEMENTS_ARRAY[3]) score += 0.5; // 金 (metal) generates water
    });
    
    // Check branches
    const branches = [chart.year.branch, chart.month.branch, chart.day.branch, chart.hour.branch];
    branches.forEach(branch => {
      const element = this.getBranchElement(branch);
      if (element === FIVE_ELEMENTS_ARRAY[4]) score += 1.5; // 水 (water)
      if (element === FIVE_ELEMENTS_ARRAY[1]) score -= 1.5; // 火 (fire)
      if (element === FIVE_ELEMENTS_ARRAY[2]) score -= 0.5; // 土 (earth)
      
      // Earth branches are dry: 辰(4), 丑(1), 未(7), 戌(10)
      const earthBranches = [EARTHLY_BRANCHES_ARRAY[4], EARTHLY_BRANCHES_ARRAY[1], EARTHLY_BRANCHES_ARRAY[7], EARTHLY_BRANCHES_ARRAY[10]];
      if (earthBranches.includes(branch as any)) score -= 0.5;
      // Water branches: 亥(11), 子(0)
      const waterBranches = [EARTHLY_BRANCHES_ARRAY[11], EARTHLY_BRANCHES_ARRAY[0]];
      if (waterBranches.includes(branch as any)) score += 1;
    });
    
    // Categorize
    if (score <= -3) return '燥';
    if (score <= -1) return '偏燥';
    if (score <= 1) return '平衡';
    if (score <= 3) return '偏湿';
    return '湿';
  }
  
  /**
   * Get adjustment recommendation
   */
  private static getAdjustment(
    temperature: string,
    humidity: string
  ): string {
    // Return a translation key that can be processed by ContentTranslator
    return `climate_adjustment:${temperature}:${humidity}`;
  }
  
  /**
   * Generate specific suggestions
   */
  private static generateSuggestions(
    temperature: string,
    humidity: string,
    chart: BaziChart
  ): string[] {
    const suggestions: string[] = [];
    
    // Temperature-based suggestions
    if (temperature === 'cold' || temperature === 'cool') {
      suggestions.push('climate_suggestion:temp:cold:living');
      suggestions.push('climate_suggestion:temp:cold:career');
      suggestions.push('climate_suggestion:temp:cold:clothing');
    } else if (temperature === 'hot' || temperature === 'warm') {
      suggestions.push('climate_suggestion:temp:hot:living');
      suggestions.push('climate_suggestion:temp:hot:career');
      suggestions.push('climate_suggestion:temp:hot:clothing');
    }
    
    // Humidity-based suggestions
    if (humidity === 'dry' || humidity === 'slightly-dry') {
      suggestions.push('climate_suggestion:humidity:dry:hydration');
      suggestions.push('climate_suggestion:humidity:dry:environment');
      suggestions.push('climate_suggestion:humidity:dry:diet');
    } else if (humidity === 'wet' || humidity === 'slightly-wet') {
      suggestions.push('climate_suggestion:humidity:wet:environment');
      suggestions.push('climate_suggestion:humidity:wet:exercise');
      suggestions.push('climate_suggestion:humidity:wet:diet');
    }
    
    return suggestions;
  }
  
  // Helper methods
  private static getStemElement(stem: string): string {
    const stemData = HEAVENLY_STEMS.find(s => s.name === stem);
    return stemData?.element || '';
  }
  
  private static getBranchElement(branch: string): string {
    const branchData = EARTHLY_BRANCHES.find(b => b.name === branch);
    return branchData?.element || '';
  }
  
  private static getSeason(monthBranch: string): string {
    // Map branch to season using constants
    const branchIndex = EARTHLY_BRANCHES_ARRAY.indexOf(monthBranch as any);
    
    // Spring: 寅(2), 卯(3), 辰(4)
    if (branchIndex >= 2 && branchIndex <= 4) return 'spring';
    // Summer: 巳(5), 午(6), 未(7)
    if (branchIndex >= 5 && branchIndex <= 7) return 'summer';
    // Autumn: 申(8), 酉(9), 戌(10)
    if (branchIndex >= 8 && branchIndex <= 10) return 'autumn';
    // Winter: 亥(11), 子(0), 丑(1)
    return 'winter';
  }
}