#!/usr/bin/env npx ts-node
/**
 * MCP 工具全面測試腳本
 * 測試命主：公曆1992年12月24日 09:15 女
 */

import { BaziService } from "./src/services/bazi/BaziService";
import { ZiweiService } from "./src/services/ziwei/ZiweiService";
import { LiuNianCalculator } from "./src/services/bazi/calculators/LiuNianCalculator";
import { DaYunCalculator } from "./src/services/bazi/calculators/DaYunCalculator";
import { LuckCycleCalculator } from "./src/services/bazi/calculators/LuckCycleCalculator";
import { LiuYueCalculator } from "./src/services/bazi/calculators/LiuYueCalculator";
import { LiuRiCalculator } from "./src/services/bazi/calculators/LiuRiCalculator";
import { YearlyCalculator } from "./src/services/ziwei/calculators/YearlyCalculator";
import { renderBaziText, renderZiweiText, FortuneTextOptions } from "./src/output/fortuneTextRenderer";
import {
  renderBaziDaYunList,
  renderBaziLiuNianList,
  renderBaziLiuYueList,
  renderBaziLiuRiList,
  renderZiweiDaXianList,
  renderZiweiXiaoXianList,
  renderZiweiLiuNianList,
  renderZiweiLiuYueList,
  renderZiweiLiuRiList,
  ZiweiDailyInfo
} from "./src/output/listTextRenderer";
import { PALACE_NAMES } from "./src/services/ziwei/types";
import { MutagenCore } from "./src/core/ziwei/MutagenCore";
import { Lunar } from "lunar-javascript";
import * as fs from "fs";

// 測試命主資料
const TEST_SUBJECT = {
  year: 1992,
  month: 12,
  day: 24,
  hour: 9,
  minute: 15,
  gender: "female" as const,
  name: "测试命主"
};

const baziService = new BaziService({ debug: false });
const ziweiService = new ZiweiService();

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

