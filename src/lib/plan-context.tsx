import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import {
  buildStartingPoint,
  cleanAnswers,
  isCompleteAnswers,
  isValidTimestamp,
  type Answers,
  type StartingPoint,
  type StartingPointRecord,
} from "./starter-plan";

// Keep the existing storage location; the record itself declares its schema.
const STORAGE_KEY = "steady_plan_v1";
export type StartingPointContextValue = {
  startingPoint: StartingPoint | null;
  hydrated: boolean;
  storageAvailable: boolean;
  migrated: boolean;
  saveStartingPoint: (answers: Answers) => StartingPoint | null;
};
const StartingPointContext = createContext<StartingPointContextValue | null>(null);
function decode(raw: string): { record: StartingPointRecord; legacy: boolean } | null {
  const value: unknown = JSON.parse(raw);
  if (
    !value ||
    typeof value !== "object" ||
    !("answers" in value) ||
    !isCompleteAnswers(value.answers)
  )
    return null;
  if ("schemaVersion" in value && value.schemaVersion !== 2) return null;
  const legacy = !("schemaVersion" in value);
  // A timestamp is metadata: preserve valid answers without inventing a date.
  const savedAt = "savedAt" in value && isValidTimestamp(value.savedAt) ? value.savedAt : null;
  return { record: { schemaVersion: 2, answers: cleanAnswers(value.answers), savedAt }, legacy };
}
export function PlanProvider({ children }: { children: ReactNode }) {
  const [startingPoint, setStartingPoint] = useState<StartingPoint | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [storageAvailable, setStorageAvailable] = useState(true);
  const [migrated, setMigrated] = useState(false);
  useEffect(() => {
    const restore = () => {
      let raw: string | null;
      try {
        // Read current storage rather than a potentially queued, older event value.
        raw = window.localStorage.getItem(STORAGE_KEY);
      } catch {
        setStorageAvailable(false);
        return;
      }
      let decoded: ReturnType<typeof decode> = null;
      try {
        decoded = raw ? decode(raw) : null;
      } catch {
        /* Invalid JSON is an empty starting point. */
      }
      setStorageAvailable(true);
      setMigrated(decoded?.legacy ?? false);
      if (decoded) {
        const { record } = decoded;
        setStartingPoint({ ...buildStartingPoint(record.answers), savedAt: record.savedAt });
        // Rewrite only a sanitized canonical record, including when old extra fields exist.
        if (raw !== JSON.stringify(record)) {
          try {
            window.localStorage.setItem(STORAGE_KEY, JSON.stringify(record));
          } catch {
            setStorageAvailable(false);
          }
        }
      } else {
        setStartingPoint(null);
      }
    };
    const onStorage = (event: StorageEvent) => {
      if (event.storageArea && event.storageArea !== window.localStorage) return;
      if (event.key === STORAGE_KEY || event.key === null) restore();
    };
    restore();
    setHydrated(true);
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);
  const saveStartingPoint = (answers: Answers): StartingPoint | null => {
    if (!hydrated || !isCompleteAnswers(answers)) return null;
    const record: StartingPointRecord = {
      schemaVersion: 2,
      answers: cleanAnswers(answers),
      savedAt: Date.now(),
    };
    const next = { ...buildStartingPoint(record.answers), savedAt: record.savedAt };
    setStartingPoint(next);
    setMigrated(false);
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(record));
      setStorageAvailable(true);
    } catch {
      setStorageAvailable(false);
    }
    return next;
  };
  return (
    <StartingPointContext.Provider
      value={{ startingPoint, hydrated, storageAvailable, migrated, saveStartingPoint }}
    >
      {children}
    </StartingPointContext.Provider>
  );
}
export function useStartingPoint(): StartingPointContextValue {
  const value = useContext(StartingPointContext);
  if (!value) throw new Error("useStartingPoint must be used inside PlanProvider");
  return value;
}
