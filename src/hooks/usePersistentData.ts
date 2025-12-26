import { useState, useEffect, useCallback } from 'react';
import type { DayEntry } from '../types/index';

const STORAGE_KEY = 'kinetics-data-v1';

export const usePersistentData = () => {
  const [entries, setEntries] = useState<DayEntry[]>([]);

  // Load
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setEntries(parsed.map((d: any) => ({ ...d, date: new Date(d.date) })));
      } catch (e) {
        console.error("Data load error", e);
      }
    }
  }, []);

  // Save
  useEffect(() => {
    if (entries.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    }
  }, [entries]);

  const exportData = useCallback(() => {
    const dataStr = JSON.stringify(entries, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `kinetics-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [entries]);

  const importData = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const json = JSON.parse(e.target?.result as string);
        if (Array.isArray(json)) {
          setEntries(json.map((d: any) => ({ ...d, date: new Date(d.date) })));
        }
      } catch (err) {
        alert("Invalid JSON structure");
      }
    };
    reader.readAsText(file);
  }, []);

  return { entries, setEntries, exportData, importData };
};