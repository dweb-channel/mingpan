/**
 * 奇门遁甲服务
 *
 * 提供奇门遁甲排盘功能，支持时盘和日盘
 * 支持拆补法和茅山法两种置闰算法
 */

import { Lunar, Solar } from 'lunar-javascript';
import type {
  QimenInput,
  QimenResult,
  QimenServiceConfig,
  GongWei,
  GongInfo,
  TianGan,
  DiZhi,
  PanType,
  ZhiRunMethod,
  SiZhuInfo,
  XunShouInfo,
  QimenCalculationError,
} from './types';
import { JuShuCalculator } from './calculators/JuShuCalculator';
import { JiuGongCalculator } from './calculators/JiuGongCalculator';
import { SanQiLiuYiCalculator } from './calculators/SanQiLiuYiCalculator';
import { BaMenCalculator } from './calculators/BaMenCalculator';
import { JiuXingCalculator } from './calculators/JiuXingCalculator';
import { BaShenCalculator } from './calculators/BaShenCalculator';
import { GeJuCalculator } from './calculators/GeJuCalculator';
import {
  GONG_NAMES,
  GONG_WUXING,
  getXunShou,
  getXunKong,
  getLiuYiGan,
  DI_ZHI_GONG,
  MA_XING,
  ZHONG_GONG_JI,
} from './data/constants';

export class QimenService {
  private config: QimenServiceConfig;

  constructor(config: QimenServiceConfig = {}) {
    this.config = config;
  }

  /**
   * 计算奇门遁甲盘
   */
  calculate(input: QimenInput): QimenResult {
    const panType: PanType = input.panType || '时盘';
    const zhiRunMethod: ZhiRunMethod = input.zhiRunMethod || 'chaibu';

    // 1. 处理时间，获取四柱和节气信息
    const { siZhu, jieQi, jieQiDate, solarDate, lunarDate } = this.getTimeInfo(input);

    // 2. 计算局数（阴阳遁 + 上中下元 + 局数）
    const currentDate = new Date(input.year, input.month - 1, input.day);
    const juShuResult = JuShuCalculator.calculate(
      jieQi,
      siZhu.dayGanZhi,
      zhiRunMethod,
      jieQiDate,
      currentDate
    );
    const { yinYangDun, juShu, yuan } = juShuResult;

    // 3. 计算地盘（九宫布局）
    const diPanResult = JiuGongCalculator.calculate(juShu, yinYangDun);

    // 4. 确定用于计算的干支（时盘用时干支，日盘用日干支）
    const refGanZhi = panType === '时盘' ? siZhu.hourGanZhi : siZhu.dayGanZhi;
    const refZhi = panType === '时盘' ? siZhu.hourZhi : siZhu.dayZhi;

    // 5. 计算天盘（三奇六仪飞布）
    const tianPanResult = SanQiLiuYiCalculator.calculate(
      diPanResult.ganGong,
      refGanZhi,
      yinYangDun
    );

    // 6. 计算旬首信息
    const xunShouInfo = this.calculateXunShou(
      refGanZhi,
      diPanResult.ganGong,
      tianPanResult.ganGong,
      refZhi,
      yinYangDun
    );

    // 7. 计算九星
    const jiuXingResult = JiuXingCalculator.calculate(
      xunShouInfo.zhiFuGong,
      refZhi,
      yinYangDun
    );

    // 8. 计算八门
    const baMenResult = BaMenCalculator.calculate(
      xunShouInfo.zhiFuGong,
      refZhi,
      yinYangDun
    );

    // 9. 计算八神
    const baShenResult = BaShenCalculator.calculate(
      jiuXingResult.zhiFuLuoGong,
      yinYangDun
    );

    // 10. 组装九宫信息
    const gongs = this.assembleGongs(
      diPanResult.gongGan,
      tianPanResult.gongGan,
      baMenResult.gongMen,
      jiuXingResult.gongXing,
      baShenResult.gongShen,
      xunShouInfo.kongWang,
      siZhu.dayZhi
    );

    // 11. 计算日干/时干落宫
    const dayGanGong = this.findGanGong(siZhu.dayGan, tianPanResult.ganGong);
    const hourGanGong = this.findGanGong(siZhu.hourGan, tianPanResult.ganGong);

    // 12. 计算格局
    const geJu = GeJuCalculator.calculate(
      gongs,
      yinYangDun,
      siZhu.dayGan,
      siZhu.hourGan,
      xunShouInfo
    );

    // 更新旬首信息中的值符值使落宫
    const fullXunShouInfo: XunShouInfo = {
      ...xunShouInfo,
      zhiFuXing: jiuXingResult.zhiFuXing,
      zhiFuLuoGong: jiuXingResult.zhiFuLuoGong,
      zhiShiMen: baMenResult.zhiShiMen,
      zhiShiLuoGong: baMenResult.zhiShiLuoGong,
    };

    return {
      timeInfo: {
        solarDate,
        lunarDate,
        siZhu,
        jieQi,
      },
      panType,
      zhiRunMethod,
      yinYangDun,
      juShu,
      yuan,
      xunShou: fullXunShouInfo,
      gongs,
      dayGanGong,
      hourGanGong,
      geJu,
    };
  }

