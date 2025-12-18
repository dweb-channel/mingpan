import { BaziChart } from '../types';

/**
 * 六十甲子纳音五行表
 * Each pair of stems and branches has a specific NaYin element
 */
const NAYIN_MAP: Record<string, string> = {
  // 甲子乙丑海中金
  '甲子': '海中金', '乙丑': '海中金',
  // 丙寅丁卯炉中火
  '丙寅': '炉中火', '丁卯': '炉中火',
  // 戊辰己巳大林木
  '戊辰': '大林木', '己巳': '大林木',
  // 庚午辛未路旁土
  '庚午': '路旁土', '辛未': '路旁土',
  // 壬申癸酉剑锋金
  '壬申': '剑锋金', '癸酉': '剑锋金',
  // 甲戌乙亥山头火
  '甲戌': '山头火', '乙亥': '山头火',
  // 丙子丁丑涧下水
  '丙子': '涧下水', '丁丑': '涧下水',
  // 戊寅己卯城头土
  '戊寅': '城头土', '己卯': '城头土',
  // 庚辰辛巳白蜡金
  '庚辰': '白蜡金', '辛巳': '白蜡金',
  // 壬午癸未杨柳木
  '壬午': '杨柳木', '癸未': '杨柳木',
  // 甲申乙酉泉中水
  '甲申': '泉中水', '乙酉': '泉中水',
  // 丙戌丁亥屋上土
  '丙戌': '屋上土', '丁亥': '屋上土',
  // 戊子己丑霹雳火
  '戊子': '霹雳火', '己丑': '霹雳火',
  // 庚寅辛卯松柏木
  '庚寅': '松柏木', '辛卯': '松柏木',
  // 壬辰癸巳长流水
  '壬辰': '长流水', '癸巳': '长流水',
  // 甲午乙未沙中金
  '甲午': '沙中金', '乙未': '沙中金',
  // 丙申丁酉山下火
  '丙申': '山下火', '丁酉': '山下火',
  // 戊戌己亥平地木
  '戊戌': '平地木', '己亥': '平地木',
  // 庚子辛丑壁上土
  '庚子': '壁上土', '辛丑': '壁上土',
  // 壬寅癸卯金箔金
  '壬寅': '金箔金', '癸卯': '金箔金',
  // 甲辰乙巳覆灯火
  '甲辰': '覆灯火', '乙巳': '覆灯火',
  // 丙午丁未天河水
  '丙午': '天河水', '丁未': '天河水',
  // 戊申己酉大驿土
  '戊申': '大驿土', '己酉': '大驿土',
  // 庚戌辛亥钗钏金
  '庚戌': '钗钏金', '辛亥': '钗钏金',
  // 壬子癸丑桑柘木
  '壬子': '桑柘木', '癸丑': '桑柘木',
  // 甲寅乙卯大溪水
  '甲寅': '大溪水', '乙卯': '大溪水',
  // 丙辰丁巳沙中土
  '丙辰': '沙中土', '丁巳': '沙中土',
  // 戊午己未天上火
  '戊午': '天上火', '己未': '天上火',
  // 庚申辛酉石榴木
  '庚申': '石榴木', '辛酉': '石榴木',
  // 壬戌癸亥大海水
  '壬戌': '大海水', '癸亥': '大海水'
};

/**
 * NaYin element characteristics
 */
const NAYIN_CHARACTERISTICS: Record<string, {
  element: string;
  quality: string;
  description: string;
}> = {
  '海中金': { element: '金', quality: '深藏', description: '金在海中，宝藏深藏，需要挖掘' },
  '炉中火': { element: '火', quality: '炼化', description: '炉中之火，可炼金成器' },
  '大林木': { element: '木', quality: '茂盛', description: '大林之木，枝繁叶茂' },
  '路旁土': { element: '土', quality: '承载', description: '路旁之土，承载万物' },
  '剑锋金': { element: '金', quality: '锋利', description: '剑锋之金，锋芒毕露' },
  '山头火': { element: '火', quality: '光明', description: '山头之火，照亮四方' },
  '涧下水': { element: '水', quality: '清澈', description: '涧下之水，清澈见底' },
  '城头土': { element: '土', quality: '坚固', description: '城头之土，固若金汤' },
  '白蜡金': { element: '金', quality: '精纯', description: '白蜡之金，纯净精致' },
  '杨柳木': { element: '木', quality: '柔韧', description: '杨柳之木，柔韧多姿' },
  '泉中水': { element: '水', quality: '涌动', description: '泉中之水，源源不断' },
  '屋上土': { element: '土', quality: '庇护', description: '屋上之土，遮风挡雨' },
  '霹雳火': { element: '火', quality: '迅猛', description: '霹雳之火，雷厉风行' },
  '松柏木': { element: '木', quality: '坚韧', description: '松柏之木，傲雪凌霜' },
  '长流水': { element: '水', quality: '绵延', description: '长流之水，绵延不绝' },
  '沙中金': { element: '金', quality: '散布', description: '沙中之金，需要淘洗' },
  '山下火': { element: '火', quality: '温暖', description: '山下之火，温暖如春' },
  '平地木': { element: '木', quality: '平稳', description: '平地之木，根基稳固' },
  '壁上土': { element: '土', quality: '装饰', description: '壁上之土，美化环境' },
  '金箔金': { element: '金', quality: '华丽', description: '金箔之金，华丽装饰' },
  '覆灯火': { element: '火', quality: '照明', description: '覆灯之火，照亮前程' },
  '天河水': { element: '水', quality: '浩瀚', description: '天河之水，浩瀚无垠' },
  '大驿土': { element: '土', quality: '通达', description: '大驿之土，四通八达' },
  '钗钏金': { element: '金', quality: '精美', description: '钗钏之金，精美饰品' },
  '桑柘木': { element: '木', quality: '实用', description: '桑柘之木，养蚕织布' },
  '大溪水': { element: '水', quality: '汇聚', description: '大溪之水，百川汇聚' },
  '沙中土': { element: '土', quality: '松软', description: '沙中之土，松软易变' },
  '天上火': { element: '火', quality: '崇高', description: '天上之火，高不可攀' },
  '石榴木': { element: '木', quality: '多子', description: '石榴之木，多子多福' },
  '大海水': { element: '水', quality: '包容', description: '大海之水，包容万物' }
};

