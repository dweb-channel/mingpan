/**
 * 格局计算器
 * 识别奇门遁甲中的吉格和凶格
 */

import type {
  GongWei,
  GongInfo,
  TianGan,
  DiZhi,
  GeJuInfo,
  XunShouInfo,
  YinYangDun,
  BaMen,
  JiuXing,
} from '../types';
import {
  GONG_WUXING,
  TIAN_GAN_WUXING,
  BA_MEN_GONG,
  JIU_XING_GONG,
} from '../data/constants';

/**
 * 格局计算器
 */
export class GeJuCalculator {
  /**
   * 计算所有格局
   */
  static calculate(
    gongs: Record<GongWei, GongInfo>,
    yinYangDun: YinYangDun,
    dayGan: TianGan,
    hourGan: TianGan,
    xunShou: XunShouInfo
  ): GeJuInfo[] {
    const geJuList: GeJuInfo[] = [];

    // 检查各类格局
    geJuList.push(...this.checkSanQiGeJu(gongs));
    geJuList.push(...this.checkJiuDunGeJu(gongs));
    geJuList.push(...this.checkMenPoGeJu(gongs, yinYangDun));
    geJuList.push(...this.checkRuMuGeJu(gongs));
    geJuList.push(...this.checkJiXingGeJu(gongs));
    geJuList.push(...this.checkWuBuYuShiGeJu(dayGan, hourGan));
    geJuList.push(...this.checkFuYinFanYinGeJu(gongs, xunShou));
    geJuList.push(...this.checkQingLongTaoGeJu(gongs));
    geJuList.push(...this.checkBaiHuChangKuangGeJu(gongs));

    return geJuList;
  }

  /**
   * 三奇格局（乙丙丁为三奇）
   */
  private static checkSanQiGeJu(gongs: Record<GongWei, GongInfo>): GeJuInfo[] {
    const results: GeJuInfo[] = [];
    const sanQi: TianGan[] = ['乙', '丙', '丁'];
    const jiMen: BaMen[] = ['开', '休', '生'];

    for (const gong of Object.values(gongs)) {
      // 三奇得使：乙丙丁临开休生三吉门
      if (sanQi.includes(gong.tianPanGan) && jiMen.includes(gong.men)) {
        results.push({
          name: '三奇得使',
          type: '吉格',
          description: `${gong.tianPanGan}奇临${gong.men}门于${gong.gongName}宫`,
          gongs: [gong.gong],
        });
      }

      // 三奇贵人：乙丙丁遇值符
      if (sanQi.includes(gong.tianPanGan) && gong.shen === '符') {
        results.push({
          name: '三奇贵人',
          type: '吉格',
          description: `${gong.tianPanGan}奇遇值符于${gong.gongName}宫`,
          gongs: [gong.gong],
        });
      }
    }

    return results;
  }

