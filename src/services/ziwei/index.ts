/**
 * 紫微斗数服务统一导出
 */

// 导出主服务
export { ZiweiService, ziweiService } from './ZiweiService';

// 导出所有类型
export * from './types';

// 导出计算器（如果需要单独使用）
export { DecadeCalculator } from './calculators/DecadeCalculator';
export { MinorLimitCalculator } from './calculators/MinorLimitCalculator';
export { YearlyCalculator } from './calculators/YearlyCalculator';
export { MutagenCalculator } from './calculators/MutagenCalculator';
export { BrightnessCalculator } from './calculators/BrightnessCalculator';

// 导出转换器
export { PalaceTransformer } from './transformers/PalaceTransformer';

// 导出核心系统（高级用户使用）
export { BrightnessSystem } from '../../core/ziwei/BrightnessSystem';
export { MutagenCore } from '../../core/ziwei/MutagenCore';
export { IztroAdapter } from '../../core/ziwei/IztroAdapter';