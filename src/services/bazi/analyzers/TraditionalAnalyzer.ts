/**
 * Traditional BaZi Analyzer
 * Analyzes Yong Shen (用神) and Ge Ju (格局)
 */

import { 
  BaziChart, 
  YongShenAnalysis, 
  GeJuAnalysis, 
  FiveElementsAnalysis,
  DayMasterStrength 
} from '../types';
import { 
  HEAVENLY_STEMS, 
  EARTHLY_BRANCHES,
  FIVE_ELEMENTS_ARRAY,
  FIVE_ELEMENTS_RELATIONS,
  BRANCH_RELATIONS
} from '../../../core/constants/bazi';
import { StrengthAnalyzer } from './StrengthAnalyzer';

export class TraditionalAnalyzer {
  /**
   * Perform traditional BaZi analysis
   */
  static analyze(
    chart: BaziChart, 
    fiveElements: FiveElementsAnalysis,
    dayMasterElement: string
  ): {
    yongShen: YongShenAnalysis;
    geJu: GeJuAnalysis;
    strength: DayMasterStrength;
  } {
    // Use StrengthAnalyzer for consistent strength calculation
    const strengthAnalysis = StrengthAnalyzer.analyzeDayMasterStrength(chart);
    const strength = strengthAnalysis.strength;
    
    // Analyze Yong Shen based on strength
    const yongShen = this.analyzeYongShen(chart, fiveElements, dayMasterElement, strength);
    
    // Analyze Ge Ju (pattern)
    const geJu = this.analyzeGeJu(chart, dayMasterElement);
    
    return {
      yongShen,
      geJu,
      strength
    };
  }
  
  /**
   * Analyze day master strength based on five elements distribution
   */
  private static analyzeDayMasterStrength(
    fiveElements: FiveElementsAnalysis,
    dayMasterElement: string
  ): DayMasterStrength {
    // Create element map using constants
    const elementMap: Record<string, number> = {
      [FIVE_ELEMENTS_ARRAY[0]]: fiveElements.木,   // 木
      [FIVE_ELEMENTS_ARRAY[1]]: fiveElements.火,   // 火
      [FIVE_ELEMENTS_ARRAY[2]]: fiveElements.土,  // 土
      [FIVE_ELEMENTS_ARRAY[3]]: fiveElements.金,  // 金
      [FIVE_ELEMENTS_ARRAY[4]]: fiveElements.水   // 水
    };
    
    const dayMasterCount = elementMap[dayMasterElement] || 0;
    const total = fiveElements.total;
    const percentage = (dayMasterCount / total) * 100;
    
    // Consider supporting elements
    const supportingElement = this.getGeneratingElement(dayMasterElement);
    const supportCount = elementMap[supportingElement] || 0;
    const totalSupport = dayMasterCount + supportCount * 0.7;
    const supportPercentage = (totalSupport / total) * 100;
    
    if (supportPercentage < 15) return '衰极';
    if (supportPercentage < 25) return '偏弱';
    if (supportPercentage < 35) return '中和';
    if (supportPercentage < 45) return '身旺';
    return '旺极';
  }
  
  /**
   * Analyze Yong Shen (用神)
   */
  private static analyzeYongShen(
    chart: BaziChart,
    fiveElements: FiveElementsAnalysis,
    dayMasterElement: string,
    strength: DayMasterStrength
  ): YongShenAnalysis {
    const yongShen: string[] = [];
    const xiShen: string[] = [];
    const jiShen: string[] = [];
    const xianShen: string[] = [];
    
    // Determine Yong Shen based on day master strength
    if (strength === '衰极') {
      // Too weak - use same element and generating element
      yongShen.push(dayMasterElement);
      const generating = this.getGeneratingElement(dayMasterElement);
      yongShen.push(generating);
      xiShen.push(generating);
      
      // Ji Shen - controlling and draining elements
      jiShen.push(this.getControllingElement(dayMasterElement));
      jiShen.push(this.getDrainingElement(dayMasterElement));
      jiShen.push(this.getControlledElement(dayMasterElement));
    } else if (strength === '偏弱' || strength === '身弱') {
      // Weak - primarily use generating element
      const generating = this.getGeneratingElement(dayMasterElement);
      yongShen.push(generating);
      xiShen.push(dayMasterElement);
      
      // Ji Shen - controlling element
      jiShen.push(this.getControllingElement(dayMasterElement));
      
      // Xian Shen - neutral elements
      xianShen.push(this.getDrainingElement(dayMasterElement));
      xianShen.push(this.getControlledElement(dayMasterElement));
    } else if (strength === '中和') {
      // Normal - need balance based on what's missing
      if (fiveElements.balance.missing.length > 0) {
        yongShen.push(...fiveElements.balance.missing);
      } else {
        // Use elements that create circulation
        const controlled = this.getControlledElement(dayMasterElement);
        yongShen.push(controlled);
        xiShen.push(this.getDrainingElement(dayMasterElement));
      }
    } else if (strength === '偏强' || strength === '身旺') {
      // Strong - use draining and controlled elements
      yongShen.push(this.getDrainingElement(dayMasterElement));
      xiShen.push(this.getControlledElement(dayMasterElement));
      
      // Ji Shen - same and generating elements
      jiShen.push(dayMasterElement);
      jiShen.push(this.getGeneratingElement(dayMasterElement));
    } else {
      // Too strong - follow the strength
      yongShen.push(dayMasterElement);
      xiShen.push(this.getGeneratingElement(dayMasterElement));
      
      // Ji Shen - controlling element
      jiShen.push(this.getControllingElement(dayMasterElement));
    }
    
    // Generate explanation
    const explanation = this.generateYongShenExplanation(strength, dayMasterElement, yongShen);
    
    return {
      yongShen: [...new Set(yongShen)],
      xiShen: [...new Set(xiShen)],
      jiShen: [...new Set(jiShen)],
      xianShen: [...new Set(xianShen)],
      explanation
    };
  }
  