export interface NaYinElement {
  name: string;
  element: string;
  quality: string;
  description: string;
}

export interface NaYinAnalysis {
  year: NaYinElement;
  month: NaYinElement;
  day: NaYinElement;
  hour: NaYinElement | null;
  summary: {
    dominantElement: string;
    characteristics: string[];
    interactions: string[];
  };
}

export class NaYinAnalyzer {
  /**
   * Get NaYin element for a stem-branch combination
   */
  private static getNaYin(stem: string, branch: string): NaYinElement | null {
    const key = stem + branch;
    const nayin = NAYIN_MAP[key];
    
    if (!nayin) return null;
    
    const characteristics = NAYIN_CHARACTERISTICS[nayin];
    return {
      name: nayin,
      element: characteristics.element,
      quality: characteristics.quality,
      description: characteristics.description
    };
  }

  /**
   * Analyze element interactions between NaYin elements
   */
  private static analyzeInteractions(elements: (NaYinElement | null)[]): string[] {
    const interactions: string[] = [];
    const validElements = elements.filter(e => e !== null) as NaYinElement[];
    
    // Check for same element reinforcement
    const elementCounts: Record<string, number> = {};
    validElements.forEach(e => {
      elementCounts[e.element] = (elementCounts[e.element] || 0) + 1;
    });
    
    Object.entries(elementCounts).forEach(([element, count]) => {
      if (count >= 3) {
        interactions.push(`strong_${element}_convergence`);
      } else if (count === 2) {
        interactions.push(`${element}_reinforcement`);
      }
    });
    
    // Check generation cycles
    const generationMap: Record<string, string> = {
      '木': '火',
      '火': '土',
      '土': '金',
      '金': '水',
      '水': '木'
    };
    
    for (let i = 0; i < validElements.length - 1; i++) {
      const current = validElements[i];
      const next = validElements[i + 1];
      
      if (generationMap[current.element] === next.element) {
        interactions.push(`${current.element}_generates_${next.element}`);
      }
    }
    
    // Check control cycles
    const controlMap: Record<string, string> = {
      '木': '土',
      '土': '水',
      '水': '火',
      '火': '金',
      '金': '木'
    };
    
    for (let i = 0; i < validElements.length; i++) {
      for (let j = i + 1; j < validElements.length; j++) {
        if (controlMap[validElements[i].element] === validElements[j].element) {
          interactions.push(`${validElements[i].element}_controls_${validElements[j].element}`);
        }
      }
    }
    
    return interactions;
  }

  /**
   * Analyze NaYin elements for a BaZi chart
   */
  static analyze(chart: BaziChart): NaYinAnalysis {
    const yearNaYin = this.getNaYin(chart.year.stem, chart.year.branch);
    const monthNaYin = this.getNaYin(chart.month.stem, chart.month.branch);
    const dayNaYin = this.getNaYin(chart.day.stem, chart.day.branch);
    const hourNaYin = chart.hour ? 
      this.getNaYin(chart.hour.stem, chart.hour.branch) : null;
    
    const allElements = [yearNaYin, monthNaYin, dayNaYin, hourNaYin];
    const validElements = allElements.filter(e => e !== null) as NaYinElement[];
    
    // Find dominant element
    const elementCounts: Record<string, number> = {};
    validElements.forEach(e => {
      elementCounts[e.element] = (elementCounts[e.element] || 0) + 1;
    });
    
    const dominantElement = Object.entries(elementCounts)
      .sort(([,a], [,b]) => b - a)[0][0];
    
    // Collect unique characteristics
    const characteristics = [...new Set(validElements.map(e => e.quality))];
    
    // Analyze interactions
    const interactions = this.analyzeInteractions(allElements);
    
    return {
      year: yearNaYin!,
      month: monthNaYin!,
      day: dayNaYin!,
      hour: hourNaYin,
      summary: {
        dominantElement,
        characteristics,
        interactions
      }
    };
  }
}