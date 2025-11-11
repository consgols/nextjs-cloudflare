'use server';

import { getDB } from '@/lib/database/d1db';
import { LoginFormSchema, RegisterFormSchema } from '@/lib/database/rules';
import { createSession } from '@/lib/database/session';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export type AuthResponseType = {
  errors: {
    email?: string[] | string | undefined;
    password?: string[] | string | undefined;
    confirmPassword?: string[] | undefined;
  };
  email: string | undefined;
  message?: string;
};

type UserType = {
  UserID: number;
  UserEmail: string;
  UserPassword: string;
};

const db = getDB();

export async function register(_: unknown, formData: FormData): Promise<AuthResponseType> {
  //  Validate input via Zod
  const validated = RegisterFormSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
    confirmPassword: formData.get('confirmPassword'),
  });

  if (!validated.success) {
    return {
      errors: validated.error.flatten().fieldErrors,
      email: formData.get('email')?.toString(),
    };
  }

  const { email, password } = validated.data;

  // Check if user already exists
  const existingUser = await db
    .prepare('SELECT 1 FROM Users WHERE UserEmail = ? LIMIT 1')
    .bind(email)
    .first<UserType>();

  if (existingUser) {
    return {
      errors: { email: 'Email already exists!', password: [], confirmPassword: [] },
      email,
    };
  }

  // Hash password (bcrypt.hash already handles salt)
  const hashedPassword = await bcrypt.hash(password, 10);

  //  Save new user
  await db.prepare('INSERT INTO Users (UserEmail, UserPassword) VALUES (?, ?)').bind(email, hashedPassword).run();

  // Redirect to dashboard
  redirect('/createcv');
}

export async function login(_: unknown, formData: FormData): Promise<AuthResponseType> {
  const validated = LoginFormSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  });

  if (!validated.success) {
    return {
      errors: validated.error.flatten().fieldErrors,
      email: formData.get('email')?.toString(),
    };
  }

  const { email, password } = validated.data;

  // Only fetch what you need; ensure the query can use an index on UserEmail
  const user = await db
    .prepare('SELECT UserID, UserPassword FROM Users WHERE UserEmail = ? LIMIT 1')
    .bind(email)
    .first<UserType>();

  if (!user) {
    return { errors: { email: ['Email not registered'], password: [] }, email };
  }

  const ok = await bcrypt.compare(password, user.UserPassword);
  if (!ok) {
    return { errors: { email: [], password: ['invalid password'] }, email };
  }

  await createSession(String(user.UserID));
  redirect('/createcv'); // never returns
}

export async function logout() {
  //Delete the session cookie to log out the user.
  const cookieStore = await cookies();
  cookieStore.delete('session');
  redirect('/login');
}
