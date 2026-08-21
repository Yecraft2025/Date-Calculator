/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Github } from 'lucide-react';
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
            <Github className="w-3.5 h-3.5" />
            <span>GitHub</span>
          </a>
        </div>
      </footer>
    </div>
  );
}
