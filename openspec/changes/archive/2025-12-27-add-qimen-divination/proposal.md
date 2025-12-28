# Change: 新增奇门遁甲排盘功能

## Why

命盘 MCP 服务目前已实现八字、紫微斗数、六爻、梅花易数、大六壬五大术数体系，但尚缺少奇门遁甲这一中国古代三式之一的重要术数。奇门遁甲与大六壬、太乙神数并称"三式"，是古代用于军事谋略和预测的重要体系，市场需求广泛。

## What Changes

### 核心功能
- 新增 `QimenService` 服务类，提供奇门遁甲排盘计算
- 支持**时盘**和**日盘**两种盘式
- 支持**拆补法**和**茅山法**两种置闰算法
- 实现基础格局判断（约 20-30 种吉凶格局）

### 计算模块
- `JuShuCalculator`: 局数计算器（阴阳遁 + 上中下元）
- `JiuGongCalculator`: 九宫计算器（地盘布局）
- `SanQiLiuYiCalculator`: 三奇六仪计算器（天盘飞布）
- `BaMenCalculator`: 八门计算器（八门飞布）
- `JiuXingCalculator`: 九星计算器（九星飞布）
- `BaShenCalculator`: 八神计算器（八神排布）
- `GeJuCalculator`: 格局判断计算器

### MCP 工具
- 新增 `qimen_basic` 工具，提供完整的奇门遁甲排盘能力

### 输出内容
- 阴阳遁和局数
- 九宫布局（地盘干、天盘干、八门、九星、八神）
- 旬首信息（符头、值符星、值使门、空亡）
- 格局判断（吉格/凶格）
- 日干/时干落宫

## Impact

### Affected Specs
- 新增 `qimen-divination` 能力规范

### Affected Code
- `src/services/qimen/` - 新增服务目录
- `src/output/qimenTextRenderer.ts` - 新增渲染器
- `src/index.ts` - 注册新 MCP 工具

### Dependencies
- 复用现有 `lunar-javascript` 库进行节气和干支计算
- 复用现有 `normalizeBirthDateTime` 时间处理工具

### Risks
- 奇门遁甲算法复杂，需要仔细验证计算准确性
- 置闰法有多种流派，不同算法可能产生不同结果
