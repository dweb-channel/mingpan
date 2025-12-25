/**
 * 奇门遁甲盘面 Markdown 渲染器
 *
 * 输出格式设计原则：
 * - 第一屏就让人/agent 看懂
 * - ASCII 艺术保持九宫格的直观性
 * - 统一使用简体中文
 */

import type { QimenResult, GongWei, GongInfo } from '../services/qimen/types';
import {
  BA_MEN_FULL,
  JIU_XING_FULL,
  BA_SHEN_FULL,
} from '../services/qimen/data/constants';

/**
 * 渲染奇门遁甲盘面为 Markdown 文本
 */
export function renderQimenText(result: QimenResult): string {
  const lines: string[] = [];

  // 标题
  lines.push('## 奇门遁甲排盘');
  lines.push('');

  // 基本信息
  lines.push(`**${result.yinYangDun}${result.juShu}局** | ${result.panType} | ${result.yuan} | ${result.zhiRunMethod === 'chaibu' ? '拆补法' : '茅山法'}`);
  lines.push('');

  // 时间信息
  lines.push(`**公历**：${result.timeInfo.solarDate} | **农历**：${result.timeInfo.lunarDate}`);
  lines.push(`**节气**：${result.timeInfo.jieQi}`);
  lines.push(`**四柱**：${result.timeInfo.siZhu.yearGanZhi}年 ${result.timeInfo.siZhu.monthGanZhi}月 ${result.timeInfo.siZhu.dayGanZhi}日 ${result.timeInfo.siZhu.hourGanZhi}时`);
  lines.push('');

  // 旬首信息
  lines.push(`**旬首**：${result.xunShou.xunShou} | **空亡**：${result.xunShou.kongWang[0]}${result.xunShou.kongWang[1]}`);
  lines.push(`**值符**：${JIU_XING_FULL[result.xunShou.zhiFuXing]}（原${getGongName(result.xunShou.zhiFuGong)}→${getGongName(result.xunShou.zhiFuLuoGong)}）`);
  lines.push(`**值使**：${BA_MEN_FULL[result.xunShou.zhiShiMen]}（原${getGongName(result.xunShou.zhiShiGong)}→${getGongName(result.xunShou.zhiShiLuoGong)}）`);
  lines.push('');

  // 日时落宫
  lines.push(`**日干${result.timeInfo.siZhu.dayGan}落宫**：${getGongName(result.dayGanGong)} | **时干${result.timeInfo.siZhu.hourGan}落宫**：${getGongName(result.hourGanGong)}`);
  lines.push('');

  // 九宫盘
  lines.push('### 九宫盘');
  lines.push('');
  lines.push(renderJiuGongGrid(result.gongs));
  lines.push('');

  // 格局
  if (result.geJu.length > 0) {
    lines.push('### 格局');
    lines.push('');

    const jiGe = result.geJu.filter(g => g.type === '吉格');
    const xiongGe = result.geJu.filter(g => g.type === '凶格');
    const zhongXing = result.geJu.filter(g => g.type === '中性');

    if (jiGe.length > 0) {
      lines.push(`**吉格**：${jiGe.map(g => g.name).join('、')}`);
    }
    if (xiongGe.length > 0) {
      lines.push(`**凶格**：${xiongGe.map(g => g.name).join('、')}`);
    }
    if (zhongXing.length > 0) {
      lines.push(`**中性**：${zhongXing.map(g => g.name).join('、')}`);
    }
    lines.push('');

    // 格局详情
    lines.push('**格局详情**：');
    for (const ge of result.geJu) {
      const icon = ge.type === '吉格' ? '✓' : ge.type === '凶格' ? '✗' : '○';
      lines.push(`- ${icon} ${ge.name}：${ge.description}`);
    }
    lines.push('');
  }

  // 九宫详表
  lines.push('### 九宫详表');
  lines.push('');
  lines.push('| 宫位 | 地盘 | 天盘 | 八门 | 九星 | 八神 | 空亡 | 马星 |');
  lines.push('|:----:|:----:|:----:|:----:|:----:|:----:|:----:|:----:|');

  // 按洛书顺序排列：巽4 离9 坤2 / 震3 中5 兑7 / 艮8 坎1 乾6
  const displayOrder: GongWei[] = [4, 9, 2, 3, 5, 7, 8, 1, 6];
  for (const gongWei of displayOrder) {
    const gong = result.gongs[gongWei];
    const kongMark = gong.isKong ? '○' : '';
    const maMark = gong.isMa ? '○' : '';
    lines.push(`| ${gong.gongName}${gong.gong} | ${gong.diPanGan} | ${gong.tianPanGan} | ${BA_MEN_FULL[gong.men]} | ${JIU_XING_FULL[gong.xing]} | ${BA_SHEN_FULL[gong.shen]} | ${kongMark} | ${maMark} |`);
  }
  lines.push('');

  return lines.join('\n');
}

