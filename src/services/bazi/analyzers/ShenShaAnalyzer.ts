/**
 * Shen Sha Analyzer
 * Analyzes auspicious and inauspicious spirits (神煞) in BaZi chart
 * Implements 40-50 traditional ShenSha types following classical BaZi rules
 */

import { BaziChart, ShenShaInfo } from '../types';
import { 
  SHEN_SHA_DEFINITIONS,
  HEAVENLY_STEMS_ARRAY,
  EARTHLY_BRANCHES_ARRAY
} from '../../../core/constants/bazi';
import { POSITION_NAMES } from '../../../core/constants/positions';

export class ShenShaAnalyzer {
  /**
   * Analyze Shen Sha in the BaZi chart
   */
  static analyze(chart: BaziChart, gender: 'male' | 'female'): ShenShaInfo[] {
    const results: ShenShaInfo[] = [];
    
    // Get day master for reference
    const dayMaster = chart.day.stem;
    const dayBranch = chart.day.branch;
    
    // Noble Persons (貴人) - 10 types
    results.push(...this.checkTianYi(dayMaster, chart));         // 天乙貴人
    results.push(...this.checkTaiJi(chart));                     // 太極貴人
    results.push(...this.checkWenChang(dayMaster, chart));       // 文昌貴人
    results.push(...this.checkWenQu(dayMaster, chart));          // 文曲貴人
    results.push(...this.checkGuoYin(dayMaster, chart));         // 國印貴人
    results.push(...this.checkDeXiu(dayMaster, chart));          // 德秀貴人
    results.push(...this.checkTianDe(chart));                    // 天德貴人
    results.push(...this.checkYueDe(chart));                     // 月德貴人
    results.push(...this.checkFuXing(dayMaster, chart));         // 福星貴人
    results.push(...this.checkSanQi(dayMaster, chart));          // 三奇貴人
    
    // Academic & Career Stars (學業事業) - 8 types
    results.push(...this.checkXueTang(dayMaster, chart));        // 學堂
    results.push(...this.checkCiGuan(dayMaster, chart));         // 詞館
    results.push(...this.checkJinYu(dayMaster, chart));          // 金輿
    results.push(...this.checkLuShen(dayMaster, chart));         // 祿神
    results.push(...this.checkJiangXing(chart));                 // 將星
    results.push(...this.checkHuaGai(chart));                    // 華蓋
    results.push(...this.checkYiMa(chart));                      // 驛馬
    results.push(...this.checkTianYiDoctor(dayMaster, chart));   // 天醫
    
    // Romance & Relationships (感情) - 6 types
    results.push(...this.checkPeachBlossom(dayBranch, chart));   // 桃花
    results.push(...this.checkHongLuan(chart));                  // 紅鸞
    results.push(...this.checkTianXi(chart));                    // 天喜
    results.push(...this.checkXianChi(dayBranch, chart));        // 咸池
    results.push(...this.checkLonelyStars(chart, gender));       // 孤辰寡宿
    results.push(...this.checkYuanChen(chart, gender));          // 元辰
    
    // Wealth & Fortune (財富) - 5 types
    results.push(...this.checkJinShen(dayMaster, chart));        // 金神
    results.push(...this.checkTianCai(dayMaster, chart));        // 天財
    results.push(...this.checkBaZhuan(chart));                   // 八專
    results.push(...this.checkShiGan(dayMaster, chart));         // 十干祿
    results.push(...this.checkJianLu(dayMaster, chart));         // 建祿
    
    // Inauspicious Spirits (凶煞) - 15 types
    results.push(...this.checkYangRen(dayMaster, chart));        // 羊刃
    results.push(...this.checkFeiRen(dayMaster, chart));         // 飛刃
    results.push(...this.checkXueRen(chart));                    // 血刃
    results.push(...this.checkJieSha(chart));                    // 劫煞
    results.push(...this.checkZaiSha(chart));                    // 災煞
    results.push(...this.checkWangShen(chart));                  // 亡神
    results.push(...this.checkLiuE(chart));                      // 六厄
    results.push(...this.checkTianKu(chart));                    // 天哭
    results.push(...this.checkDiKu(chart));                      // 地哭
    results.push(...this.checkBaiHu(chart));                     // 白虎
    results.push(...this.checkPiMa(chart));                      // 披麻
    results.push(...this.checkDiaoKe(chart));                    // 吊客
    results.push(...this.checkTianLuo(chart));                   // 天羅
    results.push(...this.checkDiWang(chart));                    // 地網
    results.push(...this.checkLiuXia(chart));                    // 流霞
    
    // Special Formations (特殊格局) - 6 types
    results.push(...this.checkKuiGang(chart));                   // 魁罡
    results.push(...this.checkJinShenGe(chart));                 // 金神格
    results.push(...this.checkRiDeGe(chart));                    // 日德格
    results.push(...this.checkKongWang(chart));                  // 空亡
    results.push(...this.checkSiDaKongWang(chart));              // 四大空亡
    results.push(...this.checkShiEYunDao(chart));                // 十惡大敗
    
    return results;
  }
  
  /**
   * Check for Tian Yi Noble Person (天乙貴人)
   */
  private static checkTianYi(dayMaster: string, chart: BaziChart): ShenShaInfo[] {
    const results: ShenShaInfo[] = [];
    
    // Tian Yi mapping based on day master
    const tianYiMap: Record<string, string[]> = {
      [HEAVENLY_STEMS_ARRAY[0]]: [EARTHLY_BRANCHES_ARRAY[1], EARTHLY_BRANCHES_ARRAY[7]],  // 甲: 丑, 未
      [HEAVENLY_STEMS_ARRAY[1]]: [EARTHLY_BRANCHES_ARRAY[0], EARTHLY_BRANCHES_ARRAY[8]],  // 乙: 子, 申
      [HEAVENLY_STEMS_ARRAY[2]]: [EARTHLY_BRANCHES_ARRAY[11], EARTHLY_BRANCHES_ARRAY[9]], // 丙: 亥, 酉
      [HEAVENLY_STEMS_ARRAY[3]]: [EARTHLY_BRANCHES_ARRAY[11], EARTHLY_BRANCHES_ARRAY[9]], // 丁: 亥, 酉
      [HEAVENLY_STEMS_ARRAY[4]]: [EARTHLY_BRANCHES_ARRAY[1], EARTHLY_BRANCHES_ARRAY[7]],  // 戊: 丑, 未
      [HEAVENLY_STEMS_ARRAY[5]]: [EARTHLY_BRANCHES_ARRAY[0], EARTHLY_BRANCHES_ARRAY[8]],  // 己: 子, 申
      [HEAVENLY_STEMS_ARRAY[6]]: [EARTHLY_BRANCHES_ARRAY[1], EARTHLY_BRANCHES_ARRAY[7]],  // 庚: 丑, 未
      [HEAVENLY_STEMS_ARRAY[7]]: [EARTHLY_BRANCHES_ARRAY[2], EARTHLY_BRANCHES_ARRAY[6]],  // 辛: 寅, 午
      [HEAVENLY_STEMS_ARRAY[8]]: [EARTHLY_BRANCHES_ARRAY[3], EARTHLY_BRANCHES_ARRAY[5]],  // 壬: 卯, 巳
      [HEAVENLY_STEMS_ARRAY[9]]: [EARTHLY_BRANCHES_ARRAY[3], EARTHLY_BRANCHES_ARRAY[5]]   // 癸: 卯, 巳
    };
    
    const tianYiBranches = tianYiMap[dayMaster] || [];
    const branches = [
      { branch: chart.year.branch, position: '年支' },
      { branch: chart.month.branch, position: '月支' },
      { branch: chart.day.branch, position: '日支' },
      { branch: chart.hour.branch, position: '時支' }
    ];
    
    branches.forEach(({ branch, position }) => {
      if (tianYiBranches.includes(branch)) {
        results.push({
          name: '天乙貴人',
          type: '吉星',
          position,
          description: '天乙貴人，主貴人相助，逢凶化吉。遇難得貴人扶持，宜從事公職或與人合作。'
        });
      }
    });
    
    return results;
  }
  
  /**
   * Check for Tai Ji Noble Person (太極貴人)
   */
  private static checkTaiJi(chart: BaziChart): ShenShaInfo[] {
    const results: ShenShaInfo[] = [];
    
    // Simplified Tai Ji check - when stem and branch elements complement
    const pillars = [
      { pillar: chart.year, position: POSITION_NAMES.year },
      { pillar: chart.month, position: POSITION_NAMES.month },
      { pillar: chart.day, position: POSITION_NAMES.day },
      { pillar: chart.hour, position: POSITION_NAMES.hour }
    ];
    
    // Check for specific combinations that form Tai Ji
    const taiJiCombos = [
      { stem: HEAVENLY_STEMS_ARRAY[0], branch: EARTHLY_BRANCHES_ARRAY[0] },   // 甲子
      { stem: HEAVENLY_STEMS_ARRAY[1], branch: EARTHLY_BRANCHES_ARRAY[6] },   // 乙午
      { stem: HEAVENLY_STEMS_ARRAY[2], branch: EARTHLY_BRANCHES_ARRAY[3] },   // 丙卯
      { stem: HEAVENLY_STEMS_ARRAY[3], branch: EARTHLY_BRANCHES_ARRAY[9] },   // 丁酉
      { stem: HEAVENLY_STEMS_ARRAY[4], branch: EARTHLY_BRANCHES_ARRAY[4] },   // 戊辰
      { stem: HEAVENLY_STEMS_ARRAY[5], branch: EARTHLY_BRANCHES_ARRAY[1] },   // 己丑
      { stem: HEAVENLY_STEMS_ARRAY[6], branch: EARTHLY_BRANCHES_ARRAY[2] },   // 庚寅
      { stem: HEAVENLY_STEMS_ARRAY[7], branch: EARTHLY_BRANCHES_ARRAY[11] },  // 辛亥
      { stem: HEAVENLY_STEMS_ARRAY[8], branch: EARTHLY_BRANCHES_ARRAY[8] },   // 壬申
      { stem: HEAVENLY_STEMS_ARRAY[9], branch: EARTHLY_BRANCHES_ARRAY[5] }    // 癸巳
    ];
    
    pillars.forEach(({ pillar, position }) => {
      if (taiJiCombos.some(combo => 
        combo.stem === pillar.stem && combo.branch === pillar.branch
      )) {
        results.push({
          name: '太極貴人',
          type: '吉星',
          position,
          description: '太極貴人，主聰明好學，悟性高，有研究精神。易得上級賞識，適合學術研究。'
        });
      }
    });
    
    return results;
  }
  
  /**
   * Check for Wen Chang (文昌貴人)
   */
  private static checkWenChang(dayMaster: string, chart: BaziChart): ShenShaInfo[] {
    const results: ShenShaInfo[] = [];
    
    // Wen Chang mapping
    const wenChangMap: Record<string, string> = {
      [HEAVENLY_STEMS_ARRAY[0]]: EARTHLY_BRANCHES_ARRAY[5],   // 甲: 巳
      [HEAVENLY_STEMS_ARRAY[1]]: EARTHLY_BRANCHES_ARRAY[6],   // 乙: 午
      [HEAVENLY_STEMS_ARRAY[2]]: EARTHLY_BRANCHES_ARRAY[8],   // 丙: 申
      [HEAVENLY_STEMS_ARRAY[3]]: EARTHLY_BRANCHES_ARRAY[9],   // 丁: 酉
      [HEAVENLY_STEMS_ARRAY[4]]: EARTHLY_BRANCHES_ARRAY[8],   // 戊: 申
      [HEAVENLY_STEMS_ARRAY[5]]: EARTHLY_BRANCHES_ARRAY[9],   // 己: 酉
      [HEAVENLY_STEMS_ARRAY[6]]: EARTHLY_BRANCHES_ARRAY[11],  // 庚: 亥
      [HEAVENLY_STEMS_ARRAY[7]]: EARTHLY_BRANCHES_ARRAY[0],   // 辛: 子
      [HEAVENLY_STEMS_ARRAY[8]]: EARTHLY_BRANCHES_ARRAY[2],   // 壬: 寅
      [HEAVENLY_STEMS_ARRAY[9]]: EARTHLY_BRANCHES_ARRAY[3]    // 癸: 卯
    };
    
    const wenChangBranch = wenChangMap[dayMaster];
    if (!wenChangBranch) return results;
    
    const branches = [
      { branch: chart.year.branch, position: '年支' },
      { branch: chart.month.branch, position: '月支' },
      { branch: chart.day.branch, position: '日支' },
      { branch: chart.hour.branch, position: '時支' }
    ];
    
    branches.forEach(({ branch, position }) => {
      if (branch === wenChangBranch) {
        results.push({
          name: '文昌貴人',
          type: '吉星',
          position,
          description: '文昌貴人，主文采斐然，考試順利。利於讀書求學，文職工作，創作寫作。'
        });
      }
    });
    
    return results;
  }
  
  /**
   * Check for Peach Blossom (桃花)
   */
  private static checkPeachBlossom(dayBranch: string, chart: BaziChart): ShenShaInfo[] {
    const results: ShenShaInfo[] = [];
    
    // Peach blossom mapping based on day branch
    const peachBlossomMap: Record<string, string> = {
      [EARTHLY_BRANCHES_ARRAY[8]]: EARTHLY_BRANCHES_ARRAY[9],  // 申: 酉
      [EARTHLY_BRANCHES_ARRAY[0]]: EARTHLY_BRANCHES_ARRAY[9],  // 子: 酉
      [EARTHLY_BRANCHES_ARRAY[4]]: EARTHLY_BRANCHES_ARRAY[9],  // 辰: 酉
      [EARTHLY_BRANCHES_ARRAY[2]]: EARTHLY_BRANCHES_ARRAY[3],  // 寅: 卯
      [EARTHLY_BRANCHES_ARRAY[6]]: EARTHLY_BRANCHES_ARRAY[3],  // 午: 卯
      [EARTHLY_BRANCHES_ARRAY[10]]: EARTHLY_BRANCHES_ARRAY[3], // 戌: 卯
      [EARTHLY_BRANCHES_ARRAY[5]]: EARTHLY_BRANCHES_ARRAY[6],  // 巳: 午
      [EARTHLY_BRANCHES_ARRAY[9]]: EARTHLY_BRANCHES_ARRAY[6],  // 酉: 午
      [EARTHLY_BRANCHES_ARRAY[1]]: EARTHLY_BRANCHES_ARRAY[6],  // 丑: 午
      [EARTHLY_BRANCHES_ARRAY[11]]: EARTHLY_BRANCHES_ARRAY[0], // 亥: 子
      [EARTHLY_BRANCHES_ARRAY[3]]: EARTHLY_BRANCHES_ARRAY[0],  // 卯: 子
      [EARTHLY_BRANCHES_ARRAY[7]]: EARTHLY_BRANCHES_ARRAY[0]   // 未: 子
    };
    
    const peachBranch = peachBlossomMap[dayBranch];
    if (!peachBranch) return results;
    
    const branches = [
      { branch: chart.year.branch, position: '年支' },
      { branch: chart.month.branch, position: '月支' },
      { branch: chart.day.branch, position: '日支' },
      { branch: chart.hour.branch, position: '時支' }
    ];
    
    branches.forEach(({ branch, position }) => {
      if (branch === peachBranch) {
        results.push({
          name: '桃花',
          type: '中性',
          position,
          description: '桃花星，主異性緣佳，感情豐富。魅力十足，但需防爛桃花。'
        });
      }
    });
    
    return results;
  }
  
