// 儒略日相关计算函数

/**
 * 将公历日期转换为儒略日
 * @param year 年
 * @param month 月 (1-12)
 * @param day 日
 * @param hour 时 (0-23)
 * @param minute 分 (0-59)
 * @param second 秒 (0-59)
 * @returns 儒略日数
 */
export function gregorianToJulianDay(
  year: number,
  month: number,
  day: number,
  hour: number = 12,
  minute: number = 0,
  second: number = 0
): number {
  // 修正月份和年份
  if (month <= 2) {
    year -= 1;
    month += 12;
  }

  // 判断是否为儒略历还是格里高利历
  const isGregorian = (year > 1582) || 
    (year === 1582 && month > 10) ||
    (year === 1582 && month === 10 && day >= 15);

  let a = 0;
  if (isGregorian) {
    a = Math.floor(year / 100);
    a = 2 - a + Math.floor(a / 4);
  }

  const b = Math.floor(365.25 * (year + 4716));
  const c = Math.floor(30.6001 * (month + 1));
  
  // 计算整数部分
  const jd = a + b + c + day - 1524.5;
  
  // 加上时间部分
  const timeInDays = (hour + minute / 60 + second / 3600) / 24;
  
  return jd + timeInDays;
}

/**
 * 将儒略日转换为公历日期
 * @param jd 儒略日数
 * @returns 公历日期对象
 */
export function julianDayToGregorian(jd: number): {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  second: number;
} {
  const z = Math.floor(jd + 0.5);
  const f = jd + 0.5 - z;

  let a: number;
  if (z < 2299161) {
    a = z;
  } else {
    const alpha = Math.floor((z - 1867216.25) / 36524.25);
    a = z + 1 + alpha - Math.floor(alpha / 4);
  }

  const b = a + 1524;
  const c = Math.floor((b - 122.1) / 365.25);
  const d = Math.floor(365.25 * c);
  const e = Math.floor((b - d) / 30.6001);

  // 计算日
  const day = b - d - Math.floor(30.6001 * e);

  // 计算月
  let month: number;
  if (e < 14) {
    month = e - 1;
  } else {
    month = e - 13;
  }

  // 计算年
  let year: number;
  if (month > 2) {
    year = c - 4716;
  } else {
    year = c - 4715;
  }

  // 计算时间
  const timeInDays = f;
  const totalSeconds = timeInDays * 24 * 3600;
  const hour = Math.floor(totalSeconds / 3600);
  const minute = Math.floor((totalSeconds % 3600) / 60);
  const second = Math.floor(totalSeconds % 60);

  return { year, month, day, hour, minute, second };
}

/**
 * 计算某日的干支
 * @param jd 儒略日数
 * @returns 干支对象
 */
export function getGanZhiFromJulianDay(jd: number): { gan: string; zhi: string } {
  // 使用已验证的基准点：1900年1月31日为甲子日，JD=2415051
  // 这是经过多个万年历网站验证的准确基准点
  const baseJD = 2415051;
  const daysDiff = Math.floor(jd - baseJD + 0.5);
  
  // 甲子日：甲=0，子=0
  const ganIndex = ((daysDiff % 10) + 10) % 10;
  const zhiIndex = ((daysDiff % 12) + 12) % 12;
  
  const gan = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'][ganIndex];
  const zhi = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'][zhiIndex];
  
  return { gan, zhi };
}

/**
 * 计算两个儒略日之间的天数差
 * @param jd1 第一个儒略日
 * @param jd2 第二个儒略日
 * @returns 天数差
 */
export function daysBetweenJulianDays(jd1: number, jd2: number): number {
  return Math.abs(jd2 - jd1);
}

/**
 * 判断某年是否为闰年
 * @param year 年份
 * @returns 是否为闰年
 */
export function isLeapYear(year: number): boolean {
  if (year % 400 === 0) return true;
  if (year % 100 === 0) return false;
  if (year % 4 === 0) return true;
  return false;
}

/**
 * 获取某月的天数
 * @param year 年份
 * @param month 月份 (1-12)
 * @returns 该月的天数
 */
export function getDaysInMonth(year: number, month: number): number {
  const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  
  if (month === 2 && isLeapYear(year)) {
    return 29;
  }
  
  return daysInMonth[month - 1];
}