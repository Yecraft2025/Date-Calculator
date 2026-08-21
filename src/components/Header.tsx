import React, { useState, useEffect } from 'react';
import { Calendar, Moon, Sun, History } from 'lucide-react';
import { Theme } from '../hooks/useTheme';

export type TabType = 'linkage' | 'history';

interface HeaderProps {
  theme: Theme;
  toggleTheme: () => void;
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  historyCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  theme,
  toggleTheme,
  activeTab,
  setActiveTab,
  historyCount,
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      // Show header only when scrolled to the top (scrollY <= 20px)
      if (window.scrollY <= 20) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 transition-all duration-300 ease-in-out ${
        isVisible
          ? 'translate-y-0 opacity-100'
          : '-translate-y-full opacity-0 pointer-events-none'
      }`}
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3.5">
        <div className="flex items-center justify-between gap-4">
          {/* Minimalist Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl overflow-hidden shrink-0 shadow-sm border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-800">
              <img
                src="DateCalc.png"
                alt="DateCalc Logo"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                日期计算器
              </h1>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                三参数双向联动推算
              </p>
            </div>
          </div>

          {/* Navigation Tabs & Dark Mode Toggle */}
          <div className="flex items-center gap-2">
            <nav className="flex items-center bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl">
              <button
                onClick={() => setActiveTab('linkage')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'linkage'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                日期计算
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'history'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <History className="w-3.5 h-3.5" />
                <span>历史记录</span>
                {historyCount > 0 && (
                  <span className="px-1.5 py-0.2 text-[10px] rounded-full bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-200">
                    {historyCount}
                  </span>
                )}
              </button>
            </nav>

            {/* Dark / Light Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              aria-label="切换明暗主题"
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
              title={theme === 'dark' ? '切换为浅色主题' : '切换为深色主题'}
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-slate-700" />
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