  /**
   * Check for other noble persons
   */
  private static checkNoblePersons(dayMaster: string, chart: BaziChart): ShenShaInfo[] {
    const results: ShenShaInfo[] = [];
    
    // Check for Tian De (天德) - simplified
    if (chart.month.branch === EARTHLY_BRANCHES_ARRAY[2] && dayMaster === HEAVENLY_STEMS_ARRAY[3]) {  // 寅, 丁
      results.push({
        name: '天德貴人',
        type: '吉星',
        position: POSITION_NAMES.month,
        description: '天德貴人，主逢凶化吉，遇難呈祥。能消災解厄，化險為夷。'
      });
    }
    
    // Check for Yue De (月德) - simplified
    if (chart.month.branch === EARTHLY_BRANCHES_ARRAY[0] && dayMaster === HEAVENLY_STEMS_ARRAY[8]) {  // 子, 壬
      results.push({
        name: '月德貴人',
        type: '吉星',
        position: POSITION_NAMES.month,
        description: '月德貴人，主慈祥和善，福澤深厚。人緣好，容易得到幫助。'
      });
    }
    
    // Check for Fu Xing (福星) - simplified
    const fuXingCombos = [
      { stem: HEAVENLY_STEMS_ARRAY[0], branch: EARTHLY_BRANCHES_ARRAY[2] },  // 甲寅
      { stem: HEAVENLY_STEMS_ARRAY[1], branch: EARTHLY_BRANCHES_ARRAY[3] },  // 乙卯
      { stem: HEAVENLY_STEMS_ARRAY[2], branch: EARTHLY_BRANCHES_ARRAY[5] },  // 丙巳
      { stem: HEAVENLY_STEMS_ARRAY[3], branch: EARTHLY_BRANCHES_ARRAY[6] }   // 丁午
    ];
    
    if (fuXingCombos.some(combo => 
      combo.stem === chart.year.stem && combo.branch === chart.year.branch
    )) {
      results.push({
        name: '福星貴人',
        type: '吉星',
        position: POSITION_NAMES.year,
        description: '福星貴人，主福祿雙全，一生順遂。財運亨通，事業有成。'
      });
    }
    
    return results;
  }
  
  /**
   * Check for evil spirits
   */
  private static checkEvilSpirits(chart: BaziChart): ShenShaInfo[] {
    const results: ShenShaInfo[] = [];
    
    // Check for Jie Sha (劫煞) - simplified
    const jieMap: Record<string, string> = {
      [EARTHLY_BRANCHES_ARRAY[8]]: EARTHLY_BRANCHES_ARRAY[5],   // 申: 巳
      [EARTHLY_BRANCHES_ARRAY[0]]: EARTHLY_BRANCHES_ARRAY[5],   // 子: 巳
      [EARTHLY_BRANCHES_ARRAY[4]]: EARTHLY_BRANCHES_ARRAY[5],   // 辰: 巳
      [EARTHLY_BRANCHES_ARRAY[2]]: EARTHLY_BRANCHES_ARRAY[11],  // 寅: 亥
      [EARTHLY_BRANCHES_ARRAY[6]]: EARTHLY_BRANCHES_ARRAY[11],  // 午: 亥
      [EARTHLY_BRANCHES_ARRAY[10]]: EARTHLY_BRANCHES_ARRAY[11], // 戌: 亥
      [EARTHLY_BRANCHES_ARRAY[5]]: EARTHLY_BRANCHES_ARRAY[2],   // 巳: 寅
      [EARTHLY_BRANCHES_ARRAY[9]]: EARTHLY_BRANCHES_ARRAY[2],   // 酉: 寅
      [EARTHLY_BRANCHES_ARRAY[1]]: EARTHLY_BRANCHES_ARRAY[2],   // 丑: 寅
      [EARTHLY_BRANCHES_ARRAY[11]]: EARTHLY_BRANCHES_ARRAY[8],  // 亥: 申
      [EARTHLY_BRANCHES_ARRAY[3]]: EARTHLY_BRANCHES_ARRAY[8],   // 卯: 申
      [EARTHLY_BRANCHES_ARRAY[7]]: EARTHLY_BRANCHES_ARRAY[8]    // 未: 申
    };
    
    const jieBranch = jieMap[chart.day.branch];
    if (jieBranch) {
      if (chart.year.branch === jieBranch) {
        results.push({
          name: '劫煞',
          type: '凶星',
          position: '年支',
          description: '劫煞，主破財損失，錢財被劫。理財需謹慎，防範小人。'
        });
      }
      if (chart.month.branch === jieBranch) {
        results.push({
          name: '劫煞',
          type: '凶星',
          position: '月支',
          description: '劫煞，主破財損失，錢財被劫。理財需謹慎，防範小人。'
        });
      }
      if (chart.hour.branch === jieBranch) {
        results.push({
          name: '劫煞',
          type: '凶星',
          position: '時支',
          description: '劫煞，主破財損失，錢財被劫。理財需謹慎，防範小人。'
        });
      }
    }
    
    // Check for Zai Sha (災煞) - simplified
    const zaiMap: Record<string, string> = {
      [EARTHLY_BRANCHES_ARRAY[8]]: EARTHLY_BRANCHES_ARRAY[6],   // 申: 午
      [EARTHLY_BRANCHES_ARRAY[0]]: EARTHLY_BRANCHES_ARRAY[6],   // 子: 午
      [EARTHLY_BRANCHES_ARRAY[4]]: EARTHLY_BRANCHES_ARRAY[6],   // 辰: 午
      [EARTHLY_BRANCHES_ARRAY[2]]: EARTHLY_BRANCHES_ARRAY[0],   // 寅: 子
      [EARTHLY_BRANCHES_ARRAY[6]]: EARTHLY_BRANCHES_ARRAY[0],   // 午: 子
      [EARTHLY_BRANCHES_ARRAY[10]]: EARTHLY_BRANCHES_ARRAY[0],  // 戌: 子
      [EARTHLY_BRANCHES_ARRAY[5]]: EARTHLY_BRANCHES_ARRAY[3],   // 巳: 卯
      [EARTHLY_BRANCHES_ARRAY[9]]: EARTHLY_BRANCHES_ARRAY[3],   // 酉: 卯
      [EARTHLY_BRANCHES_ARRAY[1]]: EARTHLY_BRANCHES_ARRAY[3],   // 丑: 卯
      [EARTHLY_BRANCHES_ARRAY[11]]: EARTHLY_BRANCHES_ARRAY[9],  // 亥: 酉
      [EARTHLY_BRANCHES_ARRAY[3]]: EARTHLY_BRANCHES_ARRAY[9],   // 卯: 酉
      [EARTHLY_BRANCHES_ARRAY[7]]: EARTHLY_BRANCHES_ARRAY[9]    // 未: 酉
    };
    
    const zaiBranch = zaiMap[chart.day.branch];
    if (zaiBranch) {
      if (chart.year.branch === zaiBranch) {
        results.push({
          name: '災煞',
          type: '凶星',
          position: '年支',
          description: '災煞，主災禍橫生，意外頻發。需要多行善事，化解災厄。'
        });
      }
      if (chart.month.branch === zaiBranch) {
        results.push({
          name: '災煞',
          type: '凶星',
          position: '月支',
          description: '災煞，主災禍橫生，意外頻發。需要多行善事，化解災厄。'
        });
      }
      if (chart.hour.branch === zaiBranch) {
        results.push({
          name: '災煞',
          type: '凶星',
          position: '時支',
          description: '災煞，主災禍橫生，意外頻發。需要多行善事，化解災厄。'
        });
      }
    }
    
    return results;
  }
  
  /**
   * Check for lonely stars
   */
  private static checkLonelyStars(chart: BaziChart, gender: 'male' | 'female'): ShenShaInfo[] {
    const results: ShenShaInfo[] = [];
    
    // Gu Chen (孤辰) and Gua Su (寡宿) mapping
    const lonelyMap: Record<string, { guChen: string; guaSu: string }> = {
      [EARTHLY_BRANCHES_ARRAY[0]]: { guChen: EARTHLY_BRANCHES_ARRAY[2], guaSu: EARTHLY_BRANCHES_ARRAY[10] },  // 子
      [EARTHLY_BRANCHES_ARRAY[1]]: { guChen: EARTHLY_BRANCHES_ARRAY[2], guaSu: EARTHLY_BRANCHES_ARRAY[10] },  // 丑
      [EARTHLY_BRANCHES_ARRAY[2]]: { guChen: EARTHLY_BRANCHES_ARRAY[5], guaSu: EARTHLY_BRANCHES_ARRAY[1] },   // 寅
      [EARTHLY_BRANCHES_ARRAY[3]]: { guChen: EARTHLY_BRANCHES_ARRAY[5], guaSu: EARTHLY_BRANCHES_ARRAY[1] },   // 卯
      [EARTHLY_BRANCHES_ARRAY[4]]: { guChen: EARTHLY_BRANCHES_ARRAY[5], guaSu: EARTHLY_BRANCHES_ARRAY[1] },   // 辰
      [EARTHLY_BRANCHES_ARRAY[5]]: { guChen: EARTHLY_BRANCHES_ARRAY[8], guaSu: EARTHLY_BRANCHES_ARRAY[4] },   // 巳
      [EARTHLY_BRANCHES_ARRAY[6]]: { guChen: EARTHLY_BRANCHES_ARRAY[8], guaSu: EARTHLY_BRANCHES_ARRAY[4] },   // 午
      [EARTHLY_BRANCHES_ARRAY[7]]: { guChen: EARTHLY_BRANCHES_ARRAY[8], guaSu: EARTHLY_BRANCHES_ARRAY[4] },   // 未
      [EARTHLY_BRANCHES_ARRAY[8]]: { guChen: EARTHLY_BRANCHES_ARRAY[11], guaSu: EARTHLY_BRANCHES_ARRAY[7] },  // 申
      [EARTHLY_BRANCHES_ARRAY[9]]: { guChen: EARTHLY_BRANCHES_ARRAY[11], guaSu: EARTHLY_BRANCHES_ARRAY[7] },  // 酉
      [EARTHLY_BRANCHES_ARRAY[10]]: { guChen: EARTHLY_BRANCHES_ARRAY[11], guaSu: EARTHLY_BRANCHES_ARRAY[7] }, // 戌
      [EARTHLY_BRANCHES_ARRAY[11]]: { guChen: EARTHLY_BRANCHES_ARRAY[2], guaSu: EARTHLY_BRANCHES_ARRAY[10] }  // 亥
    };
    
    const lonely = lonelyMap[chart.year.branch];
    if (!lonely) return results;
    
    const branches = [chart.year.branch, chart.month.branch, chart.day.branch, chart.hour.branch];
    
    if (branches.includes(lonely.guChen) && gender === 'male') {
      results.push({
        name: '孤辰',
        type: '凶星',
        position: '命盤',
        description: '孤辰星，男命主獨立自主，但親情淡薄。個性較孤僻，不喜熱鬧。'
      });
    }
    
    if (branches.includes(lonely.guaSu) && gender === 'female') {
      results.push({
        name: '寡宿',
        type: '凶星',
        position: '命盤',
        description: '寡宿星，女命主清心寡欲，感情淡泊。獨立性強，但婚姻較晚。'
      });
    }
    
    return results;
  }
  
  /**
   * Check for Yi Ma (驿马) - Travel Horse
   * 申子辰见寅，寅午戌见申，巳酉丑见亥，亥卯未见巳
   */
  private static checkYiMa(chart: BaziChart): ShenShaInfo[] {
    const results: ShenShaInfo[] = [];
    
    // Yi Ma mapping based on branch groups
    const yiMaMap: Record<string, string> = {
      // 申子辰 -> 寅
      [EARTHLY_BRANCHES_ARRAY[8]]: EARTHLY_BRANCHES_ARRAY[2],   // 申: 寅
      [EARTHLY_BRANCHES_ARRAY[0]]: EARTHLY_BRANCHES_ARRAY[2],   // 子: 寅
      [EARTHLY_BRANCHES_ARRAY[4]]: EARTHLY_BRANCHES_ARRAY[2],   // 辰: 寅
      // 寅午戌 -> 申
      [EARTHLY_BRANCHES_ARRAY[2]]: EARTHLY_BRANCHES_ARRAY[8],   // 寅: 申
      [EARTHLY_BRANCHES_ARRAY[6]]: EARTHLY_BRANCHES_ARRAY[8],   // 午: 申
      [EARTHLY_BRANCHES_ARRAY[10]]: EARTHLY_BRANCHES_ARRAY[8],  // 戌: 申
      // 巳酉丑 -> 亥
      [EARTHLY_BRANCHES_ARRAY[5]]: EARTHLY_BRANCHES_ARRAY[11],  // 巳: 亥
      [EARTHLY_BRANCHES_ARRAY[9]]: EARTHLY_BRANCHES_ARRAY[11],  // 酉: 亥
      [EARTHLY_BRANCHES_ARRAY[1]]: EARTHLY_BRANCHES_ARRAY[11],  // 丑: 亥
      // 亥卯未 -> 巳
      [EARTHLY_BRANCHES_ARRAY[11]]: EARTHLY_BRANCHES_ARRAY[5],  // 亥: 巳
      [EARTHLY_BRANCHES_ARRAY[3]]: EARTHLY_BRANCHES_ARRAY[5],   // 卯: 巳
      [EARTHLY_BRANCHES_ARRAY[7]]: EARTHLY_BRANCHES_ARRAY[5]    // 未: 巳
    };
    
    // Check day branch for Yi Ma
    const yiMaBranch = yiMaMap[chart.day.branch];
    if (!yiMaBranch) return results;
    
    const branches = [
      { branch: chart.year.branch, position: '年支' },
      { branch: chart.month.branch, position: '月支' },
      { branch: chart.day.branch, position: '日支' },
      { branch: chart.hour.branch, position: '時支' }
    ];
    
    branches.forEach(({ branch, position }) => {
      if (branch === yiMaBranch) {
        results.push({
          name: '驛馬',
          type: '中性',
          position,
          description: '驛馬星，主奔波變動，遷移頻繁。適合經商貿易，出差旅行。'
        });
      }
    });
    
    return results;
  }
  
  /**
   * Check for Jiang Xing (将星) - General Star
   * 申子辰见子，寅午戌见午，巳酉丑见酉，亥卯未见卯
   */
  private static checkJiangXing(chart: BaziChart): ShenShaInfo[] {
    const results: ShenShaInfo[] = [];
    
    // Jiang Xing mapping based on branch groups
    const jiangXingMap: Record<string, string> = {
      // 申子辰 -> 子
      [EARTHLY_BRANCHES_ARRAY[8]]: EARTHLY_BRANCHES_ARRAY[0],   // 申: 子
      [EARTHLY_BRANCHES_ARRAY[0]]: EARTHLY_BRANCHES_ARRAY[0],   // 子: 子
      [EARTHLY_BRANCHES_ARRAY[4]]: EARTHLY_BRANCHES_ARRAY[0],   // 辰: 子
      // 寅午戌 -> 午
      [EARTHLY_BRANCHES_ARRAY[2]]: EARTHLY_BRANCHES_ARRAY[6],   // 寅: 午
      [EARTHLY_BRANCHES_ARRAY[6]]: EARTHLY_BRANCHES_ARRAY[6],   // 午: 午
      [EARTHLY_BRANCHES_ARRAY[10]]: EARTHLY_BRANCHES_ARRAY[6],  // 戌: 午
      // 巳酉丑 -> 酉
      [EARTHLY_BRANCHES_ARRAY[5]]: EARTHLY_BRANCHES_ARRAY[9],   // 巳: 酉
      [EARTHLY_BRANCHES_ARRAY[9]]: EARTHLY_BRANCHES_ARRAY[9],   // 酉: 酉
      [EARTHLY_BRANCHES_ARRAY[1]]: EARTHLY_BRANCHES_ARRAY[9],   // 丑: 酉
      // 亥卯未 -> 卯
      [EARTHLY_BRANCHES_ARRAY[11]]: EARTHLY_BRANCHES_ARRAY[3],  // 亥: 卯
      [EARTHLY_BRANCHES_ARRAY[3]]: EARTHLY_BRANCHES_ARRAY[3],   // 卯: 卯
      [EARTHLY_BRANCHES_ARRAY[7]]: EARTHLY_BRANCHES_ARRAY[3]    // 未: 卯
    };
    
    // Check day branch for Jiang Xing
    const jiangXingBranch = jiangXingMap[chart.day.branch];
    if (!jiangXingBranch) return results;
    
    const branches = [
      { branch: chart.year.branch, position: '年支' },
      { branch: chart.month.branch, position: '月支' },
      { branch: chart.day.branch, position: '日支' },
      { branch: chart.hour.branch, position: '時支' }
    ];
    
    branches.forEach(({ branch, position }) => {
      if (branch === jiangXingBranch) {
        results.push({
          name: '將星',
          type: '吉星',
          position,
          description: '將星，主領導才能，威權顯赫。有統御之才，適合擔任主管。'
        });
      }
    });
    
    return results;
  }
  