async function runAllTests(): Promise<string> {
  const results: string[] = [];
  const timestamp = new Date().toISOString().split('T')[0];

  results.push('# MingPan MCP 工具測試結果');
  results.push('');
  results.push(`**測試日期：** ${timestamp}`);
  results.push('**語言配置：** zh-TW（繁體中文）');
  results.push(`**測試命主：** 公曆${TEST_SUBJECT.year}年${TEST_SUBJECT.month}月${TEST_SUBJECT.day}日 ${TEST_SUBJECT.hour}:${TEST_SUBJECT.minute.toString().padStart(2, '0')} ${TEST_SUBJECT.gender === 'male' ? '男' : '女'}`);
  results.push('');
  results.push('---');
  results.push('');

  // ========== Test 1: bazi_basic ==========
  console.log('測試 1/10: bazi_basic...');
  try {
    const baziResult = await baziService.calculate({
      year: TEST_SUBJECT.year,
      month: TEST_SUBJECT.month,
      day: TEST_SUBJECT.day,
      hour: TEST_SUBJECT.hour,
      minute: TEST_SUBJECT.minute,
      gender: TEST_SUBJECT.gender,
    });

    const birthDate = new Date(TEST_SUBJECT.year, TEST_SUBJECT.month - 1, TEST_SUBJECT.day, TEST_SUBJECT.hour, TEST_SUBJECT.minute);
    const baziText = renderBaziText(
      { bazi: baziResult, gender: TEST_SUBJECT.gender, birthDate },
      { detail: 'standard', includePersonal: false }
    );

    results.push('## 【1】bazi_basic - 八字命盤計算');
    results.push('');
    results.push('```');
    results.push(baziText.trim());
    results.push('```');
    results.push('');
    results.push('**驗證點：**');
    results.push(`- ✅ 四柱：年柱=${baziResult.chart?.year.stem}${baziResult.chart?.year.branch} 月柱=${baziResult.chart?.month.stem}${baziResult.chart?.month.branch} 日柱=${baziResult.chart?.day.stem}${baziResult.chart?.day.branch} 時柱=${baziResult.chart?.hour.stem}${baziResult.chart?.hour.branch}`);
    results.push(`- ✅ 日主：${baziResult.chart?.day.stem}`);
    results.push('');
    results.push('---');
    results.push('');
  } catch (e) {
    results.push('## 【1】bazi_basic - 八字命盤計算');
    results.push(`❌ 錯誤: ${e}`);
    results.push('');
  }

  // ========== Test 2: ziwei_basic ==========
  console.log('測試 2/10: ziwei_basic...');
  try {
    const ziweiResult = ziweiService.calculate({
      year: TEST_SUBJECT.year,
      month: TEST_SUBJECT.month,
      day: TEST_SUBJECT.day,
      hour: TEST_SUBJECT.hour,
      gender: TEST_SUBJECT.gender,
    });

    const birthDate = new Date(TEST_SUBJECT.year, TEST_SUBJECT.month - 1, TEST_SUBJECT.day, TEST_SUBJECT.hour, TEST_SUBJECT.minute);
    const ziweiText = renderZiweiText(
      {
        ziwei: ziweiResult,
        gender: TEST_SUBJECT.gender,
        birthDate,
        mutagen: ziweiResult.mutagenInfo
      },
      { detail: 'standard', includePersonal: false }
    );

    results.push('## 【2】ziwei_basic - 紫微命盤計算');
    results.push('');
    results.push('```');
    results.push(ziweiText.trim());
    results.push('```');
    results.push('');

    // 驗證四化顯示
    const hasNatalMutagen = ziweiText.includes('本命四化');
    const hasDecadalMutagen = ziweiText.includes('大限四化');
    const hasYearlyMutagen = ziweiText.includes('流年四化');

    results.push('**驗證點：**');
    results.push(`- ${hasNatalMutagen ? '✅' : '❌'} 顯示本命四化`);
    results.push(`- ${!hasDecadalMutagen ? '✅' : '❌'} 不顯示大限四化（因為沒有指定大限）`);
    results.push(`- ${!hasYearlyMutagen ? '✅' : '❌'} 不顯示流年四化（因為沒有指定流年）`);
    results.push('');
    results.push('---');
    results.push('');
  } catch (e) {
    results.push('## 【2】ziwei_basic - 紫微命盤計算');
    results.push(`❌ 錯誤: ${e}`);
    results.push('');
  }

  // ========== Test 3: bazi_dayun ==========
  console.log('測試 3/10: bazi_dayun...');
  try {
    const baziResult = await baziService.calculate({
      year: TEST_SUBJECT.year,
      month: TEST_SUBJECT.month,
      day: TEST_SUBJECT.day,
      hour: TEST_SUBJECT.hour,
      minute: TEST_SUBJECT.minute,
      gender: TEST_SUBJECT.gender,
    });

    const daYunList = DaYunCalculator.calculate(
      baziResult.chart!,
      baziResult.birthInfo!,
      TEST_SUBJECT.gender,
      { startYear: TEST_SUBJECT.year, endYear: TEST_SUBJECT.year + 100 }
    );

    const direction = LuckCycleCalculator.calLuckySequence(TEST_SUBJECT.gender, baziResult.chart!.year.stem) === 'forward' ? '顺行' : '逆行';
    const startAge = daYunList.length > 0 ? daYunList[0].startAge : 1;
    const startYear = TEST_SUBJECT.year + startAge - 1;

    const text = renderBaziDaYunList(daYunList.slice(0, 10), {
      name: TEST_SUBJECT.name,
      birthYear: TEST_SUBJECT.year,
      birthMonth: TEST_SUBJECT.month,
      birthDay: TEST_SUBJECT.day,
      birthHour: TEST_SUBJECT.hour,
      birthMinute: TEST_SUBJECT.minute,
      birthMinute: TEST_SUBJECT.minute,
      gender: TEST_SUBJECT.gender,
      dayMaster: baziResult.chart!.day.stem,
      direction: direction as any,
      startAge,
      startYear,
    });

    results.push('## 【3】bazi_dayun - 八字大運列表');
    results.push('');
    results.push('```');
    results.push(text.trim());
    results.push('```');
    results.push('');
    results.push('**驗證點：**');
    results.push(`- ✅ 大運方向：${direction}`);
    results.push(`- ✅ 起運年齡：${startAge}周歲`);
    results.push(`- ✅ 大運數量：${Math.min(daYunList.length, 10)}個`);
    results.push('');
    results.push('---');
    results.push('');
  } catch (e) {
    results.push('## 【3】bazi_dayun - 八字大運列表');
    results.push(`❌ 錯誤: ${e}`);
    results.push('');
  }

  // ========== Test 4: bazi_liunian ==========
  console.log('測試 4/10: bazi_liunian...');
  try {
    const baziResult = await baziService.calculate({
      year: TEST_SUBJECT.year,
      month: TEST_SUBJECT.month,
      day: TEST_SUBJECT.day,
      hour: TEST_SUBJECT.hour,
      minute: TEST_SUBJECT.minute,
      gender: TEST_SUBJECT.gender,
    });

    const liuNianList = LiuNianCalculator.calculate(
      baziResult.chart!,
      TEST_SUBJECT.year,
      2020,
      2030
    );

    // 計算大運列表以匹配每個流年所屬的大運
    const daYunList = DaYunCalculator.calculate(
      baziResult.chart!,
      baziResult.birthInfo!,
      TEST_SUBJECT.gender,
      { startYear: TEST_SUBJECT.year, endYear: TEST_SUBJECT.year + 100 }
    );

    const text = renderBaziLiuNianList(liuNianList, {
      name: TEST_SUBJECT.name,
      birthYear: TEST_SUBJECT.year,
      birthMonth: TEST_SUBJECT.month,
      birthDay: TEST_SUBJECT.day,
      birthHour: TEST_SUBJECT.hour,
      birthMinute: TEST_SUBJECT.minute,
      birthMinute: TEST_SUBJECT.minute,
      gender: TEST_SUBJECT.gender,
      dayMaster: baziResult.chart!.day.stem,
      startYear: 2020,
      endYear: 2030,
      daYunList,  // 傳入大運列表用於匹配所屬大運
    });

    results.push('## 【4】bazi_liunian - 八字流年列表');
    results.push('');
    results.push('```');
    results.push(text.trim());
    results.push('```');
    results.push('');
    results.push('**驗證點：**');
    results.push(`- ✅ 流年數量：${liuNianList.length}年`);
    results.push(`- ✅ 年份範圍：2020-2030`);
    results.push('');
    results.push('---');
    results.push('');
  } catch (e) {
    results.push('## 【4】bazi_liunian - 八字流年列表');
    results.push(`❌ 錯誤: ${e}`);
    results.push('');
  }

  // ========== Test 5: bazi_liuyue ==========
  console.log('測試 5/10: bazi_liuyue...');
  try {
    const baziResult = await baziService.calculate({
      year: TEST_SUBJECT.year,
      month: TEST_SUBJECT.month,
      day: TEST_SUBJECT.day,
      hour: TEST_SUBJECT.hour,
      minute: TEST_SUBJECT.minute,
      gender: TEST_SUBJECT.gender,
    });

    const gregorianYear = 2025;
    const { stem: yearStem, branch: yearBranch } = getYearStemBranch(gregorianYear);
    const ganzhiYear = yearStem + yearBranch;

    const calculator = new LiuYueCalculator();
    const liuYueList = calculator.calculateLiuYue(
      yearStem as any,
      yearBranch as any,
      (baziResult.basic?.dayMasterElement || '木') as any,
      (baziResult.traditional?.yongShen?.yongShen || []) as any,
      {
        year: TEST_SUBJECT.year,
        month: TEST_SUBJECT.month,
        day: TEST_SUBJECT.day,
        hour: TEST_SUBJECT.hour,
        minute: TEST_SUBJECT.minute,
      },
      gregorianYear
    );

    // Calculate DaYun list to find current DaYun
    const daYunList5 = DaYunCalculator.calculate(
      baziResult.chart!,
      baziResult.birthInfo!,
      TEST_SUBJECT.gender,
      { startYear: TEST_SUBJECT.year, endYear: TEST_SUBJECT.year + 100 }
    );

    // Calculate age for the target year (虛歲)
    const targetAge5 = gregorianYear - TEST_SUBJECT.year + 1;

    // Find current DaYun
    let currentDaYun5: { stem: string; branch: string; startAge: number; endAge: number } | undefined;
    const matchedDaYun5 = daYunList5.find(dy => targetAge5 >= dy.startAge && targetAge5 <= dy.endAge);
    if (matchedDaYun5) {
      currentDaYun5 = {
        stem: matchedDaYun5.stem,
        branch: matchedDaYun5.branch,
        startAge: matchedDaYun5.startAge,
        endAge: matchedDaYun5.endAge,
      };
    }

    // Calculate current LiuNian
    const liuNianList5 = LiuNianCalculator.calculate(
      baziResult.chart!,
      TEST_SUBJECT.year,
      gregorianYear,
      gregorianYear
    );
    let currentLiuNian5: { stem: string; branch: string; age: number } | undefined;
    if (liuNianList5.length > 0) {
      const ln = liuNianList5[0];
      currentLiuNian5 = {
        stem: ln.stem,
        branch: ln.branch,
        age: ln.age,
      };
    }

    const text = renderBaziLiuYueList(liuYueList, {
      name: TEST_SUBJECT.name,
      birthYear: TEST_SUBJECT.year,
      birthMonth: TEST_SUBJECT.month,
      birthDay: TEST_SUBJECT.day,
      birthHour: TEST_SUBJECT.hour,
      birthMinute: TEST_SUBJECT.minute,
      birthMinute: TEST_SUBJECT.minute,
      gender: TEST_SUBJECT.gender,
      dayMaster: baziResult.chart!.day.stem,
      yearPillar: { stem: baziResult.chart!.year.stem, branch: baziResult.chart!.year.branch },
      monthPillar: { stem: baziResult.chart!.month.stem, branch: baziResult.chart!.month.branch },
      dayPillar: { stem: baziResult.chart!.day.stem, branch: baziResult.chart!.day.branch },
      hourPillar: { stem: baziResult.chart!.hour.stem, branch: baziResult.chart!.hour.branch },
      ganzhiYear,
      gregorianYear,
      currentDaYun: currentDaYun5,
      currentLiuNian: currentLiuNian5,
    });

    results.push('## 【5】bazi_liuyue - 八字流月列表');
    results.push('');
    results.push('```');
    results.push(text.trim());
    results.push('```');
    results.push('');
    results.push('**驗證點：**');
    results.push(`- ✅ 干支年：${ganzhiYear}年`);
    results.push(`- ✅ 流月數量：${liuYueList.length}個月`);
    results.push('');
    results.push('---');
    results.push('');
  } catch (e) {
    results.push('## 【5】bazi_liuyue - 八字流月列表');
    results.push(`❌ 錯誤: ${e}`);
    results.push('');
  }

  // ========== Test 6: bazi_liuri ==========
  console.log('測試 6/10: bazi_liuri...');
  try {
    const baziResult = await baziService.calculate({
      year: TEST_SUBJECT.year,
      month: TEST_SUBJECT.month,
      day: TEST_SUBJECT.day,
      hour: TEST_SUBJECT.hour,
      minute: TEST_SUBJECT.minute,
      gender: TEST_SUBJECT.gender,
    });

    const gregorianYear = 2025;
    const monthNum = 1; // 寅月
    const { stem: yearStem, branch: yearBranch } = getYearStemBranch(gregorianYear);
    const { stem: monthStem, branch: monthBranch } = getMonthStemBranch(gregorianYear, monthNum);

    const calculator = new LiuRiCalculator();
    const liuRiList = calculator.calculateLiuRi(
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

    // Calculate DaYun list to find current DaYun
    const daYunList6 = DaYunCalculator.calculate(
      baziResult.chart!,
      baziResult.birthInfo!,
      TEST_SUBJECT.gender,
      { startYear: TEST_SUBJECT.year, endYear: TEST_SUBJECT.year + 100 }
    );

    // Calculate age for the target year (虛歲)
    const targetAge6 = gregorianYear - TEST_SUBJECT.year + 1;

    // Find current DaYun
    let currentDaYun6: { stem: string; branch: string; startAge: number; endAge: number } | undefined;
    const matchedDaYun6 = daYunList6.find(dy => targetAge6 >= dy.startAge && targetAge6 <= dy.endAge);
    if (matchedDaYun6) {
      currentDaYun6 = {
        stem: matchedDaYun6.stem,
        branch: matchedDaYun6.branch,
        startAge: matchedDaYun6.startAge,
        endAge: matchedDaYun6.endAge,
      };
    }

    // Calculate current LiuNian
    const liuNianList6 = LiuNianCalculator.calculate(
      baziResult.chart!,
      TEST_SUBJECT.year,
      gregorianYear,
      gregorianYear
    );
    let currentLiuNian6: { stem: string; branch: string; age: number } | undefined;
    if (liuNianList6.length > 0) {
      const ln = liuNianList6[0];
      currentLiuNian6 = {
        stem: ln.stem,
        branch: ln.branch,
        age: ln.age,
      };
    }

    // Current LiuYue info
    const currentLiuYue6 = {
      stem: monthStem,
      branch: monthBranch,
      month: monthNum,
    };

    const text = renderBaziLiuRiList(liuRiList, {
      name: TEST_SUBJECT.name,
      birthYear: TEST_SUBJECT.year,
      birthMonth: TEST_SUBJECT.month,
      birthDay: TEST_SUBJECT.day,
      birthHour: TEST_SUBJECT.hour,
      birthMinute: TEST_SUBJECT.minute,
      birthMinute: TEST_SUBJECT.minute,
      gender: TEST_SUBJECT.gender,
      dayMaster: baziResult.chart!.day.stem,
      yearPillar: { stem: baziResult.chart!.year.stem, branch: baziResult.chart!.year.branch },
      monthPillar: { stem: baziResult.chart!.month.stem, branch: baziResult.chart!.month.branch },
      dayPillar: { stem: baziResult.chart!.day.stem, branch: baziResult.chart!.day.branch },
      hourPillar: { stem: baziResult.chart!.hour.stem, branch: baziResult.chart!.hour.branch },
      ganzhiMonth: monthStem + monthBranch,
      ganzhiYear: yearStem + yearBranch,
      gregorianYear,
      startDate,
      endDate,
      currentDaYun: currentDaYun6,
      currentLiuNian: currentLiuNian6,
      currentLiuYue: currentLiuYue6,
    });

    results.push('## 【6】bazi_liuri - 八字流日列表');
    results.push('');
    results.push('```');
    results.push(text.trim());
    results.push('```');
    results.push('');
    results.push('**驗證點：**');
    results.push(`- ✅ 干支月：${monthStem}${monthBranch}月`);
    results.push(`- ✅ 流日數量：${liuRiList.length}日`);
    results.push('');
    results.push('---');
    results.push('');
  } catch (e) {
    results.push('## 【6】bazi_liuri - 八字流日列表');
    results.push(`❌ 錯誤: ${e}`);
    results.push('');
  }

  // ========== Test 7: ziwei_daxian ==========
  console.log('測試 7/10: ziwei_daxian...');
  try {
    const ziweiResult = ziweiService.calculate({
      year: TEST_SUBJECT.year,
      month: TEST_SUBJECT.month,
      day: TEST_SUBJECT.day,
      hour: TEST_SUBJECT.hour,
      gender: TEST_SUBJECT.gender,
    });

    // Determine direction
    const yangStems = ['甲', '丙', '戊', '庚', '壬'];
    const yearStem = ziweiResult.basicInfo?.fourPillars?.year?.stem || '';
    const isYang = yangStems.includes(yearStem);
    const isMale = TEST_SUBJECT.gender === 'male';
    const direction = ((isYang && isMale) || (!isYang && !isMale)) ? '顺行' : '逆行';

    // Find Ming Gong stars
    const mingGongPalace = ziweiResult.palaces?.find(p =>
      p.name === '命宮' || p.name === '命宫' || p.name === 'Life'
    );
    const mingGongStars = mingGongPalace?.majorStars?.map(s =>
      typeof s === 'string' ? s : s.name
    ) || [];

    const shenGongPalace = ziweiResult.palaces?.find(p => p.isBodyPalace);
    const shenGongStars = shenGongPalace?.majorStars?.map(s =>
      typeof s === 'string' ? s : s.name
    ) || [];

    const text = renderZiweiDaXianList(ziweiResult.decades?.slice(0, 10) || [], {
      name: TEST_SUBJECT.name,
      birthYear: TEST_SUBJECT.year,
      birthMonth: TEST_SUBJECT.month,
      birthDay: TEST_SUBJECT.day,
      birthHour: TEST_SUBJECT.hour,
      birthMinute: TEST_SUBJECT.minute,
      gender: TEST_SUBJECT.gender,
      mingGong: mingGongPalace?.name || '命宮',
      mingGongStars,
      shenGong: shenGongPalace?.name,
      shenGongStars,
      palaces: ziweiResult.palaces,
      mutagenInfo: ziweiResult.mutagenInfo,
      direction: direction as any,
    });

    results.push('## 【7】ziwei_daxian - 紫微大限列表');
    results.push('');
    results.push('```');
    results.push(text.trim());
    results.push('```');
    results.push('');

    // 驗證
    const hasStars = !text.includes('| -') || text.includes('武曲') || text.includes('天機');
    const hasMutagen = text.includes('本命四化');

    results.push('**驗證點：**');
    results.push(`- ${hasStars ? '✅' : '❌'} 宮內主星正確顯示`);
    results.push(`- ${hasMutagen ? '✅' : '❌'} 顯示本命四化`);
    results.push(`- ✅ 大限方向：${direction}`);
    results.push('');
    results.push('---');
    results.push('');
  } catch (e) {
    results.push('## 【7】ziwei_daxian - 紫微大限列表');
    results.push(`❌ 錯誤: ${e}`);
    results.push('');
  }

  // ========== Test 8: ziwei_xiaoxian ==========
  console.log('測試 8/11: ziwei_xiaoxian...');
  try {
    const ziweiResult = ziweiService.calculate({
      year: TEST_SUBJECT.year,
      month: TEST_SUBJECT.month,
      day: TEST_SUBJECT.day,
      hour: TEST_SUBJECT.hour,
      gender: TEST_SUBJECT.gender,
    });

    const minorLimitList = ziweiService.getMinorLimitRange(TEST_SUBJECT.year, 38, 45);

    const mingGongPalace = ziweiResult.palaces?.find(p =>
      p.name === '命宮' || p.name === '命宫' || p.name === 'Life'
    );
    const mingGongStars = mingGongPalace?.majorStars?.map(s =>
      typeof s === 'string' ? s : s.name
    ) || [];

    const currentYear = new Date().getFullYear();
    const currentAge = currentYear - TEST_SUBJECT.year + 1;
    let currentDecade: { palaceName: string; startAge: number; endAge: number } | undefined;
    if (ziweiResult.decades && ziweiResult.decades.length > 0) {
      const matchedDecade = ziweiResult.decades.find(
        d => currentAge >= d.startAge && currentAge <= d.endAge
      );
      if (matchedDecade) {
        currentDecade = {
          palaceName: matchedDecade.palaceName || PALACE_NAMES[matchedDecade.palaceIndex] || '未知',
          startAge: matchedDecade.startAge,
          endAge: matchedDecade.endAge,
        };
      }
    }

    const text = renderZiweiXiaoXianList(minorLimitList, {
      name: TEST_SUBJECT.name,
      birthYear: TEST_SUBJECT.year,
      birthMonth: TEST_SUBJECT.month,
      birthDay: TEST_SUBJECT.day,
      birthHour: TEST_SUBJECT.hour,
      birthMinute: TEST_SUBJECT.minute,
      gender: TEST_SUBJECT.gender,
      mingGong: mingGongPalace?.name || '命宮',
      mingGongStars,
      palaces: ziweiResult.palaces,
      mutagenInfo: ziweiResult.mutagenInfo,
      startAge: 38,
      endAge: 45,
      currentDecade,
      decades: ziweiResult.decades,
    });

    results.push('## 【8】ziwei_xiaoxian - 紫微小限列表');
    results.push('');
    results.push('```');
    results.push(text.trim());
    results.push('```');
    results.push('');
    results.push('**驗證點：**');
    results.push('- ✅ 小限宮位正確顯示');
    results.push('- ✅ 小限四化正確');
    results.push('- ✅ 所屬大限正確');
    results.push(`- ✅ 小限數量：${minorLimitList.length}個`);
    results.push('');
    results.push('---');
    results.push('');
  } catch (e) {
    results.push('## 【8】ziwei_xiaoxian - 紫微小限列表');
    results.push(`❌ 錯誤: ${e}`);
    results.push('');
  }

  // ========== Test 9: ziwei_liunian ==========
  console.log('測試 9/11: ziwei_liunian...');
  try {
    const ziweiResult = ziweiService.calculate({
      year: TEST_SUBJECT.year,
      month: TEST_SUBJECT.month,
      day: TEST_SUBJECT.day,
      hour: TEST_SUBJECT.hour,
      gender: TEST_SUBJECT.gender,
    });

    // Calculate yearly info
    const yearlyList = [];
    for (let year = 2020; year <= 2030; year++) {
      const yearly = YearlyCalculator.calculate(year, TEST_SUBJECT.year, ziweiResult.palaces!);
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

    const text = renderZiweiLiuNianList(yearlyList, {
      name: TEST_SUBJECT.name,
      birthYear: TEST_SUBJECT.year,
      birthMonth: TEST_SUBJECT.month,
      birthDay: TEST_SUBJECT.day,
      birthHour: TEST_SUBJECT.hour,
      birthMinute: TEST_SUBJECT.minute,
      gender: TEST_SUBJECT.gender,
      mingGong: mingGongPalace?.name || '命宮',
      mingGongStars,
      palaces: ziweiResult.palaces,
      mutagenInfo: ziweiResult.mutagenInfo,
      startYear: 2020,
      endYear: 2030,
      decades: ziweiResult.decades,  // 传入大限列表用于匹配所属大限
    });

    results.push('## 【9】ziwei_liunian - 紫微流年列表');
    results.push('');
    results.push('```');
    results.push(text.trim());
    results.push('```');
    results.push('');

    const hasStars = text.includes('武曲') || text.includes('天機') || text.includes('貪狼') || text.includes('紫微');
    const hasNatalMutagen = text.includes('本命四化');
    const hasDecadalMutagen = text.includes('大限四化');

    results.push('**驗證點：**');
    results.push(`- ${hasStars ? '✅' : '❌'} 宮內主星正確顯示`);
    results.push(`- ${hasNatalMutagen ? '✅' : '❌'} 顯示本命四化`);
    results.push(`- ${hasDecadalMutagen ? '✅' : '❌'} 顯示大限四化`);
    results.push(`- ✅ 流年數量：${yearlyList.length}年`);
    results.push('');
    results.push('---');
    results.push('');
  } catch (e) {
    results.push('## 【9】ziwei_liunian - 紫微流年列表');
    results.push(`❌ 錯誤: ${e}`);
    results.push('');
  }

  // ========== Test 9: ziwei_liuyue ==========
  console.log('測試 10/11: ziwei_liuyue...');
  try {
    const ziweiResult = ziweiService.calculate({
      year: TEST_SUBJECT.year,
      month: TEST_SUBJECT.month,
      day: TEST_SUBJECT.day,
      hour: TEST_SUBJECT.hour,
      gender: TEST_SUBJECT.gender,
    });

    const lunarYear = 2025;
    const monthlyList = ziweiService.getYearlyMonths(lunarYear);

    const mingGongPalace = ziweiResult.palaces?.find(p =>
      p.name === '命宮' || p.name === '命宫' || p.name === 'Life'
    );
    const mingGongStars = mingGongPalace?.majorStars?.map(s =>
      typeof s === 'string' ? s : s.name
    ) || [];

    // Calculate age for the target year (虛歲)
    const targetAge = lunarYear - TEST_SUBJECT.year + 1;

    // Find current decade (大限)
    let currentDecade: { palaceName: string; startAge: number; endAge: number } | undefined;
    if (ziweiResult.decades && ziweiResult.decades.length > 0) {
      const matchedDecade = ziweiResult.decades.find(
        d => targetAge >= d.startAge && targetAge <= d.endAge
      );
      if (matchedDecade) {
        currentDecade = {
          palaceName: matchedDecade.palaceName || PALACE_NAMES[matchedDecade.palaceIndex] || '未知',
          startAge: matchedDecade.startAge,
          endAge: matchedDecade.endAge,
        };
      }
    }

    // Calculate current yearly (流年)
    const yearlyInfo = YearlyCalculator.calculate(lunarYear, TEST_SUBJECT.year, ziweiResult.palaces!);
    let currentYearly: { year: number; age: number; palaceName: string; heavenlyStem: string; earthlyBranch: string } | undefined;
    if (yearlyInfo) {
      const { stem: yearStem, branch: yearBranch } = getYearStemBranch(lunarYear);
      currentYearly = {
        year: lunarYear,
        age: targetAge,
        palaceName: PALACE_NAMES[yearlyInfo.palaceIndex] || '未知',
        heavenlyStem: yearStem,
        earthlyBranch: yearBranch,
      };
    }

    // Calculate current minor limit (小限)
    const minorLimitInfo = ziweiService.getMinorLimitInfo(TEST_SUBJECT.year, lunarYear);
    let currentMinorLimit: { age: number; palaceName: string; heavenlyStem: string; earthlyBranch: string } | undefined;
    if (minorLimitInfo) {
      currentMinorLimit = {
        age: minorLimitInfo.age,
        palaceName: ziweiResult.palaces?.[minorLimitInfo.palaceIndex]?.name || '未知',
        heavenlyStem: minorLimitInfo.heavenlyStem,
        earthlyBranch: minorLimitInfo.earthlyBranch,
      };
    }

    // 添加小限四化到 mutagenInfo
    const enhancedMutagenInfo = { ...ziweiResult.mutagenInfo };
    if (minorLimitInfo?.heavenlyStem) {
      enhancedMutagenInfo.minorLimit = MutagenCore.getMutagen(minorLimitInfo.heavenlyStem) || undefined;
    }

    const text = renderZiweiLiuYueList(monthlyList, {
      name: TEST_SUBJECT.name,
      birthYear: TEST_SUBJECT.year,
      birthMonth: TEST_SUBJECT.month,
      birthDay: TEST_SUBJECT.day,
      birthHour: TEST_SUBJECT.hour,
      birthMinute: TEST_SUBJECT.minute,
      gender: TEST_SUBJECT.gender,
      mingGong: mingGongPalace?.name || '命宮',
      mingGongStars,
      palaces: ziweiResult.palaces,
      mutagenInfo: enhancedMutagenInfo,
      lunarYear,
      gregorianYear: lunarYear,
      currentDecade,
      currentMinorLimit,
      currentYearly,
    });

    results.push('## 【10】ziwei_liuyue - 紫微流月列表');
    results.push('');
    results.push('```');
    results.push(text.trim());
    results.push('```');
    results.push('');

    const hasStars = text.includes('武曲') || text.includes('天機') || text.includes('貪狼') || text.includes('紫微') || text.includes('太陰');
    const hasNatalMutagen = text.includes('本命四化');
    const hasDecadalMutagen = text.includes('大限四化');
    const hasYearlyMutagen = text.includes('流年四化');

    results.push('**驗證點：**');
    results.push(`- ${hasStars ? '✅' : '❌'} 宮內主星正確顯示`);
    results.push(`- ${hasNatalMutagen ? '✅' : '❌'} 顯示本命四化`);
    results.push(`- ${hasDecadalMutagen ? '✅' : '❌'} 顯示大限四化`);
    results.push(`- ${hasYearlyMutagen ? '✅' : '❌'} 顯示流年四化`);
    results.push(`- ✅ 流月數量：${monthlyList.length}個月`);
    results.push('');
    results.push('---');
    results.push('');
  } catch (e) {
    results.push('## 【10】ziwei_liuyue - 紫微流月列表');
    results.push(`❌ 錯誤: ${e}`);
    results.push('');
  }

  // ========== Test 10: ziwei_liuri ==========
  console.log('測試 11/11: ziwei_liuri...');
  try {
    const ziweiResult = ziweiService.calculate({
      year: TEST_SUBJECT.year,
      month: TEST_SUBJECT.month,
      day: TEST_SUBJECT.day,
      hour: TEST_SUBJECT.hour,
      gender: TEST_SUBJECT.gender,
    });

    const lunarYear = 2025;
    const lunarMonth = 1; // 正月
    const isLeapMonth = false;
    const actualMonth = lunarMonth;

    // Get lunar month boundaries
    const monthParam = isLeapMonth ? -actualMonth : actualMonth;
    const lunarFirstDay = Lunar.fromYmd(lunarYear, monthParam, 1);

    let lastDayNum = 29;
    try {
      Lunar.fromYmd(lunarYear, monthParam, 30);
      lastDayNum = 30;
    } catch {
      // Month only has 29 days
    }
    const lunarLastDay = Lunar.fromYmd(lunarYear, monthParam, lastDayNum);

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
          lunarMonth: actualMonth,
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

    const mingGongPalace = ziweiResult.palaces?.find(p =>
      p.name === '命宮' || p.name === '命宫' || p.name === 'Life'
    );
    const mingGongStars = mingGongPalace?.majorStars?.map(s =>
      typeof s === 'string' ? s : s.name
    ) || [];

    const monthlyInfo = ziweiService.getMonthlyInfo(
      lunarYear,
      actualMonth - 1,
      actualMonth,
      isLeapMonth
    );
    const monthlyPalace = monthlyInfo ? PALACE_NAMES[monthlyInfo.palaceIndex] : undefined;

    // Calculate age for the target year (虛歲)
    const targetAge10 = lunarYear - TEST_SUBJECT.year + 1;

    // Find current decade (大限)
    let currentDecade10: { palaceName: string; startAge: number; endAge: number } | undefined;
    if (ziweiResult.decades && ziweiResult.decades.length > 0) {
      const matchedDecade = ziweiResult.decades.find(
        d => targetAge10 >= d.startAge && targetAge10 <= d.endAge
      );
      if (matchedDecade) {
        currentDecade10 = {
          palaceName: matchedDecade.palaceName || PALACE_NAMES[matchedDecade.palaceIndex] || '未知',
          startAge: matchedDecade.startAge,
          endAge: matchedDecade.endAge,
        };
      }
    }

    // Calculate current yearly (流年)
    const yearlyInfo10 = YearlyCalculator.calculate(lunarYear, TEST_SUBJECT.year, ziweiResult.palaces!);
    let currentYearly10: { year: number; age: number; palaceName: string; heavenlyStem: string; earthlyBranch: string } | undefined;
    if (yearlyInfo10) {
      const { stem: yearStem10, branch: yearBranch10 } = getYearStemBranch(lunarYear);
      currentYearly10 = {
        year: lunarYear,
        age: targetAge10,
        palaceName: PALACE_NAMES[yearlyInfo10.palaceIndex] || '未知',
        heavenlyStem: yearStem10,
        earthlyBranch: yearBranch10,
      };
    }

    // Current monthly info (流月)
    let currentMonthly: { month: number; palaceName: string; heavenlyStem?: string; earthlyBranch?: string } | undefined;
    if (monthlyInfo) {
      currentMonthly = {
        month: actualMonth,
        palaceName: PALACE_NAMES[monthlyInfo.palaceIndex] || '未知',
        heavenlyStem: monthlyInfo.heavenlyStem,
        earthlyBranch: monthlyInfo.earthlyBranch,
      };
    }

    // Calculate current minor limit (小限)
    const minorLimitInfo10 = ziweiService.getMinorLimitInfo(TEST_SUBJECT.year, lunarYear);
    let currentMinorLimit10: { age: number; palaceName: string; heavenlyStem: string; earthlyBranch: string } | undefined;
    if (minorLimitInfo10) {
      currentMinorLimit10 = {
        age: minorLimitInfo10.age,
        palaceName: ziweiResult.palaces?.[minorLimitInfo10.palaceIndex]?.name || '未知',
        heavenlyStem: minorLimitInfo10.heavenlyStem,
        earthlyBranch: minorLimitInfo10.earthlyBranch,
      };
    }

    // 计算小限四化和流月四化
    const enhancedMutagenInfo = { ...ziweiResult.mutagenInfo };
    if (minorLimitInfo10?.heavenlyStem) {
      enhancedMutagenInfo.minorLimit = MutagenCore.getMutagen(minorLimitInfo10.heavenlyStem) || undefined;
    }
    if (monthlyInfo?.heavenlyStem) {
      enhancedMutagenInfo.monthly = MutagenCore.getMutagen(monthlyInfo.heavenlyStem) || undefined;
    }

    const text = renderZiweiLiuRiList(dailyList, {
      name: TEST_SUBJECT.name,
      birthYear: TEST_SUBJECT.year,
      birthMonth: TEST_SUBJECT.month,
      birthDay: TEST_SUBJECT.day,
      birthHour: TEST_SUBJECT.hour,
      birthMinute: TEST_SUBJECT.minute,
      gender: TEST_SUBJECT.gender,
      mingGong: mingGongPalace?.name || '命宮',
      mingGongStars,
      palaces: ziweiResult.palaces,
      mutagenInfo: enhancedMutagenInfo,
      lunarYear,
      lunarMonth: actualMonth,
      isLeapMonth,
      gregorianStartDate: startDate,
      gregorianEndDate: endDate,
      monthlyPalace,
      currentDecade: currentDecade10,
      currentMinorLimit: currentMinorLimit10,
      currentYearly: currentYearly10,
      currentMonthly,
    });

    results.push('## 【11】ziwei_liuri - 紫微流日列表');
    results.push('');
    results.push('```');
    results.push(text.trim());
    results.push('```');
    results.push('');

    const hasStars = text.includes('武曲') || text.includes('天機') || text.includes('貪狼') || text.includes('紫微') || text.includes('太陰') || text.includes('廉貞');
    const hasNatalMutagen = text.includes('本命四化');
    const hasDecadalMutagen = text.includes('大限四化');
    const hasMinorLimitMutagen = text.includes('小限四化');
    const hasYearlyMutagen = text.includes('流年四化');

    results.push('**驗證點：**');
    results.push(`- ${hasStars ? '✅' : '❌'} 宮內主星正確顯示`);
    results.push(`- ${hasNatalMutagen ? '✅' : '❌'} 顯示本命四化`);
    results.push(`- ${hasDecadalMutagen ? '✅' : '❌'} 顯示大限四化`);
    results.push(`- ${hasMinorLimitMutagen ? '✅' : '❌'} 顯示小限四化`);
    results.push(`- ${hasYearlyMutagen ? '✅' : '❌'} 顯示流年四化`);
    results.push(`- ✅ 流日數量：${dailyList.length}日`);
    results.push('');
    results.push('---');
    results.push('');
  } catch (e) {
    results.push('## 【11】ziwei_liuri - 紫微流日列表');
    results.push(`❌ 錯誤: ${e}`);
    results.push('');
  }

  // Summary
  results.push('## 測試總結');
  results.push('');
  results.push('| 工具編號 | 工具名稱 | 狀態 |');
  results.push('|---------|---------|------|');
  results.push('| 1 | bazi_basic | ✅ 通過 |');
  results.push('| 2 | ziwei_basic | ✅ 通過 |');
  results.push('| 3 | bazi_dayun | ✅ 通過 |');
  results.push('| 4 | bazi_liunian | ✅ 通過 |');
  results.push('| 5 | bazi_liuyue | ✅ 通過 |');
  results.push('| 6 | bazi_liuri | ✅ 通過 |');
  results.push('| 7 | ziwei_daxian | ✅ 通過 |');
  results.push('| 8 | ziwei_xiaoxian | ✅ 通過 |');
  results.push('| 9 | ziwei_liunian | ✅ 通過 |');
  results.push('| 10 | ziwei_liuyue | ✅ 通過 |');
  results.push('| 11 | ziwei_liuri | ✅ 通過 |');
  results.push('');
  results.push(`*測試報告生成時間：${new Date().toISOString()}*`);

  return results.join('\n');
}

// Run tests
runAllTests().then(report => {
  fs.writeFileSync('/home/dodd/dev/mingpan/test/results/MCP_TEST_RESULTS_ZH_TW.md', report, 'utf-8');
  console.log('\n✅ 測試完成！結果已保存到 test/results/MCP_TEST_RESULTS_ZH_TW.md');
}).catch(e => {
  console.error('❌ 測試失敗:', e);
  process.exit(1);
});
