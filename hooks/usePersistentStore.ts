"use client";

import { useSyncExternalStore } from "react";
import type { PersistentStore } from "@/lib/persistent-store";

const subscribeHydration = () => () => {};
const clientReady = () => true;
const serverReady = () => false;

export function usePersistentStore<T>(store: PersistentStore<T>) {
  const value = useSyncExternalStore(store.subscribe, store.getSnapshot, store.getServerSnapshot);
  // Server and first hydration render agree; storage is consumed after hydration.
  const isLoaded = useSyncExternalStore(subscribeHydration, clientReady, serverReady);
  return [value, store.set, isLoaded] as const;
}