  /**
   * Check for Hua Gai (华盖) - Canopy Star
   * 申子辰见辰，寅午戌见戌，巳酉丑见丑，亥卯未见未
   */
  private static checkHuaGai(chart: BaziChart): ShenShaInfo[] {
    const results: ShenShaInfo[] = [];
    
    // Hua Gai mapping based on branch groups
    const huaGaiMap: Record<string, string> = {
      // 申子辰 -> 辰
      [EARTHLY_BRANCHES_ARRAY[8]]: EARTHLY_BRANCHES_ARRAY[4],   // 申: 辰
      [EARTHLY_BRANCHES_ARRAY[0]]: EARTHLY_BRANCHES_ARRAY[4],   // 子: 辰
      [EARTHLY_BRANCHES_ARRAY[4]]: EARTHLY_BRANCHES_ARRAY[4],   // 辰: 辰
      // 寅午戌 -> 戌
      [EARTHLY_BRANCHES_ARRAY[2]]: EARTHLY_BRANCHES_ARRAY[10],  // 寅: 戌
      [EARTHLY_BRANCHES_ARRAY[6]]: EARTHLY_BRANCHES_ARRAY[10],  // 午: 戌
      [EARTHLY_BRANCHES_ARRAY[10]]: EARTHLY_BRANCHES_ARRAY[10], // 戌: 戌
      // 巳酉丑 -> 丑
      [EARTHLY_BRANCHES_ARRAY[5]]: EARTHLY_BRANCHES_ARRAY[1],   // 巳: 丑
      [EARTHLY_BRANCHES_ARRAY[9]]: EARTHLY_BRANCHES_ARRAY[1],   // 酉: 丑
      [EARTHLY_BRANCHES_ARRAY[1]]: EARTHLY_BRANCHES_ARRAY[1],   // 丑: 丑
      // 亥卯未 -> 未
      [EARTHLY_BRANCHES_ARRAY[11]]: EARTHLY_BRANCHES_ARRAY[7],  // 亥: 未
      [EARTHLY_BRANCHES_ARRAY[3]]: EARTHLY_BRANCHES_ARRAY[7],   // 卯: 未
      [EARTHLY_BRANCHES_ARRAY[7]]: EARTHLY_BRANCHES_ARRAY[7]    // 未: 未
    };
    
    // Check day branch for Hua Gai
    const huaGaiBranch = huaGaiMap[chart.day.branch];
    if (!huaGaiBranch) return results;
    
    const branches = [
      { branch: chart.year.branch, position: '年支' },
      { branch: chart.month.branch, position: '月支' },
      { branch: chart.day.branch, position: '日支' },
      { branch: chart.hour.branch, position: '時支' }
    ];
    
    branches.forEach(({ branch, position }) => {
      if (branch === huaGaiBranch) {
        results.push({
          name: '華蓋',
          type: '中性',
          position,
          description: '華蓋星，主聰明孤高，喜好玄學。有藝術天分，但性格較孤僻。'
        });
      }
    });
    
    return results;
  }
  
  /**
   * Check for Yang Ren (羊刃) - Goat Blade
   * 甲见卯，乙见寅，丙见午，丁见巳，戊见午，己见巳，庚见酉，辛见申，壬见子，癸见亥
   */
  private static checkYangRen(dayMaster: string, chart: BaziChart): ShenShaInfo[] {
    const results: ShenShaInfo[] = [];
    
    // Yang Ren mapping based on day master
    const yangRenMap: Record<string, string> = {
      [HEAVENLY_STEMS_ARRAY[0]]: EARTHLY_BRANCHES_ARRAY[3],   // 甲: 卯
      [HEAVENLY_STEMS_ARRAY[1]]: EARTHLY_BRANCHES_ARRAY[2],   // 乙: 寅
      [HEAVENLY_STEMS_ARRAY[2]]: EARTHLY_BRANCHES_ARRAY[6],   // 丙: 午
      [HEAVENLY_STEMS_ARRAY[3]]: EARTHLY_BRANCHES_ARRAY[5],   // 丁: 巳
      [HEAVENLY_STEMS_ARRAY[4]]: EARTHLY_BRANCHES_ARRAY[6],   // 戊: 午
      [HEAVENLY_STEMS_ARRAY[5]]: EARTHLY_BRANCHES_ARRAY[5],   // 己: 巳
      [HEAVENLY_STEMS_ARRAY[6]]: EARTHLY_BRANCHES_ARRAY[9],   // 庚: 酉
      [HEAVENLY_STEMS_ARRAY[7]]: EARTHLY_BRANCHES_ARRAY[8],   // 辛: 申
      [HEAVENLY_STEMS_ARRAY[8]]: EARTHLY_BRANCHES_ARRAY[0],   // 壬: 子
      [HEAVENLY_STEMS_ARRAY[9]]: EARTHLY_BRANCHES_ARRAY[11]   // 癸: 亥
    };
    
    const yangRenBranch = yangRenMap[dayMaster];
    if (!yangRenBranch) return results;
    
    const branches = [
      { branch: chart.year.branch, position: '年支' },
      { branch: chart.month.branch, position: '月支' },
      { branch: chart.day.branch, position: '日支' },
      { branch: chart.hour.branch, position: '時支' }
    ];
    
    branches.forEach(({ branch, position }) => {
      if (branch === yangRenBranch) {
        results.push({
          name: '羊刃',
          type: '凶星',
          position,
          description: '羊刃，主性格剛烈，易有血光。需注意安全，避免衝突。'
        });
      }
    });
    
    return results;
  }
  
  /**
   * Check for Xue Ren (血刃) - Blood Blade
   * 申子辰见戌，寅午戌见丑，巳酉丑见未，亥卯未见辰
   */
  private static checkXueRen(chart: BaziChart): ShenShaInfo[] {
    const results: ShenShaInfo[] = [];
    
    // Xue Ren mapping based on branch groups
    const xueRenMap: Record<string, string> = {
      // 申子辰 -> 戌
      [EARTHLY_BRANCHES_ARRAY[8]]: EARTHLY_BRANCHES_ARRAY[10],  // 申: 戌
      [EARTHLY_BRANCHES_ARRAY[0]]: EARTHLY_BRANCHES_ARRAY[10],  // 子: 戌
      [EARTHLY_BRANCHES_ARRAY[4]]: EARTHLY_BRANCHES_ARRAY[10],  // 辰: 戌
      // 寅午戌 -> 丑
      [EARTHLY_BRANCHES_ARRAY[2]]: EARTHLY_BRANCHES_ARRAY[1],   // 寅: 丑
      [EARTHLY_BRANCHES_ARRAY[6]]: EARTHLY_BRANCHES_ARRAY[1],   // 午: 丑
      [EARTHLY_BRANCHES_ARRAY[10]]: EARTHLY_BRANCHES_ARRAY[1],  // 戌: 丑
      // 巳酉丑 -> 未
      [EARTHLY_BRANCHES_ARRAY[5]]: EARTHLY_BRANCHES_ARRAY[7],   // 巳: 未
      [EARTHLY_BRANCHES_ARRAY[9]]: EARTHLY_BRANCHES_ARRAY[7],   // 酉: 未
      [EARTHLY_BRANCHES_ARRAY[1]]: EARTHLY_BRANCHES_ARRAY[7],   // 丑: 未
      // 亥卯未 -> 辰
      [EARTHLY_BRANCHES_ARRAY[11]]: EARTHLY_BRANCHES_ARRAY[4],  // 亥: 辰
      [EARTHLY_BRANCHES_ARRAY[3]]: EARTHLY_BRANCHES_ARRAY[4],   // 卯: 辰
      [EARTHLY_BRANCHES_ARRAY[7]]: EARTHLY_BRANCHES_ARRAY[4]    // 未: 辰
    };
    
    // Check day branch for Xue Ren
    const xueRenBranch = xueRenMap[chart.day.branch];
    if (!xueRenBranch) return results;
    
    const branches = [
      { branch: chart.year.branch, position: '年支' },
      { branch: chart.month.branch, position: '月支' },
      { branch: chart.day.branch, position: '日支' },
      { branch: chart.hour.branch, position: '時支' }
    ];
    
    branches.forEach(({ branch, position }) => {
      if (branch === xueRenBranch) {
        results.push({
          name: '血刃',
          type: '凶星',
          position,
          description: '血刃，主血光之災，手術開刀。注意健康，避免危險活動。'
        });
      }
    });
    
    return results;
  }
  
  /**
   * Check for Jin Yu (金輿) - Golden Carriage
   * 甲見辰，乙見巳，丙見未，丁見申，戊見未，己見申，庚見戌，辛見亥，壬見丑，癸見寅
   */
  private static checkJinYu(dayMaster: string, chart: BaziChart): ShenShaInfo[] {
    const results: ShenShaInfo[] = [];
    
    const jinYuMap: Record<string, string> = {
      [HEAVENLY_STEMS_ARRAY[0]]: EARTHLY_BRANCHES_ARRAY[4],   // 甲: 辰
      [HEAVENLY_STEMS_ARRAY[1]]: EARTHLY_BRANCHES_ARRAY[5],   // 乙: 巳
      [HEAVENLY_STEMS_ARRAY[2]]: EARTHLY_BRANCHES_ARRAY[7],   // 丙: 未
      [HEAVENLY_STEMS_ARRAY[3]]: EARTHLY_BRANCHES_ARRAY[8],   // 丁: 申
      [HEAVENLY_STEMS_ARRAY[4]]: EARTHLY_BRANCHES_ARRAY[7],   // 戊: 未
      [HEAVENLY_STEMS_ARRAY[5]]: EARTHLY_BRANCHES_ARRAY[8],   // 己: 申
      [HEAVENLY_STEMS_ARRAY[6]]: EARTHLY_BRANCHES_ARRAY[10],  // 庚: 戌
      [HEAVENLY_STEMS_ARRAY[7]]: EARTHLY_BRANCHES_ARRAY[11],  // 辛: 亥
      [HEAVENLY_STEMS_ARRAY[8]]: EARTHLY_BRANCHES_ARRAY[1],   // 壬: 丑
      [HEAVENLY_STEMS_ARRAY[9]]: EARTHLY_BRANCHES_ARRAY[2]    // 癸: 寅
    };
    
    const jinYuBranch = jinYuMap[dayMaster];
    if (!jinYuBranch) return results;
    
    const branches = [
      { branch: chart.year.branch, position: '年支' },
      { branch: chart.month.branch, position: '月支' },
      { branch: chart.day.branch, position: '日支' },
      { branch: chart.hour.branch, position: '時支' }
    ];
    
    branches.forEach(({ branch, position }) => {
      if (branch === jinYuBranch) {
        results.push({
          name: '金輿',
          type: '吉星',
          position,
          description: '金輿星，主車馬之福，出入平安。有交通工具之便，出行順利。'
        });
      }
    });
    
    return results;
  }
  
  /**
   * Check for Lu Shen (祿神) - Salary God
   * 甲祿在寅，乙祿在卯，丙戊祿在巳，丁己祿在午，庚祿在申，辛祿在酉，壬祿在亥，癸祿在子
   */
  private static checkLuShen(dayMaster: string, chart: BaziChart): ShenShaInfo[] {
    const results: ShenShaInfo[] = [];
    
    const luShenMap: Record<string, string> = {
      [HEAVENLY_STEMS_ARRAY[0]]: EARTHLY_BRANCHES_ARRAY[2],   // 甲: 寅
      [HEAVENLY_STEMS_ARRAY[1]]: EARTHLY_BRANCHES_ARRAY[3],   // 乙: 卯
      [HEAVENLY_STEMS_ARRAY[2]]: EARTHLY_BRANCHES_ARRAY[5],   // 丙: 巳
      [HEAVENLY_STEMS_ARRAY[3]]: EARTHLY_BRANCHES_ARRAY[6],   // 丁: 午
      [HEAVENLY_STEMS_ARRAY[4]]: EARTHLY_BRANCHES_ARRAY[5],   // 戊: 巳
      [HEAVENLY_STEMS_ARRAY[5]]: EARTHLY_BRANCHES_ARRAY[6],   // 己: 午
      [HEAVENLY_STEMS_ARRAY[6]]: EARTHLY_BRANCHES_ARRAY[8],   // 庚: 申
      [HEAVENLY_STEMS_ARRAY[7]]: EARTHLY_BRANCHES_ARRAY[9],   // 辛: 酉
      [HEAVENLY_STEMS_ARRAY[8]]: EARTHLY_BRANCHES_ARRAY[11],  // 壬: 亥
      [HEAVENLY_STEMS_ARRAY[9]]: EARTHLY_BRANCHES_ARRAY[0]    // 癸: 子
    };
    
    const luShenBranch = luShenMap[dayMaster];
    if (!luShenBranch) return results;
    
    const branches = [
      { branch: chart.year.branch, position: '年支' },
      { branch: chart.month.branch, position: '月支' },
      { branch: chart.day.branch, position: '日支' },
      { branch: chart.hour.branch, position: '時支' }
    ];
    
    branches.forEach(({ branch, position }) => {
      if (branch === luShenBranch) {
        results.push({
          name: '祿神',
          type: '吉星',
          position,
          description: '祿神星，主財祿豐厚，衣食無憂。正財運佳，工作收入穩定。'
        });
      }
    });
    
    return results;
  }
  
  /**
   * Check for Tian Ku (天哭) - Heaven Crying
   * 申子辰見午，寅午戌見子，巳酉丑見卯，亥卯未見酉
   */
  private static checkTianKu(chart: BaziChart): ShenShaInfo[] {
    const results: ShenShaInfo[] = [];
    
    const tianKuMap: Record<string, string> = {
      // 申子辰 -> 午
      [EARTHLY_BRANCHES_ARRAY[8]]: EARTHLY_BRANCHES_ARRAY[6],   // 申: 午
      [EARTHLY_BRANCHES_ARRAY[0]]: EARTHLY_BRANCHES_ARRAY[6],   // 子: 午
      [EARTHLY_BRANCHES_ARRAY[4]]: EARTHLY_BRANCHES_ARRAY[6],   // 辰: 午
      // 寅午戌 -> 子
      [EARTHLY_BRANCHES_ARRAY[2]]: EARTHLY_BRANCHES_ARRAY[0],   // 寅: 子
      [EARTHLY_BRANCHES_ARRAY[6]]: EARTHLY_BRANCHES_ARRAY[0],   // 午: 子
      [EARTHLY_BRANCHES_ARRAY[10]]: EARTHLY_BRANCHES_ARRAY[0],  // 戌: 子
      // 巳酉丑 -> 卯
      [EARTHLY_BRANCHES_ARRAY[5]]: EARTHLY_BRANCHES_ARRAY[3],   // 巳: 卯
      [EARTHLY_BRANCHES_ARRAY[9]]: EARTHLY_BRANCHES_ARRAY[3],   // 酉: 卯
      [EARTHLY_BRANCHES_ARRAY[1]]: EARTHLY_BRANCHES_ARRAY[3],   // 丑: 卯
      // 亥卯未 -> 酉
      [EARTHLY_BRANCHES_ARRAY[11]]: EARTHLY_BRANCHES_ARRAY[9],  // 亥: 酉
      [EARTHLY_BRANCHES_ARRAY[3]]: EARTHLY_BRANCHES_ARRAY[9],   // 卯: 酉
      [EARTHLY_BRANCHES_ARRAY[7]]: EARTHLY_BRANCHES_ARRAY[9]    // 未: 酉
    };
    
    const tianKuBranch = tianKuMap[chart.day.branch];
    if (!tianKuBranch) return results;
    
    const branches = [
      { branch: chart.year.branch, position: '年支' },
      { branch: chart.month.branch, position: '月支' },
      { branch: chart.day.branch, position: '日支' },
      { branch: chart.hour.branch, position: '時支' }
    ];
    
    branches.forEach(({ branch, position }) => {
      if (branch === tianKuBranch) {
        results.push({
          name: '天哭',
          type: '凶星',
          position,
          description: '天哭星，主悲觀多愁，易感傷。需要調整心態，積極樂觀。'
        });
      }
    });
    
    return results;
  }
  