  /**
   * 九遁格局
   */
  private static checkJiuDunGeJu(gongs: Record<GongWei, GongInfo>): GeJuInfo[] {
    const results: GeJuInfo[] = [];

    for (const gong of Object.values(gongs)) {
      // 天遁：丙+生门+天心
      if (gong.tianPanGan === '丙' && gong.men === '生' && gong.xing === '心') {
        results.push({
          name: '天遁',
          type: '吉格',
          description: `丙奇临生门天心于${gong.gongName}宫`,
          gongs: [gong.gong],
        });
      }

      // 地遁：乙+开门+地盘己
      if (gong.tianPanGan === '乙' && gong.men === '开' && gong.diPanGan === '己') {
        results.push({
          name: '地遁',
          type: '吉格',
          description: `乙奇临开门遇地盘己于${gong.gongName}宫`,
          gongs: [gong.gong],
        });
      }

      // 人遁：丁+休门+太阴
      if (gong.tianPanGan === '丁' && gong.men === '休' && gong.shen === '阴') {
        results.push({
          name: '人遁',
          type: '吉格',
          description: `丁奇临休门遇太阴于${gong.gongName}宫`,
          gongs: [gong.gong],
        });
      }

      // 神遁：丙+生门+九天
      if (gong.tianPanGan === '丙' && gong.men === '生' && gong.shen === '天') {
        results.push({
          name: '神遁',
          type: '吉格',
          description: `丙奇临生门遇九天于${gong.gongName}宫`,
          gongs: [gong.gong],
        });
      }

      // 鬼遁：乙+生门+九地
      if (gong.tianPanGan === '乙' && gong.men === '生' && gong.shen === '地') {
        results.push({
          name: '鬼遁',
          type: '吉格',
          description: `乙奇临生门遇九地于${gong.gongName}宫`,
          gongs: [gong.gong],
        });
      }

      // 龙遁：乙+休门+六合（合为六合）
      if (gong.tianPanGan === '乙' && gong.men === '休' && gong.shen === '合') {
        results.push({
          name: '龙遁',
          type: '吉格',
          description: `乙奇临休门遇六合于${gong.gongName}宫`,
          gongs: [gong.gong],
        });
      }

      // 虎遁：乙+开门+太阴
      if (gong.tianPanGan === '乙' && gong.men === '开' && gong.shen === '阴') {
        results.push({
          name: '虎遁',
          type: '吉格',
          description: `乙奇临开门遇太阴于${gong.gongName}宫`,
          gongs: [gong.gong],
        });
      }

      // 风遁：乙+开门+天辅
      if (gong.tianPanGan === '乙' && gong.men === '开' && gong.xing === '辅') {
        results.push({
          name: '风遁',
          type: '吉格',
          description: `乙奇临开门天辅于${gong.gongName}宫`,
          gongs: [gong.gong],
        });
      }

      // 云遁：乙+休门+六合+天芮
      if (gong.tianPanGan === '乙' && gong.men === '休' && gong.shen === '合' && gong.xing === '芮') {
        results.push({
          name: '云遁',
          type: '吉格',
          description: `乙奇临休门遇六合天芮于${gong.gongName}宫`,
          gongs: [gong.gong],
        });
      }
    }

    return results;
  }

  /**
   * 门迫格局（凶格）
   */
  private static checkMenPoGeJu(
    gongs: Record<GongWei, GongInfo>,
    yinYangDun: YinYangDun
  ): GeJuInfo[] {
    const results: GeJuInfo[] = [];

    // 门克宫为门迫
    const menWuXing: Record<BaMen, string> = {
      '休': '水',
      '生': '土',
      '伤': '木',
      '杜': '木',
      '景': '火',
      '死': '土',
      '惊': '金',
      '开': '金',
    };

    const keMap: Record<string, string[]> = {
      '木': ['土'],
      '火': ['金'],
      '土': ['水'],
      '金': ['木'],
      '水': ['火'],
    };

    for (const gong of Object.values(gongs)) {
      if (gong.gong === 5) continue; // 中宫跳过

      const menWX = menWuXing[gong.men];
      const gongWX = gong.wuXing;

      // 门克宫
      if (keMap[menWX]?.includes(gongWX)) {
        results.push({
          name: '门迫',
          type: '凶格',
          description: `${gong.men}门克${gong.gongName}宫`,
          gongs: [gong.gong],
        });
      }
    }

    return results;
  }

  /**
   * 入墓格局（凶格）
   */
  private static checkRuMuGeJu(gongs: Record<GongWei, GongInfo>): GeJuInfo[] {
    const results: GeJuInfo[] = [];

    // 天干入墓宫位
    const ganMuGong: Record<string, GongWei> = {
      '甲': 6, // 甲墓在乾（戌）
      '乙': 6, // 乙墓在乾（戌）
      '丙': 6, // 丙墓在乾（戌）
      '丁': 6, // 丁墓在乾（戌）
      '戊': 6, // 戊墓在乾（戌）
      '庚': 2, // 庚墓在坤（丑）
      '辛': 2, // 辛墓在坤（丑）
      '壬': 4, // 壬墓在巽（辰）
      '癸': 4, // 癸墓在巽（辰）
    };

    for (const gong of Object.values(gongs)) {
      const muGong = ganMuGong[gong.tianPanGan];
      if (muGong && gong.gong === muGong) {
        // 三奇入墓尤为严重
        const isSanQi = ['乙', '丙', '丁'].includes(gong.tianPanGan);
        results.push({
          name: isSanQi ? '三奇入墓' : '入墓',
          type: '凶格',
          description: `${gong.tianPanGan}入墓于${gong.gongName}宫`,
          gongs: [gong.gong],
        });
      }
    }

    return results;
  }

