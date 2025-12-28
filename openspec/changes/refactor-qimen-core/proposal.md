# Change: 奇门遁甲核心逻辑下沉到 Core 层

## Why

当前奇门遁甲的所有计算逻辑都放在 `services/qimen/` 目录下，存在以下问题：

### 1. 分层不当
部分纯数学/通用计算应该属于 Core 层：
- **飞宫数学规则** - 洛书九宫的遍历算法，是通用数学逻辑
- **九宫映射** - 宫位名称、五行、对冲关系等基础映射
- **阴阳遁判定** - 基于节气的简单规则，可独立测试

### 2. 代码质量问题
- `GeJuCalculator` 内部重复定义 `DI_ZHI_GONG_MAP`，与 `constants.ts` 中的 `DI_ZHI_GONG` 重复（DRY 违规）
- `CHONG_GONG_MAP`（宫位对冲）写在业务代码中，应抽取为通用常量
- `GAN_HE_MAP`（天干五合）写在业务代码中，应抽取为通用常量
- 方法命名不清晰：`checkFuYinFanYinGeJu` 只检测伏吟但名字带"反吟"

### 3. 测试覆盖不足
仅有 1 个 UI 渲染测试，核心计算器缺乏单元测试。

## What Changes

### 架构调整
- 新增 `src/core/qimen/` 目录，包含奇门遁甲的核心计算模块
- 新增 `src/core/qimen/types.ts`，定义 core 层所需的基础类型（避免反向依赖 services）
- 将 `FlyingRule`（飞宫数学规则）抽取到 core/qimen
- 将 `GongMapping`（九宫映射、对冲关系、天干五合）抽取到 core/qimen
- 将 `YinYangDunCalculator`（阴阳遁判定）抽取到 core/qimen
- `services/qimen/` 调用 `core/qimen/` 的计算结果进行业务组装

### 类型处理策略
由于 `TianGan`, `DiZhi`, `WuXing` 等基础类型在多个 services 中重复定义（qimen, daliuren, liuyao），
本次采用方案A：在 `core/qimen/types.ts` 中定义 core 层需要的类型，保持 services 层现有类型不变。
后续可通过方案B统一迁移到 `core/constants/ganzhi.ts`。

### 代码质量修复
- 删除 `GeJuCalculator` 中的重复定义（DI_ZHI_GONG_MAP, CHONG_GONG_MAP, GAN_HE_MAP）
- 统一使用 core 层的常量和函数
- 重命名混淆的方法名

### 测试补充
- 为 core/qimen/ 新模块编写单元测试

## Impact

- Affected specs: `qimen-divination`
- Affected code:
  - 新增: `src/core/qimen/` (types.ts, FlyingRule.ts, GongMapping.ts, YinYangDunCalculator.ts, index.ts)
  - 修改: `src/services/qimen/calculators/` (使用 core 层的计算结果)
  - 修改: `src/services/qimen/calculators/GeJuCalculator.ts` (删除重复定义)
  - 修改: `src/services/qimen/data/constants.ts` (重新导出 core 层常量)
  - 修改: `src/core/index.ts` (导出新模块)
- 新增测试: `test/core/qimen/`
