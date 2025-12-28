# 奇门遁甲功能设计文档

## Context

### 背景
奇门遁甲是中国古代三式（奇门、六壬、太乙）之一，相传源于黄帝战蚩尤时期，后经姜太公、张良等人整理发展。其核心是通过天时（九星）、地利（九宫）、人和（八门）、神助（八神）四个维度，结合三奇六仪的排布，进行预测和决策。

### 约束
- 奇门遁甲有多种流派和算法，本实现以"飞盘奇门"为主
- 置闰法支持拆补法（主流）和茅山法两种
- 排盘层只负责输出确定性结构，断盘交给 AI/用户

### 参考
- 《奇门遁甲》传统典籍
- 《遁甲演义》
- 现有大六壬服务实现模式

## Goals / Non-Goals

### Goals
- 实现完整的奇门遁甲时盘/日盘排盘功能
- 支持拆补法和茅山法两种置闰算法
- 输出结构化的九宫盘面信息
- 实现基础格局判断（20-30种）
- 遵循项目现有的分层架构和设计模式

### Non-Goals
- 不实现月盘和年盘（保留扩展性）
- 不实现断盘解读（交给 AI）
- 不实现所有格局判断（100+种）
- 不支持"转盘奇门"（另一种流派）

## Decisions

### 1. 目录结构

遵循现有占卜服务的目录模式：

```
src/services/qimen/
├── QimenService.ts           # 主服务类
├── types.ts                  # 类型定义
├── index.ts                  # 模块导出
├── data/
│   └── constants.ts          # 常量数据
└── calculators/
    ├── JuShuCalculator.ts    # 局数计算器
    ├── JiuGongCalculator.ts  # 九宫计算器
    ├── SanQiLiuYiCalculator.ts  # 三奇六仪计算器
    ├── BaMenCalculator.ts    # 八门计算器
    ├── JiuXingCalculator.ts  # 九星计算器
    ├── BaShenCalculator.ts   # 八神计算器
    └── GeJuCalculator.ts     # 格局计算器
```

**理由**: 与六爻、梅花、大六壬服务保持一致的组织方式。

### 2. 计算器设计模式

采用无状态静态工厂模式：

```typescript
export class JuShuCalculator {
  static calculate(
    jieQi: string,
    dayGanZhi: string,
    hourZhi: DiZhi,
    method: 'chaibu' | 'maoshan'
  ): { yinYangDun: YinYangDun; juShu: JuShu } {
    // 纯函数计算
  }
}
```

**理由**: 与现有计算器保持一致，便于测试和复用。

### 3. 九宫布局数据结构

使用 1-9 的宫位编号，对应洛书九宫：

```
┌────┬────┬────┐
│ 4  │ 9  │ 2  │
├────┼────┼────┤
│ 3  │ 5  │ 7  │
├────┼────┼────┤
│ 8  │ 1  │ 6  │
└────┴────┴────┘
巽   离   坤
震   中   兑
艮   坎   乾
```

**理由**: 洛书是奇门遁甲的基础，使用 1-9 编号更符合传统。

### 4. 输出格式

采用 Markdown 表格和 ASCII 艺术结合：

```markdown
## 奇门遁甲排盘

**阳遁3局** | 时盘 | 拆补法

### 九宫盘
┌────────┬────────┬────────┐
│ 巽四宫 │ 离九宫 │ 坤二宫 │
│ 丙+戊  │ 乙+己  │ 庚+辛  │
│ 天冲 杜│ 天英 景│ 天芮 死│
│ 六合   │ 白虎   │ 玄武   │
├────────┼────────┼────────┤
...
```

**理由**: ASCII 艺术保持九宫格的直观性，便于 AI 理解空间关系。

### 5. 置闰法实现

#### 拆补法（默认）
- 根据日干支在六十甲子中的位置确定符头
- 符头决定上中下元
- 节气+元数确定局数

#### 茅山法
- 以节气交节时间为基准
- 每 5 天换一局

**理由**: 拆补法是最主流的算法，茅山法作为备选。

### 6. 格局判断范围