  /**
   * 获取时间信息（四柱、节气）
   */
  private getTimeInfo(input: QimenInput): {
    siZhu: SiZhuInfo;
    jieQi: string;
    jieQiDate: Date;
    solarDate: string;
    lunarDate: string;
  } {
    let solar: InstanceType<typeof Solar>;
    let lunar: InstanceType<typeof Lunar>;

    if (input.isLunar) {
      // 农历转公历
      lunar = Lunar.fromYmd(input.year, input.month, input.day);
      solar = lunar.getSolar();
    } else {
      // 公历
      solar = Solar.fromYmd(input.year, input.month, input.day);
      lunar = solar.getLunar();
    }

    // 使用 Solar 获取精确时辰信息
    const hour = input.hour;
    const solarWithTime = Solar.fromYmdHms(
      solar.getYear(),
      solar.getMonth(),
      solar.getDay(),
      hour,
      input.minute || 0,
      0
    );
    const lunarWithTime = solarWithTime.getLunar();

    // 使用 EightChar 获取精确四柱
    const eightChar = lunarWithTime.getEightChar();
    const yearGanZhi = eightChar.getYear();
    const monthGanZhi = eightChar.getMonth();
    const dayGanZhi = eightChar.getDay();
    const hourGanZhi = eightChar.getTime();

    const siZhu: SiZhuInfo = {
      yearGanZhi,
      monthGanZhi,
      dayGanZhi,
      hourGanZhi,
      dayGan: dayGanZhi[0] as TianGan,
      dayZhi: dayGanZhi[1] as DiZhi,
      hourGan: hourGanZhi[0] as TianGan,
      hourZhi: hourGanZhi[1] as DiZhi,
    };

    // 获取节气
    const prevJieQi = lunarWithTime.getPrevJieQi();
    const jieQi = prevJieQi ? prevJieQi.getName() : '冬至';
    const jieQiSolar = prevJieQi ? prevJieQi.getSolar() : solar;
    const jieQiDate = new Date(
      jieQiSolar.getYear(),
      jieQiSolar.getMonth() - 1,
      jieQiSolar.getDay()
    );

    // 格式化日期
    const solarDate = `${solar.getYear()}年${solar.getMonth()}月${solar.getDay()}日`;
    const lunarDate = `${lunar.getMonthInChinese()}月${lunar.getDayInChinese()}`;

    return { siZhu, jieQi, jieQiDate, solarDate, lunarDate };
  }

