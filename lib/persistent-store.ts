/** A synchronous local store with stable React snapshots and a memory fallback. */
export function createPersistentStore<T>(
  key: string,
  initialValue: T,
  normalize: (value: unknown) => T,
) {
  const eventName = "shanghai-island:storage";
  let cachedRaw: string | null | undefined;
  let cachedValue = initialValue;
  let memoryRaw: string | undefined;

  function getSnapshot(): T {
    if (typeof window === "undefined") return initialValue;
    let raw: string | null;
    try {
      raw = memoryRaw ?? window.localStorage.getItem(key);
    } catch {
      raw = memoryRaw ?? null;
    }
    if (raw === cachedRaw) return cachedValue;
    cachedRaw = raw;
    try {
      cachedValue = raw === null ? initialValue : normalize(JSON.parse(raw));
    } catch {
      cachedValue = initialValue;
    }
    return cachedValue;
  }

  function set(update: T | ((previous: T) => T)): T {
    const previous = getSnapshot();
    const next = typeof update === "function"
      ? (update as (previous: T) => T)(previous)
      : update;
    if (Object.is(previous, next)) return previous;
    const raw = JSON.stringify(next);
    // Keep working when storage is unavailable/full, without losing this tab's state.
    try {
      window.localStorage.setItem(key, raw);
      memoryRaw = undefined;
    } catch {
      memoryRaw = raw;
    }
    cachedRaw = raw;
    cachedValue = next;
    window.dispatchEvent(new CustomEvent(eventName, { detail: key }));
    return next;
  }

  function subscribe(listener: () => void) {
    const onLocalChange = (event: Event) => {
      if ((event as CustomEvent<string>).detail === key) listener();
    };
    const onStorage = (event: StorageEvent) => {
      if (event.key !== null && event.key !== key) return;
      // A write/clear in another tab is authoritative, including after a failed write.
      memoryRaw = undefined;
      cachedRaw = undefined;
      listener();
    };
    window.addEventListener(eventName, onLocalChange);
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener(eventName, onLocalChange);
      window.removeEventListener("storage", onStorage);
    };
  }

  return { getSnapshot, getServerSnapshot: () => initialValue, set, subscribe };
}

export type PersistentStore<T> = ReturnType<typeof createPersistentStore<T>>;

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function stringArray(value: unknown): string[] {
  return Array.isArray(value) ? [...new Set(value.filter((item): item is string => typeof item === "string"))] : [];
}
