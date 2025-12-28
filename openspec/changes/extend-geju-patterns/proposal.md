# Proposal: Extend GeJu Patterns Recognition

## Summary

扩展奇门遁甲格局识别功能，补充当前缺失的格局类型，包括反吟格局、奇仪相合、飞干格/伏干格、天显时格、地私门格、网盖格、天牢格等。

## Motivation

当前 GeJuCalculator 已实现 15 种格局识别（三奇得使、九遁、门迫、入墓、六仪击刑、五不遇时、伏吟、青龙逃走、白虎猖狂等），但仍缺少一些重要的格局：

1. **反吟格局** - 天盘地盘相冲（与伏吟相对）
2. **奇仪相合** - 乙庚合、丙辛合、丁壬合等天干相合
3. **飞干格/伏干格** - 天盘干与地盘干的特殊组合
4. **天显时格** - 特定时辰的吉格
5. **地私门格** - 门与时辰的关系
6. **网盖格** - 天盘地盘特殊关系
7. **天牢格** - 特定凶格

## Scope

### In Scope

- 在 GeJuCalculator 中新增 7 类格局识别方法
- 为每类格局编写完整的测试用例
- 更新类型定义（如需要）

### Out of Scope

- 不修改现有格局识别逻辑
- 不修改 QimenService 接口
- 不涉及 MCP 工具层面的改动

## Technical Approach

在 `GeJuCalculator.ts` 中扩展 `calculate()` 方法，新增以下检查方法：

1. `checkFanYinGeJu()` - 反吟格局检测
2. `checkQiYiXiangHeGeJu()` - 奇仪相合检测
3. `checkFeiGanFuGanGeJu()` - 飞干格/伏干格检测
4. `checkTianXianShiGeJu()` - 天显时格检测
5. `checkDiSiMenGeJu()` - 地私门格检测
6. `checkWangGaiGeJu()` - 网盖格检测
7. `checkTianLaoGeJu()` - 天牢格检测

## Dependencies

- 依赖现有 `add-qimen-divination` 提案的完成
- 无外部依赖

## Risks

- **低风险**：纯增量功能，不影响现有逻辑
- 格局定义需确保与传统奇门理论一致

## Success Criteria

- 所有新增格局有对应的单元测试
- 通过真实案例验证格局识别准确性
- 测试覆盖率保持 100%
