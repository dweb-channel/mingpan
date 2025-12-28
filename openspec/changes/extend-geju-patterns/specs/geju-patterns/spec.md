# GeJu Patterns Extension Capability

## ADDED Requirements

### Requirement: Fan Yin Pattern Recognition (反吟格局)

The system SHALL detect Fan Yin (反吟) patterns where Tian Pan and Di Pan stems are in opposing positions.

#### Scenario: Tian Di Fan Yin (天地反吟)
- **WHEN** Tian Pan stem at a palace is the Chong (冲) of Di Pan stem
- **THEN** system identifies "天地反吟" pattern
- **AND** marks the pattern as "中性" type with affected palaces

#### Scenario: Xing Men Fan Yin (星门反吟)
- **WHEN** Zhifu Star lands in the palace opposite to its original palace
- **THEN** system identifies "星反吟" pattern
- **AND** Zhishi Men in opposite palace triggers "门反吟" pattern

#### Scenario: Chong Palace Mapping
- **WHEN** checking for Fan Yin patterns
- **THEN** system uses correct Chong palace pairs:
  - Palace 1 (坎) vs Palace 9 (离)
  - Palace 3 (震) vs Palace 7 (兑)
  - Palace 4 (巽) vs Palace 6 (乾)
  - Palace 2 (坤) vs Palace 8 (艮)

---

### Requirement: Qi Yi Xiang He Pattern Recognition (奇仪相合)

The system SHALL detect Qi Yi Xiang He (奇仪相合) patterns based on Tian Gan five-element combinations.

#### Scenario: Yi Geng He (乙庚合)
- **WHEN** Tian Pan has 乙 and Di Pan has 庚 (or vice versa) in same palace
- **THEN** system identifies "乙庚合" pattern
- **AND** marks as "吉格" (Wood-Metal combination, generates Water)

#### Scenario: Bing Xin He (丙辛合)
- **WHEN** Tian Pan has 丙 and Di Pan has 辛 (or vice versa) in same palace
- **THEN** system identifies "丙辛合" pattern
- **AND** marks as "吉格" (Fire-Metal combination, generates Water)

#### Scenario: Ding Ren He (丁壬合)
- **WHEN** Tian Pan has 丁 and Di Pan has 壬 (or vice versa) in same palace
- **THEN** system identifies "丁壬合" pattern
- **AND** marks as "吉格" (Fire-Water combination, generates Wood)

#### Scenario: Wu Gui He (戊癸合)
- **WHEN** Tian Pan has 戊 and Di Pan has 癸 (or vice versa) in same palace
- **THEN** system identifies "戊癸合" pattern
- **AND** marks as "吉格" (Earth-Water combination, generates Fire)

#### Scenario: Ji Jia He (己甲合)
- **WHEN** Tian Pan has 己 and Di Pan has 甲 (via Liu Yi) in same palace
- **THEN** system identifies "己甲合" pattern
- **AND** marks as "吉格" (Earth-Wood combination, generates Soil)

---

### Requirement: Fei Gan Fu Gan Pattern Recognition (飞干格/伏干格)

The system SHALL detect Fei Gan (飞干格) and Fu Gan (伏干格) patterns based on day stem relationships.

#### Scenario: Fei Gan Ge (飞干格)
- **WHEN** hour stem on Tian Pan lands in the palace of day stem on Di Pan
- **THEN** system identifies "飞干格" pattern
- **AND** marks as "凶格" (hour interferes with day)

#### Scenario: Fu Gan Ge (伏干格)
- **WHEN** day stem on Tian Pan lands in the palace of hour stem on Di Pan
- **THEN** system identifies "伏干格" pattern
- **AND** marks as "凶格" (day suppresses hour)

---

### Requirement: Tian Xian Shi Pattern Recognition (天显时格)

The system SHALL detect Tian Xian Shi (天显时格) patterns for specific auspicious timing.

#### Scenario: Tian Xian Shi Detection
- **WHEN** San Qi (乙丙丁) lands on the palace matching hour branch location
- **AND** palace has auspicious door (开休生)
- **THEN** system identifies "天显时格" pattern
- **AND** marks as "吉格"

#### Scenario: Hour Branch Palace Mapping
- **WHEN** determining hour branch location
- **THEN** system uses correct mapping:
  - 子 → 坎1, 丑 → 艮8, 寅 → 艮8, 卯 → 震3
  - 辰 → 巽4, 巳 → 巽4, 午 → 离9, 未 → 坤2
  - 申 → 坤2, 酉 → 兑7, 戌 → 乾6, 亥 → 乾6

---

### Requirement: Di Si Men Pattern Recognition (地私门格)

The system SHALL detect Di Si Men (地私门格) pattern for specific inauspicious timing.

#### Scenario: Di Si Men Detection
- **WHEN** Liu Yi (六仪) lands on the palace matching hour branch location
- **AND** palace has inauspicious door (死惊杜)
- **THEN** system identifies "地私门格" pattern
- **AND** marks as "凶格"

---

### Requirement: Wang Gai Pattern Recognition (网盖格)

The system SHALL detect Wang Gai (网盖格) patterns where palaces are obstructed.

#### Scenario: Tian Wang Si Zhang (天网四张)
- **WHEN** 戊 lands in palace 6 (乾) with 死 or 惊 door
- **THEN** system identifies "天网四张" pattern
- **AND** marks as "凶格" (blocked in all directions)

#### Scenario: Di Wang Gai (地网盖)
- **WHEN** 癸 lands in palace 4 (巽) and oppressed by inauspicious elements
- **THEN** system identifies "地网盖" pattern
- **AND** marks as "凶格" (ground obstruction)

---

### Requirement: Tian Lao Pattern Recognition (天牢格)

The system SHALL detect Tian Lao (天牢格) patterns for imprisonment indication.

#### Scenario: Tian Lao Basic Detection
- **WHEN** day stem or hour stem lands in a palace
- **AND** palace has 庚 on Tian Pan with 开 door and 白虎 god
- **THEN** system identifies "天牢" pattern
- **AND** marks as "凶格"

#### Scenario: Tian Lao Alternative
- **WHEN** 庚 on Tian Pan with 杜 door forms blocking pattern
- **THEN** system identifies "天牢" pattern variant
- **AND** marks as "凶格"

---

## MODIFIED Requirements

### Requirement: Updated calculate() Method Signature

The GeJuCalculator.calculate() method SHALL accept additional parameter for hour branch.

#### Scenario: Extended Method Signature
- **WHEN** GeJuCalculator.calculate() is invoked
- **THEN** method accepts new parameter `hourZhi: DiZhi` after `hourGan`
- **AND** QimenService passes `siZhu.hourZhi` when calling calculate()

#### Scenario: Complete Pattern Detection
- **WHEN** calculate() is called with complete chart data
- **THEN** system checks all existing patterns (三奇, 九遁, 门迫, etc.)
- **AND** additionally checks: 反吟, 奇仪相合, 飞干格, 伏干格, 天显时格, 地私门格, 网盖格, 天牢格
- **AND** returns combined list of all detected patterns

### Requirement: QimenService Integration Update

The QimenService SHALL pass hourZhi to GeJuCalculator.

#### Scenario: Passing Hour Branch
- **WHEN** QimenService calls GeJuCalculator.calculate()
- **THEN** siZhu.hourZhi is passed as parameter
- **AND** enables time-based pattern detection (天显时格, 地私门格)