  /**
   * Check for Di Ku (地哭) - Earth Crying
   */
  private static checkDiKu(chart: BaziChart): ShenShaInfo[] {
    const results: ShenShaInfo[] = [];
    
    // Similar pattern to Tian Ku but different mapping
    const diKuMap: Record<string, string> = {
      // 申子辰 -> 未
      [EARTHLY_BRANCHES_ARRAY[8]]: EARTHLY_BRANCHES_ARRAY[7],   // 申: 未
      [EARTHLY_BRANCHES_ARRAY[0]]: EARTHLY_BRANCHES_ARRAY[7],   // 子: 未
      [EARTHLY_BRANCHES_ARRAY[4]]: EARTHLY_BRANCHES_ARRAY[7],   // 辰: 未
      // 寅午戌 -> 丑
      [EARTHLY_BRANCHES_ARRAY[2]]: EARTHLY_BRANCHES_ARRAY[1],   // 寅: 丑
      [EARTHLY_BRANCHES_ARRAY[6]]: EARTHLY_BRANCHES_ARRAY[1],   // 午: 丑
      [EARTHLY_BRANCHES_ARRAY[10]]: EARTHLY_BRANCHES_ARRAY[1],  // 戌: 丑
      // 巳酉丑 -> 辰
      [EARTHLY_BRANCHES_ARRAY[5]]: EARTHLY_BRANCHES_ARRAY[4],   // 巳: 辰
      [EARTHLY_BRANCHES_ARRAY[9]]: EARTHLY_BRANCHES_ARRAY[4],   // 酉: 辰
      [EARTHLY_BRANCHES_ARRAY[1]]: EARTHLY_BRANCHES_ARRAY[4],   // 丑: 辰
      // 亥卯未 -> 戌
      [EARTHLY_BRANCHES_ARRAY[11]]: EARTHLY_BRANCHES_ARRAY[10], // 亥: 戌
      [EARTHLY_BRANCHES_ARRAY[3]]: EARTHLY_BRANCHES_ARRAY[10],  // 卯: 戌
      [EARTHLY_BRANCHES_ARRAY[7]]: EARTHLY_BRANCHES_ARRAY[10]   // 未: 戌
    };
    
    const diKuBranch = diKuMap[chart.day.branch];
    if (!diKuBranch) return results;
    
    const branches = [
      { branch: chart.year.branch, position: '年支' },
      { branch: chart.month.branch, position: '月支' },
      { branch: chart.day.branch, position: '日支' },
      { branch: chart.hour.branch, position: '時支' }
    ];
    
    branches.forEach(({ branch, position }) => {
      if (branch === diKuBranch) {
        results.push({
          name: '地哭',
          type: '凶星',
          position,
          description: '地哭星，主憂愁煩惱，心事重重。宜多運動，保持心情愉快。'
        });
      }
    });
    
    return results;
  }
  
  /**
   * Check for Kui Gang (魁罡) - Chief Gang
   * 庚辰，庚戌，壬辰，戊戌 日柱
   */
  private static checkKuiGang(chart: BaziChart): ShenShaInfo[] {
    const results: ShenShaInfo[] = [];
    
    const kuiGangCombos = [
      { stem: HEAVENLY_STEMS_ARRAY[6], branch: EARTHLY_BRANCHES_ARRAY[4] },  // 庚辰
      { stem: HEAVENLY_STEMS_ARRAY[6], branch: EARTHLY_BRANCHES_ARRAY[10] }, // 庚戌
      { stem: HEAVENLY_STEMS_ARRAY[8], branch: EARTHLY_BRANCHES_ARRAY[4] },  // 壬辰
      { stem: HEAVENLY_STEMS_ARRAY[4], branch: EARTHLY_BRANCHES_ARRAY[10] }  // 戊戌
    ];
    
    if (kuiGangCombos.some(combo => 
      combo.stem === chart.day.stem && combo.branch === chart.day.branch
    )) {
      results.push({
        name: '魁罡',
        type: '中性',
        position: POSITION_NAMES.day,
        description: '魁罡格，主剛毅果斷，不屈不撓。性格堅強，但婚姻較難順。'
      });
    }
    
    return results;
  }
  
  /**
   * Check for Liu Xia (流霞) - Flowing Cloud
   * 甲見酉，乙見戌，丙見未，丁見申，戊見巳，己見午，庚見辰，辛見卯，壬見亥，癸見寅
   */
  private static checkLiuXia(chart: BaziChart): ShenShaInfo[] {
    const results: ShenShaInfo[] = [];
    
    const liuXiaMap: Record<string, string> = {
      [HEAVENLY_STEMS_ARRAY[0]]: EARTHLY_BRANCHES_ARRAY[9],   // 甲: 酉
      [HEAVENLY_STEMS_ARRAY[1]]: EARTHLY_BRANCHES_ARRAY[10],  // 乙: 戌
      [HEAVENLY_STEMS_ARRAY[2]]: EARTHLY_BRANCHES_ARRAY[7],   // 丙: 未
      [HEAVENLY_STEMS_ARRAY[3]]: EARTHLY_BRANCHES_ARRAY[8],   // 丁: 申
      [HEAVENLY_STEMS_ARRAY[4]]: EARTHLY_BRANCHES_ARRAY[5],   // 戊: 巳
      [HEAVENLY_STEMS_ARRAY[5]]: EARTHLY_BRANCHES_ARRAY[6],   // 己: 午
      [HEAVENLY_STEMS_ARRAY[6]]: EARTHLY_BRANCHES_ARRAY[4],   // 庚: 辰
      [HEAVENLY_STEMS_ARRAY[7]]: EARTHLY_BRANCHES_ARRAY[3],   // 辛: 卯
      [HEAVENLY_STEMS_ARRAY[8]]: EARTHLY_BRANCHES_ARRAY[11],  // 壬: 亥
      [HEAVENLY_STEMS_ARRAY[9]]: EARTHLY_BRANCHES_ARRAY[2]    // 癸: 寅
    };
    
    const liuXiaBranch = liuXiaMap[chart.day.stem];
    if (!liuXiaBranch) return results;
    
    const branches = [
      { branch: chart.year.branch, position: '年支' },
      { branch: chart.month.branch, position: '月支' },
      { branch: chart.day.branch, position: '日支' },
      { branch: chart.hour.branch, position: '時支' }
    ];
    
    branches.forEach(({ branch, position }) => {
      if (branch === liuXiaBranch) {
        results.push({
          name: '流霞',
          type: '凶星',
          position,
          description: '流霞煞，主產厄血光，女性不利。女性需注意婦科健康。'
        });
      }
    });
    
    return results;
  }
  
  /**
   * Check for Tian Luo (天羅) - Heaven Net
   * 戌年生人見亥，亥年生人見戌
   */
  private static checkTianLuo(chart: BaziChart): ShenShaInfo[] {
    const results: ShenShaInfo[] = [];
    
    if (chart.year.branch === EARTHLY_BRANCHES_ARRAY[10] && // 戌年
        (chart.day.branch === EARTHLY_BRANCHES_ARRAY[11] || 
         chart.hour.branch === EARTHLY_BRANCHES_ARRAY[11])) { // 見亥
      results.push({
        name: '天羅',
        type: '凶星',
        position: '命盤',
        description: '天羅星，主困頓受制，進退兩難。需要耐心等待時機。'
      });
    }
    
    if (chart.year.branch === EARTHLY_BRANCHES_ARRAY[11] && // 亥年
        (chart.day.branch === EARTHLY_BRANCHES_ARRAY[10] || 
         chart.hour.branch === EARTHLY_BRANCHES_ARRAY[10])) { // 見戌
      results.push({
        name: '天羅',
        type: '凶星',
        position: '命盤',
        description: '天羅星，主困頓受制，進退兩難。需要耐心等待時機。'
      });
    }
    
    return results;
  }
  
  /**
   * Check for Di Wang (地網) - Earth Net
   * 辰年生人見巳，巳年生人見辰
   */
  private static checkDiWang(chart: BaziChart): ShenShaInfo[] {
    const results: ShenShaInfo[] = [];
    
    if (chart.year.branch === EARTHLY_BRANCHES_ARRAY[4] && // 辰年
        (chart.day.branch === EARTHLY_BRANCHES_ARRAY[5] || 
         chart.hour.branch === EARTHLY_BRANCHES_ARRAY[5])) { // 見巳
      results.push({
        name: '地網',
        type: '凶星',
        position: '命盤',
        description: '地網星，主束縛限制，行動不便。避免法律糾紛。'
      });
    }
    
    if (chart.year.branch === EARTHLY_BRANCHES_ARRAY[5] && // 巳年
        (chart.day.branch === EARTHLY_BRANCHES_ARRAY[4] || 
         chart.hour.branch === EARTHLY_BRANCHES_ARRAY[4])) { // 見辰
      results.push({
        name: '地網',
        type: '凶星',
        position: '命盤',
        description: '地網星，主束縛限制，行動不便。避免法律糾紛。'
      });
    }
    
    return results;
  }
  
  /**
   * Check for Wen Qu (文曲貴人) - Literary Curve Noble
   * Based on day master
   */
  private static checkWenQu(dayMaster: string, chart: BaziChart): ShenShaInfo[] {
    const results: ShenShaInfo[] = [];
    
    const wenQuMap: Record<string, string> = {
      [HEAVENLY_STEMS_ARRAY[0]]: EARTHLY_BRANCHES_ARRAY[5],   // 甲: 巳
      [HEAVENLY_STEMS_ARRAY[1]]: EARTHLY_BRANCHES_ARRAY[7],   // 乙: 未
      [HEAVENLY_STEMS_ARRAY[2]]: EARTHLY_BRANCHES_ARRAY[9],   // 丙: 酉
      [HEAVENLY_STEMS_ARRAY[3]]: EARTHLY_BRANCHES_ARRAY[11],  // 丁: 亥
      [HEAVENLY_STEMS_ARRAY[4]]: EARTHLY_BRANCHES_ARRAY[9],   // 戊: 酉
      [HEAVENLY_STEMS_ARRAY[5]]: EARTHLY_BRANCHES_ARRAY[11],  // 己: 亥
      [HEAVENLY_STEMS_ARRAY[6]]: EARTHLY_BRANCHES_ARRAY[0],   // 庚: 子
      [HEAVENLY_STEMS_ARRAY[7]]: EARTHLY_BRANCHES_ARRAY[2],   // 辛: 寅
      [HEAVENLY_STEMS_ARRAY[8]]: EARTHLY_BRANCHES_ARRAY[4],   // 壬: 辰
      [HEAVENLY_STEMS_ARRAY[9]]: EARTHLY_BRANCHES_ARRAY[6]    // 癸: 午
    };
    
    const wenQuBranch = wenQuMap[dayMaster];
    if (!wenQuBranch) return results;
    
    const branches = [
      { branch: chart.year.branch, position: '年支' },
      { branch: chart.month.branch, position: '月支' },
      { branch: chart.day.branch, position: '日支' },
      { branch: chart.hour.branch, position: '時支' }
    ];
    
    branches.forEach(({ branch, position }) => {
      if (branch === wenQuBranch) {
        results.push({
          name: '文曲貴人',
          type: '吉星',
          position,
          description: '文曲貴人，主口才便給，能言善辯。適合教學、演講、銷售等需要表達能力的工作。'
        });
      }
    });
    
    return results;
  }
  
  /**
   * Check for Guo Yin (國印貴人) - National Seal Noble
   */
  private static checkGuoYin(dayMaster: string, chart: BaziChart): ShenShaInfo[] {
    const results: ShenShaInfo[] = [];
    
    const guoYinMap: Record<string, string> = {
      [HEAVENLY_STEMS_ARRAY[0]]: EARTHLY_BRANCHES_ARRAY[10],  // 甲: 戌
      [HEAVENLY_STEMS_ARRAY[1]]: EARTHLY_BRANCHES_ARRAY[10],  // 乙: 戌
      [HEAVENLY_STEMS_ARRAY[2]]: EARTHLY_BRANCHES_ARRAY[1],   // 丙: 丑
      [HEAVENLY_STEMS_ARRAY[3]]: EARTHLY_BRANCHES_ARRAY[1],   // 丁: 丑
      [HEAVENLY_STEMS_ARRAY[4]]: EARTHLY_BRANCHES_ARRAY[1],   // 戊: 丑
      [HEAVENLY_STEMS_ARRAY[5]]: EARTHLY_BRANCHES_ARRAY[1],   // 己: 丑
      [HEAVENLY_STEMS_ARRAY[6]]: EARTHLY_BRANCHES_ARRAY[4],   // 庚: 辰
      [HEAVENLY_STEMS_ARRAY[7]]: EARTHLY_BRANCHES_ARRAY[4],   // 辛: 辰
      [HEAVENLY_STEMS_ARRAY[8]]: EARTHLY_BRANCHES_ARRAY[7],   // 壬: 未
      [HEAVENLY_STEMS_ARRAY[9]]: EARTHLY_BRANCHES_ARRAY[7]    // 癸: 未
    };
    
    const guoYinBranch = guoYinMap[dayMaster];
    if (!guoYinBranch) return results;
    
    const branches = [
      { branch: chart.year.branch, position: '年支' },
      { branch: chart.month.branch, position: '月支' },
      { branch: chart.day.branch, position: '日支' },
      { branch: chart.hour.branch, position: '時支' }
    ];
    
    branches.forEach(({ branch, position }) => {
      if (branch === guoYinBranch) {
        results.push({
          name: '國印貴人',
          type: '吉星',
          position,
          description: '國印貴人，主掌權得印，仕途亨通。易獲權位，適合從政或管理工作。'
        });
      }
    });
    
    return results;
  }
  
  /**
   * Check for De Xiu (德秀貴人) - Virtue Excellence Noble
   */
  private static checkDeXiu(dayMaster: string, chart: BaziChart): ShenShaInfo[] {
    const results: ShenShaInfo[] = [];
    
    // 德秀貴人查法：春月見丙丁，夏月見甲乙，秋月見庚辛，冬月見壬癸
    const monthBranch = chart.month.branch;
    let seasonStems: string[] = [];
    
    // Spring: 寅卯辰
    if ([EARTHLY_BRANCHES_ARRAY[2], EARTHLY_BRANCHES_ARRAY[3], EARTHLY_BRANCHES_ARRAY[4]].includes(monthBranch)) {
      seasonStems = [HEAVENLY_STEMS_ARRAY[2], HEAVENLY_STEMS_ARRAY[3]]; // 丙丁
    }
    // Summer: 巳午未
    else if ([EARTHLY_BRANCHES_ARRAY[5], EARTHLY_BRANCHES_ARRAY[6], EARTHLY_BRANCHES_ARRAY[7]].includes(monthBranch)) {
      seasonStems = [HEAVENLY_STEMS_ARRAY[0], HEAVENLY_STEMS_ARRAY[1]]; // 甲乙
    }
    // Autumn: 申酉戌
    else if ([EARTHLY_BRANCHES_ARRAY[8], EARTHLY_BRANCHES_ARRAY[9], EARTHLY_BRANCHES_ARRAY[10]].includes(monthBranch)) {
      seasonStems = [HEAVENLY_STEMS_ARRAY[6], HEAVENLY_STEMS_ARRAY[7]]; // 庚辛
    }
    // Winter: 亥子丑
    else if ([EARTHLY_BRANCHES_ARRAY[11], EARTHLY_BRANCHES_ARRAY[0], EARTHLY_BRANCHES_ARRAY[1]].includes(monthBranch)) {
      seasonStems = [HEAVENLY_STEMS_ARRAY[8], HEAVENLY_STEMS_ARRAY[9]]; // 壬癸
    }
    
    const stems = [
      { stem: chart.year.stem, position: '年干' },
      { stem: chart.month.stem, position: '月干' },
      { stem: chart.day.stem, position: '日干' },
      { stem: chart.hour.stem, position: '時干' }
    ];
    
    stems.forEach(({ stem, position }) => {
      if (seasonStems.includes(stem)) {
        results.push({
          name: '德秀貴人',
          type: '吉星',
          position,
          description: '德秀貴人，主品德高尚，受人尊敬。為人正直，易得他人信任和支持。'
        });
      }
    });
    
    return results;
  }
  
