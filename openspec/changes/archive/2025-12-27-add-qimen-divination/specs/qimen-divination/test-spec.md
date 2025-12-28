# Qimen Divination Test Specification

## Overview

本文档定义奇门遁甲模块的测试规范，包含验收测试场景、边界条件和预期结果。

---

## 1. 局数计算测试 (JuShuCalculator)

### 1.1 阴阳遁判断

#### Test Case: 阳遁节气验证

| 节气 | 预期阴阳遁 | 说明 |
|-----|-----------|------|
| 冬至 | 阳遁 | 阳遁起点 |
| 小寒 | 阳遁 | |
| 大寒 | 阳遁 | |
| 立春 | 阳遁 | |
| 雨水 | 阳遁 | |
| 惊蛰 | 阳遁 | |
| 春分 | 阳遁 | |
| 清明 | 阳遁 | |
| 谷雨 | 阳遁 | |
| 立夏 | 阳遁 | |
| 小满 | 阳遁 | |
| 芒种 | 阳遁 | 阳遁终点 |

#### Test Case: 阴遁节气验证

| 节气 | 预期阴阳遁 | 说明 |
|-----|-----------|------|
| 夏至 | 阴遁 | 阴遁起点 |
| 小暑 | 阴遁 | |
| 大暑 | 阴遁 | |
| 立秋 | 阴遁 | |
| 处暑 | 阴遁 | |
| 白露 | 阴遁 | |
| 秋分 | 阴遁 | |
| 寒露 | 阴遁 | |
| 霜降 | 阴遁 | |
| 立冬 | 阴遁 | |
| 小雪 | 阴遁 | |
| 大雪 | 阴遁 | 阴遁终点 |

### 1.2 拆补法上中下元

#### Test Case: 旬首与元对应关系

| 日干支所属旬首 | 预期元 |
|--------------|-------|
| 甲子旬 | 上元 |
| 甲午旬 | 上元 |
| 甲戌旬 | 中元 |
| 甲辰旬 | 中元 |
| 甲申旬 | 下元 |
| 甲寅旬 | 下元 |

#### Test Case: 具体日干支测试

```yaml
- input: { dayGanZhi: "甲子" }
  expected: { yuan: "上元", xunShou: "甲子" }

- input: { dayGanZhi: "乙丑" }
  expected: { yuan: "上元", xunShou: "甲子" }

- input: { dayGanZhi: "癸酉" }
  expected: { yuan: "上元", xunShou: "甲子" }

- input: { dayGanZhi: "甲戌" }
  expected: { yuan: "中元", xunShou: "甲戌" }

- input: { dayGanZhi: "甲申" }
  expected: { yuan: "下元", xunShou: "甲申" }
```

### 1.3 茅山法上中下元

#### Test Case: 交节天数与元对应

| 交节后天数 | 预期元 |
|-----------|-------|
| 1-5 天 | 上元 |
| 6-10 天 | 中元 |
| 11-15 天 | 下元 |

### 1.4 局数验证

#### Test Case: 冬至节气局数

| 元 | 预期局数 |
|---|---------|
| 上元 | 1 |
| 中元 | 7 |
| 下元 | 4 |

#### Test Case: 夏至节气局数

| 元 | 预期局数 |
|---|---------|
| 上元 | 9 |
| 中元 | 3 |
| 下元 | 6 |

---

## 2. 地盘计算测试 (JiuGongCalculator)

### 2.1 阳遁地盘布局

#### Test Case: 阳遁一局地盘

```yaml
input:
  juShu: 1
  yinYangDun: "阳遁"

expected:
  gongGan:
    1: "戊"  # 坎宫
    8: "己"  # 艮宫
    3: "庚"  # 震宫
    4: "辛"  # 巽宫
    9: "壬"  # 离宫
    2: "癸"  # 坤宫
    7: "丁"  # 兑宫
    6: "丙"  # 乾宫
    5: "乙"  # 中宫
```

