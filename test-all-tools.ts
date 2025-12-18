#!/usr/bin/env npx ts-node
/**
 * 完整功能测试脚本
 * 测试命主：公历1992年4月12日 07:30 男
 */

import { BaziService } from './src/services/bazi/BaziService';
import { ZiweiService } from './src/services/ziwei/ZiweiService';
import { LiuNianCalculator } from './src/services/bazi/calculators/LiuNianCalculator';
import { DaYunCalculator } from './src/services/bazi/calculators/DaYunCalculator';
import { LuckCycleCalculator } from './src/services/bazi/calculators/LuckCycleCalculator';
import { LiuYueCalculator } from './src/services/bazi/calculators/LiuYueCalculator';
import { LiuRiCalculator } from './src/services/bazi/calculators/LiuRiCalculator';
import { YearlyCalculator } from './src/services/ziwei/calculators/YearlyCalculator';
import { renderBaziText, renderZiweiText } from './src/output/fortuneTextRenderer';
import {
  renderBaziDaYunList,
  renderBaziLiuNianList,
  renderBaziLiuYueList,
  renderBaziLiuRiList,
  renderZiweiDaXianList,
  renderZiweiLiuNianList,
  renderZiweiLiuYueList,
  renderZiweiLiuRiList,
  ZiweiDailyInfo
} from './src/output/listTextRenderer';
import { PALACE_NAMES } from './src/services/ziwei/types';
import { Lunar } from 'lunar-javascript';

// 测试命主信息
const BIRTH_INFO = {
  year: 1992,
  month: 4,
  day: 12,
  hour: 7,
  minute: 30,
  gender: 'male' as const,
  name: '测试命主'
};

// Helper functions
function getYearStemBranch(year: number): { stem: string; branch: string } {
  const STEMS = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
  const BRANCHES = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
  const baseYear = 1984;
  const yearDiff = year - baseYear;
  const stemIndex = ((yearDiff % 10) + 10) % 10;
  const branchIndex = ((yearDiff % 12) + 12) % 12;
  return { stem: STEMS[stemIndex], branch: BRANCHES[branchIndex] };
}

function getMonthStemBranch(year: number, monthNum: number): { stem: string; branch: string } {
  const STEMS = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
  const BRANCHES = ['寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥', '子', '丑'];
  const branch = BRANCHES[(monthNum - 1) % 12];
  const { stem: yearStem } = getYearStemBranch(year);
  const yearStemIndex = STEMS.indexOf(yearStem);
  const firstMonthStemMap: Record<number, number> = {
    0: 2, 1: 4, 2: 6, 3: 8, 4: 0, 5: 2, 6: 4, 7: 6, 8: 8, 9: 0
  };
  const firstMonthStemIndex = firstMonthStemMap[yearStemIndex];
  const monthStemIndex = (firstMonthStemIndex + monthNum - 1) % 10;
  return { stem: STEMS[monthStemIndex], branch };
}

