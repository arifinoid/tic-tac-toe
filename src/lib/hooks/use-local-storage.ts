"use client";

import { Dispatch, SetStateAction, useEffect, useState } from "react";

/**
 * Persisted state that is safe under SSR: the first client render always sees
 * `initialValue` (matching the server HTML), and storage is read only after
 * mount. Reading storage in a lazy useState initializer would hydrate
 * differently on server and client and throw a hydration error.
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T,
): [T, Dispatch<SetStateAction<T>>, boolean] {
  const [value, setValue] = useState<T>(initialValue);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(key);
      if (raw !== null) setValue(JSON.parse(raw) as T);
    } catch {
      /* corrupted value or unavailable storage: keep the default */
    }
    setHydrated(true);
  }, [key]);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* quota exceeded or private mode: state still works in memory */
    }
  }, [key, value, hydrated]);

  return [value, setValue, hydrated];
}