#### Test Case: 阳遁九局地盘

```yaml
input:
  juShu: 9
  yinYangDun: "阳遁"

expected:
  gongGan:
    9: "戊"  # 离宫（起点）
    2: "己"
    7: "庚"
    6: "辛"
    1: "壬"
    8: "癸"
    3: "丁"
    4: "丙"
    5: "乙"
```

### 2.2 阴遁地盘布局

#### Test Case: 阴遁九局地盘

```yaml
input:
  juShu: 9
  yinYangDun: "阴遁"

expected:
  gongGan:
    9: "戊"  # 离宫（起点，逆布）
    4: "己"
    3: "庚"
    8: "辛"
    1: "壬"
    6: "癸"
    7: "丁"
    2: "丙"
    5: "乙"
```

---

## 3. 天盘计算测试 (SanQiLiuYiCalculator)

### 3.1 天盘飞布

#### Test Case: 时干庚，阳遁

```yaml
input:
  hourGan: "庚"
  diPanGanGong: { "庚": 3 }  # 庚在地盘震3宫
  yinYangDun: "阳遁"

expected:
  # 天盘从庚的地盘落宫（震3）开始顺布
  tianPanStartGong: 3
```

### 3.2 甲时处理

#### Test Case: 甲子时

```yaml
input:
  hourGanZhi: "甲子"

expected:
  # 甲遁于戊，使用戊的位置
  dunGan: "戊"
```

#### Test Case: 甲午时

```yaml
input:
  hourGanZhi: "甲午"

expected:
  # 甲午旬首对应辛
  dunGan: "辛"
```

---

## 4. 八门计算测试 (BaMenCalculator)

### 4.1 八门原始宫位

| 门 | 原始宫位 | 宫名 |
|---|---------|-----|
| 休门 | 1 | 坎 |
| 生门 | 8 | 艮 |
| 伤门 | 3 | 震 |
| 杜门 | 4 | 巽 |
| 景门 | 9 | 离 |
| 死门 | 2 | 坤 |
| 惊门 | 7 | 兑 |
| 开门 | 6 | 乾 |

### 4.2 值使门确定

#### Test Case: 值符星落坎1宫

```yaml
input:
  zhiFuGong: 1

expected:
  zhiShiMen: "休"  # 坎宫对应休门
```

### 4.3 八门飞布

#### Test Case: 阳遁，子时

```yaml
input:
  zhiFuGong: 1
  hourZhi: "子"  # 时辰数=1
  yinYangDun: "阳遁"

expected:
  # 值使门从值符落宫起飞0步（子时-1=0）
  zhiShiLuoGong: 1
```

---

## 5. 九星计算测试 (JiuXingCalculator)

### 5.1 九星原始宫位

| 星 | 原始宫位 | 宫名 |
|---|---------|-----|
| 天蓬 | 1 | 坎 |
| 天芮 | 2 | 坤 |
| 天冲 | 3 | 震 |
| 天辅 | 4 | 巽 |
| 天禽 | 5 | 中 |
| 天心 | 6 | 乾 |
| 天柱 | 7 | 兑 |
| 天任 | 8 | 艮 |
| 天英 | 9 | 离 |

### 5.2 值符星确定

#### Test Case: 旬首落坎1宫

```yaml
input:
  xunShouGong: 1

expected:
  zhiFuXing: "蓬"  # 坎宫对应天蓬星
```

---

## 6. 八神计算测试 (BaShenCalculator)

### 6.1 八神顺序

固定顺序：值符 → 腾蛇 → 太阴 → 六合 → 白虎 → 玄武 → 九地 → 九天

### 6.2 八神飞布

#### Test Case: 阳遁，值符落离9宫

```yaml
input:
  zhiFuLuoGong: 9
  yinYangDun: "阳遁"

expected:
  gongShen:
    9: "符"  # 值符
    2: "蛇"  # 腾蛇（顺飞）
    7: "阴"  # 太阴
    6: "合"  # 六合
    1: "虎"  # 白虎
    8: "武"  # 玄武
    3: "地"  # 九地
    4: "天"  # 九天
```

