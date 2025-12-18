/**
 * 统一的位置常量定义
 * 遵循DRY原则，所有位置相关的值都从这里引用
 */

// 位置的内部标识符（用于逻辑计算）
export const POSITION_KEYS = {
  YEAR: 'year',
  MONTH: 'month',
  DAY: 'day',
  HOUR: 'hour'
} as const;

// 位置的中文名称（用于显示）
export const POSITION_NAMES = {
  [POSITION_KEYS.YEAR]: '年柱',
  [POSITION_KEYS.MONTH]: '月柱',
  [POSITION_KEYS.DAY]: '日柱',
  [POSITION_KEYS.HOUR]: '時柱'
} as const;

// 位置索引（用于距离计算）
export const POSITION_INDICES = {
  [POSITION_KEYS.YEAR]: 0,
  [POSITION_KEYS.MONTH]: 1,
  [POSITION_KEYS.DAY]: 2,
  [POSITION_KEYS.HOUR]: 3
} as const;

// 位置类型定义
export type PositionKey = typeof POSITION_KEYS[keyof typeof POSITION_KEYS];
export type PositionName = typeof POSITION_NAMES[keyof typeof POSITION_NAMES];

// 工具函数：从中文名称获取内部键
export function getPositionKeyByName(name: PositionName): PositionKey | undefined {
  return Object.entries(POSITION_NAMES).find(([key, value]) => value === name)?.[0] as PositionKey;
}

// 工具函数：从内部键获取中文名称
export function getPositionNameByKey(key: PositionKey): PositionName {
  return POSITION_NAMES[key];
}