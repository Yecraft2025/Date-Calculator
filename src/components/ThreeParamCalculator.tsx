import React, { useState, useEffect } from 'react';
import {
  ArrowRight,
  RefreshCw,
  Copy,
  Check,
  Plus,
  Minus,
  BookmarkPlus,
} from 'lucide-react';
import {
  LinkageMode,
  SavedHistoryItem,
} from '../types/date';
import {
  formatDateStr,
  getTodayStr,
  calculateDaysDiff,
  calculateEndDate,
  calculateStartDate,
  getDetailedBreakdown,
  getDayOfWeekCn,
  parseDateStr,
} from '../utils/dateUtils';
import { CustomDatePicker } from './CustomDatePicker';

interface ThreeParamCalculatorProps {
  onSaveHistory: (item: Omit<SavedHistoryItem, 'id' | 'createdAt'>) => void;
  loadedRecord?: SavedHistoryItem | null;
}

export const ThreeParamCalculator: React.FC<ThreeParamCalculatorProps> = ({
  onSaveHistory,
  loadedRecord,
}) => {
  const today = getTodayStr();

  // Core State
  const [startDate, setStartDate] = useState<string>(today);
  const [endDate, setEndDate] = useState<string>(() => {
    return calculateEndDate(today, 30, false);
  });
  const [daysDiff, setDaysDiff] = useState<number>(30);
  const [includeEndDate, setIncludeEndDate] = useState<boolean>(false);
  const [activeMode, setActiveMode] = useState<LinkageMode>('calc_diff');

  // UI state
  const [copied, setCopied] = useState<boolean>(false);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);
  const [noteInput, setNoteInput] = useState<string>('');
  const [showSaveModal, setShowSaveModal] = useState<boolean>(false);

  // Sync state when a history record is loaded from outside
  useEffect(() => {
    if (loadedRecord) {
      setStartDate(loadedRecord.startDate);
      setEndDate(loadedRecord.endDate);
      setDaysDiff(loadedRecord.daysDiff);
      setIncludeEndDate(loadedRecord.includeEndDate);
      setActiveMode('calc_diff');
    }
  }, [loadedRecord]);

  // Sync calculations whenever inputs or active mode change
  useEffect(() => {
    if (activeMode === 'calc_diff') {
      const computedDiff = calculateDaysDiff(startDate, endDate, includeEndDate);
      setDaysDiff(computedDiff);
    } else if (activeMode === 'calc_end') {
      const computedEnd = calculateEndDate(startDate, daysDiff, includeEndDate);
      setEndDate(computedEnd);
    } else if (activeMode === 'calc_start') {
      const computedStart = calculateStartDate(endDate, daysDiff, includeEndDate);
      setStartDate(computedStart);
    }
  }, [startDate, endDate, daysDiff, includeEndDate, activeMode]);

  // Handle Start Date Change
  const handleStartDateChange = (val: string) => {
    setStartDate(val);
    if (activeMode === 'calc_start') {
      setActiveMode('calc_diff');
    }
  };

  // Handle End Date Change
  const handleEndDateChange = (val: string) => {
    setEndDate(val);
    if (activeMode === 'calc_end') {
      setActiveMode('calc_diff');
    }
  };

  // Handle Days Diff Change
  const handleDaysDiffChange = (num: number) => {
    setDaysDiff(num);
    if (activeMode === 'calc_diff') {
      setActiveMode('calc_end');
    }
  };

  // Swap Start & End Dates
  const handleSwapDates = () => {
    const temp = startDate;
    setStartDate(endDate);
    setEndDate(temp);
    setActiveMode('calc_diff');
  };

  // Calculate days from today to end date
  const daysFromTodayToEnd = calculateDaysDiff(today, endDate, false);

  // Detailed breakdown
  const breakdown = getDetailedBreakdown(startDate, endDate, includeEndDate, 'none');

  // Copy result text
  const handleCopyResult = () => {
    const todayCountdownText = daysFromTodayToEnd > 0
      ? `距今天还剩 ${daysFromTodayToEnd} 天`
      : daysFromTodayToEnd === 0
      ? `今天到期`
      : `已过去 ${Math.abs(daysFromTodayToEnd)} 天`;

    const text = `【日期计算结果】
开始日期：${startDate} (${getDayOfWeekCn(startDate)})
结束日期：${endDate} (${getDayOfWeekCn(endDate)})
距今天：${todayCountdownText}
${includeEndDate ? '包含当天：是' : '包含当天：否'}
相差天数：${daysDiff} 天
时间跨度：${breakdown.years > 0 ? `${breakdown.years}年` : ''}${breakdown.months > 0 ? `${breakdown.months}个月` : ''}${breakdown.days}天 (${breakdown.weeks}周${breakdown.remainingDaysInWeeks}天)`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Save history
  const handleConfirmSave = () => {
    onSaveHistory({
      title: noteInput.trim() || `${startDate} 至 ${endDate}`,
      startDate,
      endDate,
      daysDiff,
      includeEndDate,
      note: noteInput.trim(),
    });
    setSavedSuccess(true);
    setShowSaveModal(false);
    setNoteInput('');
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Target Linkage Mode Navigation */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="text-xs font-bold text-slate-500 dark:text-slate-400">
            推算目标：设置任意两个参数自动计算第三个
          </div>

          <button
            onClick={handleSwapDates}
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3 h-3" />
            首尾对调
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <button
            onClick={() => setActiveMode('calc_start')}
            className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
              activeMode === 'calc_start'
                ? 'border-indigo-600 dark:border-indigo-500 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300'
                : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <span>求解【开始日期】</span>
            {activeMode === 'calc_start' && (
              <span className="w-2 h-2 rounded-full bg-indigo-600" />
            )}
          </button>

          <button
            onClick={() => setActiveMode('calc_end')}
            className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
              activeMode === 'calc_end'
                ? 'border-indigo-600 dark:border-indigo-500 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300'
                : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <span>求解【结束日期】</span>
            {activeMode === 'calc_end' && (
              <span className="w-2 h-2 rounded-full bg-indigo-600" />
            )}
          </button>

          <button
            onClick={() => setActiveMode('calc_diff')}
            className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
              activeMode === 'calc_diff'
                ? 'border-indigo-600 dark:border-indigo-500 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300'
                : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <span>求解【相差天数】</span>
            {activeMode === 'calc_diff' && (
              <span className="w-2 h-2 rounded-full bg-indigo-600" />
            )}
          </button>
        </div>
      </div>

      {/* 3 Main Parameter Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Param 1: Start Date */}
        <div
          className={`bg-white dark:bg-slate-900 rounded-2xl p-4 border transition-all ${
            activeMode === 'calc_start'
              ? 'border-indigo-500 dark:border-indigo-500 ring-2 ring-indigo-500/10 shadow-xs'
              : 'border-slate-200/80 dark:border-slate-800'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
              开始日期
            </span>
            {activeMode === 'calc_start' && (
              <span className="text-[10px] font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded-md">
                推算得出
              </span>
            )}
          </div>

          <CustomDatePicker
            value={startDate}
            onChange={handleStartDateChange}
            highlight={activeMode === 'calc_start'}
          />

          <div className="mt-3 flex gap-1.5 flex-wrap">
            <button
              onClick={() => handleStartDateChange(today)}
              className="px-2 py-1 text-[11px] rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 cursor-pointer"
            >
              今天
            </button>
            <button
              onClick={() => {
                const now = new Date();
                handleStartDateChange(formatDateStr(new Date(now.getFullYear(), now.getMonth(), 1)));
              }}
              className="px-2 py-1 text-[11px] rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 cursor-pointer"
            >
              月初
            </button>
          </div>
        </div>

        {/* Param 2: End Date */}
        <div
          className={`bg-white dark:bg-slate-900 rounded-2xl p-4 border transition-all ${
            activeMode === 'calc_end'
              ? 'border-indigo-500 dark:border-indigo-500 ring-2 ring-indigo-500/10 shadow-xs'
              : 'border-slate-200/80 dark:border-slate-800'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
              结束日期
            </span>
            {activeMode === 'calc_end' && (
              <span className="text-[10px] font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded-md">
                推算得出
              </span>
            )}
          </div>

          <CustomDatePicker
            value={endDate}
            onChange={handleEndDateChange}
            highlight={activeMode === 'calc_end'}
          />

          <div className="mt-3 flex items-center justify-between gap-1.5 flex-wrap">
            <div className="flex gap-1.5">
            <button
              onClick={() => handleEndDateChange(today)}
              className="px-2 py-1 text-[11px] rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 cursor-pointer"
            >
              今天
            </button>
            <button
              onClick={() => {
                const now = new Date();
                handleEndDateChange(formatDateStr(new Date(now.getFullYear(), now.getMonth() + 1, 0)));
              }}
              className="px-2 py-1 text-[11px] rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 cursor-pointer"
            >
              月末
            </button>
          </div>

            <div className="text-[11px] font-semibold px-2 py-0.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-900/40">
              {daysFromTodayToEnd > 0
                ? `距今天还剩 ${daysFromTodayToEnd} 天`
                : daysFromTodayToEnd === 0
                ? `今天到期`
                : `已过去 ${Math.abs(daysFromTodayToEnd)} 天`}
            </div>
          </div>
        </div>

        {/* Param 3: Days Diff */}
        <div
          className={`bg-white dark:bg-slate-900 rounded-2xl p-4 border transition-all ${
            activeMode === 'calc_diff'
              ? 'border-indigo-500 dark:border-indigo-500 ring-2 ring-indigo-500/10 shadow-xs'
              : 'border-slate-200/80 dark:border-slate-800'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
              相差天数 (间隔)
            </span>
            {activeMode === 'calc_diff' && (
              <span className="text-[10px] font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded-md">
                推算得出
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => handleDaysDiffChange(daysDiff - 1)}
              className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
            >
              <Minus className="w-4 h-4" />
            </button>

            <div className="relative flex-1">
              <input
                type="number"
                value={daysDiff}
                onChange={(e) => handleDaysDiffChange(parseInt(e.target.value) || 0)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    (e.target as HTMLInputElement).blur();
                  }
                }}
                className={`w-full text-center px-3 py-2.5 rounded-xl border text-base font-bold focus:outline-none transition-all ${
                  activeMode === 'calc_diff'
                    ? 'border-indigo-500 bg-indigo-50/40 dark:bg-indigo-950/30 text-indigo-950 dark:text-indigo-100'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white'
                }`}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 pointer-events-none">
                天
              </span>
            </div>

            <button
              type="button"
              onClick={() => handleDaysDiffChange(daysDiff + 1)}
              className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <div className="mt-3 flex gap-1.5 flex-wrap">
            <button
              onClick={() => handleDaysDiffChange(7)}
              className="px-2 py-1 text-[11px] rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 cursor-pointer"
            >
              +7天
            </button>
            <button
              onClick={() => handleDaysDiffChange(30)}
              className="px-2 py-1 text-[11px] rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 cursor-pointer"
            >
              +30天
            </button>
            <button
              onClick={() => handleDaysDiffChange(90)}
              className="px-2 py-1 text-[11px] rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 cursor-pointer"
            >
              +90天
            </button>
            <button
              onClick={() => handleDaysDiffChange(100)}
              className="px-2 py-1 text-[11px] rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 cursor-pointer"
            >
              +100天
            </button>
            <button
              onClick={() => handleDaysDiffChange(180)}
              className="px-2 py-1 text-[11px] rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 cursor-pointer"
            >
              +180天
            </button>
            <button
              onClick={() => handleDaysDiffChange(365)}
              className="px-2 py-1 text-[11px] rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 cursor-pointer"
            >
              +365天
            </button>
          </div>
        </div>
      </div>

      {/* Option: Include Start/End Day */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
        <label className="flex items-center gap-2.5 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={includeEndDate}
            onChange={(e) => setIncludeEndDate(e.target.checked)}
            className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300 dark:border-slate-700 dark:bg-slate-800 cursor-pointer"
          />
          <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
            包含首尾当天 (算头算尾)
          </span>
        </label>

        <span className="text-[11px] text-slate-400">
          {includeEndDate ? '包含开头与结尾当天' : '不含结尾当日'}
        </span>
      </div>

      {/* Clean Theme-Adaptive Result Summary Card */}
      <div className="bg-white border border-slate-200/90 text-slate-800 dark:bg-slate-900 dark:text-white dark:border dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-5 transition-colors duration-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-slate-100">
            <span>{startDate}</span>
            <ArrowRight className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span>{endDate}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyResult}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-200 text-xs font-medium transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? '已复制' : '复制结果'}
            </button>

            <button
              onClick={() => setShowSaveModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-xs font-medium text-white transition-colors cursor-pointer"
            >
              <BookmarkPlus className="w-3.5 h-3.5" />
              保存记录
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">总间隔天数</div>
            <div className="text-3xl font-extrabold text-indigo-600 dark:text-white mt-1">
              {breakdown.totalDays} <span className="text-sm font-normal text-slate-500 dark:text-slate-400">天</span>
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
              {breakdown.weeks} 周 {breakdown.remainingDaysInWeeks > 0 ? `${breakdown.remainingDaysInWeeks} 天` : ''}
            </div>
          </div>

          <div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">距今天倒计时</div>
            <div className={`text-2xl font-extrabold mt-1.5 ${
              daysFromTodayToEnd > 0
                ? 'text-emerald-600 dark:text-emerald-400'
                : daysFromTodayToEnd === 0
                ? 'text-amber-600 dark:text-amber-400'
                : 'text-slate-500 dark:text-slate-400'
            }`}>
              {daysFromTodayToEnd > 0
                ? `还剩 ${daysFromTodayToEnd} 天`
                : daysFromTodayToEnd === 0
                ? '今天到期'
                : `已过去 ${Math.abs(daysFromTodayToEnd)} 天`}
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
              结束日期：{endDate}
            </div>
          </div>

          <div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">年月天分解</div>
            <div className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-1.5">
              {breakdown.years > 0 && `${breakdown.years}年 `}
              {breakdown.months > 0 && `${breakdown.months}个月 `}
              {`${breakdown.days}天`}
            </div>
          </div>

          <div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">换算时长</div>
            <div className="text-sm font-semibold text-slate-800 dark:text-slate-200 mt-1.5">
              {breakdown.totalHours.toLocaleString()} 小时
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              {breakdown.totalMinutes.toLocaleString()} 分钟
            </div>
          </div>
        </div>
      </div>

      {/* Save Modal */}
      {showSaveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-sm w-full p-5 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              保存计算记录
            </h3>

            <input
              type="text"
              placeholder="请输入备注说明（可选）"
              value={noteInput}
              onChange={(e) => setNoteInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleConfirmSave();
                }
              }}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
              autoFocus
            />

            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                onClick={() => setShowSaveModal(false)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                取消
              </button>
              <button
                onClick={handleConfirmSave}
                className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-500 shadow-xs cursor-pointer"
              >
                保存
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Toast */}
      {savedSuccess && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-600 text-white px-3.5 py-2.5 rounded-xl shadow-lg text-xs font-bold flex items-center gap-1.5">
          <Check className="w-4 h-4" />
          已成功保存至历史记录！
        </div>
      )}
    </div>
  );
};