---

## 7. 格局识别测试 (GeJuCalculator)

### 7.1 吉格测试

#### Test Case: 三奇得使

```yaml
condition:
  tianPanGan: ["乙", "丙", "丁"]  # 三奇之一
  men: ["开", "休", "生"]  # 三吉门之一

expected:
  geJu:
    name: "三奇得使"
    type: "吉格"
```

#### Test Case: 天遁

```yaml
condition:
  tianPanGan: "丙"
  men: "生"
  xing: "心"

expected:
  geJu:
    name: "天遁"
    type: "吉格"
```

#### Test Case: 地遁

```yaml
condition:
  tianPanGan: "乙"
  men: "开"
  diPanGan: "己"

expected:
  geJu:
    name: "地遁"
    type: "吉格"
```

#### Test Case: 人遁

```yaml
condition:
  tianPanGan: "丁"
  men: "休"
  shen: "阴"  # 太阴

expected:
  geJu:
    name: "人遁"
    type: "吉格"
```

### 7.2 凶格测试

#### Test Case: 门迫

```yaml
condition:
  # 门克宫
  men: "休"  # 休门属水
  gongWuXing: "火"  # 水克火

expected:
  geJu:
    name: "门迫"
    type: "凶格"
```

#### Test Case: 入墓

```yaml
condition:
  tianPanGan: "乙"
  gong: 6  # 乾宫（戌）

expected:
  geJu:
    name: "三奇入墓"
    type: "凶格"
```

#### Test Case: 六仪击刑

```yaml
condition:
  tianPanGan: "戊"
  gong: 3  # 震宫（卯）

expected:
  geJu:
    name: "六仪击刑"
    type: "凶格"
```

#### Test Case: 五不遇时

```yaml
condition:
  dayGan: "甲"
  hourGan: "戊"  # 甲克戊

expected:
  geJu:
    name: "五不遇时"
    type: "凶格"
```

---

## 8. 集成测试 (QimenService)

### 8.1 完整排盘测试

#### Test Case: 经典案例 - 阳遁一局

```yaml
input:
  year: 2024
  month: 1
  day: 1
  hour: 0  # 子时
  panType: "时盘"
  zhiRunMethod: "chaibu"

expected:
  yinYangDun: "阳遁"
  juShu: 1
  yuan: "上元"
  # 验证九宫布局完整性
  gongs:
    count: 9
    requiredFields: ["gong", "gongName", "diPanGan", "tianPanGan", "men", "xing", "shen", "wuXing"]
```

#### Test Case: 经典案例 - 阴遁九局

```yaml
input:
  year: 2024
  month: 7
  day: 1
  hour: 12  # 午时
  panType: "时盘"
  zhiRunMethod: "chaibu"

expected:
  yinYangDun: "阴遁"
  # 验证阴遁逆飞
```

### 8.2 日盘测试

#### Test Case: 日盘排盘

```yaml
input:
  year: 2024
  month: 3
  day: 15
  hour: 10
  panType: "日盘"

expected:
  panType: "日盘"
  # 日盘使用日干支而非时干支
```

### 8.3 茅山法测试

#### Test Case: 茅山法置闰

```yaml
input:
  year: 2024
  month: 1
  day: 5
  hour: 8
  zhiRunMethod: "maoshan"

expected:
  zhiRunMethod: "maoshan"
  yuan: "上元"  # 交节后第5天
```

### 8.4 农历输入测试

#### Test Case: 农历转公历

```yaml
input:
  year: 2024
  month: 1
  day: 15
  hour: 12
  isLunar: true

expected:
  # 系统正确转换农历并计算
  timeInfo:
    lunarDate: "正月十五"
```

---

## 9. 边界条件测试

### 9.1 节气边界

