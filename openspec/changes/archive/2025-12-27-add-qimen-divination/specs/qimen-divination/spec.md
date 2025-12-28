# Qimen Divination Capability

## ADDED Requirements

### Requirement: Qimen Basic Chart Calculation

The system SHALL provide a complete Qimen Dunjia (奇门遁甲) chart calculation service that outputs deterministic structural data for AI interpretation.

#### Scenario: Time-based chart calculation with default settings
- **WHEN** user provides solar date (year, month, day) and hour (0-23)
- **THEN** system calculates the Qimen chart using Chaibu (拆补法) method
- **AND** returns complete nine-palace layout with all elements

#### Scenario: Lunar calendar input
- **WHEN** user provides lunar date with isLunar=true
- **THEN** system converts to solar date before calculation
- **AND** proceeds with normal chart calculation

#### Scenario: Alternative Zhirun method
- **WHEN** user specifies zhiRunMethod='maoshan'
- **THEN** system uses Maoshan (茅山法) algorithm for Yuan determination
- **AND** may produce different Ju number than Chaibu method

#### Scenario: Daily chart calculation
- **WHEN** user specifies panType='日盘'
- **THEN** system calculates daily chart instead of hourly chart
- **AND** uses day stem-branch for Zhifu/Zhishi determination

---

### Requirement: Yin-Yang Dun and Ju Number Calculation

The system SHALL determine the correct Yin-Yang Dun (阴阳遁) and Ju number (局数) based on solar term and time.

#### Scenario: Yang Dun period (Winter Solstice to Summer Solstice)
- **WHEN** current solar term is between Winter Solstice (冬至) and before Summer Solstice (夏至)
- **THEN** system uses Yang Dun (阳遁) with forward flying sequence
- **AND** Ju number is 1-9 based on solar term and Yuan

#### Scenario: Yin Dun period (Summer Solstice to Winter Solstice)
- **WHEN** current solar term is between Summer Solstice (夏至) and before Winter Solstice (冬至)
- **THEN** system uses Yin Dun (阴遁) with backward flying sequence
- **AND** Ju number is 9-1 based on solar term and Yuan

#### Scenario: Yuan determination using Chaibu method
- **WHEN** zhiRunMethod is 'chaibu' (default)
- **THEN** system determines Upper/Middle/Lower Yuan (上中下元) by day Jiazi position
- **AND** calculates Ju number from solar term + Yuan combination

---

### Requirement: Nine Palace Layout

The system SHALL calculate and output the complete nine-palace (九宫) layout following Luoshu (洛书) arrangement.

#### Scenario: Di Pan (地盘) calculation
- **WHEN** Ju number and Yin-Yang Dun are determined
- **THEN** system places San Qi Liu Yi (三奇六仪) on Di Pan
- **AND** Yang Dun starts from Ju position forward, Yin Dun backward

#### Scenario: Tian Pan (天盘) calculation
- **WHEN** Di Pan is established
- **THEN** system flies San Qi Liu Yi based on hour stem position
- **AND** outputs both Di Pan and Tian Pan stems for each palace

#### Scenario: Central palace handling
- **WHEN** calculating palace 5 (中五宫)
- **THEN** system handles central palace according to flying rules
- **AND** properly manages stars/doors that land in central palace

---

### Requirement: Eight Doors Calculation

The system SHALL calculate the Eight Doors (八门) positions for the chart.

#### Scenario: Zhishi Men determination
- **WHEN** Xun Shou (旬首) position is determined
- **THEN** system identifies Zhishi Men (值使门) from original palace door
- **AND** uses it as the flying starting point

#### Scenario: Eight Doors flying
- **WHEN** Zhishi Men is determined
- **THEN** system flies Eight Doors based on hour branch
- **AND** Yang Dun flies forward, Yin Dun flies backward

---

### Requirement: Nine Stars Calculation

The system SHALL calculate the Nine Stars (九星) positions for the chart.

#### Scenario: Zhifu Star determination
- **WHEN** Xun Shou position is determined
- **THEN** system identifies Zhifu Xing (值符星) from original palace star
- **AND** uses it as the flying starting point

#### Scenario: Nine Stars flying
- **WHEN** Zhifu Star is determined
- **THEN** system flies Nine Stars based on hour branch
- **AND** Tianqin (天禽) follows Tianrui (天芮) or stays in designated palace

---

### Requirement: Eight Gods Calculation

The system SHALL calculate the Eight Gods (八神) positions for the chart.

#### Scenario: Zhifu God placement
- **WHEN** Zhifu Star final position is determined
- **THEN** system places Zhifu God (值符神) in same palace as Zhifu Star
- **AND** arranges remaining seven gods from that position

#### Scenario: Eight Gods sequence
- **WHEN** Zhifu God position is set
- **THEN** Yang Dun arranges gods in forward sequence
- **AND** Yin Dun arranges gods in backward sequence

---

### Requirement: Xun Shou Information

The system SHALL calculate and output Xun Shou (旬首) related information.

#### Scenario: Fu Tou identification
- **WHEN** day Gan-Zhi is provided
- **THEN** system identifies the Fu Tou (符头) from six Jia heads
- **AND** determines which Liu Yi represents the hidden Jia

#### Scenario: Kong Wang calculation
- **WHEN** Fu Tou is identified
- **THEN** system calculates the two Kong Wang (空亡) branches
- **AND** marks affected palaces in the output

---

### Requirement: Basic Pattern Recognition

The system SHALL identify basic auspicious and inauspicious patterns (格局) in the chart.

#### Scenario: Auspicious pattern detection
- **WHEN** chart calculation is complete
- **THEN** system checks for auspicious patterns including:
  - San Qi De Shi (三奇得使)
  - San Qi De Men (三奇得门)
  - Jiu Dun patterns (九遁)
  - Yu Nv Shou Men (玉女守门)
- **AND** lists detected patterns with palace locations

#### Scenario: Inauspicious pattern detection
- **WHEN** chart calculation is complete
- **THEN** system checks for inauspicious patterns including:
  - Ru Mu (入墓)
  - Ji Xing (击刑)
  - Liu Yi Ji Xing (六仪击刑)
  - Men Po (门迫)
- **AND** lists detected patterns with palace locations

---

### Requirement: MCP Tool Integration

The system SHALL expose Qimen calculation as an MCP tool named `qimen_basic`.

#### Scenario: Tool invocation with minimal parameters
- **WHEN** user calls qimen_basic with year, month, day, hour
- **THEN** system uses default settings (时盘, 拆补法)
- **AND** returns Markdown-formatted chart output

#### Scenario: Tool invocation with full parameters
- **WHEN** user calls qimen_basic with all optional parameters
- **THEN** system respects panType and zhiRunMethod settings
- **AND** returns chart calculated with specified options

#### Scenario: Error handling
- **WHEN** invalid parameters are provided
- **THEN** system returns clear error message
- **AND** indicates which parameter is invalid

---

### Requirement: Text Output Format

The system SHALL output chart data in Markdown format optimized for AI consumption.

#### Scenario: Basic information section
- **WHEN** rendering chart output
- **THEN** system includes solar/lunar date, four pillars, solar term
- **AND** clearly states Yin-Yang Dun, Ju number, and calculation method

#### Scenario: Nine palace grid visualization
- **WHEN** rendering palace layout
- **THEN** system uses ASCII art 3x3 grid format
- **AND** each cell shows Tian Pan + Di Pan stems, star, door, and god

#### Scenario: Pattern listing
- **WHEN** patterns are detected
- **THEN** system lists patterns with type indicator (吉/凶)
- **AND** includes palace location for each pattern
