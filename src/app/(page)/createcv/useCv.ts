/* eslint-disable @typescript-eslint/ban-ts-comment */

'use client';

import useSWR from 'swr';
import { CVFormData } from './defaullt_data';

type UseCvOptions = {
  endpoint?: string; // defaults to '/api/cv'
  initialData?: CvData; // defaults to CVFormData (fallback for 404)
  fetcher?: typeof fetch; // for testing/mocking; defaults to window.fetch
};

export type CvWithId = CvData & { _id?: string; id?: string }; // support either _id or id from API

// @ts-ignore

export function useCv(options: UseCvOptions = {}) {
  const { endpoint = '/api/cv', initialData = CVFormData, fetcher = fetch } = options;

  // Local fetcher that handles 404 → initialData and throws on other non-OK statuses
  const swrFetcher = async (url: string): Promise<CvWithId> => {
    const res = await fetcher(url);

    if (res.status === 404) {
      // user has no CV yet — use a blank/default
      return initialData as CvWithId;
    }
    if (!res.ok) {
      throw new Error(`Failed to fetch CV (status ${res.status})`);
    }
    return (await res.json()) as CvWithId;
  };

  const { data, error, isLoading, mutate } = useSWR<CvWithId>(endpoint, swrFetcher, {
    // 404 already returns initialData; leave other errors surfaced
    revalidateOnFocus: true,
    dedupingInterval: 1000,
  });

  // convenient alias — forces a revalidation
  const refresh = () => mutate();

  /** Utility to read the id (supports _id or id) */
  const getId = (cv?: Partial<CvWithId>) => cv?._id ?? cv?.id ?? '';

  /**
   * Create (POST /api/cv)
   * - Expects `{ id }` in response
   * - Seeds cache with the returned id (as `_id`) if server doesn’t return a full CV
   */
  const createCv = async (payload: CvData): Promise<{ id: string; cv: CvWithId }> => {
    const res = await fetcher(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      throw new Error(`Failed to create CV (status ${res.status})`);
    }

    // Some APIs return { id }, others return the full CV. Handle both.
    const body = await res.json().catch(() => null);

    // @ts-ignore

    const id: string | undefined = body?.id ?? body?._id ?? body?.cv?._id ?? body?.cv?.id;

    let next: CvWithId;

    // @ts-ignore

    if (body && (body.fullName || body.cv)) {
      // looks like a full CV payload
      // @ts-ignore

      next = (body.cv ?? body) as CvWithId;
      if (id && !getId(next)) next._id = id;
    } else {
      // most minimal case: only id returned
      if (!id) throw new Error('Create succeeded but no id returned');
      next = { ...(payload as CvWithId), _id: id };
    }

    // Put into cache without revalidation (instant UI)
    await mutate(next, { revalidate: false, populateCache: true });

    return { id: getId(next), cv: next };
  };

  /**
   * Update (PUT /api/cv)
   * - Sends `{ id, ...payload }` per your current API
   * - Optimistic update; keeps optimistic state on failure (no rollback)
   */
  const updateCv = async (payload: CvData, idFromCaller?: string): Promise<CvWithId> => {
    const current = (data ?? initialData) as CvWithId;
    const id = idFromCaller ?? getId(current);
    if (!id) throw new Error('Missing CV id for update');

    const next = { ...current, ...payload } as CvWithId;

    const result = await mutate(
      async () => {
        const res = await fetcher(endpoint, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id, ...payload }),
        });

        if (!res.ok) {
          throw new Error(`Failed to update CV (status ${res.status})`);
        }

        // Prefer server version if available; else keep optimistic
        const saved = (await res.json().catch(() => null)) as CvWithId | null;
        // Ensure id is not lost even if server omits it
        if (saved && !getId(saved)) (saved as CvWithId)._id = id;
        return (saved ?? next) as CvWithId;
      },
      {
        optimisticData: next,
        revalidate: true,
        rollbackOnError: false, // keep optimistic state if the request fails
        populateCache: true,
      },
    );

    return result as CvWithId;
  };

  /**
   * Unified save:
   * - If we have an id → update
   * - If not → create, then bind cache to the new entity
   */
  const saveCv = async (updates: Partial<CvData> | CvData): Promise<{ id: string; cv: CvWithId }> => {
    const current = (data ?? initialData) as CvWithId;
    const next = { ...current, ...(updates as object) } as CvWithId;
    const id = getId(current);

    if (id) {
      const updated = await updateCv(next as CvData, id);
      return { id: getId(updated), cv: updated };
    } else {
      return await createCv(next as CvData);
    }
  };

  /**
   * Expose a setCv helper similar to useState’s setter.
   * - setCv(next) replaces the cache with `next`
   * - setCv(updater) receives the current cached value
   */
  const setCv = (next: CvWithId | ((prev: CvWithId | undefined) => CvWithId)) => {
    return mutate(
      typeof next === 'function'
        ? (prev?: CvWithId) => (next as (p?: CvWithId) => CvWithId)(prev ?? (initialData as CvWithId))
        : next,
      { revalidate: true, populateCache: true },
    );
  };

  return {
    cv: (data ?? null) as CvWithId,
    setCv,
    loading: isLoading,
    error: error ?? null,
    refresh,
    // new helpers:
    createCv,
    updateCv,
    saveCv,
  };
}