#### Test Case: 冬至当天

```yaml
input:
  # 冬至当天
  year: 2024
  month: 12
  day: 21

expected:
  yinYangDun: "阳遁"
```

#### Test Case: 夏至当天

```yaml
input:
  # 夏至当天
  year: 2024
  month: 6
  day: 21

expected:
  yinYangDun: "阴遁"
```

### 9.2 时辰边界

#### Test Case: 子时（23:00-01:00）

```yaml
input:
  hour: 23

expected:
  hourZhi: "子"
```

### 9.3 中宫处理

#### Test Case: 天禽落中宫

```yaml
condition:
  # 天禽星原在中5宫
  xing: "禽"

expected:
  # 天禽随天芮或寄坤二
  handling: "寄坤二"
```

---

## 10. 错误处理测试

### 10.1 无效输入

#### Test Case: 无效节气

```yaml
input:
  jieQi: "未知节气"

expected:
  error: true
  message: "未知节气"
```

#### Test Case: 无效年份

```yaml
input:
  year: 1800  # 超出范围

expected:
  error: true
  message: "年份超出有效范围"
```

### 10.2 参数验证

#### Test Case: 缺少必填参数

```yaml
input:
  year: 2024
  # 缺少 month, day, hour

expected:
  error: true
```

---

## 11. 验收标准

### 11.1 功能验收

- [ ] 所有 24 节气正确识别阴阳遁
- [ ] 拆补法和茅山法正确计算上中下元
- [ ] 阳遁 1-9 局地盘布局正确
- [ ] 阴遁 1-9 局地盘布局正确
- [ ] 天盘飞布符合洛书顺序
- [ ] 八门/九星/八神飞布正确
- [ ] 格局识别覆盖所有已实现格局
- [ ] 日盘和时盘差异处理正确
- [ ] 农历/公历转换正确

### 11.2 性能验收

- [ ] 单次排盘计算 < 100ms
- [ ] 无内存泄漏

### 11.3 输出验收

- [ ] Markdown 格式正确
- [ ] ASCII 九宫格可读
- [ ] 格局列表完整

---

## 12. 测试数据参考

### 12.1 六十甲子索引

```
甲子(0)  乙丑(1)  丙寅(2)  丁卯(3)  戊辰(4)  己巳(5)  庚午(6)  辛未(7)  壬申(8)  癸酉(9)
甲戌(10) 乙亥(11) 丙子(12) 丁丑(13) 戊寅(14) 己卯(15) 庚辰(16) 辛巳(17) 壬午(18) 癸未(19)
甲申(20) 乙酉(21) 丙戌(22) 丁亥(23) 戊子(24) 己丑(25) 庚寅(26) 辛卯(27) 壬辰(28) 癸巳(29)
甲午(30) 乙未(31) 丙申(32) 丁酉(33) 戊戌(34) 己亥(35) 庚子(36) 辛丑(37) 壬寅(38) 癸卯(39)
甲辰(40) 乙巳(41) 丙午(42) 丁未(43) 戊申(44) 己酉(45) 庚戌(46) 辛亥(47) 壬子(48) 癸丑(49)
甲寅(50) 乙卯(51) 丙辰(52) 丁巳(53) 戊午(54) 己未(55) 庚申(56) 辛酉(57) 壬戌(58) 癸亥(59)
```

### 12.2 洛书九宫

```
┌───┬───┬───┐
│ 4 │ 9 │ 2 │  巽  离  坤
├───┼───┼───┤
│ 3 │ 5 │ 7 │  震  中  兑
├───┼───┼───┤
│ 8 │ 1 │ 6 │  艮  坎  乾
└───┴───┴───┘
```

### 12.3 洛书飞布顺序

顺飞: 1 → 8 → 3 → 4 → 9 → 2 → 7 → 6 → (循环)
逆飞: 1 → 6 → 7 → 2 → 9 → 4 → 3 → 8 → (循环)
