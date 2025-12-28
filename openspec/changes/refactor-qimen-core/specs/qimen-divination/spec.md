## ADDED Requirements

### Requirement: Core Layer Architecture

The system SHALL provide a core layer (`core/qimen/`) containing reusable, pure mathematical calculations that are independent of Qimen business logic.

#### Scenario: Core layer type definitions
- **WHEN** core/qimen modules need basic types (TianGan, DiZhi, GongWei, etc.)
- **THEN** they import from `core/qimen/types.ts`
- **AND** no reverse dependency on services layer exists

#### Scenario: Reusable flying rule calculations
- **WHEN** any calculator needs to perform Luoshu flying operations
- **THEN** it imports from `core/qimen/FlyingRule`
- **AND** the flying logic is not duplicated across calculators

#### Scenario: Centralized Gong mapping
- **WHEN** any component needs Gong-related constants (names, Wuxing, DiZhi mapping)
- **THEN** it imports from `core/qimen/GongMapping`
- **AND** no duplicate definitions exist in service layer

---

### Requirement: Flying Rule Core Calculations

The system SHALL provide Luoshu (洛书) flying rule calculations in the core layer.

#### Scenario: Forward flying from any palace
- **WHEN** a starting palace (1-9) and step count is provided
- **THEN** system returns the target palace following Luoshu forward sequence
- **AND** the calculation handles central palace (5) by substituting with palace 2

#### Scenario: Backward flying from any palace
- **WHEN** a starting palace (1-9) and step count is provided
- **THEN** system returns the target palace following Luoshu backward sequence
- **AND** the calculation handles central palace (5) by substituting with palace 2

#### Scenario: Step wrap-around
- **WHEN** step count exceeds 8
- **THEN** system correctly wraps around the Luoshu sequence
- **AND** returns the correct target palace

---

### Requirement: Gong Mapping Core Data

The system SHALL provide palace mapping data in the core layer.

#### Scenario: Di Zhi to Gong mapping
- **WHEN** a valid Di Zhi (地支) is provided
- **THEN** system returns the corresponding Gong Wei (宫位)
- **AND** the mapping is available from `core/qimen/GongMapping`

#### Scenario: Gong names and Wu Xing
- **WHEN** a valid Gong Wei (1-9) is provided
- **THEN** system returns the Gong name (坎/坤/震/巽/中/乾/兑/艮/离)
- **AND** system returns the Gong Wu Xing (五行)

#### Scenario: Gong opposition mapping
- **WHEN** calculating Fanyin (反吟) patterns
- **THEN** system uses `CHONG_GONG_MAP` from `core/qimen/GongMapping`
- **AND** the opposition relationships are: 1↔9, 3↔7, 4↔6, 2↔8

#### Scenario: Tian Gan Wu He mapping
- **WHEN** calculating Qi Yi Xiang He (奇仪相合) patterns
- **THEN** system uses `GAN_HE_MAP` from `core/qimen/GongMapping`
- **AND** the Wu He relationships are: 乙↔庚, 丙↔辛, 丁↔壬, 戊↔癸

---

### Requirement: Yin-Yang Dun Core Calculation

The system SHALL provide Yin-Yang Dun (阴阳遁) determination in the core layer.

#### Scenario: Determine Yin-Yang Dun from Jie Qi
- **WHEN** a valid solar term (节气) name is provided
- **THEN** system returns whether it is Yang Dun (阳遁) or Yin Dun (阴遁)
- **AND** the calculation is available from `core/qimen/YinYangDunCalculator`

#### Scenario: Get Ju number from Jie Qi and Yuan
- **WHEN** a valid solar term (节气) name and Yuan (上元/中元/下元) is provided
- **THEN** system returns the corresponding Ju Shu (局数, 1-9)
- **AND** the calculation is available from `core/qimen/YinYangDunCalculator`

---

### Requirement: Code Quality Standards

The system SHALL maintain code quality by eliminating duplication and ensuring clear naming.

#### Scenario: No duplicate constant definitions
- **WHEN** a constant (like DI_ZHI_GONG) is needed in multiple places
- **THEN** it is defined once in the core layer
- **AND** other modules import from the single source of truth

#### Scenario: GeJuCalculator uses core imports
- **WHEN** GeJuCalculator needs DI_ZHI_GONG, CHONG_GONG_MAP, or GAN_HE_MAP
- **THEN** it imports from `core/qimen/GongMapping`
- **AND** no local duplicate definitions exist

#### Scenario: Method names reflect functionality
- **WHEN** a method only checks for Fuyin (伏吟) patterns
- **THEN** it is named `checkFuYinGeJu` (not `checkFuYinFanYinGeJu`)
- **AND** method names accurately describe their scope

---

### Requirement: Unit Test Coverage

The system SHALL have unit tests for core Qimen calculations.

#### Scenario: Flying rule tests
- **WHEN** running test suite
- **THEN** FlyingRule module has tests for forward and backward flying
- **AND** edge cases (central palace, wrap-around) are covered

#### Scenario: Gong mapping tests
- **WHEN** running test suite
- **THEN** GongMapping module has tests for all mappings
- **AND** DiZhi to Gong, Gong opposition, and Gan Wu He mappings are verified

#### Scenario: Yin-Yang Dun tests
- **WHEN** running test suite
- **THEN** YinYangDunCalculator has tests for all 24 solar terms
- **AND** both Yang Dun and Yin Dun periods are tested
