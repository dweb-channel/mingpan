/**
 * Hidden Stems Analyzer
 * Analyzes hidden stems (藏干) in earthly branches
 */

import { BaziChart, HiddenStemsAnalysis } from '../types';
import { HEAVENLY_STEMS, FIVE_ELEMENTS_ARRAY } from '../../../core/constants/bazi';

export class HiddenStemsAnalyzer {
  /**
   * Analyze hidden stems in the BaZi chart
   */
  static analyze(chart: BaziChart): HiddenStemsAnalysis {
    const byElement: Record<string, number> = {
      [FIVE_ELEMENTS_ARRAY[0]]: 0,  // 木 (wood)
      [FIVE_ELEMENTS_ARRAY[1]]: 0,  // 火 (fire)
      [FIVE_ELEMENTS_ARRAY[2]]: 0,  // 土 (earth)
      [FIVE_ELEMENTS_ARRAY[3]]: 0,  // 金 (metal)
      [FIVE_ELEMENTS_ARRAY[4]]: 0   // 水 (water)
    };
    
    const mainQi: string[] = [];
    const residualQi: string[] = [];
    let total = 0;
    
    // Analyze each pillar
    const pillars = [chart.year, chart.month, chart.day, chart.hour];
    
    pillars.forEach(pillar => {
      if (pillar.hiddenStems && pillar.hiddenStems.length > 0) {
        pillar.hiddenStems.forEach((hidden, index) => {
          const element = this.getStemElement(hidden.stem);
          if (element) {
            byElement[element] += hidden.power;
            total += hidden.power;
          }
          
          // First hidden stem is main qi (本氣)
          if (index === 0) {
            mainQi.push(hidden.stem);
          } else {
            residualQi.push(hidden.stem);
          }
        });
      }
    });
    
    return {
      total,
      byElement,
      mainQi,
      residualQi
    };
  }
  
  /**
   * Get element of a stem
   */
  private static getStemElement(stem: string): string {
    const stemData = HEAVENLY_STEMS.find(s => s.name === stem);
    return stemData?.element || '';
  }
}