  /**
   * Check for Tian De (天德貴人) - Heavenly Virtue Noble
   * Complete implementation based on month branch
   */
  private static checkTianDe(chart: BaziChart): ShenShaInfo[] {
    const results: ShenShaInfo[] = [];
    
    // 天德貴人查法：正月生見丁，二月生見申...
    const tianDeMap: Record<string, string> = {
      [EARTHLY_BRANCHES_ARRAY[2]]: HEAVENLY_STEMS_ARRAY[3],   // 寅月: 丁
      [EARTHLY_BRANCHES_ARRAY[3]]: EARTHLY_BRANCHES_ARRAY[8], // 卯月: 申
      [EARTHLY_BRANCHES_ARRAY[4]]: HEAVENLY_STEMS_ARRAY[8],   // 辰月: 壬
      [EARTHLY_BRANCHES_ARRAY[5]]: HEAVENLY_STEMS_ARRAY[7],   // 巳月: 辛
      [EARTHLY_BRANCHES_ARRAY[6]]: EARTHLY_BRANCHES_ARRAY[11],// 午月: 亥
      [EARTHLY_BRANCHES_ARRAY[7]]: HEAVENLY_STEMS_ARRAY[0],   // 未月: 甲
      [EARTHLY_BRANCHES_ARRAY[8]]: HEAVENLY_STEMS_ARRAY[9],   // 申月: 癸
      [EARTHLY_BRANCHES_ARRAY[9]]: EARTHLY_BRANCHES_ARRAY[2], // 酉月: 寅
      [EARTHLY_BRANCHES_ARRAY[10]]: HEAVENLY_STEMS_ARRAY[3],  // 戌月: 丙
      [EARTHLY_BRANCHES_ARRAY[11]]: HEAVENLY_STEMS_ARRAY[1],  // 亥月: 乙
      [EARTHLY_BRANCHES_ARRAY[0]]: EARTHLY_BRANCHES_ARRAY[5], // 子月: 巳
      [EARTHLY_BRANCHES_ARRAY[1]]: HEAVENLY_STEMS_ARRAY[6]    // 丑月: 庚
    };
    
    const tianDeElement = tianDeMap[chart.month.branch];
    if (!tianDeElement) return results;
    
    // Check if it's a stem or branch
    if (HEAVENLY_STEMS_ARRAY.includes(tianDeElement)) {
      // Check stems
      const stems = [
        { stem: chart.year.stem, position: '年干' },
        { stem: chart.month.stem, position: '月干' },
        { stem: chart.day.stem, position: '日干' },
        { stem: chart.hour.stem, position: '時干' }
      ];
      
      stems.forEach(({ stem, position }) => {
        if (stem === tianDeElement) {
          results.push({
            name: '天德貴人',
            type: '吉星',
            position,
            description: '天德貴人，主逢凶化吉，遇難呈祥。能消災解厄，化險為夷。'
          });
        }
      });
    } else {
      // Check branches
      const branches = [
        { branch: chart.year.branch, position: '年支' },
        { branch: chart.day.branch, position: '日支' },
        { branch: chart.hour.branch, position: '時支' }
      ];
      
      branches.forEach(({ branch, position }) => {
        if (branch === tianDeElement) {
          results.push({
            name: '天德貴人',
            type: '吉星',
            position,
            description: '天德貴人，主逢凶化吉，遇難呈祥。能消災解厄，化險為夷。'
          });
        }
      });
    }
    
    return results;
  }
  
  /**
   * Check for Yue De (月德貴人) - Monthly Virtue Noble
   */
  private static checkYueDe(chart: BaziChart): ShenShaInfo[] {
    const results: ShenShaInfo[] = [];
    
    // 月德貴人查法
    const yueDeMap: Record<string, string> = {
      [EARTHLY_BRANCHES_ARRAY[2]]: HEAVENLY_STEMS_ARRAY[2],   // 寅月: 丙
      [EARTHLY_BRANCHES_ARRAY[3]]: HEAVENLY_STEMS_ARRAY[0],   // 卯月: 甲
      [EARTHLY_BRANCHES_ARRAY[4]]: HEAVENLY_STEMS_ARRAY[8],   // 辰月: 壬
      [EARTHLY_BRANCHES_ARRAY[5]]: HEAVENLY_STEMS_ARRAY[6],   // 巳月: 庚
      [EARTHLY_BRANCHES_ARRAY[6]]: HEAVENLY_STEMS_ARRAY[2],   // 午月: 丙
      [EARTHLY_BRANCHES_ARRAY[7]]: HEAVENLY_STEMS_ARRAY[0],   // 未月: 甲
      [EARTHLY_BRANCHES_ARRAY[8]]: HEAVENLY_STEMS_ARRAY[8],   // 申月: 壬
      [EARTHLY_BRANCHES_ARRAY[9]]: HEAVENLY_STEMS_ARRAY[6],   // 酉月: 庚
      [EARTHLY_BRANCHES_ARRAY[10]]: HEAVENLY_STEMS_ARRAY[2],  // 戌月: 丙
      [EARTHLY_BRANCHES_ARRAY[11]]: HEAVENLY_STEMS_ARRAY[0],  // 亥月: 甲
      [EARTHLY_BRANCHES_ARRAY[0]]: HEAVENLY_STEMS_ARRAY[8],   // 子月: 壬
      [EARTHLY_BRANCHES_ARRAY[1]]: HEAVENLY_STEMS_ARRAY[6]    // 丑月: 庚
    };
    
    const yueDeStem = yueDeMap[chart.month.branch];
    if (!yueDeStem) return results;
    
    const stems = [
      { stem: chart.year.stem, position: '年干' },
      { stem: chart.month.stem, position: '月干' },
      { stem: chart.day.stem, position: '日干' },
      { stem: chart.hour.stem, position: '時干' }
    ];
    
    stems.forEach(({ stem, position }) => {
      if (stem === yueDeStem) {
        results.push({
          name: '月德貴人',
          type: '吉星',
          position,
          description: '月德貴人，主慈祥和善，福澤深厚。人緣好，容易得到幫助。'
        });
      }
    });
    
    return results;
  }
  
  /**
   * Check for Fu Xing (福星貴人) - Fortune Star Noble
   */
  private static checkFuXing(dayMaster: string, chart: BaziChart): ShenShaInfo[] {
    const results: ShenShaInfo[] = [];
    
    // 福星貴人查法：甲寅日、乙卯日、丙巳日、丁午日等
    const fuXingCombos = [
      { stem: HEAVENLY_STEMS_ARRAY[0], branch: EARTHLY_BRANCHES_ARRAY[2] },  // 甲寅
      { stem: HEAVENLY_STEMS_ARRAY[1], branch: EARTHLY_BRANCHES_ARRAY[3] },  // 乙卯
      { stem: HEAVENLY_STEMS_ARRAY[2], branch: EARTHLY_BRANCHES_ARRAY[5] },  // 丙巳
      { stem: HEAVENLY_STEMS_ARRAY[3], branch: EARTHLY_BRANCHES_ARRAY[6] },  // 丁午
      { stem: HEAVENLY_STEMS_ARRAY[4], branch: EARTHLY_BRANCHES_ARRAY[7] },  // 戊未
      { stem: HEAVENLY_STEMS_ARRAY[5], branch: EARTHLY_BRANCHES_ARRAY[6] },  // 己午
      { stem: HEAVENLY_STEMS_ARRAY[6], branch: EARTHLY_BRANCHES_ARRAY[8] },  // 庚申
      { stem: HEAVENLY_STEMS_ARRAY[7], branch: EARTHLY_BRANCHES_ARRAY[9] },  // 辛酉
      { stem: HEAVENLY_STEMS_ARRAY[8], branch: EARTHLY_BRANCHES_ARRAY[11] }, // 壬亥
      { stem: HEAVENLY_STEMS_ARRAY[9], branch: EARTHLY_BRANCHES_ARRAY[0] }   // 癸子
    ];
    
    const pillars = [
      { pillar: chart.year, position: POSITION_NAMES.year },
      { pillar: chart.month, position: POSITION_NAMES.month },
      { pillar: chart.day, position: POSITION_NAMES.day },
      { pillar: chart.hour, position: POSITION_NAMES.hour }
    ];
    
    pillars.forEach(({ pillar, position }) => {
      if (fuXingCombos.some(combo => 
        combo.stem === pillar.stem && combo.branch === pillar.branch
      )) {
        results.push({
          name: '福星貴人',
          type: '吉星',
          position,
          description: '福星貴人，主福祿雙全，一生順遂。財運亨通，事業有成。'
        });
      }
    });
    
    return results;
  }
  
  /**
   * Check for San Qi (三奇貴人) - Three Wonders Noble
   * 乙丙丁、甲戊庚、辛壬癸
   */
  private static checkSanQi(dayMaster: string, chart: BaziChart): ShenShaInfo[] {
    const results: ShenShaInfo[] = [];
    
    const allStems = [chart.year.stem, chart.month.stem, chart.day.stem, chart.hour.stem];
    
    // Check for 天上三奇: 乙丙丁
    if (allStems.includes(HEAVENLY_STEMS_ARRAY[1]) && 
        allStems.includes(HEAVENLY_STEMS_ARRAY[2]) && 
        allStems.includes(HEAVENLY_STEMS_ARRAY[3])) {
      results.push({
        name: '天上三奇',
        type: '吉星',
        position: '命盤',
        description: '天上三奇，主才華橫溢，智慧超群。有特殊才能，容易成就非凡。'
      });
    }
    
    // Check for 地上三奇: 甲戊庚
    if (allStems.includes(HEAVENLY_STEMS_ARRAY[0]) && 
        allStems.includes(HEAVENLY_STEMS_ARRAY[4]) && 
        allStems.includes(HEAVENLY_STEMS_ARRAY[6])) {
      results.push({
        name: '地上三奇',
        type: '吉星',
        position: '命盤',
        description: '地上三奇，主腳踏實地，穩重務實。做事有條理，容易積累財富。'
      });
    }
    
    // Check for 人中三奇: 辛壬癸
    if (allStems.includes(HEAVENLY_STEMS_ARRAY[7]) && 
        allStems.includes(HEAVENLY_STEMS_ARRAY[8]) && 
        allStems.includes(HEAVENLY_STEMS_ARRAY[9])) {
      results.push({
        name: '人中三奇',
        type: '吉星',
        position: '命盤',
        description: '人中三奇，主人緣極佳，左右逢源。善於交際，貴人多助。'
      });
    }
    
    return results;
  }
  
  /**
   * Check for Xue Tang (學堂) - Academic Hall
   */
  private static checkXueTang(dayMaster: string, chart: BaziChart): ShenShaInfo[] {
    const results: ShenShaInfo[] = [];
    
    // 學堂查法：以日干的長生之位
    const xueTangMap: Record<string, string> = {
      [HEAVENLY_STEMS_ARRAY[0]]: EARTHLY_BRANCHES_ARRAY[11],  // 甲: 亥
      [HEAVENLY_STEMS_ARRAY[1]]: EARTHLY_BRANCHES_ARRAY[6],   // 乙: 午
      [HEAVENLY_STEMS_ARRAY[2]]: EARTHLY_BRANCHES_ARRAY[2],   // 丙: 寅
      [HEAVENLY_STEMS_ARRAY[3]]: EARTHLY_BRANCHES_ARRAY[9],   // 丁: 酉
      [HEAVENLY_STEMS_ARRAY[4]]: EARTHLY_BRANCHES_ARRAY[2],   // 戊: 寅
      [HEAVENLY_STEMS_ARRAY[5]]: EARTHLY_BRANCHES_ARRAY[9],   // 己: 酉
      [HEAVENLY_STEMS_ARRAY[6]]: EARTHLY_BRANCHES_ARRAY[5],   // 庚: 巳
      [HEAVENLY_STEMS_ARRAY[7]]: EARTHLY_BRANCHES_ARRAY[0],   // 辛: 子
      [HEAVENLY_STEMS_ARRAY[8]]: EARTHLY_BRANCHES_ARRAY[8],   // 壬: 申
      [HEAVENLY_STEMS_ARRAY[9]]: EARTHLY_BRANCHES_ARRAY[3]    // 癸: 卯
    };
    
    const xueTangBranch = xueTangMap[dayMaster];
    if (!xueTangBranch) return results;
    
    const branches = [
      { branch: chart.year.branch, position: '年支' },
      { branch: chart.month.branch, position: '月支' },
      { branch: chart.day.branch, position: '日支' },
      { branch: chart.hour.branch, position: '時支' }
    ];
    
    branches.forEach(({ branch, position }) => {
      if (branch === xueTangBranch) {
        results.push({
          name: '學堂',
          type: '吉星',
          position,
          description: '學堂星，主好學上進，學業有成。利於求學深造，學術研究。'
        });
      }
    });
    
    return results;
  }
  
  /**
   * Check for Ci Guan (詞館) - Literary Hall
   */
  private static checkCiGuan(dayMaster: string, chart: BaziChart): ShenShaInfo[] {
    const results: ShenShaInfo[] = [];
    
    // 詞館查法：以日干的臨官之位
    const ciGuanMap: Record<string, string> = {
      [HEAVENLY_STEMS_ARRAY[0]]: EARTHLY_BRANCHES_ARRAY[2],   // 甲: 寅
      [HEAVENLY_STEMS_ARRAY[1]]: EARTHLY_BRANCHES_ARRAY[3],   // 乙: 卯
      [HEAVENLY_STEMS_ARRAY[2]]: EARTHLY_BRANCHES_ARRAY[5],   // 丙: 巳
      [HEAVENLY_STEMS_ARRAY[3]]: EARTHLY_BRANCHES_ARRAY[6],   // 丁: 午
      [HEAVENLY_STEMS_ARRAY[4]]: EARTHLY_BRANCHES_ARRAY[5],   // 戊: 巳
      [HEAVENLY_STEMS_ARRAY[5]]: EARTHLY_BRANCHES_ARRAY[6],   // 己: 午
      [HEAVENLY_STEMS_ARRAY[6]]: EARTHLY_BRANCHES_ARRAY[8],   // 庚: 申
      [HEAVENLY_STEMS_ARRAY[7]]: EARTHLY_BRANCHES_ARRAY[9],   // 辛: 酉
      [HEAVENLY_STEMS_ARRAY[8]]: EARTHLY_BRANCHES_ARRAY[11],  // 壬: 亥
      [HEAVENLY_STEMS_ARRAY[9]]: EARTHLY_BRANCHES_ARRAY[0]    // 癸: 子
    };
    
    const ciGuanBranch = ciGuanMap[dayMaster];
    if (!ciGuanBranch) return results;
    
    const branches = [
      { branch: chart.year.branch, position: '年支' },
      { branch: chart.month.branch, position: '月支' },
      { branch: chart.day.branch, position: '日支' },
      { branch: chart.hour.branch, position: '時支' }
    ];
    
    branches.forEach(({ branch, position }) => {
      if (branch === ciGuanBranch) {
        results.push({
          name: '詞館',
          type: '吉星',
          position,
          description: '詞館星，主文思敏捷，辯才無礙。適合文學創作，法律辯論。'
        });
      }
    });
    
    return results;
  }
  
  /**
   * Check for Hong Luan (紅鸞) - Red Phoenix
   */
  private static checkHongLuan(chart: BaziChart): ShenShaInfo[] {
    const results: ShenShaInfo[] = [];
    
    // 紅鸞查法：以年支查其他地支
    const hongLuanMap: Record<string, string> = {
      [EARTHLY_BRANCHES_ARRAY[0]]: EARTHLY_BRANCHES_ARRAY[3],   // 子年: 卯
      [EARTHLY_BRANCHES_ARRAY[1]]: EARTHLY_BRANCHES_ARRAY[2],   // 丑年: 寅
      [EARTHLY_BRANCHES_ARRAY[2]]: EARTHLY_BRANCHES_ARRAY[1],   // 寅年: 丑
      [EARTHLY_BRANCHES_ARRAY[3]]: EARTHLY_BRANCHES_ARRAY[0],   // 卯年: 子
      [EARTHLY_BRANCHES_ARRAY[4]]: EARTHLY_BRANCHES_ARRAY[11],  // 辰年: 亥
      [EARTHLY_BRANCHES_ARRAY[5]]: EARTHLY_BRANCHES_ARRAY[10],  // 巳年: 戌
      [EARTHLY_BRANCHES_ARRAY[6]]: EARTHLY_BRANCHES_ARRAY[9],   // 午年: 酉
      [EARTHLY_BRANCHES_ARRAY[7]]: EARTHLY_BRANCHES_ARRAY[8],   // 未年: 申
      [EARTHLY_BRANCHES_ARRAY[8]]: EARTHLY_BRANCHES_ARRAY[7],   // 申年: 未
      [EARTHLY_BRANCHES_ARRAY[9]]: EARTHLY_BRANCHES_ARRAY[6],   // 酉年: 午
      [EARTHLY_BRANCHES_ARRAY[10]]: EARTHLY_BRANCHES_ARRAY[5],  // 戌年: 巳
      [EARTHLY_BRANCHES_ARRAY[11]]: EARTHLY_BRANCHES_ARRAY[4]   // 亥年: 辰
    };
    
    const hongLuanBranch = hongLuanMap[chart.year.branch];
    if (!hongLuanBranch) return results;
    
    const branches = [
      { branch: chart.month.branch, position: '月支' },
      { branch: chart.day.branch, position: '日支' },
      { branch: chart.hour.branch, position: '時支' }
    ];
    
    branches.forEach(({ branch, position }) => {
      if (branch === hongLuanBranch) {
        results.push({
          name: '紅鸞',
          type: '中性',
          position,
          description: '紅鸞星，主婚姻喜慶，感情美滿。利於戀愛結婚，夫妻和諧。'
        });
      }
    });
    
    return results;
  }
  