  /**
   * Analyze Ge Ju (格局)
   */
  private static analyzeGeJu(chart: BaziChart, dayMasterElement: string): GeJuAnalysis {
    // Check for special patterns first
    const specialPattern = this.checkSpecialPatterns(chart);
    if (specialPattern) {
      return specialPattern;
    }
    
    // Check regular patterns based on month branch
    const monthBranch = chart.month.branch;
    const monthElement = this.getBranchElement(monthBranch);
    
    // Determine pattern based on relationship between day master and month branch
    let pattern = '';
    let type = '';
    let quality: '优秀' | '良好' | '一般' | '较差' = '一般';
    
    if (monthElement === dayMasterElement) {
      pattern = 'jianlu';
      type = 'strong_body';
      quality = '良好';
    } else if (this.isGenerating(monthElement, dayMasterElement)) {
      pattern = 'seal';
      type = 'seal';
      quality = '良好';
    } else if (this.isControlling(dayMasterElement, monthElement)) {
      pattern = 'wealth';
      type = 'wealth';
      quality = '良好';
    } else if (this.isControlling(monthElement, dayMasterElement)) {
      pattern = 'officer';
      type = 'officer';
      quality = '良好';
    } else if (this.isGenerating(dayMasterElement, monthElement)) {
      pattern = 'output';
      type = 'output';
      quality = '一般';
    }
    
    // Check pattern quality
    if (this.hasGoodCombination(chart)) {
      quality = quality === '良好' ? '优秀' : '良好';
    }
    
    const description = this.generateGeJuDescription(pattern, type, quality);
    
    return {
      pattern,
      type,
      quality,
      description
    };
  }
  
  /**
   * Check for special patterns
   */
  private static checkSpecialPatterns(chart: BaziChart): GeJuAnalysis | null {
    // Check for Cong Ge (從格) - following pattern
    const stems = [chart.year.stem, chart.month.stem, chart.day.stem, chart.hour.stem];
    const elements = stems.map(s => this.getStemElement(s));
    const uniqueElements = new Set(elements);
    
    if (uniqueElements.size === 2) {
      // Possible Cong Ge
      const dayElement = this.getStemElement(chart.day.stem);
      const otherElements = elements.filter(e => e !== dayElement);
      
      if (otherElements.length >= 3) {
        const dominantElement = otherElements[0];
        if (otherElements.every(e => e === dominantElement)) {
          return {
            pattern: `follow_${dominantElement}`,
            type: '从格',
            quality: '优秀',
            description: `follow_pattern_${dominantElement}`
          };
        }
      }
    }
    
    // Check for Zhuan Wang Ge (專旺格)
    if (elements.filter(e => e === elements[2]).length >= 3) {
      return {
        pattern: 'specialized_strong',
        type: 'specialized_strong',
        quality: '优秀',
        description: 'specialized_strong_pattern'
      };
    }
    
    return null;
  }
  
  /**
   * Check if chart has good combinations
   */
  private static hasGoodCombination(chart: BaziChart): boolean {
    // Simplified check - in reality would check for specific combinations
    const branches = [chart.year.branch, chart.month.branch, chart.day.branch, chart.hour.branch];
    
    // Check for three harmony
    return BRANCH_RELATIONS.threeHarmony.some((harmony: string[]) => 
      harmony.filter(h => branches.includes(h)).length >= 2
    );
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
  
  private static getGeneratingElement(element: string): string {
    return FIVE_ELEMENTS_RELATIONS.generateBy[element as keyof typeof FIVE_ELEMENTS_RELATIONS.generateBy] || '';
  }
  
  private static getControllingElement(element: string): string {
    return FIVE_ELEMENTS_RELATIONS.restrictBy[element as keyof typeof FIVE_ELEMENTS_RELATIONS.restrictBy] || '';
  }
  
  private static getControlledElement(element: string): string {
    return FIVE_ELEMENTS_RELATIONS.controlling[element as keyof typeof FIVE_ELEMENTS_RELATIONS.controlling] || '';
  }
  
  private static getDrainingElement(element: string): string {
    return FIVE_ELEMENTS_RELATIONS.generating[element as keyof typeof FIVE_ELEMENTS_RELATIONS.generating] || '';
  }
  
  private static isGenerating(from: string, to: string): boolean {
    return this.getGeneratingElement(to) === from;
  }
  
  private static isControlling(from: string, to: string): boolean {
    return this.getControlledElement(from) === to;
  }
  
  private static generateYongShenExplanation(
    strength: DayMasterStrength,
    dayMasterElement: string,
    yongShen: string[]
  ): string {
    // Return a key that can be translated at the display layer
    return `yongshen_explanation:${strength}:${dayMasterElement}:${yongShen.join(',')}`;
  }
  
  private static generateGeJuDescription(pattern: string, type: string, quality: string): string {
    // Return a key that can be translated at the display layer
    return `geju_description:${pattern}:${type}:${quality}`;
  }
}