async function main() {
  console.log('=' .repeat(60));
  console.log('MingPan MCP 全功能测试');
  console.log('=' .repeat(60));
  console.log(`\n测试命主：${BIRTH_INFO.name}`);
  console.log(`出生：${BIRTH_INFO.year}年${BIRTH_INFO.month}月${BIRTH_INFO.day}日 ${BIRTH_INFO.hour}:${BIRTH_INFO.minute}`);
  console.log(`性别：${BIRTH_INFO.gender === 'male' ? '男' : '女'}`);
  console.log('');

  const baziService = new BaziService({ debug: false });
  const ziweiService = new ZiweiService();

  // ============================================================
  // 1. calculate_bazi - 八字命盘计算
  // ============================================================
  console.log('\n' + '='.repeat(60));
  console.log('【1】calculate_bazi - 八字命盘计算');
  console.log('='.repeat(60));

  const baziResult = await baziService.calculate({
    year: BIRTH_INFO.year,
    month: BIRTH_INFO.month,
    day: BIRTH_INFO.day,
    hour: BIRTH_INFO.hour,
    minute: BIRTH_INFO.minute,
    gender: BIRTH_INFO.gender,
  });

  const birthDate = new Date(BIRTH_INFO.year, BIRTH_INFO.month - 1, BIRTH_INFO.day, BIRTH_INFO.hour, BIRTH_INFO.minute);
  const baziText = renderBaziText(
    { bazi: baziResult, gender: BIRTH_INFO.gender, birthDate },
    { detail: 'standard' }
  );
  console.log(baziText);

  // ============================================================
  // 2. calculate_ziwei - 紫微命盘计算
  // ============================================================
  console.log('\n' + '='.repeat(60));
  console.log('【2】calculate_ziwei - 紫微命盘计算');
  console.log('='.repeat(60));

  const ziweiResult = ziweiService.calculate({
    year: BIRTH_INFO.year,
    month: BIRTH_INFO.month,
    day: BIRTH_INFO.day,
    hour: BIRTH_INFO.hour,
    gender: BIRTH_INFO.gender,
  });

  const ziweiText = renderZiweiText(
    { ziwei: ziweiResult, gender: BIRTH_INFO.gender, birthDate },
    { detail: 'standard' }
  );
  console.log(ziweiText);

  // ============================================================
  // 3. bazi_dayun_list - 八字大运列表
  // ============================================================
  console.log('\n' + '='.repeat(60));
  console.log('【3】bazi_dayun_list - 八字大运列表');
  console.log('='.repeat(60));

  if (baziResult.chart && baziResult.birthInfo) {
    const daYunList = DaYunCalculator.calculate(
      baziResult.chart,
      baziResult.birthInfo,
      BIRTH_INFO.gender,
      { startYear: BIRTH_INFO.year, endYear: BIRTH_INFO.year + 100 }
    );

    const direction = LuckCycleCalculator.calLuckySequence(BIRTH_INFO.gender, baziResult.chart.year.stem) === 'forward' ? '顺行' : '逆行';
    const startAge = daYunList.length > 0 ? daYunList[0].startAge : 1;
    const startYear = BIRTH_INFO.year + startAge - 1;

    const dayunText = renderBaziDaYunList(daYunList.slice(0, 10), {
      name: BIRTH_INFO.name,
      birthYear: BIRTH_INFO.year,
      birthMonth: BIRTH_INFO.month,
      birthDay: BIRTH_INFO.day,
      birthHour: BIRTH_INFO.hour,
      birthMinute: BIRTH_INFO.minute,
      gender: BIRTH_INFO.gender,
      dayMaster: baziResult.chart.day.stem,
      direction,
      startAge,
      startYear,
    });
    console.log(dayunText);
  }

  // ============================================================
  // 4. bazi_liunian_list - 八字流年列表
  // ============================================================
  console.log('\n' + '='.repeat(60));
  console.log('【4】bazi_liunian_list - 八字流年列表 (2020-2030)');
  console.log('='.repeat(60));

  if (baziResult.chart) {
    const liuNianList = LiuNianCalculator.calculate(
      baziResult.chart,
      BIRTH_INFO.year,
      2020,
      2030
    );

    const liunianText = renderBaziLiuNianList(liuNianList, {
      name: BIRTH_INFO.name,
      birthYear: BIRTH_INFO.year,
      birthMonth: BIRTH_INFO.month,
      birthDay: BIRTH_INFO.day,
      birthHour: BIRTH_INFO.hour,
      birthMinute: BIRTH_INFO.minute,
      gender: BIRTH_INFO.gender,
      dayMaster: baziResult.chart.day.stem,
      startYear: 2020,
      endYear: 2030,
    });
    console.log(liunianText);
  }

  // ============================================================
  // 5. bazi_liuyue_list - 八字流月列表（干支月/节气月）
  // ============================================================
  console.log('\n' + '='.repeat(60));
  console.log('【5】bazi_liuyue_list - 八字流月列表 (2025年/乙巳年)');
  console.log('='.repeat(60));

  if (baziResult.chart) {
    const gregorianYear = 2025;
    const { stem: yearStem, branch: yearBranch } = getYearStemBranch(gregorianYear);
    const ganzhiYear = yearStem + yearBranch;

    const liuyueCalculator = new LiuYueCalculator();
    const liuYueList = liuyueCalculator.calculateLiuYue(
      yearStem as any,
      yearBranch as any,
      (baziResult.basic?.dayMasterElement || '木') as any,
      (baziResult.traditional?.yongShen?.yongShen || []) as any,
      {
        year: BIRTH_INFO.year,
        month: BIRTH_INFO.month,
        day: BIRTH_INFO.day,
        hour: BIRTH_INFO.hour,
        minute: BIRTH_INFO.minute,
      },
      gregorianYear
    );

    const liuyueText = renderBaziLiuYueList(liuYueList, {
      name: BIRTH_INFO.name,
      birthYear: BIRTH_INFO.year,
      birthMonth: BIRTH_INFO.month,
      birthDay: BIRTH_INFO.day,
      birthHour: BIRTH_INFO.hour,
      birthMinute: BIRTH_INFO.minute,
      gender: BIRTH_INFO.gender,
      dayMaster: baziResult.chart.day.stem,
      ganzhiYear,
      gregorianYear,
    });
    console.log(liuyueText);
  }

  // ============================================================
  // 6. bazi_liuri_list - 八字流日列表
  // ============================================================
  console.log('\n' + '='.repeat(60));
  console.log('【6】bazi_liuri_list - 八字流日列表 (2025年寅月/丙寅月)');
  console.log('='.repeat(60));

  if (baziResult.chart) {
    const gregorianYear = 2025;
    const monthNum = 1; // 寅月
    const { stem: yearStem, branch: yearBranch } = getYearStemBranch(gregorianYear);
    const { stem: monthStem, branch: monthBranch } = getMonthStemBranch(gregorianYear, monthNum);
    const ganzhiYear = yearStem + yearBranch;

    const liuriCalculator = new LiuRiCalculator();
    const liuRiList = liuriCalculator.calculateLiuRi(
      monthStem as any,
      monthBranch as any,
      yearStem as any,
      yearBranch as any,
      (baziResult.basic?.dayMasterElement || '木') as any,
      (baziResult.traditional?.yongShen?.yongShen || []) as any,
      gregorianYear,
      monthNum
    );

    const startDate = liuRiList.length > 0 ? liuRiList[0].date : new Date();
    const endDate = liuRiList.length > 0 ? liuRiList[liuRiList.length - 1].date : new Date();

    const liuriText = renderBaziLiuRiList(liuRiList, {
      name: BIRTH_INFO.name,
      birthYear: BIRTH_INFO.year,
      birthMonth: BIRTH_INFO.month,
      birthDay: BIRTH_INFO.day,
      birthHour: BIRTH_INFO.hour,
      birthMinute: BIRTH_INFO.minute,
      gender: BIRTH_INFO.gender,
      dayMaster: baziResult.chart.day.stem,
      ganzhiMonth: monthStem + monthBranch,
      ganzhiYear,
      gregorianYear,
      startDate,
      endDate,
    });
    console.log(liuriText);
  }

  // ============================================================
  // 7. ziwei_daxian_list - 紫微大限列表
  // ============================================================
  console.log('\n' + '='.repeat(60));
  console.log('【7】ziwei_daxian_list - 紫微大限列表');
  console.log('='.repeat(60));

  if (ziweiResult.decades && ziweiResult.decades.length > 0) {
    const yangStems = ['甲', '丙', '戊', '庚', '壬'];
    const yearStem = ziweiResult.basicInfo?.fourPillars?.year?.stem || '';
    const isYang = yangStems.includes(yearStem);
    const isMale = BIRTH_INFO.gender === 'male';
    const direction = ((isYang && isMale) || (!isYang && !isMale)) ? '顺行' : '逆行';

    const mingGongPalace = ziweiResult.palaces?.find(p =>
      p.name === '命宮' || p.name === '命宫' || p.name === 'Life'
    );
    const mingGongStars = mingGongPalace?.majorStars?.map(s =>
      typeof s === 'string' ? s : s.name
    ) || [];

    const daxianText = renderZiweiDaXianList(ziweiResult.decades.slice(0, 10), {
      name: BIRTH_INFO.name,
      birthYear: BIRTH_INFO.year,
      birthMonth: BIRTH_INFO.month,
      birthDay: BIRTH_INFO.day,
      birthHour: BIRTH_INFO.hour,
      gender: BIRTH_INFO.gender,
      mingGong: mingGongPalace?.name || '命宮',
      mingGongStars,
      direction: direction as '顺行' | '逆行',
    });
    console.log(daxianText);
  }

  // ============================================================
  // 8. ziwei_liunian_list - 紫微流年列表
  // ============================================================
  console.log('\n' + '='.repeat(60));
  console.log('【8】ziwei_liunian_list - 紫微流年列表 (2020-2030)');
  console.log('='.repeat(60));

  if (ziweiResult.palaces) {
    const yearlyList = [];
    for (let year = 2020; year <= 2030; year++) {
      const yearly = YearlyCalculator.calculate(year, BIRTH_INFO.year, ziweiResult.palaces);
      if (yearly) {
        yearlyList.push(yearly);
      }
    }

    const mingGongPalace = ziweiResult.palaces?.find(p =>
      p.name === '命宮' || p.name === '命宫' || p.name === 'Life'
    );
    const mingGongStars = mingGongPalace?.majorStars?.map(s =>
      typeof s === 'string' ? s : s.name
    ) || [];

    const liunianText = renderZiweiLiuNianList(yearlyList, {
      name: BIRTH_INFO.name,
      birthYear: BIRTH_INFO.year,
      birthMonth: BIRTH_INFO.month,
      birthDay: BIRTH_INFO.day,
      birthHour: BIRTH_INFO.hour,
      gender: BIRTH_INFO.gender,
      mingGong: mingGongPalace?.name || '命宮',
      mingGongStars,
      startYear: 2020,
      endYear: 2030,
    });
    console.log(liunianText);
  }

  // ============================================================
  // 9. ziwei_liuyue_list - 紫微流月列表（农历月）
  // ============================================================
  console.log('\n' + '='.repeat(60));
  console.log('【9】ziwei_liuyue_list - 紫微流月列表 (农历2025年)');
  console.log('='.repeat(60));

  const lunarYear = 2025;
  const monthlyList = ziweiService.getYearlyMonths(lunarYear);

  const mingGongPalace = ziweiResult.palaces?.find(p =>
    p.name === '命宮' || p.name === '命宫' || p.name === 'Life'
  );
  const mingGongStars = mingGongPalace?.majorStars?.map(s =>
    typeof s === 'string' ? s : s.name
  ) || [];

  const liuyueZiweiText = renderZiweiLiuYueList(monthlyList, {
    name: BIRTH_INFO.name,
    birthYear: BIRTH_INFO.year,
    birthMonth: BIRTH_INFO.month,
    birthDay: BIRTH_INFO.day,
    birthHour: BIRTH_INFO.hour,
    gender: BIRTH_INFO.gender,
    mingGong: mingGongPalace?.name || '命宮',
    mingGongStars,
    lunarYear,
    gregorianYear: lunarYear,
  });
  console.log(liuyueZiweiText);

  // ============================================================
  // 10. ziwei_liuri_list - 紫微流日列表（农历日）
  // ============================================================
  console.log('\n' + '='.repeat(60));
  console.log('【10】ziwei_liuri_list - 紫微流日列表 (农历2025年正月)');
  console.log('='.repeat(60));

  const lunarMonth = 1; // 正月
  const isLeapMonth = false;

  // Get lunar month boundaries
  const monthParam = isLeapMonth ? -lunarMonth : lunarMonth;
  const lunarFirstDay = Lunar.fromYmd(lunarYear, monthParam, 1);

  // Find last day of the month
  let lastDayNum = 29;
  try {
    Lunar.fromYmd(lunarYear, monthParam, 30);
    lastDayNum = 30;
  } catch {
    // Month only has 29 days
  }
  const lunarLastDay = Lunar.fromYmd(lunarYear, monthParam, lastDayNum);

  // Convert to solar dates
  const firstSolar = lunarFirstDay.getSolar();
  const lastSolar = lunarLastDay.getSolar();
  const startDate = new Date(firstSolar.getYear(), firstSolar.getMonth() - 1, firstSolar.getDay());
  const endDate = new Date(lastSolar.getYear(), lastSolar.getMonth() - 1, lastSolar.getDay());

  // Build daily list
  const dailyList: ZiweiDailyInfo[] = [];
  for (let day = 1; day <= lastDayNum; day++) {
    try {
      const lunarDay = Lunar.fromYmd(lunarYear, monthParam, day);
      const solarDay = lunarDay.getSolar();
      const solarDate = new Date(solarDay.getYear(), solarDay.getMonth() - 1, solarDay.getDay());

      const dailyInfo = ziweiService.getDailyInfo(
        solarDay.getYear(),
        solarDay.getMonth(),
        solarDay.getDay()
      );

      dailyList.push({
        lunarMonth,
        lunarDay: day,
        isLeapMonth,
        gregorianDate: solarDate,
        ganzhi: dailyInfo ? `${dailyInfo.heavenlyStem}${dailyInfo.earthlyBranch}` : '',
        palaceIndex: dailyInfo?.palaceIndex || 0,
      });
    } catch (e) {
      // Skip invalid dates
    }
  }

  const monthlyInfo = ziweiService.getMonthlyInfo(
    lunarYear,
    lunarMonth - 1,
    lunarMonth,
    isLeapMonth
  );
  const monthlyPalace = monthlyInfo ? PALACE_NAMES[monthlyInfo.palaceIndex] : undefined;

  const liuriZiweiText = renderZiweiLiuRiList(dailyList, {
    name: BIRTH_INFO.name,
    birthYear: BIRTH_INFO.year,
    birthMonth: BIRTH_INFO.month,
    birthDay: BIRTH_INFO.day,
    birthHour: BIRTH_INFO.hour,
    gender: BIRTH_INFO.gender,
    mingGong: mingGongPalace?.name || '命宮',
    mingGongStars,
    lunarYear,
    lunarMonth,
    isLeapMonth,
    gregorianStartDate: startDate,
    gregorianEndDate: endDate,
    monthlyPalace,
  });
  console.log(liuriZiweiText);

  // ============================================================
  // 完成
  // ============================================================
  console.log('\n' + '='.repeat(60));
  console.log('✅ 全部 10 个功能测试完成');
  console.log('='.repeat(60));
}

main().catch(console.error);