  /**
   * Check for Tian Xi (天喜) - Heavenly Happiness
   */
  private static checkTianXi(chart: BaziChart): ShenShaInfo[] {
    const results: ShenShaInfo[] = [];
    
    // 天喜查法：紅鸞對宮
    const tianXiMap: Record<string, string> = {
      [EARTHLY_BRANCHES_ARRAY[0]]: EARTHLY_BRANCHES_ARRAY[9],   // 子年: 酉
      [EARTHLY_BRANCHES_ARRAY[1]]: EARTHLY_BRANCHES_ARRAY[8],   // 丑年: 申
      [EARTHLY_BRANCHES_ARRAY[2]]: EARTHLY_BRANCHES_ARRAY[7],   // 寅年: 未
      [EARTHLY_BRANCHES_ARRAY[3]]: EARTHLY_BRANCHES_ARRAY[6],   // 卯年: 午
      [EARTHLY_BRANCHES_ARRAY[4]]: EARTHLY_BRANCHES_ARRAY[5],   // 辰年: 巳
      [EARTHLY_BRANCHES_ARRAY[5]]: EARTHLY_BRANCHES_ARRAY[4],   // 巳年: 辰
      [EARTHLY_BRANCHES_ARRAY[6]]: EARTHLY_BRANCHES_ARRAY[3],   // 午年: 卯
      [EARTHLY_BRANCHES_ARRAY[7]]: EARTHLY_BRANCHES_ARRAY[2],   // 未年: 寅
      [EARTHLY_BRANCHES_ARRAY[8]]: EARTHLY_BRANCHES_ARRAY[1],   // 申年: 丑
      [EARTHLY_BRANCHES_ARRAY[9]]: EARTHLY_BRANCHES_ARRAY[0],   // 酉年: 子
      [EARTHLY_BRANCHES_ARRAY[10]]: EARTHLY_BRANCHES_ARRAY[11], // 戌年: 亥
      [EARTHLY_BRANCHES_ARRAY[11]]: EARTHLY_BRANCHES_ARRAY[10]  // 亥年: 戌
    };
    
    const tianXiBranch = tianXiMap[chart.year.branch];
    if (!tianXiBranch) return results;
    
    const branches = [
      { branch: chart.month.branch, position: '月支' },
      { branch: chart.day.branch, position: '日支' },
      { branch: chart.hour.branch, position: '時支' }
    ];
    
    branches.forEach(({ branch, position }) => {
      if (branch === tianXiBranch) {
        results.push({
          name: '天喜',
          type: '中性',
          position,
          description: '天喜星，主喜事臨門，添丁進財。有喜慶之事，人逢喜事精神爽。'
        });
      }
    });
    
    return results;
  }
  
  /**
   * Check for Xian Chi (咸池) - Salt Pool (Romance)
   */
  private static checkXianChi(dayBranch: string, chart: BaziChart): ShenShaInfo[] {
    const results: ShenShaInfo[] = [];
    
    // 咸池即桃花，但用於凶的情況
    const xianChiMap: Record<string, string> = {
      [EARTHLY_BRANCHES_ARRAY[8]]: EARTHLY_BRANCHES_ARRAY[9],  // 申: 酉
      [EARTHLY_BRANCHES_ARRAY[0]]: EARTHLY_BRANCHES_ARRAY[9],  // 子: 酉
      [EARTHLY_BRANCHES_ARRAY[4]]: EARTHLY_BRANCHES_ARRAY[9],  // 辰: 酉
      [EARTHLY_BRANCHES_ARRAY[2]]: EARTHLY_BRANCHES_ARRAY[3],  // 寅: 卯
      [EARTHLY_BRANCHES_ARRAY[6]]: EARTHLY_BRANCHES_ARRAY[3],  // 午: 卯
      [EARTHLY_BRANCHES_ARRAY[10]]: EARTHLY_BRANCHES_ARRAY[3], // 戌: 卯
      [EARTHLY_BRANCHES_ARRAY[5]]: EARTHLY_BRANCHES_ARRAY[6],  // 巳: 午
      [EARTHLY_BRANCHES_ARRAY[9]]: EARTHLY_BRANCHES_ARRAY[6],  // 酉: 午
      [EARTHLY_BRANCHES_ARRAY[1]]: EARTHLY_BRANCHES_ARRAY[6],  // 丑: 午
      [EARTHLY_BRANCHES_ARRAY[11]]: EARTHLY_BRANCHES_ARRAY[0], // 亥: 子
      [EARTHLY_BRANCHES_ARRAY[3]]: EARTHLY_BRANCHES_ARRAY[0],  // 卯: 子
      [EARTHLY_BRANCHES_ARRAY[7]]: EARTHLY_BRANCHES_ARRAY[0]   // 未: 子
    };
    
    const xianChiBranch = xianChiMap[dayBranch];
    if (!xianChiBranch) return results;
    
    const branches = [
      { branch: chart.year.branch, position: '年支' },
      { branch: chart.month.branch, position: '月支' },
      { branch: chart.day.branch, position: '日支' },
      { branch: chart.hour.branch, position: '時支' }
    ];
    
    branches.forEach(({ branch, position }) => {
      if (branch === xianChiBranch) {
        results.push({
          name: '咸池',
          type: '凶星',
          position,
          description: '咸池星，主風流多情，異性緣重。感情豐富，但需注意節制。'
        });
      }
    });
    
    return results;
  }
  
  /**
   * Check for Yuan Chen (元辰) - Primary Inauspicious
   */
  private static checkYuanChen(chart: BaziChart, gender: 'male' | 'female'): ShenShaInfo[] {
    const results: ShenShaInfo[] = [];
    
    // 元辰查法：男女不同
    const maleYuanChenMap: Record<string, string> = {
      [EARTHLY_BRANCHES_ARRAY[0]]: EARTHLY_BRANCHES_ARRAY[7],   // 子: 未
      [EARTHLY_BRANCHES_ARRAY[1]]: EARTHLY_BRANCHES_ARRAY[8],   // 丑: 申
      [EARTHLY_BRANCHES_ARRAY[2]]: EARTHLY_BRANCHES_ARRAY[9],   // 寅: 酉
      [EARTHLY_BRANCHES_ARRAY[3]]: EARTHLY_BRANCHES_ARRAY[10],  // 卯: 戌
      [EARTHLY_BRANCHES_ARRAY[4]]: EARTHLY_BRANCHES_ARRAY[11],  // 辰: 亥
      [EARTHLY_BRANCHES_ARRAY[5]]: EARTHLY_BRANCHES_ARRAY[0],   // 巳: 子
      [EARTHLY_BRANCHES_ARRAY[6]]: EARTHLY_BRANCHES_ARRAY[1],   // 午: 丑
      [EARTHLY_BRANCHES_ARRAY[7]]: EARTHLY_BRANCHES_ARRAY[2],   // 未: 寅
      [EARTHLY_BRANCHES_ARRAY[8]]: EARTHLY_BRANCHES_ARRAY[3],   // 申: 卯
      [EARTHLY_BRANCHES_ARRAY[9]]: EARTHLY_BRANCHES_ARRAY[4],   // 酉: 辰
      [EARTHLY_BRANCHES_ARRAY[10]]: EARTHLY_BRANCHES_ARRAY[5],  // 戌: 巳
      [EARTHLY_BRANCHES_ARRAY[11]]: EARTHLY_BRANCHES_ARRAY[6]   // 亥: 午
    };
    
    const femaleYuanChenMap: Record<string, string> = {
      [EARTHLY_BRANCHES_ARRAY[0]]: EARTHLY_BRANCHES_ARRAY[5],   // 子: 巳
      [EARTHLY_BRANCHES_ARRAY[1]]: EARTHLY_BRANCHES_ARRAY[6],   // 丑: 午
      [EARTHLY_BRANCHES_ARRAY[2]]: EARTHLY_BRANCHES_ARRAY[7],   // 寅: 未
      [EARTHLY_BRANCHES_ARRAY[3]]: EARTHLY_BRANCHES_ARRAY[8],   // 卯: 申
      [EARTHLY_BRANCHES_ARRAY[4]]: EARTHLY_BRANCHES_ARRAY[9],   // 辰: 酉
      [EARTHLY_BRANCHES_ARRAY[5]]: EARTHLY_BRANCHES_ARRAY[10],  // 巳: 戌
      [EARTHLY_BRANCHES_ARRAY[6]]: EARTHLY_BRANCHES_ARRAY[11],  // 午: 亥
      [EARTHLY_BRANCHES_ARRAY[7]]: EARTHLY_BRANCHES_ARRAY[0],   // 未: 子
      [EARTHLY_BRANCHES_ARRAY[8]]: EARTHLY_BRANCHES_ARRAY[1],   // 申: 丑
      [EARTHLY_BRANCHES_ARRAY[9]]: EARTHLY_BRANCHES_ARRAY[2],   // 酉: 寅
      [EARTHLY_BRANCHES_ARRAY[10]]: EARTHLY_BRANCHES_ARRAY[3],  // 戌: 卯
      [EARTHLY_BRANCHES_ARRAY[11]]: EARTHLY_BRANCHES_ARRAY[4]   // 亥: 辰
    };
    
    const yuanChenMap = gender === 'male' ? maleYuanChenMap : femaleYuanChenMap;
    const yuanChenBranch = yuanChenMap[chart.year.branch];
    if (!yuanChenBranch) return results;
    
    const branches = [
      { branch: chart.month.branch, position: '月支' },
      { branch: chart.day.branch, position: '日支' },
      { branch: chart.hour.branch, position: '時支' }
    ];
    
    branches.forEach(({ branch, position }) => {
      if (branch === yuanChenBranch) {
        results.push({
          name: '元辰',
          type: '凶星',
          position,
          description: '元辰星，主運勢反覆，起伏不定。需要更加努力，方能成功。'
        });
      }
    });
    
    return results;
  }
  
  /**
   * Check for Jin Shen (金神) - Gold God
   */
  private static checkJinShen(dayMaster: string, chart: BaziChart): ShenShaInfo[] {
    const results: ShenShaInfo[] = [];
    
    // 金神日：乙丑、己巳、癸酉
    const jinShenDays = [
      { stem: HEAVENLY_STEMS_ARRAY[1], branch: EARTHLY_BRANCHES_ARRAY[1] },  // 乙丑
      { stem: HEAVENLY_STEMS_ARRAY[5], branch: EARTHLY_BRANCHES_ARRAY[5] },  // 己巳
      { stem: HEAVENLY_STEMS_ARRAY[9], branch: EARTHLY_BRANCHES_ARRAY[9] }   // 癸酉
    ];
    
    if (jinShenDays.some(combo => 
      combo.stem === chart.day.stem && combo.branch === chart.day.branch
    )) {
      results.push({
        name: '金神',
        type: '中性',
        position: POSITION_NAMES.day,
        description: '金神，主剛強果斷，殺伐決斷。性格強勢，適合軍警司法工作。'
      });
    }
    
    return results;
  }
  
  /**
   * Check for Tian Cai (天財) - Heavenly Wealth
   */
  private static checkTianCai(dayMaster: string, chart: BaziChart): ShenShaInfo[] {
    const results: ShenShaInfo[] = [];
    
    // 天財查法：以日干查
    const tianCaiMap: Record<string, string> = {
      [HEAVENLY_STEMS_ARRAY[0]]: EARTHLY_BRANCHES_ARRAY[1],   // 甲: 丑
      [HEAVENLY_STEMS_ARRAY[1]]: EARTHLY_BRANCHES_ARRAY[4],   // 乙: 辰
      [HEAVENLY_STEMS_ARRAY[2]]: EARTHLY_BRANCHES_ARRAY[7],   // 丙: 未
      [HEAVENLY_STEMS_ARRAY[3]]: EARTHLY_BRANCHES_ARRAY[10],  // 丁: 戌
      [HEAVENLY_STEMS_ARRAY[4]]: EARTHLY_BRANCHES_ARRAY[1],   // 戊: 丑
      [HEAVENLY_STEMS_ARRAY[5]]: EARTHLY_BRANCHES_ARRAY[4],   // 己: 辰
      [HEAVENLY_STEMS_ARRAY[6]]: EARTHLY_BRANCHES_ARRAY[7],   // 庚: 未
      [HEAVENLY_STEMS_ARRAY[7]]: EARTHLY_BRANCHES_ARRAY[10],  // 辛: 戌
      [HEAVENLY_STEMS_ARRAY[8]]: EARTHLY_BRANCHES_ARRAY[1],   // 壬: 丑
      [HEAVENLY_STEMS_ARRAY[9]]: EARTHLY_BRANCHES_ARRAY[4]    // 癸: 辰
    };
    
    const tianCaiBranch = tianCaiMap[dayMaster];
    if (!tianCaiBranch) return results;
    
    const branches = [
      { branch: chart.year.branch, position: '年支' },
      { branch: chart.month.branch, position: '月支' },
      { branch: chart.day.branch, position: '日支' },
      { branch: chart.hour.branch, position: '時支' }
    ];
    
    branches.forEach(({ branch, position }) => {
      if (branch === tianCaiBranch) {
        results.push({
          name: '天財',
          type: '吉星',
          position,
          description: '天財星，主橫財運佳，意外之財。投資運好，但需謹慎理財。'
        });
      }
    });
    
    return results;
  }
  
  /**
   * Check for Ba Zhuan (八專) - Eight Specialists
   */
  private static checkBaZhuan(chart: BaziChart): ShenShaInfo[] {
    const results: ShenShaInfo[] = [];
    
    // 八專日：甲寅、乙卯、丁未、戊戌、己未、庚申、辛酉、癸丑
    const baZhuanDays = [
      { stem: HEAVENLY_STEMS_ARRAY[0], branch: EARTHLY_BRANCHES_ARRAY[2] },  // 甲寅
      { stem: HEAVENLY_STEMS_ARRAY[1], branch: EARTHLY_BRANCHES_ARRAY[3] },  // 乙卯
      { stem: HEAVENLY_STEMS_ARRAY[3], branch: EARTHLY_BRANCHES_ARRAY[7] },  // 丁未
      { stem: HEAVENLY_STEMS_ARRAY[4], branch: EARTHLY_BRANCHES_ARRAY[10] }, // 戊戌
      { stem: HEAVENLY_STEMS_ARRAY[5], branch: EARTHLY_BRANCHES_ARRAY[7] },  // 己未
      { stem: HEAVENLY_STEMS_ARRAY[6], branch: EARTHLY_BRANCHES_ARRAY[8] },  // 庚申
      { stem: HEAVENLY_STEMS_ARRAY[7], branch: EARTHLY_BRANCHES_ARRAY[9] },  // 辛酉
      { stem: HEAVENLY_STEMS_ARRAY[9], branch: EARTHLY_BRANCHES_ARRAY[1] }   // 癸丑
    ];
    
    if (baZhuanDays.some(combo => 
      combo.stem === chart.day.stem && combo.branch === chart.day.branch
    )) {
      results.push({
        name: '八專',
        type: '中性',
        position: POSITION_NAMES.day,
        description: '八專，主專心致志，執著專注。做事認真，但較為固執。'
      });
    }
    
    return results;
  }
  
