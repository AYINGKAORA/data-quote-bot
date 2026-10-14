import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { ACTIVE_KEY, HISTORY_KEY, addHistory, readHistory, type QuoteRecord } from '@/lib/quote-history';

const WorkspaceContext = createContext<{ records: QuoteRecord[]; active: QuoteRecord | null; ready: boolean; open: (record: QuoteRecord) => void; save: (record: QuoteRecord) => void }>({ records: [], active: null, ready: false, open: () => {}, save: () => {} });
export const useWorkspace = () => useContext(WorkspaceContext);
export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const [records, setRecords] = useState<QuoteRecord[]>([]);
  const [active, setActive] = useState<QuoteRecord | null>(null);
  const [ready, setReady] = useState(false);
  useEffect(() => { try { setRecords(readHistory(localStorage.getItem(HISTORY_KEY))); setActive(readHistory(sessionStorage.getItem(ACTIVE_KEY))[0] || null); } catch {} setReady(true); }, []);
  function open(record: QuoteRecord) { try { sessionStorage.setItem(ACTIVE_KEY, JSON.stringify([record])); } catch {} setActive(record); }
  function save(record: QuoteRecord) { const next = addHistory(records, record); localStorage.setItem(HISTORY_KEY, JSON.stringify(next)); setRecords(next); }
  return <WorkspaceContext.Provider value={{ records, active, ready, open, save }}>{children}</WorkspaceContext.Provider>;
}