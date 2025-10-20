import 'server-only';

import { JWTPayload, jwtVerify, SignJWT } from 'jose';
import { cookies } from 'next/headers';

const secretKey = process.env.SESSION_SECRET_KEY;
const encodeKey = new TextEncoder().encode(secretKey);
const algorithmHMAC = 'HS256';

export async function encrypt(payload: JWTPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: algorithmHMAC })
    .setIssuedAt()
    .setExpirationTime('2h')
    .sign(encodeKey);
}

export async function decrypt(session: string) {
  try {
    const { payload } = await jwtVerify(session, encodeKey, { algorithms: [algorithmHMAC] });
    return payload;
  } catch (error) {
    console.debug('Session expired or invalid', error);
    return null;
  }
}

export async function createSession(userId: string) {
  const expiresAt = new Date(Date.now() + 2 * 60 * 60 * 1000); // 2 hours from now
  const session = await encrypt({ userId, expiresAt: expiresAt.toISOString() });
  const cookieStore = await cookies();

  cookieStore.set('session', session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    expires: expiresAt,
    sameSite: 'lax',
    path: '/',
  });

  return session;
}
