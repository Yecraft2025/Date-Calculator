/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useTheme } from './hooks/useTheme';
import { useHistory } from './hooks/useHistory';
import { Header, TabType } from './components/Header';
import { ThreeParamCalculator } from './components/ThreeParamCalculator';
import { HistorySection } from './components/HistorySection';
import { SavedHistoryItem } from './types/date';

export default function App() {
  const { theme, toggleTheme } = useTheme();
  const { history, addHistoryItem, removeHistoryItem, clearHistory } = useHistory();
  const [activeTab, setActiveTab] = useState<TabType>('linkage');
  const [loadedRecord, setLoadedRecord] = useState<SavedHistoryItem | null>(null);

  const handleSelectRecord = (item: SavedHistoryItem) => {
    setLoadedRecord(item);
    setActiveTab('linkage');
  };

  const handleClearLoadedRecord = () => {
    setLoadedRecord(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      {/* Minimalist Navbar Header */}
      <Header
        theme={theme}
        toggleTheme={toggleTheme}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        historyCount={history.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
        <div className={activeTab === 'linkage' ? 'block' : 'hidden'}>
          <ThreeParamCalculator
            onSaveHistory={addHistoryItem}
            loadedRecord={loadedRecord}
            onClearLoadedRecord={handleClearLoadedRecord}
          />
        </div>

        <div className={activeTab === 'history' ? 'block' : 'hidden'}>
          <HistorySection
            history={history}
            onRemoveItem={removeHistoryItem}
            onClearHistory={clearHistory}
            onSelectRecord={handleSelectRecord}
          />
        </div>
      </main>

      {/* Footer with Author and GitHub Link */}
      <footer className="border-t border-slate-200/80 dark:border-slate-800 py-4 text-center text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-4xl mx-auto px-4 flex items-center justify-center gap-3 sm:gap-4">
          <span>© {new Date().getFullYear()} Yecraft</span>
          <span className="text-slate-300 dark:text-slate-700">•</span>
          <a
            href="https://github.com/Yecraft2025/Date-Calculator"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 hover:text-slate-800 dark:hover:text-slate-200 transition-colors font-medium"
          >
            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
            </svg>
            <span>GitHub</span>
          </a>
        </div>
      </footer>
    </div>
  );
}
