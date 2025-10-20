import { cookies } from 'next/headers';
import { decrypt } from './session';

export type SessionUser = { userId: string };

export default async function getAuthUser(): Promise<SessionUser | null> {
  const cookieStore = await Promise.resolve(cookies()); // works if sync or async
  const session = cookieStore.get('session')?.value;

  if (!session) return null;

  const user = await decrypt(session);
  return user as SessionUser | null; // simplest typing
}
