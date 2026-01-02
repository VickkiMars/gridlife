import { useState, useEffect, useCallback } from 'react';
import type { DayEntry, Squad } from '../types/index';

const STORAGE_KEY = 'kinetics-data-v1';

export const usePersistentData = () => {
  const [entries, setEntries] = useState<DayEntry[]>([]);
  const [squads, setSquads] = useState<Squad[]>([]);

  // Load
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Expect stored shape: { entries: DayEntry[], squads?: Squad[] }
        const rawEntries = Array.isArray(parsed) ? parsed : parsed.entries || [];
        const rawSquads = parsed.squads || [];
        setEntries(rawEntries.map((d: any) => ({
          ...d,
          date: new Date(d.date),
          tasks: (d.tasks || []).map((t: any) => ({
            ...t,
            date: t.date ? new Date(t.date) : new Date(),
            created_at: t.created_at ? new Date(t.created_at) : new Date(t.date || Date.now()),
            completed_at: t.completed_at ? new Date(t.completed_at) : undefined,
            impact_weight: t.impact_weight ?? t.weight ?? 3,
            status: t.status ?? (t.completed ? 'completed' : 'open')
          }))
        })));

        // load squads if present
        setSquads(rawSquads.map((s: any) => ({
          ...s,
          membership_history: (s.membership_history || []).map((h: any) => ({ ...h, start_at: new Date(h.start_at), end_at: h.end_at ? new Date(h.end_at) : undefined }))
        })));
      } catch (e) {
        console.error("Data load error", e);
      }
    }
  }, []);

  // Save
  useEffect(() => {
    // Save combined shape
    const payload: any = { entries };
    if (squads.length) payload.squads = squads;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  }, [entries, squads]);

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
          setEntries(json.map((d: any) => ({
            ...d,
            date: new Date(d.date),
            tasks: (d.tasks || []).map((t: any) => ({
              ...t,
              date: t.date ? new Date(t.date) : new Date(),
              created_at: t.created_at ? new Date(t.created_at) : new Date(t.date || Date.now()),
              completed_at: t.completed_at ? new Date(t.completed_at) : undefined,
              impact_weight: t.impact_weight ?? t.weight ?? 3,
              status: t.status ?? (t.completed ? 'completed' : 'open')
            }))
          })));
        } else if (json && Array.isArray(json.entries)) {
          // import object with entries + squads
          setEntries(json.entries.map((d: any) => ({
            ...d,
            date: new Date(d.date),
            tasks: (d.tasks || []).map((t: any) => ({
              ...t,
              date: t.date ? new Date(t.date) : new Date(),
              created_at: t.created_at ? new Date(t.created_at) : new Date(t.date || Date.now()),
              completed_at: t.completed_at ? new Date(t.completed_at) : undefined,
              impact_weight: t.impact_weight ?? t.weight ?? 3,
              status: t.status ?? (t.completed ? 'completed' : 'open')
            }))
          })));

          if (Array.isArray(json.squads)) {
            setSquads(json.squads.map((s: any) => ({
              ...s,
              membership_history: (s.membership_history || []).map((h: any) => ({ ...h, start_at: new Date(h.start_at), end_at: h.end_at ? new Date(h.end_at) : undefined }))
            })));
          }
        }
      } catch (err) {
        alert("Invalid JSON structure");
      }
    };
    reader.readAsText(file);
  }, []);

  return { entries, setEntries, exportData, importData, squads, setSquads };
};