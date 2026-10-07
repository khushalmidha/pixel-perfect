import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { getLesson } from "./mock-data";

const STORAGE_KEY = "steady_learning_v1";

type LearningProgress = {
  completedIds: string[];
  hydrated: boolean;
  storageAvailable: boolean;
  completeLesson: (id: string) => void;
};

const LearningContext = createContext<LearningProgress | null>(null);

function parseCompletion(raw: string | null): string[] {
  try {
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed)
      ? [...new Set(parsed.filter((id): id is string => typeof id === "string" && !!getLesson(id)))]
      : [];
  } catch {
    return [];
  }
}

export function LearningProvider({ children }: { children: ReactNode }) {
  const [completedIds, setCompletedIds] = useState<string[]>([]);
  const completionRef = useRef<string[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [storageAvailable, setStorageAvailable] = useState(true);

  useEffect(() => {
    try {
      completionRef.current = parseCompletion(window.localStorage.getItem(STORAGE_KEY));
      setCompletedIds(completionRef.current);
    } catch {
      setStorageAvailable(false);
    }
    setHydrated(true);
    const onStorage = (event: StorageEvent) => {
      if (event.storageArea && event.storageArea !== window.localStorage) return;
      if (event.key !== STORAGE_KEY && event.key !== null) return;
      try {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        const persisted = parseCompletion(raw);
        // Deletion/clear explicitly resets progress; completions otherwise accumulate.
        const next = raw === null ? [] : [...new Set([...completionRef.current, ...persisted])];
        completionRef.current = next;
        setCompletedIds(next);
        // Reconcile overlapping writes once; no write when storage already has the union.
        if (next.some((id) => !persisted.includes(id))) {
          window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        }
        setStorageAvailable(true);
      } catch {
        setStorageAvailable(false);
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const completeLesson = (id: string) => {
    if (!hydrated || !getLesson(id)) return;
    let next = [...new Set([...completionRef.current, id])];
    try {
      // A stale tab must preserve valid completions already written by another tab.
      const persisted = parseCompletion(window.localStorage.getItem(STORAGE_KEY));
      next = [...new Set([...next, ...persisted])];
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      setStorageAvailable(true);
    } catch {
      setStorageAvailable(false);
    }
    completionRef.current = next;
    setCompletedIds(next);
  };

  return (
    <LearningContext.Provider value={{ completedIds, hydrated, storageAvailable, completeLesson }}>
      {children}
    </LearningContext.Provider>
  );
}

export function useLearning() {
  const value = useContext(LearningContext);
  if (!value) throw new Error("useLearning must be used inside <LearningProvider>");
  return value;
}
