'use client';

import { SWRConfig } from 'swr';

export default function SWRProviders({ user, children }: { user: { id: string } | null; children: React.ReactNode }) {
  return (
    <SWRConfig
      key={user?.id ?? 'guest'} // remount on user change
      value={{ provider: () => new Map() }}
    >
      {children}
    </SWRConfig>
  );
}