/**
 * 渲染九宫格 ASCII 艺术
 */
function renderJiuGongGrid(gongs: Record<GongWei, GongInfo>): string {
  const lines: string[] = [];

  // 获取每个宫位的显示信息
  const getGongDisplay = (gongWei: GongWei): string[] => {
    const gong = gongs[gongWei];
    const line1 = `${gong.gongName}${gong.gong}宫`;
    const line2 = `${gong.diPanGan}+${gong.tianPanGan}`;
    const line3 = `${JIU_XING_FULL[gong.xing]} ${BA_MEN_FULL[gong.men]}`;
    const line4 = BA_SHEN_FULL[gong.shen];
    return [line1, line2, line3, line4];
  };

  // 填充到固定宽度
  const pad = (s: string, width: number): string => {
    const len = [...s].length; // 处理中文字符
    const padding = width - len;
    const left = Math.floor(padding / 2);
    const right = padding - left;
    return ' '.repeat(left) + s + ' '.repeat(right);
  };

  const cellWidth = 12;

  lines.push('```');

  // 第一行：巽4 离9 坤2
  const row1 = [getGongDisplay(4), getGongDisplay(9), getGongDisplay(2)];
  lines.push('┌' + '─'.repeat(cellWidth) + '┬' + '─'.repeat(cellWidth) + '┬' + '─'.repeat(cellWidth) + '┐');
  for (let i = 0; i < 4; i++) {
    lines.push('│' + pad(row1[0][i], cellWidth) + '│' + pad(row1[1][i], cellWidth) + '│' + pad(row1[2][i], cellWidth) + '│');
  }

  // 第二行：震3 中5 兑7
  const row2 = [getGongDisplay(3), getGongDisplay(5), getGongDisplay(7)];
  lines.push('├' + '─'.repeat(cellWidth) + '┼' + '─'.repeat(cellWidth) + '┼' + '─'.repeat(cellWidth) + '┤');
  for (let i = 0; i < 4; i++) {
    lines.push('│' + pad(row2[0][i], cellWidth) + '│' + pad(row2[1][i], cellWidth) + '│' + pad(row2[2][i], cellWidth) + '│');
  }

  // 第三行：艮8 坎1 乾6
  const row3 = [getGongDisplay(8), getGongDisplay(1), getGongDisplay(6)];
  lines.push('├' + '─'.repeat(cellWidth) + '┼' + '─'.repeat(cellWidth) + '┼' + '─'.repeat(cellWidth) + '┤');
  for (let i = 0; i < 4; i++) {
    lines.push('│' + pad(row3[0][i], cellWidth) + '│' + pad(row3[1][i], cellWidth) + '│' + pad(row3[2][i], cellWidth) + '│');
  }

  lines.push('└' + '─'.repeat(cellWidth) + '┴' + '─'.repeat(cellWidth) + '┴' + '─'.repeat(cellWidth) + '┘');

  lines.push('```');

  return lines.join('\n');
}

/**
 * 获取宫位名称
 */
function getGongName(gong: GongWei): string {
  const names: Record<GongWei, string> = {
    1: '坎一',
    2: '坤二',
    3: '震三',
    4: '巽四',
    5: '中五',
    6: '乾六',
    7: '兑七',
    8: '艮八',
    9: '离九',
  };
  return names[gong];
}

// 导出辅助函数
export { renderJiuGongGrid, getGongName };