  /**
   * 六仪击刑格局（凶格）
   */
  private static checkJiXingGeJu(gongs: Record<GongWei, GongInfo>): GeJuInfo[] {
    const results: GeJuInfo[] = [];

    // 六仪所临刑宫
    const liuYiXingGong: Record<string, GongWei> = {
      '戊': 3, // 戊临震（卯）为击刑
      '己': 8, // 己临艮为击刑（寅）
      '庚': 1, // 庚临坎为击刑（子）
      '辛': 9, // 辛临离为击刑（午）
      '壬': 2, // 壬临坤为击刑
      '癸': 8, // 癸临艮为击刑
    };

    for (const gong of Object.values(gongs)) {
      const xingGong = liuYiXingGong[gong.tianPanGan];
      if (xingGong && gong.gong === xingGong) {
        results.push({
          name: '六仪击刑',
          type: '凶格',
          description: `${gong.tianPanGan}击刑于${gong.gongName}宫`,
          gongs: [gong.gong],
        });
      }
    }

    return results;
  }

  /**
   * 五不遇时（凶格）
   */
  private static checkWuBuYuShiGeJu(dayGan: TianGan, hourGan: TianGan): GeJuInfo[] {
    const results: GeJuInfo[] = [];

    // 日干克时干为五不遇时
    const dayKe = this.getGanKe(dayGan);
    if (dayKe === hourGan) {
      results.push({
        name: '五不遇时',
        type: '凶格',
        description: `日干${dayGan}克时干${hourGan}`,
        gongs: [],
      });
    }

    return results;
  }

  /**
   * 获取天干所克
   */
  private static getGanKe(gan: TianGan): TianGan | null {
    const keMap: Record<TianGan, TianGan> = {
      '甲': '戊',
      '乙': '己',
      '丙': '庚',
      '丁': '辛',
      '戊': '壬',
      '己': '癸',
      '庚': '甲',
      '辛': '乙',
      '壬': '丙',
      '癸': '丁',
    };
    return keMap[gan] || null;
  }

  /**
   * 伏吟/反吟格局
   */
  private static checkFuYinFanYinGeJu(
    gongs: Record<GongWei, GongInfo>,
    xunShou: XunShouInfo
  ): GeJuInfo[] {
    const results: GeJuInfo[] = [];

    // 星门伏吟：值符临本宫
    if (xunShou.zhiFuGong === xunShou.zhiFuLuoGong) {
      results.push({
        name: '星伏吟',
        type: '中性',
        description: '值符星临本宫',
        gongs: [xunShou.zhiFuGong],
      });
    }

    // 门伏吟：值使临本宫
    if (xunShou.zhiShiGong === xunShou.zhiShiLuoGong) {
      results.push({
        name: '门伏吟',
        type: '中性',
        description: '值使门临本宫',
        gongs: [xunShou.zhiShiGong],
      });
    }

    // 天盘地盘相同为伏吟
    let fuYinCount = 0;
    for (const gong of Object.values(gongs)) {
      if (gong.tianPanGan === gong.diPanGan) {
        fuYinCount++;
      }
    }
    if (fuYinCount >= 8) {
      results.push({
        name: '天地伏吟',
        type: '中性',
        description: '天盘地盘干支相同',
        gongs: [],
      });
    }

    return results;
  }

  /**
   * 青龙逃走（吉格）
   */
  private static checkQingLongTaoGeJu(gongs: Record<GongWei, GongInfo>): GeJuInfo[] {
    const results: GeJuInfo[] = [];

    for (const gong of Object.values(gongs)) {
      // 日干临生门逢六合
      if (gong.men === '生' && gong.shen === '合') {
        results.push({
          name: '青龙逃走',
          type: '吉格',
          description: `生门遇六合于${gong.gongName}宫`,
          gongs: [gong.gong],
        });
      }
    }

    return results;
  }

  /**
   * 白虎猖狂（凶格）
   */
  private static checkBaiHuChangKuangGeJu(gongs: Record<GongWei, GongInfo>): GeJuInfo[] {
    const results: GeJuInfo[] = [];

    for (const gong of Object.values(gongs)) {
      // 庚临开门逢白虎
      if (gong.tianPanGan === '庚' && gong.men === '开' && gong.shen === '虎') {
        results.push({
          name: '白虎猖狂',
          type: '凶格',
          description: `庚临开门遇白虎于${gong.gongName}宫`,
          gongs: [gong.gong],
        });
      }
    }

    return results;
  }
}