  /**
   * Check for Shi Gan (十乾祿) - Ten Stems Salary
   */
  private static checkShiGan(dayMaster: string, chart: BaziChart): ShenShaInfo[] {
    // Already implemented as LuShen
    return [];
  }
  
  /**
   * Check for Jian Lu (建祿) - Establishing Salary
   */
  private static checkJianLu(dayMaster: string, chart: BaziChart): ShenShaInfo[] {
    const results: ShenShaInfo[] = [];
    
    // 建祿格：日干的祿神在月支
    const jianLuMap: Record<string, string> = {
      [HEAVENLY_STEMS_ARRAY[0]]: EARTHLY_BRANCHES_ARRAY[2],   // 甲: 寅
      [HEAVENLY_STEMS_ARRAY[1]]: EARTHLY_BRANCHES_ARRAY[3],   // 乙: 卯
      [HEAVENLY_STEMS_ARRAY[2]]: EARTHLY_BRANCHES_ARRAY[5],   // 丙: 巳
      [HEAVENLY_STEMS_ARRAY[3]]: EARTHLY_BRANCHES_ARRAY[6],   // 丁: 午
      [HEAVENLY_STEMS_ARRAY[4]]: EARTHLY_BRANCHES_ARRAY[5],   // 戊: 巳
      [HEAVENLY_STEMS_ARRAY[5]]: EARTHLY_BRANCHES_ARRAY[6],   // 己: 午
      [HEAVENLY_STEMS_ARRAY[6]]: EARTHLY_BRANCHES_ARRAY[8],   // 庚: 申
      [HEAVENLY_STEMS_ARRAY[7]]: EARTHLY_BRANCHES_ARRAY[9],   // 辛: 酉
      [HEAVENLY_STEMS_ARRAY[8]]: EARTHLY_BRANCHES_ARRAY[11],  // 壬: 亥
      [HEAVENLY_STEMS_ARRAY[9]]: EARTHLY_BRANCHES_ARRAY[0]    // 癸: 子
    };
    
    if (chart.month.branch === jianLuMap[dayMaster]) {
      results.push({
        name: '建祿',
        type: '吉星',
        position: '月支',
        description: '建祿，主自力更生，白手起家。憑自己努力獲得成就。'
      });
    }
    
    return results;
  }
  
  /**
   * Check for Fei Ren (飛刃) - Flying Blade
   */
  private static checkFeiRen(dayMaster: string, chart: BaziChart): ShenShaInfo[] {
    const results: ShenShaInfo[] = [];
    
    // 飛刃查法：羊刃的沖位
    const feiRenMap: Record<string, string> = {
      [HEAVENLY_STEMS_ARRAY[0]]: EARTHLY_BRANCHES_ARRAY[9],   // 甲: 酉 (卯的沖)
      [HEAVENLY_STEMS_ARRAY[1]]: EARTHLY_BRANCHES_ARRAY[8],   // 乙: 申 (寅的沖)
      [HEAVENLY_STEMS_ARRAY[2]]: EARTHLY_BRANCHES_ARRAY[0],   // 丙: 子 (午的沖)
      [HEAVENLY_STEMS_ARRAY[3]]: EARTHLY_BRANCHES_ARRAY[11],  // 丁: 亥 (巳的沖)
      [HEAVENLY_STEMS_ARRAY[4]]: EARTHLY_BRANCHES_ARRAY[0],   // 戊: 子 (午的沖)
      [HEAVENLY_STEMS_ARRAY[5]]: EARTHLY_BRANCHES_ARRAY[11],  // 己: 亥 (巳的沖)
      [HEAVENLY_STEMS_ARRAY[6]]: EARTHLY_BRANCHES_ARRAY[3],   // 庚: 卯 (酉的沖)
      [HEAVENLY_STEMS_ARRAY[7]]: EARTHLY_BRANCHES_ARRAY[2],   // 辛: 寅 (申的沖)
      [HEAVENLY_STEMS_ARRAY[8]]: EARTHLY_BRANCHES_ARRAY[6],   // 壬: 午 (子的沖)
      [HEAVENLY_STEMS_ARRAY[9]]: EARTHLY_BRANCHES_ARRAY[5]    // 癸: 巳 (亥的沖)
    };
    
    const feiRenBranch = feiRenMap[dayMaster];
    if (!feiRenBranch) return results;
    
    const branches = [
      { branch: chart.year.branch, position: '年支' },
      { branch: chart.month.branch, position: '月支' },
      { branch: chart.day.branch, position: '日支' },
      { branch: chart.hour.branch, position: '時支' }
    ];
    
    branches.forEach(({ branch, position }) => {
      if (branch === feiRenBranch) {
        results.push({
          name: '飛刃',
          type: '凶星',
          position,
          description: '飛刃，主突發意外，飛來橫禍。外出需謹慎，注意交通安全。'
        });
      }
    });
    
    return results;
  }
  
  /**
   * Check for Jie Sha (劫煞) - Robbery Evil
   */
  private static checkJieSha(chart: BaziChart): ShenShaInfo[] {
    const results: ShenShaInfo[] = [];
    
    const jieMap: Record<string, string> = {
      [EARTHLY_BRANCHES_ARRAY[8]]: EARTHLY_BRANCHES_ARRAY[5],   // 申: 巳
      [EARTHLY_BRANCHES_ARRAY[0]]: EARTHLY_BRANCHES_ARRAY[5],   // 子: 巳
      [EARTHLY_BRANCHES_ARRAY[4]]: EARTHLY_BRANCHES_ARRAY[5],   // 辰: 巳
      [EARTHLY_BRANCHES_ARRAY[2]]: EARTHLY_BRANCHES_ARRAY[11],  // 寅: 亥
      [EARTHLY_BRANCHES_ARRAY[6]]: EARTHLY_BRANCHES_ARRAY[11],  // 午: 亥
      [EARTHLY_BRANCHES_ARRAY[10]]: EARTHLY_BRANCHES_ARRAY[11], // 戌: 亥
      [EARTHLY_BRANCHES_ARRAY[5]]: EARTHLY_BRANCHES_ARRAY[2],   // 巳: 寅
      [EARTHLY_BRANCHES_ARRAY[9]]: EARTHLY_BRANCHES_ARRAY[2],   // 酉: 寅
      [EARTHLY_BRANCHES_ARRAY[1]]: EARTHLY_BRANCHES_ARRAY[2],   // 丑: 寅
      [EARTHLY_BRANCHES_ARRAY[11]]: EARTHLY_BRANCHES_ARRAY[8],  // 亥: 申
      [EARTHLY_BRANCHES_ARRAY[3]]: EARTHLY_BRANCHES_ARRAY[8],   // 卯: 申
      [EARTHLY_BRANCHES_ARRAY[7]]: EARTHLY_BRANCHES_ARRAY[8]    // 未: 申
    };
    
    // 劫煞以年支查其他地支
    const jieBranch = jieMap[chart.year.branch];
    if (!jieBranch) return results;
    
    const branches = [
      { branch: chart.year.branch, position: '年支' },
      { branch: chart.month.branch, position: '月支' },
      { branch: chart.day.branch, position: '日支' },
      { branch: chart.hour.branch, position: '時支' }
    ];
    
    branches.forEach(({ branch, position }) => {
      if (branch === jieBranch) {
        results.push({
          name: '劫煞',
          type: '凶星',
          position,
          description: '劫煞，主破財損失，錢財被劫。理財需謹慎，防範小人。'
        });
      }
    });
    
    return results;
  }
  
  /**
   * Check for Zai Sha (災煞) - Disaster Evil
   */
  private static checkZaiSha(chart: BaziChart): ShenShaInfo[] {
    const results: ShenShaInfo[] = [];
    
    const zaiMap: Record<string, string> = {
      [EARTHLY_BRANCHES_ARRAY[8]]: EARTHLY_BRANCHES_ARRAY[6],   // 申: 午
      [EARTHLY_BRANCHES_ARRAY[0]]: EARTHLY_BRANCHES_ARRAY[6],   // 子: 午
      [EARTHLY_BRANCHES_ARRAY[4]]: EARTHLY_BRANCHES_ARRAY[6],   // 辰: 午
      [EARTHLY_BRANCHES_ARRAY[2]]: EARTHLY_BRANCHES_ARRAY[0],   // 寅: 子
      [EARTHLY_BRANCHES_ARRAY[6]]: EARTHLY_BRANCHES_ARRAY[0],   // 午: 子
      [EARTHLY_BRANCHES_ARRAY[10]]: EARTHLY_BRANCHES_ARRAY[0],  // 戌: 子
      [EARTHLY_BRANCHES_ARRAY[5]]: EARTHLY_BRANCHES_ARRAY[3],   // 巳: 卯
      [EARTHLY_BRANCHES_ARRAY[9]]: EARTHLY_BRANCHES_ARRAY[3],   // 酉: 卯
      [EARTHLY_BRANCHES_ARRAY[1]]: EARTHLY_BRANCHES_ARRAY[3],   // 丑: 卯
      [EARTHLY_BRANCHES_ARRAY[11]]: EARTHLY_BRANCHES_ARRAY[9],  // 亥: 酉
      [EARTHLY_BRANCHES_ARRAY[3]]: EARTHLY_BRANCHES_ARRAY[9],   // 卯: 酉
      [EARTHLY_BRANCHES_ARRAY[7]]: EARTHLY_BRANCHES_ARRAY[9]    // 未: 酉
    };
    
    // 災煞以年支查其他地支
    const zaiBranch = zaiMap[chart.year.branch];
    if (!zaiBranch) return results;
    
    const branches = [
      { branch: chart.year.branch, position: '年支' },
      { branch: chart.month.branch, position: '月支' },
      { branch: chart.day.branch, position: '日支' },
      { branch: chart.hour.branch, position: '時支' }
    ];
    
    branches.forEach(({ branch, position }) => {
      if (branch === zaiBranch) {
        results.push({
          name: '災煞',
          type: '凶星',
          position,
          description: '災煞，主災禍橫生，意外頻發。需要多行善事，化解災厄。'
        });
      }
    });
    
    return results;
  }
  
  /**
   * Check for Wang Shen (亡神) - Death God
   */
  private static checkWangShen(chart: BaziChart): ShenShaInfo[] {
    const results: ShenShaInfo[] = [];
    
    // 亡神查法
    const wangShenMap: Record<string, string> = {
      [EARTHLY_BRANCHES_ARRAY[8]]: EARTHLY_BRANCHES_ARRAY[11],  // 申: 亥
      [EARTHLY_BRANCHES_ARRAY[0]]: EARTHLY_BRANCHES_ARRAY[11],  // 子: 亥
      [EARTHLY_BRANCHES_ARRAY[4]]: EARTHLY_BRANCHES_ARRAY[11],  // 辰: 亥
      [EARTHLY_BRANCHES_ARRAY[2]]: EARTHLY_BRANCHES_ARRAY[5],   // 寅: 巳
      [EARTHLY_BRANCHES_ARRAY[6]]: EARTHLY_BRANCHES_ARRAY[5],   // 午: 巳
      [EARTHLY_BRANCHES_ARRAY[10]]: EARTHLY_BRANCHES_ARRAY[5],  // 戌: 巳
      [EARTHLY_BRANCHES_ARRAY[5]]: EARTHLY_BRANCHES_ARRAY[8],   // 巳: 申
      [EARTHLY_BRANCHES_ARRAY[9]]: EARTHLY_BRANCHES_ARRAY[8],   // 酉: 申
      [EARTHLY_BRANCHES_ARRAY[1]]: EARTHLY_BRANCHES_ARRAY[8],   // 丑: 申
      [EARTHLY_BRANCHES_ARRAY[11]]: EARTHLY_BRANCHES_ARRAY[2],  // 亥: 寅
      [EARTHLY_BRANCHES_ARRAY[3]]: EARTHLY_BRANCHES_ARRAY[2],   // 卯: 寅
      [EARTHLY_BRANCHES_ARRAY[7]]: EARTHLY_BRANCHES_ARRAY[2]    // 未: 寅
    };
    
    const wangShenBranch = wangShenMap[chart.day.branch];
    if (!wangShenBranch) return results;
    
    const branches = [
      { branch: chart.year.branch, position: '年支' },
      { branch: chart.month.branch, position: '月支' },
      { branch: chart.day.branch, position: '日支' },
      { branch: chart.hour.branch, position: '時支' }
    ];
    
    branches.forEach(({ branch, position }) => {
      if (branch === wangShenBranch) {
        results.push({
          name: '亡神',
          type: '凶星',
          position,
          description: '亡神，主精神恍惚，判斷失誤。做事需謹慎，避免重大決定。'
        });
      }
    });
    
    return results;
  }
  
  /**
   * Check for Liu E (六厄) - Six Adversities
   */
  private static checkLiuE(chart: BaziChart): ShenShaInfo[] {
    const results: ShenShaInfo[] = [];
    
    // 六厄查法
    const liuEMap: Record<string, string> = {
      [EARTHLY_BRANCHES_ARRAY[0]]: EARTHLY_BRANCHES_ARRAY[5],   // 子: 巳
      [EARTHLY_BRANCHES_ARRAY[1]]: EARTHLY_BRANCHES_ARRAY[6],   // 丑: 午
      [EARTHLY_BRANCHES_ARRAY[2]]: EARTHLY_BRANCHES_ARRAY[7],   // 寅: 未
      [EARTHLY_BRANCHES_ARRAY[3]]: EARTHLY_BRANCHES_ARRAY[8],   // 卯: 申
      [EARTHLY_BRANCHES_ARRAY[4]]: EARTHLY_BRANCHES_ARRAY[9],   // 辰: 酉
      [EARTHLY_BRANCHES_ARRAY[5]]: EARTHLY_BRANCHES_ARRAY[10],  // 巳: 戌
      [EARTHLY_BRANCHES_ARRAY[6]]: EARTHLY_BRANCHES_ARRAY[11],  // 午: 亥
      [EARTHLY_BRANCHES_ARRAY[7]]: EARTHLY_BRANCHES_ARRAY[0],   // 未: 子
      [EARTHLY_BRANCHES_ARRAY[8]]: EARTHLY_BRANCHES_ARRAY[1],   // 申: 丑
      [EARTHLY_BRANCHES_ARRAY[9]]: EARTHLY_BRANCHES_ARRAY[2],   // 酉: 寅
      [EARTHLY_BRANCHES_ARRAY[10]]: EARTHLY_BRANCHES_ARRAY[3],  // 戌: 卯
      [EARTHLY_BRANCHES_ARRAY[11]]: EARTHLY_BRANCHES_ARRAY[4]   // 亥: 辰
    };
    
    const liuEBranch = liuEMap[chart.day.branch];
    if (!liuEBranch) return results;
    
    const branches = [
      { branch: chart.year.branch, position: '年支' },
      { branch: chart.month.branch, position: '月支' },
      { branch: chart.day.branch, position: '日支' },
      { branch: chart.hour.branch, position: '時支' }
    ];
    
    branches.forEach(({ branch, position }) => {
      if (branch === liuEBranch) {
        results.push({
          name: '六厄',
          type: '凶星',
          position,
          description: '六厄，主六親不睦，人際不順。需要改善人際關係。'
        });
      }
    });
    
    return results;
  }
  
