import React, { useState, useRef, useEffect } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, ChevronDown, Check } from 'lucide-react';
import { parseDateStr, formatDateStr, getDayOfWeekCn, getTodayStr } from '../utils/dateUtils';

interface CustomDatePickerProps {
  value: string; // YYYY-MM-DD
  onChange: (val: string) => void;
  label?: string;
  readOnly?: boolean;
  highlight?: boolean;
}

export const CustomDatePicker: React.FC<CustomDatePickerProps> = ({
  value,
  onChange,
  label,
  readOnly = false,
  highlight = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'days' | 'months' | 'years'>('days');
  const containerRef = useRef<HTMLDivElement>(null);
  const yearsListRef = useRef<HTMLDivElement>(null);

  const selectedDate = parseDateStr(value);
  const [viewYear, setViewYear] = useState(selectedDate.getFullYear());
  const [viewMonth, setViewMonth] = useState(selectedDate.getMonth()); // 0-indexed

  // Keep view year & month synced when value changes from outside
  useEffect(() => {
    const d = parseDateStr(value);
    setViewYear(d.getFullYear());
    setViewMonth(d.getMonth());
  }, [value]);

  // Close popup when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setViewMode('days');
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Auto-scroll to selected year when year picker opens
  useEffect(() => {
    if (viewMode === 'years' && yearsListRef.current) {
      const activeEl = yearsListRef.current.querySelector('[data-selected="true"]');
      if (activeEl) {
        activeEl.scrollIntoView({ block: 'center', behavior: 'auto' });
      }
    }
  }, [viewMode]);

  // Calendar month math
  const prevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else {
      setViewMonth((m) => m - 1);
    }
  };

  const nextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else {
      setViewMonth((m) => m + 1);
    }
  };

  // Generate days grid
  const firstDayOfWeek = new Date(viewYear, viewMonth, 1).getDay(); // 0 is Sunday
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

  const daysGrid: (number | null)[] = [];
  for (let i = 0; i < firstDayOfWeek; i++) {
    daysGrid.push(null);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    daysGrid.push(d);
  }

  const handleSelectDay = (day: number) => {
    const newDateStr = formatDateStr(new Date(viewYear, viewMonth, day));
    onChange(newDateStr);
    setIsOpen(false);
    setViewMode('days');
  };

  const todayStr = getTodayStr();

  const setToday = () => {
    onChange(todayStr);
    setIsOpen(false);
    setViewMode('days');
  };

  // Generate years list (1950 ~ 2070)
  const years = Array.from({ length: 121 }, (_, i) => 1950 + i);

  // Month names
  const monthNames = [
    '1月', '2月', '3月', '4月',
    '5月', '6月', '7月', '8月',
    '9月', '10月', '11月', '12月'
  ];

  return (
    <div className="relative w-full" ref={containerRef}>
      {/* Clickable Display Field */}
      <div
        tabIndex={0}
        onClick={() => {
          setIsOpen(!isOpen);
          setViewMode('days');
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setIsOpen(!isOpen);
            setViewMode('days');
          }
        }}
        className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl border text-left transition-all cursor-pointer select-none focus:outline-none focus:ring-2 focus:ring-indigo-500/30 ${
          highlight
            ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/30 text-indigo-950 dark:text-indigo-100 ring-2 ring-indigo-500/20'
            : 'border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/80 hover:bg-slate-100/80 dark:hover:bg-slate-800/80 text-slate-800 dark:text-slate-100'
        }`}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <CalendarIcon className={`w-4 h-4 shrink-0 ${highlight ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'}`} />
          <div className="truncate">
            <div className="text-sm font-semibold tracking-tight">
              {value}
            </div>
            <div className="text-[11px] text-slate-400 dark:text-slate-500 font-normal">
              {getDayOfWeekCn(value)}
            </div>
          </div>
        </div>

        <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300">
          选择
        </span>
      </div>

      {/* Popover Custom Calendar Picker */}
      {isOpen && (
        <div className="absolute left-0 mt-2 z-50 w-72 sm:w-80 bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200/90 dark:border-slate-800 shadow-xl dark:shadow-slate-950/90 animate-fadeIn space-y-3">
          {/* Header Controls */}
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={prevMonth}
              className="p-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Custom Sleek Year & Month Select Buttons */}
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setViewMode(viewMode === 'years' ? 'days' : 'years')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  viewMode === 'years'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-800 dark:text-slate-100 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                <span>{viewYear}年</span>
                <ChevronDown className="w-3 h-3 opacity-70" />
              </button>

              <button
                type="button"
                onClick={() => setViewMode(viewMode === 'months' ? 'days' : 'months')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  viewMode === 'months'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-800 dark:text-slate-100 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                <span>{viewMonth + 1}月</span>
                <ChevronDown className="w-3 h-3 opacity-70" />
              </button>
            </div>

            <button
              type="button"
              onClick={nextMonth}
              className="p-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Mode 1: Custom Year Picker Grid */}
          {viewMode === 'years' && (
            <div
              ref={yearsListRef}
              className="grid grid-cols-3 sm:grid-cols-4 gap-1.5 max-h-56 overflow-y-auto pr-1 text-center scroll-smooth py-1"
            >
              {years.map((y) => {
                const isSelectedYear = y === viewYear;
                return (
                  <button
                    key={y}
                    type="button"
                    data-selected={isSelectedYear ? 'true' : 'false'}
                    onClick={() => {
                      setViewYear(y);
                      setViewMode('days');
                    }}
                    className={`py-2 rounded-xl text-xs font-bold transition-all ${
                      isSelectedYear
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    {y}年
                  </button>
                );
              })}
            </div>
          )}

          {/* Mode 2: Custom Month Picker Grid */}
          {viewMode === 'months' && (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 py-2 text-center">
              {monthNames.map((mName, mIdx) => {
                const isSelectedMonth = mIdx === viewMonth;
                return (
                  <button
                    key={mIdx}
                    type="button"
                    onClick={() => {
                      setViewMonth(mIdx);
                      setViewMode('days');
                    }}
                    className={`py-2.5 rounded-xl text-xs font-bold transition-all ${
                      isSelectedMonth
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    {mName}
                  </button>
                );
              })}
            </div>
          )}

          {/* Mode 3: Normal Calendar Day Grid */}
          {viewMode === 'days' && (
            <>
              {/* Weekday Labels */}
              <div className="grid grid-cols-7 text-center text-[11px] font-semibold text-slate-400 py-1">
                <span className="text-rose-500">日</span>
                <span>一</span>
                <span>二</span>
                <span>三</span>
                <span>四</span>
                <span>五</span>
                <span className="text-rose-500">六</span>
              </div>

              {/* Days Grid */}
              <div className="grid grid-cols-7 gap-1 text-center">
                {daysGrid.map((day, idx) => {
                  if (day === null) {
                    return <div key={idx} className="h-8" />;
                  }

                  const cellDateStr = formatDateStr(new Date(viewYear, viewMonth, day));
                  const isSelected = cellDateStr === value;
                  const isToday = cellDateStr === todayStr;

                  return (
                    <button
                      type="button"
                      key={idx}
                      onClick={() => handleSelectDay(day)}
                      className={`h-8 rounded-lg text-xs font-semibold transition-all flex items-center justify-center ${
                        isSelected
                          ? 'bg-indigo-600 text-white shadow-xs font-bold'
                          : isToday
                          ? 'border border-indigo-500 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>
            </>
          )}

          {/* Quick Shortcuts */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
            <button
              type="button"
              onClick={setToday}
              className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
            >
              选择今天
            </button>

            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                setViewMode('days');
              }}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              关闭
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
