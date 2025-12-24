# 奇门遁甲实现任务清单

## 1. 基础框架

- [ ] 1.1 创建目录结构 `src/services/qimen/`
- [ ] 1.2 编写 `types.ts` 类型定义
  - 基础类型（TianGan, DiZhi, GongWei, YinYangDun, JuShu）
  - 核心类型（SanQiLiuYi, BaMen, JiuXing, BaShen）
  - 输入输出类型（QimenInput, QimenResult, GongInfo）
  - 中间类型（DiPanInfo, TianPanInfo, XunShouInfo）
  - 错误类型（QimenCalculationError）
  - 服务配置类型（QimenServiceConfig）
- [ ] 1.3 编写 `data/constants.ts` 常量数据
  - 天干地支序列（TIAN_GAN, DI_ZHI）
  - 三奇六仪顺序（SAN_QI_LIU_YI, LIU_YI_MAP）
  - 八门/九星/八神原始宫位映射
  - 八门/九星/八神全称映射（用于渲染器：BA_MEN_FULL, JIU_XING_FULL, BA_SHEN_FULL）
  - 九宫名称和五行（GONG_NAMES, GONG_WUXING）
  - 节气局数映射表（JIEQI_JU_MAP）
  - 六十甲子表和旬空表（JIA_ZI_60, XUN_KONG）
  - 洛书飞布顺序（LUOSHU_ORDER）
- [ ] 1.4 创建 `index.ts` 模块导出
  - 导出 QimenService
  - 导出所有类型
  - 导出所有计算器
  - 导出常量数据（供渲染器使用）

## 2. 局数计算器

- [ ] 2.1 实现 `JuShuCalculator.ts`
  - 根据节气确定阴阳遁
  - 实现拆补法上中下元判断
  - 实现茅山法上中下元判断
  - 输出最终局数
- [ ] 2.2 编写局数计算单元测试
  - 测试阳遁各节气
  - 测试阴遁各节气
  - 测试两种置闰法差异

## 3. 九宫计算器

- [ ] 3.1 实现 `JiuGongCalculator.ts`
  - 计算地盘布局（阳遁顺布/阴遁逆布）
  - 实现根据干找落宫
  - 实现洛书飞布顺序
- [ ] 3.2 编写九宫计算单元测试

## 4. 三奇六仪计算器

- [ ] 4.1 实现 `SanQiLiuYiCalculator.ts`
  - 计算天盘干布局
  - 根据时干确定起点
  - 处理中宫寄宫逻辑
- [ ] 4.2 编写三奇六仪单元测试

## 5. 八门计算器

- [ ] 5.1 实现 `BaMenCalculator.ts`
  - 确定值使门（旬首落宫对应的门）
  - 根据时辰飞布八门
  - 阳遁顺布/阴遁逆布
  - 处理中宫门寄宫
- [ ] 5.2 编写八门计算单元测试

## 6. 九星计算器

- [ ] 6.1 实现 `JiuXingCalculator.ts`
  - 确定值符星（旬首落宫对应的星）
  - 根据时辰飞布九星
  - 天禽随天芮（或寄坤二）
- [ ] 6.2 编写九星计算单元测试

## 7. 八神计算器

- [ ] 7.1 实现 `BaShenCalculator.ts`
  - 值符神临值符星落宫
  - 阳遁顺布/阴遁逆布
- [ ] 7.2 编写八神计算单元测试

## 8. 主服务类

- [ ] 8.1 实现 `QimenService.ts`
  - 时间标准化处理（复用 normalizeBirthDateTime）
  - 获取四柱和节气信息（复用 lunar-javascript）
  - 编排各计算器调用
  - 构建完整结果
  - 集成 Logger（参考 BaziService/ZiweiService）
  - 错误处理（抛出 QimenCalculationError）
- [ ] 8.2 实现旬首信息计算
  - 符头判断
  - 值符星/值使门确定
  - 空亡计算
- [ ] 8.3 实现时盘/日盘差异处理
  - 时盘：以时辰定值符值使
  - 日盘：以日定值符值使
- [ ] 8.4 编写服务层集成测试

## 9. 格局计算器

- [ ] 9.1 实现 `GeJuCalculator.ts`
  - 识别吉格（三奇得使、九遁等）
  - 识别凶格（入墓、击刑等）
- [ ] 9.2 添加约 20-30 种基础格局规则
- [ ] 9.3 编写格局判断单元测试

## 10. 渲染器

- [ ] 10.1 创建 `src/output/qimenTextRenderer.ts`
  - 基本信息渲染
  - 九宫格 ASCII 艺术渲染
  - 旬首信息渲染
  - 格局列表渲染
- [ ] 10.2 编写渲染器单元测试

## 11. MCP 集成

- [ ] 11.1 在 `src/index.ts` 添加导入语句
  - `import { QimenService } from "./services/qimen/QimenService";`
  - `import { renderQimenText } from "./output/qimenTextRenderer";`
- [ ] 11.2 添加 Zod Schema 定义
  ```typescript
  const QimenBasicSchema = z.object({
    year: z.number().int().min(1900).max(2100),
    month: z.number().int().min(1).max(12),
    day: z.number().int().min(1).max(31),
    hour: z.number().int().min(0).max(23),
    isLunar: isLunarField,
    panType: z.enum(['时盘', '日盘']).optional().default('时盘'),
    zhiRunMethod: z.enum(['chaibu', 'maoshan']).optional().default('chaibu'),
  });
  ```
- [ ] 11.3 在 tools 数组中注册 `qimen_basic` 工具
  - 工具名称和描述
  - inputSchema 绑定
- [ ] 11.4 实现 Handler
  - 参数验证
  - 调用 QimenService.calculate()
  - 调用 renderQimenText()
  - 返回 MCP 标准格式
- [ ] 11.5 编写 MCP 工具集成测试

## 12. 文档和验证

- [ ] 12.1 更新 README.md 添加奇门遁甲说明
- [ ] 12.2 添加使用示例
- [ ] 12.3 完整功能验收测试
- [ ] 12.4 与现有术数服务对比验证

## 依赖关系

```
1.基础框架 ──┬── 2.局数计算器 ──┬── 3.九宫计算器 ──┐
             │                   │                  │
             │                   └── 4.三奇六仪 ────┤
             │                                      │
             │   ┌─────────────────────────────────┘
             │   │
             ├── 5.八门计算器 ──┐
             │                   │
             ├── 6.九星计算器 ──┼── 8.主服务类 ── 9.格局计算器
             │                   │
             └── 7.八神计算器 ──┘
                                 │
                                 └── 10.渲染器 ── 11.MCP集成 ── 12.文档验证
```

## 可并行任务

- 任务 5、6、7（八门/九星/八神计算器）可并行开发
- 任务 9（格局计算器）和 任务 10（渲染器）可并行开发
