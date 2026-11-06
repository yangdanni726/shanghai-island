import test from 'node:test';
import assert from 'node:assert/strict';
import { createPersistentStore, isRecord } from '../lib/persistent-store.ts';

function browser() {
  const target = new EventTarget();
  const data = new Map();
  let blocked = false;
  target.localStorage = {
    getItem: (key) => { if (blocked) throw new Error('Storage blocked'); return data.get(key) ?? null; },
    setItem: (key, value) => { if (blocked) throw new Error('Quota exceeded'); data.set(key, value); },
  };
  globalThis.window = target;
  return {
    data,
    block: () => { blocked = true; },
    storageEvent: (key) => {
      const event = new Event('storage');
      Object.defineProperty(event, 'key', { value: key });
      target.dispatchEvent(event);
    },
  };
}
const initial = { count: 0, visited: [] };
function normalize(value) {
  if (!isRecord(value) || !Number.isFinite(value.count)) return initial;
  return { count: value.count, visited: Array.isArray(value.visited) ? value.visited : [] };
}

test('server snapshots never read browser storage and remain stable', () => {
  delete globalThis.window;
  const store = createPersistentStore('player', initial, normalize);
  assert.equal(store.getSnapshot(), initial);
  assert.equal(store.getServerSnapshot(), initial);
});

test('existing saves load without being overwritten during hydration', () => {
  const env = browser();
  const raw = JSON.stringify({ count: 7 });
  env.data.set('player', raw);
  const store = createPersistentStore('player', initial, normalize);
  assert.equal(store.getServerSnapshot(), initial);
  const loaded = store.getSnapshot();
  assert.deepEqual(loaded, { count: 7, visited: [] });
  assert.equal(store.getSnapshot(), loaded);
  assert.equal(env.data.get('player'), raw);
});

test('rapid functional updates read the latest value and notify subscribers', () => {
  const env = browser();
  const store = createPersistentStore('player', initial, normalize);
  let notified = 0;
  const unsubscribe = store.subscribe(() => notified++);
  store.set((state) => ({ ...state, count: state.count + 10 }));
  store.set((state) => ({ ...state, count: state.count + 30 }));
  assert.equal(store.getSnapshot().count, 40);
  assert.equal(JSON.parse(env.data.get('player')).count, 40);
  assert.equal(notified, 2);
  unsubscribe();
  store.set((state) => ({ ...state, count: 50 }));
  assert.equal(notified, 2);
});

test('malformed saves recover without a render loop; valid writes replace them', () => {
  const env = browser();
  env.data.set('player', '{broken json');
  const store = createPersistentStore('player', initial, normalize);
  assert.equal(store.getSnapshot(), initial);
  assert.equal(store.getSnapshot(), initial);
  store.set({ count: 5, visited: ['coffee'] });
  assert.deepEqual(store.getSnapshot(), { count: 5, visited: ['coffee'] });
});

test('quota/blocked storage preserves subsequent gameplay in memory', () => {
  const env = browser();
  env.data.set('player', JSON.stringify({ count: 3, visited: [] }));
  const store = createPersistentStore('player', initial, normalize);
  assert.equal(store.getSnapshot().count, 3);
  env.block();
  store.set({ count: 8, visited: ['coffee'] });
  store.set((state) => ({ ...state, count: state.count + 2 }));
  assert.equal(store.getSnapshot().count, 10);
  assert.deepEqual(store.getSnapshot().visited, ['coffee']);
});

test('other-tab changes and clear events replace stale snapshots', () => {
  const env = browser();
  const store = createPersistentStore('player', initial, normalize);
  let notified = 0;
  const unsubscribe = store.subscribe(() => notified++);
  store.set({ count: 1, visited: [] });
  env.data.set('player', JSON.stringify({ count: 12, visited: ['park'] }));
  env.storageEvent('unrelated');
  assert.equal(notified, 1);
  env.storageEvent('player');
  assert.equal(store.getSnapshot().count, 12);
  env.data.clear();
  env.storageEvent(null);
  assert.equal(store.getSnapshot(), initial);
  assert.equal(notified, 3);
  unsubscribe();
});

test('an explicitly empty feed stays empty instead of resurrecting sample posts', () => {
  const env = browser();
  env.data.set('posts', '[]');
  const store = createPersistentStore('posts', ['sample'], (value) => Array.isArray(value) ? value : ['sample']);
  assert.deepEqual(store.getSnapshot(), []);
});