  /**
   * 计算旬首信息
   */
  private calculateXunShou(
    refGanZhi: string,
    diPanGanGong: Record<TianGan, GongWei>,
    tianPanGanGong: Record<TianGan, GongWei>,
    refZhi: DiZhi,
    yinYangDun: '阳遁' | '阴遁'
  ): XunShouInfo {
    // 获取旬首
    const xunShou = getXunShou(refGanZhi);
    const fuTou = xunShou; // 符头就是旬首

    // 获取旬首对应的六仪（遁甲干）
    const liuYiGan = getLiuYiGan(xunShou);

    // 值符星原始宫位 = 旬首遁干在地盘的宫位
    let zhiFuGong = diPanGanGong[liuYiGan];
    if (zhiFuGong === 5) {
      zhiFuGong = ZHONG_GONG_JI; // 中宫寄坤二
    }

    // 值使门原始宫位 = 值符星原始宫位
    const zhiShiGong = zhiFuGong;

    // 获取空亡
    const kongWang = getXunKong(xunShou);

    return {
      xunShou,
      fuTou,
      zhiFuXing: '蓬', // 占位，后续由 JiuXingCalculator 计算
      zhiFuGong,
      zhiFuLuoGong: zhiFuGong, // 占位，后续更新
      zhiShiMen: '休', // 占位，后续由 BaMenCalculator 计算
      zhiShiGong,
      zhiShiLuoGong: zhiShiGong, // 占位，后续更新
      kongWang,
    };
  }

  /**
   * 组装九宫完整信息
   */
  private assembleGongs(
    diPanGan: Record<GongWei, TianGan>,
    tianPanGan: Record<GongWei, TianGan>,
    gongMen: Record<GongWei, import('./types').BaMen>,
    gongXing: Record<GongWei, import('./types').JiuXing>,
    gongShen: Record<GongWei, import('./types').BaShen>,
    kongWang: [DiZhi, DiZhi],
    dayZhi: DiZhi
  ): Record<GongWei, GongInfo> {
    const gongs: Record<GongWei, GongInfo> = {} as Record<GongWei, GongInfo>;

    // 获取马星地支
    const maZhi = MA_XING[dayZhi];
    const maGong = DI_ZHI_GONG[maZhi];

    for (let g = 1; g <= 9; g++) {
      const gong = g as GongWei;

      // 检查是否空亡（根据地支判断）
      const gongDiZhi = this.getGongDiZhi(gong);
      const isKong = kongWang.includes(gongDiZhi);

      // 检查是否马星
      const isMa = gong === maGong;

      gongs[gong] = {
        gong,
        gongName: GONG_NAMES[gong],
        diPanGan: diPanGan[gong],
        tianPanGan: tianPanGan[gong],
        men: gongMen[gong],
        xing: gongXing[gong],
        shen: gongShen[gong],
        wuXing: GONG_WUXING[gong],
        isKong,
        isMa,
      };
    }

    return gongs;
  }

  /**
   * 获取宫位对应的地支
   */
  private getGongDiZhi(gong: GongWei): DiZhi {
    const gongDiZhiMap: Record<GongWei, DiZhi> = {
      1: '子',
      2: '未', // 坤宫对应未申，取未
      3: '卯',
      4: '辰', // 巽宫对应辰巳，取辰
      5: '未', // 中宫寄坤二
      6: '戌', // 乾宫对应戌亥，取戌
      7: '酉',
      8: '丑', // 艮宫对应丑寅，取丑
      9: '午',
    };
    return gongDiZhiMap[gong];
  }

  /**
   * 根据天干找落宫
   * 注意：甲遁于六仪之下，需要根据旬首找对应的六仪
   */
  private findGanGong(gan: TianGan, ganGong: Record<TianGan, GongWei>): GongWei {
    let actualGan = gan;

    // 甲遁于六仪之下，需要根据日/时干支找旬首
    if (gan === '甲') {
      // 甲遁戊，直接用戊找落宫
      actualGan = '戊';
    }

    const gong = ganGong[actualGan];
    if (gong === undefined) {
      return ZHONG_GONG_JI; // 默认返回坤二
    }
    return gong === 5 ? ZHONG_GONG_JI : gong;
  }
}
