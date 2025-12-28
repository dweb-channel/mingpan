# Tasks: 奇门遁甲核心逻辑下沉到 Core 层

## 1. 创建 Core 层模块结构

- [x] 1.1 创建 `src/core/qimen/` 目录
- [x] 1.2 创建 `src/core/qimen/types.ts`，定义 core 层基础类型
  - `TianGan` - 十天干
  - `DiZhi` - 十二地支
  - `WuXing` - 五行
  - `GongWei` - 宫位 (1-9)
  - `JuShu` - 局数 (1-9)
  - `YinYangDun` - 阴阳遁
  - `YuanType` - 上中下元
- [x] 1.3 创建 `src/core/qimen/index.ts` 导出文件
- [x] 1.4 更新 `src/core/index.ts` 导出新模块（跳过：项目使用直接导入，无统一入口文件）

## 2. 抽取飞宫数学规则

- [x] 2.1 创建 `src/core/qimen/FlyingRule.ts`
  - 迁移 `LUOSHU_ORDER` 常量（洛书飞布顺序）
  - 迁移 `getLuoShuIndex()` 函数
  - 迁移 `getLuoShuGong()` 函数
  - 迁移 `flyForward()` 函数
  - 迁移 `flyBackward()` 函数

## 3. 抽取宫位映射

- [x] 3.1 创建 `src/core/qimen/GongMapping.ts`
  - 迁移 `GONG_NAMES` 常量（九宫名称）
  - 迁移 `GONG_WUXING` 常量（九宫五行）
  - 迁移 `DI_ZHI_GONG` 常量（地支→宫位映射）
  - 迁移 `ZHONG_GONG_JI` 常量（中宫寄宫）
  - 新增 `CHONG_GONG_MAP` 常量（宫位对冲映射，从 GeJuCalculator 提取）
  - 新增 `GAN_HE_MAP` 常量（天干五合映射，从 GeJuCalculator 提取）

## 4. 抽取阴阳遁与局数核心逻辑

- [x] 4.1 创建 `src/core/qimen/YinYangDunCalculator.ts`
  - 迁移 `JIEQI_JU_MAP` 常量
  - 创建 `getYinYangDun(jieQi: string)` 函数：根据节气判定阴阳遁
  - 创建 `getJuShu(jieQi: string, yuan: YuanType)` 函数：根据节气和元获取局数

## 5. 重构 Services 层以使用 Core

- [x] 5.1 更新 `services/qimen/data/constants.ts`，重新导出 core 层内容：
  - 从 `core/qimen/FlyingRule` 导出: `LUOSHU_ORDER`, `getLuoShuIndex`, `getLuoShuGong`, `flyForward`, `flyBackward`
  - 从 `core/qimen/GongMapping` 导出: `GONG_NAMES`, `GONG_WUXING`, `DI_ZHI_GONG`, `ZHONG_GONG_JI`, `CHONG_GONG_MAP`, `GAN_HE_MAP`
  - 从 `core/qimen/YinYangDunCalculator` 导出: `JIEQI_JU_MAP`
- [x] 5.2 更新 `services/qimen/calculators/JuShuCalculator.ts`
  - 使用 `core/qimen/YinYangDunCalculator`（通过重新导出自动生效）
- [x] 5.3 更新 `services/qimen/calculators/JiuGongCalculator.ts`
  - 使用 `core/qimen/FlyingRule`（通过重新导出自动生效）
  - 使用 `core/qimen/GongMapping`（通过重新导出自动生效）
- [x] 5.4 更新 `services/qimen/calculators/SanQiLiuYiCalculator.ts`
  - 使用 `core/qimen/FlyingRule`（通过重新导出自动生效）
- [x] 5.5 更新 `services/qimen/calculators/BaMenCalculator.ts`
  - 使用 `core/qimen/FlyingRule`（通过重新导出自动生效）
- [x] 5.6 更新 `services/qimen/calculators/JiuXingCalculator.ts`
  - 使用 `core/qimen/FlyingRule`（通过重新导出自动生效）

## 6. 代码质量修复

- [x] 6.1 更新 `GeJuCalculator.ts`，删除重复定义并使用 core 导入：
  - 删除 `DI_ZHI_GONG_MAP`，改为导入 `DI_ZHI_GONG`
  - 删除 `CHONG_GONG_MAP`，改为从 core 导入
  - 删除 `GAN_HE_MAP`，改为从 core 导入
- [x] 6.2 重命名 `checkFuYinFanYinGeJu` 为 `checkFuYinGeJu`
  - 方法只检测伏吟，名称应准确反映功能

## 7. 补充单元测试

- [x] 7.1 创建 `test/core/qimen/` 目录
- [x] 7.2 编写 `FlyingRule.test.ts`
  - 测试 `flyForward()` 在各起始宫位的结果
  - 测试 `flyBackward()` 在各起始宫位的结果
  - 测试中宫(5)的特殊处理
  - 测试步数超过8的环绕情况
- [x] 7.3 编写 `GongMapping.test.ts`
  - 测试 12 地支到宫位的映射正确性
  - 测试 9 宫位名称和五行
  - 测试 4 组宫位对冲关系 (1↔9, 3↔7, 4↔6, 2↔8)
  - 测试天干五合映射
- [x] 7.4 编写 `YinYangDunCalculator.test.ts`
  - 测试 12 个阳遁节气（冬至→芒种）
  - 测试 12 个阴遁节气（夏至→大雪）
  - 测试上中下元的局数计算

## 8. 验证与回归测试

- [x] 8.1 运行 `npm run build` 确保编译通过
- [x] 8.2 运行 `npm run test` 确保所有测试通过（625 tests passed）
- [x] 8.3 手动验证排盘结果与重构前一致
  - 测试阳遁一局（通过现有测试覆盖）
  - 测试阴遁九局（通过现有测试覆盖）
  - 验证格局识别正常（通过现有测试覆盖）

## 9. 清理

- [x] 9.1 移除 `services/qimen/data/constants.ts` 中已迁移到 core 的原始定义
  - 仅保留重新导出语句和奇门业务专用常量
- [x] 9.2 确认无未使用的导入或死代码
  - qimen 相关模块中存在的未使用变量是原有代码问题，非本次重构引入
- [x] 9.3 运行 linter 确保代码风格一致
  - 项目未配置 lint 脚本，TypeScript 编译检查通过
