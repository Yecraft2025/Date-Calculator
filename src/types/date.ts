export type LinkageMode = 'calc_diff' | 'calc_end' | 'calc_start';

export type WeekendMode = 'sat_sun' | 'sun_only' | 'none';

export interface DateCalcState {
  startDate: string; // YYYY-MM-DD
  endDate: string;   // YYYY-MM-DD
  daysDiff: number;  // integer
  includeEndDate: boolean; // 是否包含起始/结束当天
  weekendMode: WeekendMode; // 周末设置
  activeMode: LinkageMode;  // 当前推算哪一个参数
}

export interface DetailedDifference {
  totalDays: number;
  workdays: number;
  weekendDays: number;
  weeks: number;
  remainingDaysInWeeks: number;
  years: number;
  months: number;
  days: number;
  totalHours: number;
  totalMinutes: number;
  totalSeconds: number;
  isNegative: boolean;
}

export interface SavedHistoryItem {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  daysDiff: number;
  includeEndDate: boolean;
  createdAt: number;
  note?: string;
  tags?: string[];
}

export interface HolidayPreset {
  name: string;
  date: string; // YYYY-MM-DD or MM-DD
  isLunar?: boolean;
  category: 'holiday' | 'custom' | 'commemorative';
}
