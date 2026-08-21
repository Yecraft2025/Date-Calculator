import { DetailedDifference, WeekendMode } from '../types/date';

/**
 * Format a Date object as 'YYYY-MM-DD' in local timezone.
 */
export function formatDateStr(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/**
 * Parse 'YYYY-MM-DD' string safely to local Date at midnight.
 */
export function parseDateStr(str: string): Date {
  if (!str) return new Date();
  const parts = str.split('-');
  if (parts.length !== 3) return new Date();
  const y = parseInt(parts[0], 10);
  const m = parseInt(parts[1], 10) - 1;
  const d = parseInt(parts[2], 10);
  return new Date(y, m, d);
}

/**
 * Get Today's date as YYYY-MM-DD
 */
export function getTodayStr(): string {
  return formatDateStr(new Date());
}

/**
 * Calculate difference in days between two date strings.
 * If end date is before start date, returns negative value unless absolute requested.
 */
export function calculateDaysDiff(startStr: string, endStr: string, includeEndDate: boolean = false): number {
  const start = parseDateStr(startStr);
  const end = parseDateStr(endStr);
  
  // Normalize midnights
  const t1 = Date.UTC(start.getFullYear(), start.getMonth(), start.getDate());
  const t2 = Date.UTC(end.getFullYear(), end.getMonth(), end.getDate());
  
  const diffDays = Math.round((t2 - t1) / (1000 * 60 * 60 * 24));
  
  if (!includeEndDate) {
    return diffDays;
  }
  
  if (diffDays >= 0) {
    return diffDays + 1;
  } else {
    return diffDays - 1;
  }
}

/**
 * Calculate End Date from Start Date + Days Diff
 */
export function calculateEndDate(startStr: string, daysDiff: number, includeEndDate: boolean = false): string {
  const start = parseDateStr(startStr);
  let daysToAdd = daysDiff;
  
  if (includeEndDate) {
    if (daysDiff > 0) {
      daysToAdd = daysDiff - 1;
    } else if (daysDiff < 0) {
      daysToAdd = daysDiff + 1;
    } else {
      daysToAdd = 0;
    }
  }
  
  const result = new Date(start.getFullYear(), start.getMonth(), start.getDate() + daysToAdd);
  return formatDateStr(result);
}

/**
 * Calculate Start Date from End Date - Days Diff
 */
export function calculateStartDate(endStr: string, daysDiff: number, includeEndDate: boolean = false): string {
  const end = parseDateStr(endStr);
  let daysToSubtract = daysDiff;
  
  if (includeEndDate) {
    if (daysDiff > 0) {
      daysToSubtract = daysDiff - 1;
    } else if (daysDiff < 0) {
      daysToSubtract = daysDiff + 1;
    } else {
      daysToSubtract = 0;
    }
  }
  
  const result = new Date(end.getFullYear(), end.getMonth(), end.getDate() - daysToSubtract);
  return formatDateStr(result);
}

/**
 * Calculate comprehensive breakdown between two date strings
 */
export function getDetailedBreakdown(
  startStr: string,
  endStr: string,
  includeEndDate: boolean = false,
  weekendMode: WeekendMode = 'sat_sun'
): DetailedDifference {
  let start = parseDateStr(startStr);
  let end = parseDateStr(endStr);
  let isNegative = false;

  if (end < start) {
    isNegative = true;
    const temp = start;
    start = end;
    end = temp;
  }

  // Raw diff days
  const rawDiffDays = Math.round(
    (Date.UTC(end.getFullYear(), end.getMonth(), end.getDate()) -
     Date.UTC(start.getFullYear(), start.getMonth(), start.getDate())) / (1000 * 60 * 60 * 24)
  );

  const totalDays = includeEndDate ? rawDiffDays + 1 : rawDiffDays;

  // Workdays calculation
  let workdays = 0;
  let weekendDays = 0;
  const curr = new Date(start);
  const endLoop = new Date(end);
  if (!includeEndDate) {
    endLoop.setDate(endLoop.getDate() - 1);
  }

  if (start <= endLoop) {
    while (curr <= endLoop) {
      const dayOfWeek = curr.getDay(); // 0 is Sunday, 6 is Saturday
      let isWeekend = false;
      if (weekendMode === 'sat_sun') {
        isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
      } else if (weekendMode === 'sun_only') {
        isWeekend = dayOfWeek === 0;
      } else {
        isWeekend = false;
      }

      if (isWeekend) {
        weekendDays++;
      } else {
        workdays++;
      }
      curr.setDate(curr.getDate() + 1);
    }
  }

  // Y/M/D breakdown
  let years = end.getFullYear() - start.getFullYear();
  let months = end.getMonth() - start.getMonth();
  let days = end.getDate() - start.getDate();

  if (includeEndDate) {
    days += 1;
  }

  if (days < 0) {
    months -= 1;
    // Get last day of previous month
    const prevMonthEnd = new Date(end.getFullYear(), end.getMonth(), 0).getDate();
    days += prevMonthEnd;
  }

  if (months < 0) {
    years -= 1;
    months += 12;
  }

  const weeks = Math.floor(totalDays / 7);
  const remainingDaysInWeeks = totalDays % 7;

  return {
    totalDays: isNegative ? -totalDays : totalDays,
    workdays,
    weekendDays,
    weeks,
    remainingDaysInWeeks,
    years: Math.max(0, years),
    months: Math.max(0, months),
    days: Math.max(0, days),
    totalHours: Math.abs(totalDays) * 24,
    totalMinutes: Math.abs(totalDays) * 24 * 60,
    totalSeconds: Math.abs(totalDays) * 24 * 3600,
    isNegative,
  };
}

/**
 * Add or subtract business days (skipping weekends based on mode)
 */
export function addBusinessDays(
  startStr: string,
  days: number,
  weekendMode: WeekendMode = 'sat_sun'
): string {
  let curr = parseDateStr(startStr);
  let added = 0;
  const direction = days >= 0 ? 1 : -1;
  const target = Math.abs(days);

  while (added < target) {
    curr.setDate(curr.getDate() + direction);
    const dow = curr.getDay();
    let isWeekend = false;
    if (weekendMode === 'sat_sun') {
      isWeekend = dow === 0 || dow === 6;
    } else if (weekendMode === 'sun_only') {
      isWeekend = dow === 0;
    }

    if (!isWeekend) {
      added++;
    }
  }

  return formatDateStr(curr);
}

/**
 * Get Chinese Zodiac sign for year
 */
export function getChineseZodiac(year: number): string {
  const zodiacs = ['鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊', '猴', '鸡', '狗', '猪'];
  // 1900 is Year of the Rat
  const index = (year - 1900) % 12;
  return zodiacs[index < 0 ? index + 12 : index];
}

/**
 * Get Western Zodiac constellation sign
 */
export function getZodiacSign(month: number, day: number): { name: string; symbol: string } {
  const dates = [20, 19, 21, 20, 21, 22, 23, 23, 23, 24, 23, 22];
  const signs = [
    { name: '摩羯座', symbol: '♑' },
    { name: '水瓶座', symbol: '♒' },
    { name: '双鱼座', symbol: '♓' },
    { name: '白羊座', symbol: '♈' },
    { name: '金牛座', symbol: '♉' },
    { name: '双子座', symbol: '♊' },
    { name: '巨蟹座', symbol: '♋' },
    { name: '狮子座', symbol: '♌' },
    { name: '处女座', symbol: '♍' },
    { name: '天秤座', symbol: '♎' },
    { name: '天蝎座', symbol: '♏' },
    { name: '射手座', symbol: '♐' },
    { name: '摩羯座', symbol: '♑' },
  ];
  const index = day < dates[month - 1] ? month - 1 : month;
  return signs[index];
}

/**
 * Day of the week in Chinese
 */
export function getDayOfWeekCn(dateStr: string): string {
  const date = parseDateStr(dateStr);
  const days = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
  return days[date.getDay()];
}

/**
 * Is leap year?
 */
export function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}