第一版实现以下基础格局：

**吉格（约15种）**
- 三奇得使（乙丙丁到门）
- 三奇得门（乙丙丁遇开休生）
- 玉女守门
- 九遁（天遁、地遁、人遁等）
- 三奇贵人升殿

**凶格（约15种）
- 入墓（三奇六仪入墓）
- 击刑（门迫）
- 六仪击刑
- 五不遇时
- 时干入墓

**理由**: 基础格局覆盖最常见的判断，复杂格局可后续扩展。

## Risks / Trade-offs

### 风险1: 算法准确性
- **风险**: 奇门遁甲算法复杂，不同流派有细微差异
- **缓解**: 参考多个权威资料，提供测试用例验证

### 风险2: 置闰法争议
- **风险**: 拆补法和茅山法在某些日期会产生不同局数
- **缓解**: 明确标注使用的置闰法，让用户自行选择

### 风险3: 格局判断复杂性
- **风险**: 完整格局有100+种，难以全部实现
- **缓解**: 先实现基础格局，复杂格局交给 AI 分析

### Trade-off: 简单性 vs 完整性
- 选择先实现时盘+日盘，放弃月盘年盘
- 选择实现基础格局，放弃完整格局库
- 选择飞盘奇门，放弃转盘奇门

## Migration Plan

### Phase 1: 基础框架
1. 创建目录结构和类型定义
2. 实现 constants.ts 常量数据
3. 实现 JuShuCalculator（核心）

### Phase 2: 核心计算
4. 实现 JiuGongCalculator（九宫地盘）
5. 实现 SanQiLiuYiCalculator（天盘飞布）
6. 实现 BaMenCalculator（八门飞布）

### Phase 3: 完整排盘
7. 实现 JiuXingCalculator（九星飞布）
8. 实现 BaShenCalculator（八神排布）
9. 实现 QimenService（主服务编排）

### Phase 4: 输出和集成
10. 实现 qimenTextRenderer
11. 在 index.ts 注册 MCP 工具
12. 编写单元测试

### Phase 5: 格局判断
13. 实现 GeJuCalculator
14. 添加格局到输出

### 回滚方案
- 每个 Phase 独立提交
- 出现问题可单独回滚某个 Phase

## 关键实现细节

### 与现有架构对齐

1. **Logger 集成**
   - 参考 `BaziService` 和 `ZiweiService` 的日志模式
   - 使用 `Logger` 类记录入口、出口、错误日志
   - 使用 `LogMasker` 脱敏敏感信息

2. **错误处理**
   - 创建 `QimenCalculationError` 类（参考 `BaziCalculationError`）
   - 提供错误码和原始错误信息

3. **渲染器依赖**
   - 渲染器需要从 `constants.ts` 导入全称映射
   - 如 `BA_MEN_FULL`, `JIU_XING_FULL`, `BA_SHEN_FULL`

4. **index.ts 模块导出模式**
   ```typescript
   // src/services/qimen/index.ts
   export { QimenService } from './QimenService';
   export * from './types';
   export * from './data/constants';
   export { JuShuCalculator } from './calculators/JuShuCalculator';
   // ... 其他计算器
   ```

## Open Questions

### Q1: 是否需要支持"飞星"和"排星"两种排法？
当前计划只支持飞星法，排星法是否需要考虑？
**决定**: 第一版只支持飞星法，排星法作为后续扩展。

### Q2: 中宫寄宫规则
中五宫无门无星，寄艮八还是坤二？不同流派有不同说法。
**决定**: 天禽星寄坤二（随天芮），中宫门寄坤二。在 constants.ts 中定义为常量，便于后续调整。

### Q3: 日盘和时盘的值符值使是否相同？
时盘以时辰定值符值使，日盘以日定值符值使。
**决定**: 按此规则实现，在 QimenService 中通过 panType 参数区分。

### Q4: 节气精确时间计算
是否需要精确到分钟的节气交接时间？
**决定**: 第一版使用 `lunar-javascript` 提供的节气判断，后续可接入更精确的天文算法。
