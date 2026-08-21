import { useEffect, useState } from 'react';
import { SavedHistoryItem } from '../types/date';

const HISTORY_KEY = 'date_calc_history_v1';

export function useHistory() {
  const [history, setHistory] = useState<SavedHistoryItem[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const item = localStorage.getItem(HISTORY_KEY);
        return item ? JSON.parse(item) : [];
      } catch (e) {
        console.error('Failed to parse history from localStorage', e);
        return [];
      }
    }
    return [];
  });

  useEffect(() => {
    try {
      localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
    } catch (e) {
      console.error('Failed to save history to localStorage', e);
    }
  }, [history]);

  const addHistoryItem = (
    item: Omit<SavedHistoryItem, 'id' | 'createdAt'>
  ) => {
    const newItem: SavedHistoryItem = {
      ...item,
      id: Date.now().toString() + Math.random().toString(36).substring(2, 5),
      createdAt: Date.now(),
    };
    setHistory((prev) => [newItem, ...prev.slice(0, 49)]); // keep latest 50
    return newItem;
  };

  const removeHistoryItem = (id: string) => {
    setHistory((prev) => prev.filter((item) => item.id !== id));
  };

  const clearHistory = () => {
    setHistory([]);
  };

  return { history, addHistoryItem, removeHistoryItem, clearHistory };
}
