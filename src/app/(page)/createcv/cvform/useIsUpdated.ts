'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

type CompareOptions<T> = {
  pick?: (keyof T)[];
  omit?: (keyof T)[];
  /** return true if equal */
  isEqual?: (a: T, b: T) => boolean;
};

function stableStringify(value: unknown): string {
  const seen = new WeakSet();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const helper = (val: any): any => {
    if (val === null || typeof val !== 'object') return val;
    if (seen.has(val)) throw new TypeError('Cannot stringify circular structure');
    seen.add(val);
    if (Array.isArray(val)) return val.map(helper);
    const keys = Object.keys(val).sort();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const out: Record<string, any> = {};
    for (const k of keys) out[k] = helper(val[k]);
    return out;
  };
  return JSON.stringify(helper(value));
}

function deepEqual(a: unknown, b: unknown): boolean {
  if (Object.is(a, b)) return true;
  return stableStringify(a) === stableStringify(b);
}

function projectByPick<T extends object>(obj: T, keys: (keyof T)[]) {
  const out = {} as Partial<T>;
  for (const k of keys) out[k] = obj[k];
  return out;
}

function projectByOmit<T extends object>(obj: T, keys: (keyof T)[]) {
  const set = new Set(keys);
  const out = {} as Partial<T>;
  for (const k in obj) if (!set.has(k as keyof T)) out[k as keyof T] = obj[k as keyof T];
  return out;
}

/**
 * useIsUpdated
 * - Snapshots an initial value.
 * - Returns `isUpdated` when `current` differs from the snapshot.
 * - `resetInitial(next?)` sets a new baseline and triggers recompute immediately.
 * - If `initial` prop changes and equals `current`, the hook auto-adopts it (sets clean).
 */
export function useIsUpdated<T extends object>(current: T, initial?: T, options?: CompareOptions<T>) {
  // Snapshot ref (baseline)
  const initialRef = useRef<T>(initial ?? current);

  // Version to force recompute when baseline changes
  const [baselineVersion, setBaselineVersion] = useState(0);
  const bumpBaseline = () => setBaselineVersion(v => v + 1);

  const { pick, omit, isEqual } = options ?? {};

  // Adopt new initial when parent updates it AND it matches the current value
  // so the form becomes clean as expected.
  const stringifiedIncomingInitial = useMemo(
    () => (initial === undefined ? undefined : stableStringify(initial)),
    [initial],
  );

  useEffect(() => {
    if (initial === undefined) return;
    // Only adopt if the new initial differs from our baseline…
    if (!deepEqual(initialRef.current, initial)) {
      // …and matches the current state (i.e., user is effectively in-sync)
      if (deepEqual(current, initial)) {
        initialRef.current = initial;
        bumpBaseline(); // trigger recompute
      }
    }
  }, [stringifiedIncomingInitial, current, initial]); // stringify prevents deep deps churn

  const resetInitial = useCallback(
    (next?: T) => {
      initialRef.current = next ?? current;
      bumpBaseline(); // force recompute now
    },
    [current],
  );

  const [snapForCompare, currentForCompare] = useMemo(() => {
    let baseSnap: Partial<T> = initialRef.current;
    let baseCurr: Partial<T> = current;

    if (pick && pick.length) {
      baseSnap = projectByPick(baseSnap as T, pick);
      baseCurr = projectByPick(baseCurr as T, pick);
    } else if (omit && omit.length) {
      baseSnap = projectByOmit(baseSnap as T, omit);
      baseCurr = projectByOmit(baseCurr as T, omit);
    }

    return [baseSnap, baseCurr];
    // Include baselineVersion so comparisons recompute after reset/adopt.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current, pick?.join('|'), omit?.join('|'), baselineVersion]);

  const isUpdated = useMemo(() => {
    if (isEqual) return !isEqual(snapForCompare as T, currentForCompare as T);
    return !deepEqual(snapForCompare, currentForCompare);
  }, [snapForCompare, currentForCompare, isEqual]);

  return { isUpdated, resetInitial, initialSnapshot: initialRef.current };
}