  /**
   * Check for Bai Hu (白虎) - White Tiger
   */
  private static checkBaiHu(chart: BaziChart): ShenShaInfo[] {
    const results: ShenShaInfo[] = [];
    
    // 白虎查法
    const baiHuMap: Record<string, string> = {
      [EARTHLY_BRANCHES_ARRAY[8]]: EARTHLY_BRANCHES_ARRAY[10],  // 申: 戌
      [EARTHLY_BRANCHES_ARRAY[0]]: EARTHLY_BRANCHES_ARRAY[10],  // 子: 戌
      [EARTHLY_BRANCHES_ARRAY[4]]: EARTHLY_BRANCHES_ARRAY[10],  // 辰: 戌
      [EARTHLY_BRANCHES_ARRAY[2]]: EARTHLY_BRANCHES_ARRAY[4],   // 寅: 辰
      [EARTHLY_BRANCHES_ARRAY[6]]: EARTHLY_BRANCHES_ARRAY[4],   // 午: 辰
      [EARTHLY_BRANCHES_ARRAY[10]]: EARTHLY_BRANCHES_ARRAY[4],  // 戌: 辰
      [EARTHLY_BRANCHES_ARRAY[5]]: EARTHLY_BRANCHES_ARRAY[7],   // 巳: 未
      [EARTHLY_BRANCHES_ARRAY[9]]: EARTHLY_BRANCHES_ARRAY[7],   // 酉: 未
      [EARTHLY_BRANCHES_ARRAY[1]]: EARTHLY_BRANCHES_ARRAY[7],   // 丑: 未
      [EARTHLY_BRANCHES_ARRAY[11]]: EARTHLY_BRANCHES_ARRAY[1],  // 亥: 丑
      [EARTHLY_BRANCHES_ARRAY[3]]: EARTHLY_BRANCHES_ARRAY[1],   // 卯: 丑
      [EARTHLY_BRANCHES_ARRAY[7]]: EARTHLY_BRANCHES_ARRAY[1]    // 未: 丑
    };
    
    const baiHuBranch = baiHuMap[chart.day.branch];
    if (!baiHuBranch) return results;
    
    const branches = [
      { branch: chart.year.branch, position: '年支' },
      { branch: chart.month.branch, position: '月支' },
      { branch: chart.day.branch, position: '日支' },
      { branch: chart.hour.branch, position: '時支' }
    ];
    
    branches.forEach(({ branch, position }) => {
      if (branch === baiHuBranch) {
        results.push({
          name: '白虎',
          type: '凶星',
          position,
          description: '白虎煞，主凶險意外，血光之災。需要特別注意人身安全。'
        });
      }
    });
    
    return results;
  }
  
  /**
   * Check for Pi Ma (披麻) - Mourning Garment
   */
  private static checkPiMa(chart: BaziChart): ShenShaInfo[] {
    const results: ShenShaInfo[] = [];
    
    // 披麻查法：以年支查日時
    const piMaMap: Record<string, string> = {
      [EARTHLY_BRANCHES_ARRAY[0]]: EARTHLY_BRANCHES_ARRAY[9],   // 子: 酉
      [EARTHLY_BRANCHES_ARRAY[1]]: EARTHLY_BRANCHES_ARRAY[9],   // 丑: 酉
      [EARTHLY_BRANCHES_ARRAY[2]]: EARTHLY_BRANCHES_ARRAY[0],   // 寅: 子
      [EARTHLY_BRANCHES_ARRAY[3]]: EARTHLY_BRANCHES_ARRAY[0],   // 卯: 子
      [EARTHLY_BRANCHES_ARRAY[4]]: EARTHLY_BRANCHES_ARRAY[0],   // 辰: 子
      [EARTHLY_BRANCHES_ARRAY[5]]: EARTHLY_BRANCHES_ARRAY[3],   // 巳: 卯
      [EARTHLY_BRANCHES_ARRAY[6]]: EARTHLY_BRANCHES_ARRAY[3],   // 午: 卯
      [EARTHLY_BRANCHES_ARRAY[7]]: EARTHLY_BRANCHES_ARRAY[3],   // 未: 卯
      [EARTHLY_BRANCHES_ARRAY[8]]: EARTHLY_BRANCHES_ARRAY[6],   // 申: 午
      [EARTHLY_BRANCHES_ARRAY[9]]: EARTHLY_BRANCHES_ARRAY[6],   // 酉: 午
      [EARTHLY_BRANCHES_ARRAY[10]]: EARTHLY_BRANCHES_ARRAY[6],  // 戌: 午
      [EARTHLY_BRANCHES_ARRAY[11]]: EARTHLY_BRANCHES_ARRAY[9]   // 亥: 酉
    };
    
    const piMaBranch = piMaMap[chart.year.branch];
    if (!piMaBranch) return results;
    
    const branches = [
      { branch: chart.day.branch, position: '日支' },
      { branch: chart.hour.branch, position: '時支' }
    ];
    
    branches.forEach(({ branch, position }) => {
      if (branch === piMaBranch) {
        results.push({
          name: '披麻',
          type: '凶星',
          position,
          description: '披麻煞，主孝服重重，親人離世。宜多關心家人健康。'
        });
      }
    });
    
    return results;
  }
  
  /**
   * Check for Diao Ke (吊客) - Mourning Guest
   */
  private static checkDiaoKe(chart: BaziChart): ShenShaInfo[] {
    const results: ShenShaInfo[] = [];
    
    // 吊客查法：以年支查日時
    const diaoKeMap: Record<string, string> = {
      [EARTHLY_BRANCHES_ARRAY[0]]: EARTHLY_BRANCHES_ARRAY[3],   // 子: 卯
      [EARTHLY_BRANCHES_ARRAY[1]]: EARTHLY_BRANCHES_ARRAY[3],   // 丑: 卯
      [EARTHLY_BRANCHES_ARRAY[2]]: EARTHLY_BRANCHES_ARRAY[6],   // 寅: 午
      [EARTHLY_BRANCHES_ARRAY[3]]: EARTHLY_BRANCHES_ARRAY[6],   // 卯: 午
      [EARTHLY_BRANCHES_ARRAY[4]]: EARTHLY_BRANCHES_ARRAY[6],   // 辰: 午
      [EARTHLY_BRANCHES_ARRAY[5]]: EARTHLY_BRANCHES_ARRAY[9],   // 巳: 酉
      [EARTHLY_BRANCHES_ARRAY[6]]: EARTHLY_BRANCHES_ARRAY[9],   // 午: 酉
      [EARTHLY_BRANCHES_ARRAY[7]]: EARTHLY_BRANCHES_ARRAY[9],   // 未: 酉
      [EARTHLY_BRANCHES_ARRAY[8]]: EARTHLY_BRANCHES_ARRAY[0],   // 申: 子
      [EARTHLY_BRANCHES_ARRAY[9]]: EARTHLY_BRANCHES_ARRAY[0],   // 酉: 子
      [EARTHLY_BRANCHES_ARRAY[10]]: EARTHLY_BRANCHES_ARRAY[0],  // 戌: 子
      [EARTHLY_BRANCHES_ARRAY[11]]: EARTHLY_BRANCHES_ARRAY[3]   // 亥: 卯
    };
    
    const diaoKeBranch = diaoKeMap[chart.year.branch];
    if (!diaoKeBranch) return results;
    
    const branches = [
      { branch: chart.day.branch, position: '日支' },
      { branch: chart.hour.branch, position: '時支' }
    ];
    
    branches.forEach(({ branch, position }) => {
      if (branch === diaoKeBranch) {
        results.push({
          name: '吊客',
          type: '凶星',
          position,
          description: '吊客煞，主奔喪弔唁，白事纏身。注意家人健康，多行善事。'
        });
      }
    });
    
    return results;
  }
  
  /**
   * Check for Jin Shen Ge (金神格) - Gold God Formation
   */
  private static checkJinShenGe(chart: BaziChart): ShenShaInfo[] {
    const results: ShenShaInfo[] = [];
    
    // 金神格：時支見巳酉丑，且日干為庚辛
    if ([HEAVENLY_STEMS_ARRAY[6], HEAVENLY_STEMS_ARRAY[7]].includes(chart.day.stem) &&
        [EARTHLY_BRANCHES_ARRAY[5], EARTHLY_BRANCHES_ARRAY[9], EARTHLY_BRANCHES_ARRAY[1]].includes(chart.hour.branch)) {
      results.push({
        name: '金神格',
        type: '中性',
        position: '命盤',
        description: '金神格，主威權顯赫，富貴雙全。但需修身養性，避免剛愎。'
      });
    }
    
    return results;
  }
  
  /**
   * Check for Ri De Ge (日德格) - Daily Virtue Formation
   */
  private static checkRiDeGe(chart: BaziChart): ShenShaInfo[] {
    const results: ShenShaInfo[] = [];
    
    // 日德格：甲寅、丙辰、戊辰、庚辰、壬戌日
    const riDeGeDays = [
      { stem: HEAVENLY_STEMS_ARRAY[0], branch: EARTHLY_BRANCHES_ARRAY[2] },  // 甲寅
      { stem: HEAVENLY_STEMS_ARRAY[2], branch: EARTHLY_BRANCHES_ARRAY[4] },  // 丙辰
      { stem: HEAVENLY_STEMS_ARRAY[4], branch: EARTHLY_BRANCHES_ARRAY[4] },  // 戊辰
      { stem: HEAVENLY_STEMS_ARRAY[6], branch: EARTHLY_BRANCHES_ARRAY[4] },  // 庚辰
      { stem: HEAVENLY_STEMS_ARRAY[8], branch: EARTHLY_BRANCHES_ARRAY[10] }  // 壬戌
    ];
    
    if (riDeGeDays.some(combo => 
      combo.stem === chart.day.stem && combo.branch === chart.day.branch
    )) {
      results.push({
        name: '日德格',
        type: '吉星',
        position: POSITION_NAMES.day,
        description: '日德格，主品德高尚，福澤深厚。一生平順，貴人多助。'
      });
    }
    
    return results;
  }
  
  /**
   * Check for Kong Wang (空亡) - Empty Death
   */
  private static checkKongWang(chart: BaziChart): ShenShaInfo[] {
    const results: ShenShaInfo[] = [];
    
    // 空亡查法：根據日柱查
    const ganIndex = HEAVENLY_STEMS_ARRAY.indexOf(chart.day.stem);
    const zhiIndex = EARTHLY_BRANCHES_ARRAY.indexOf(chart.day.branch);
    
    // 計算旬首
    const xunShou = (zhiIndex - ganIndex + 12) % 12;
    
    // 計算空亡的兩個地支
    const kongWang1 = EARTHLY_BRANCHES_ARRAY[(xunShou + 10) % 12];
    const kongWang2 = EARTHLY_BRANCHES_ARRAY[(xunShou + 11) % 12];
    
    const branches = [
      { branch: chart.year.branch, position: '年支' },
      { branch: chart.month.branch, position: '月支' },
      { branch: chart.day.branch, position: '日支' },
      { branch: chart.hour.branch, position: '時支' }
    ];
    
    branches.forEach(({ branch, position }) => {
      if (branch === kongWang1 || branch === kongWang2) {
        results.push({
          name: '空亡',
          type: '凶星',
          position,
          description: '空亡，主虛無飄渺，成敗皆空。需要腳踏實地，避免好高騖遠。'
        });
      }
    });
    
    return results;
  }
  
  /**
   * Check for Si Da Kong Wang (四大空亡) - Four Great Empty Deaths
   */
  private static checkSiDaKongWang(chart: BaziChart): ShenShaInfo[] {
    const results: ShenShaInfo[] = [];
    
    // 四大空亡：甲子、甲午、甲申、甲寅日
    const siDaKongWangDays = [
      { stem: HEAVENLY_STEMS_ARRAY[0], branch: EARTHLY_BRANCHES_ARRAY[0] },  // 甲子
      { stem: HEAVENLY_STEMS_ARRAY[0], branch: EARTHLY_BRANCHES_ARRAY[6] },  // 甲午
      { stem: HEAVENLY_STEMS_ARRAY[0], branch: EARTHLY_BRANCHES_ARRAY[8] },  // 甲申
      { stem: HEAVENLY_STEMS_ARRAY[0], branch: EARTHLY_BRANCHES_ARRAY[2] }   // 甲寅
    ];
    
    if (siDaKongWangDays.some(combo => 
      combo.stem === chart.day.stem && combo.branch === chart.day.branch
    )) {
      results.push({
        name: '四大空亡',
        type: '凶星',
        position: POSITION_NAMES.day,
        description: '四大空亡，主大起大落，成敗無常。人生波折較多，需要堅持。'
      });
    }
    
    return results;
  }
  
  /**
   * Check for Shi E Yun Dao (十惡運倒) - Ten Evil Great Defeat
   */
  private static checkShiEYunDao(chart: BaziChart): ShenShaInfo[] {
    const results: ShenShaInfo[] = [];
    
    // 十惡大敗日：甲辰、乙巳、丙申、丁亥、戊戌、己丑、庚辰、辛巳、壬申、癸亥
    const shiEYunDaoDays = [
      { stem: HEAVENLY_STEMS_ARRAY[0], branch: EARTHLY_BRANCHES_ARRAY[4] },  // 甲辰
      { stem: HEAVENLY_STEMS_ARRAY[1], branch: EARTHLY_BRANCHES_ARRAY[5] },  // 乙巳
      { stem: HEAVENLY_STEMS_ARRAY[2], branch: EARTHLY_BRANCHES_ARRAY[8] },  // 丙申
      { stem: HEAVENLY_STEMS_ARRAY[3], branch: EARTHLY_BRANCHES_ARRAY[11] }, // 丁亥
      { stem: HEAVENLY_STEMS_ARRAY[4], branch: EARTHLY_BRANCHES_ARRAY[10] }, // 戊戌
      { stem: HEAVENLY_STEMS_ARRAY[5], branch: EARTHLY_BRANCHES_ARRAY[1] },  // 己丑
      { stem: HEAVENLY_STEMS_ARRAY[6], branch: EARTHLY_BRANCHES_ARRAY[4] },  // 庚辰
      { stem: HEAVENLY_STEMS_ARRAY[7], branch: EARTHLY_BRANCHES_ARRAY[5] },  // 辛巳
      { stem: HEAVENLY_STEMS_ARRAY[8], branch: EARTHLY_BRANCHES_ARRAY[8] },  // 壬申
      { stem: HEAVENLY_STEMS_ARRAY[9], branch: EARTHLY_BRANCHES_ARRAY[11] }  // 癸亥
    ];
    
    if (shiEYunDaoDays.some(combo => 
      combo.stem === chart.day.stem && combo.branch === chart.day.branch
    )) {
      results.push({
        name: '十惡大敗',
        type: '凶星',
        position: POSITION_NAMES.day,
        description: '十惡大敗，主敗家破財，諸事不順。需要謹慎行事，多積德行善。'
      });
    }
    
    return results;
  }
  
  /**
   * Check for Tian Yi (天醫) - Heavenly Doctor
   */
  private static checkTianYiDoctor(dayMaster: string, chart: BaziChart): ShenShaInfo[] {
    const results: ShenShaInfo[] = [];
    
    // 天醫查法
    const tianYiMap: Record<string, string> = {
      [HEAVENLY_STEMS_ARRAY[0]]: EARTHLY_BRANCHES_ARRAY[1],   // 甲: 丑
      [HEAVENLY_STEMS_ARRAY[1]]: EARTHLY_BRANCHES_ARRAY[0],   // 乙: 子
      [HEAVENLY_STEMS_ARRAY[2]]: EARTHLY_BRANCHES_ARRAY[11],  // 丙: 亥
      [HEAVENLY_STEMS_ARRAY[3]]: EARTHLY_BRANCHES_ARRAY[10],  // 丁: 戌
      [HEAVENLY_STEMS_ARRAY[4]]: EARTHLY_BRANCHES_ARRAY[1],   // 戊: 丑
      [HEAVENLY_STEMS_ARRAY[5]]: EARTHLY_BRANCHES_ARRAY[0],   // 己: 子
      [HEAVENLY_STEMS_ARRAY[6]]: EARTHLY_BRANCHES_ARRAY[7],   // 庚: 未
      [HEAVENLY_STEMS_ARRAY[7]]: EARTHLY_BRANCHES_ARRAY[6],   // 辛: 午
      [HEAVENLY_STEMS_ARRAY[8]]: EARTHLY_BRANCHES_ARRAY[5],   // 壬: 巳
      [HEAVENLY_STEMS_ARRAY[9]]: EARTHLY_BRANCHES_ARRAY[4]    // 癸: 辰
    };
    
    const tianYiBranch = tianYiMap[dayMaster];
    if (!tianYiBranch) return results;
    
    const branches = [
      { branch: chart.year.branch, position: '年支' },
      { branch: chart.month.branch, position: '月支' },
      { branch: chart.day.branch, position: '日支' },
      { branch: chart.hour.branch, position: '時支' }
    ];
    
    branches.forEach(({ branch, position }) => {
      if (branch === tianYiBranch) {
        results.push({
          name: '天醫',
          type: '吉星',
          position,
          description: '天醫星，主健康長壽，少病少災。有醫療天分，適合從事醫護工作。'
        });
      }
    });
    
    return results;
  }
}