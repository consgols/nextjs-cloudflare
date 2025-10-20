'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

type Options = {
  onSave?: () => Promise<void> | void; // called if user clicks "Save"
  onDiscard?: () => Promise<void> | void; // called if user clicks "Discard"
};

/**
 * Guards navigation when `isDirty` is true by:
 * - showing a modal (you render it using `open` + handlers below)
 * - blocking window unload (refresh/close tab)
 *
 * To intercept client nav, call `attemptNavigate(href)`.
 */
export function useUnsavedChangesPrompt(isDirty: boolean, opts: Options = {}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [pendingHref, setPendingHref] = useState<string | null>(null);

  // Warn on browser refresh/close
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (!isDirty) {
        window.removeEventListener('beforeunload', handler);
        return;
      }
      e.preventDefault();
      e.returnValue = ''; // required for Chrome
    };

    window.addEventListener('beforeunload', handler);

    return () => window.removeEventListener('beforeunload', handler);
  }, [isDirty]);

  const attemptNavigate = useCallback(
    (href: string) => {
      if (isDirty) {
        setPendingHref(href);
        setOpen(true);
      } else {
        router.push(href);
      }
    },
    [isDirty, router],
  );

  const confirmSave = useCallback(async () => {
    await opts.onSave?.(); // you can call resetInitial() inside your onSave
    setOpen(false);
    setPendingHref(null);
  }, [opts]);

  const confirmDiscard = useCallback(async () => {
    await opts.onDiscard?.(); // typically calls resetInitial()
    const href = pendingHref;
    setOpen(false);
    setPendingHref(null);
    if (href) router.push(href);
  }, [opts, pendingHref, router]);

  const cancelStay = useCallback(() => {
    setOpen(false);
    setPendingHref(null);
  }, []);

  return { open, attemptNavigate, confirmSave, confirmDiscard, cancelStay, pendingHref };
}
