/**
 * 宫位动态计算器
 * 计算每个宫位在大限和流年的动态名称
 */

export class PalaceDynamicCalculator {
  private static readonly PALACE_NAMES = [
    '命宮', '兄弟', '夫妻', '子女', '財帛', '疾厄',
    '遷移', '僕役', '官祿', '田宅', '福德', '父母'
  ];

  /**
   * 计算宫位在大限时的名称
   * @param originalIndex 原始宫位索引
   * @param decadePalaceIndex 大限命宫所在的宫位索引
   * @returns 该宫位在大限时的名称
   */
  static getDecadePalaceName(originalIndex: number, decadePalaceIndex: number): string {
    // 在大限盘中，大限命宫成为新的命宫（索引0）
    // 计算本命宫位在大限盘中的新位置
    // 例如：大限在子女宫（索引3），本命命宫（索引0）在大限盘中的位置是 (0 + (12 - 3)) % 12 = 9（田宅）
    const newPosition = (originalIndex + (12 - decadePalaceIndex)) % 12;
    
    
    return this.PALACE_NAMES[newPosition];
  }

  /**
   * 计算宫位在流年时的名称
   * @param originalIndex 原始宫位索引
   * @param yearlyPalaceIndex 流年命宫所在的宫位索引
   * @returns 该宫位在流年时的名称
   */
  static getYearlyPalaceName(originalIndex: number, yearlyPalaceIndex: number): string {
    // 在流年盘中，流年命宫成为新的命宫（索引0）
    // 计算本命宫位在流年盘中的新位置
    const newPosition = (originalIndex + (12 - yearlyPalaceIndex)) % 12;
    return this.PALACE_NAMES[newPosition];
  }

  /**
   * 获取完整的三重宫位信息
   * @param palaceIndex 宫位索引
   * @param palaceName 本命宫位名称
   * @param decadePalaceIndex 大限命宫索引
   * @param yearlyPalaceIndex 流年命宫索引
   * @returns 三重宫位描述
   */
  static getTriplePalaceInfo(
    palaceIndex: number,
    palaceName: string,
    decadePalaceIndex: number,
    yearlyPalaceIndex: number
  ): {
    natal: string;
    decade: string;
    yearly: string;
  } {
    return {
      natal: palaceName,
      decade: this.getDecadePalaceName(palaceIndex, decadePalaceIndex),
      yearly: this.getYearlyPalaceName(palaceIndex, yearlyPalaceIndex)
    };
  }
}