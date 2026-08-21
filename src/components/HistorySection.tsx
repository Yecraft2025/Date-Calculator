import React, { useState } from 'react';
import { History, Trash2, ArrowRight, Bookmark, RotateCcw, AlertTriangle } from 'lucide-react';
import { SavedHistoryItem } from '../types/date';
import { calculateDaysDiff, getTodayStr } from '../utils/dateUtils';

interface HistorySectionProps {
  history: SavedHistoryItem[];
  onRemoveItem: (id: string) => void;
  onClearHistory: () => void;
  onSelectRecord?: (item: SavedHistoryItem) => void;
}

export const HistorySection: React.FC<HistorySectionProps> = ({
  history,
  onRemoveItem,
  onClearHistory,
  onSelectRecord,
}) => {
  const today = getTodayStr();
  const [deleteTarget, setDeleteTarget] = useState<'all' | string | null>(null);

  const handleConfirmDelete = () => {
    if (deleteTarget === 'all') {
      onClearHistory();
    } else if (deleteTarget) {
      onRemoveItem(deleteTarget);
    }
    setDeleteTarget(null);
  };

  return (
    <div className="space-y-4">
      {/* Header Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between">
        <div>
          <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <History className="w-4 h-4 text-indigo-500" />
            历史计算记录
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            历史记录仅保存在您的浏览器本地
          </p>
        </div>

        {history.length > 0 && (
          <button
            onClick={() => setDeleteTarget('all')}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/60 transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            清空记录
          </button>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-2xl max-w-sm w-full space-y-4">
            <div className="flex items-center gap-3 text-rose-600 dark:text-rose-400">
              <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/80 shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  {deleteTarget === 'all' ? '确认清空所有历史记录？' : '确认删除此条历史记录？'}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {deleteTarget === 'all' ? '清空后数据将无法恢复。' : '此操作无法撤销。'}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setDeleteTarget(null)}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
              >
                取消
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white transition-colors cursor-pointer flex items-center gap-1 shadow-sm"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>确认删除</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {history.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-10 text-center border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <Bookmark className="w-8 h-8 text-slate-300 dark:text-slate-700 mx-auto mb-2" />
          <p className="text-xs text-slate-400">暂无计算记录，点击结果区的“保存记录”即可添加</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {history.map((item) => {
            const daysFromTodayToEnd = calculateDaysDiff(today, item.endDate, false);

            return (
              <div
                key={item.id}
                className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:border-indigo-400 dark:hover:border-indigo-600 transition-all flex flex-col justify-between space-y-3 group"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                      {item.title}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeleteTarget(item.id);
                      }}
                      className="p-1 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                      title="删除记录"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {item.note && item.note !== item.title && (
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/80 px-2 py-1 rounded-md border border-slate-100 dark:border-slate-700/50">
                      备注：{item.note}
                    </p>
                  )}

                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-xs space-y-2">
                    <div className="flex items-center justify-between font-semibold text-slate-700 dark:text-slate-300">
                      <span>{item.startDate}</span>
                      <ArrowRight className="w-3 h-3 text-slate-400" />
                      <span>{item.endDate}</span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-200/50 dark:border-slate-700/50">
                      <span>相差：<strong className="text-indigo-600 dark:text-indigo-400 font-bold">{item.daysDiff} 天</strong> ({item.includeEndDate ? '含首尾' : '不含首尾'})</span>

                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                        daysFromTodayToEnd > 0
                          ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-800/40'
                          : daysFromTodayToEnd === 0
                          ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border border-amber-200/50 dark:border-amber-800/40'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200/50 dark:border-slate-700/50'
                      }`}>
                        {daysFromTodayToEnd > 0
                          ? `距今还剩 ${daysFromTodayToEnd} 天`
                          : daysFromTodayToEnd === 0
                          ? '今天到期'
                          : `已过去 ${Math.abs(daysFromTodayToEnd)} 天`}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action: Select and Load Record */}
                {onSelectRecord && (
                  <button
                    onClick={() => onSelectRecord(item)}
                    className="w-full py-2 px-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 group-hover:bg-indigo-600 text-indigo-700 dark:text-indigo-300 group-hover:text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>载入此计算并返回</span>
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

