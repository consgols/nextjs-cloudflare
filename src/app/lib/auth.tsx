'use server';

import { getCollection } from '@/lib/database/db';
import { LoginFormSchema, RegisterFormSchema } from '@/lib/database/rules';
import { createSession } from '@/lib/database/session';
import bcrypt from 'bcrypt';
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

export async function register(state: unknown, formData: FormData): Promise<AuthResponseType> {
  //Validates form fields using zod.
  const validatedFields = RegisterFormSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
    confirmPassword: formData.get('confirmPassword'),
  });

  //If validation fails, return the errors and the email field value.
  if (!validatedFields.success)
    return { errors: validatedFields.error.flatten().fieldErrors, email: formData.get('email')?.toString() };

  //If validation succeeds, extract the email and password from the validated fields.
  const { email, password } = validatedFields.data;

  //Connect to the MongoDB database and get the users collection.
  const userCollection = await getCollection('users');

  //Check if the user already exists in the database.
  if (!userCollection) return { errors: { email: 'Server Error!', password: [], confirmPassword: [] }, email };

  //Check if the email already exists in the database.
  const existingUser = await userCollection?.findOne({ email });
  if (existingUser) return { errors: { email: 'Email already exists!', password: [], confirmPassword: [] }, email };

  //Hash the password before saving it to the database
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Save the new user to the database.
  await userCollection?.insertOne({ email, password: hashedPassword });

  //return { message: 'User created successfully!', errors: {}, email: '' };

  redirect('/createcv');
}

export async function login(state: unknown, formData: FormData): Promise<AuthResponseType> {
  //Validates form fields using zod.
  const validatedFields = LoginFormSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  });

  //If validation fails, return the errors and the email field value.
  if (!validatedFields.success)
    return { errors: validatedFields.error.flatten().fieldErrors, email: formData.get('email')?.toString() };

  //If validation succeeds, extract the email and password from the validated fields.
  const { email, password } = validatedFields.data;

  //Connect to the MongoDB database and get the users collection.
  const userCollection = await getCollection('users');

  //Check if the user already exists in the database.rror!', password: [], confirmPassword: [] }, email };
  if (!userCollection) return { errors: { email: ['Server Error!'], password: [] }, email };

  //Check if the email already exists in the database.
  const existingUser = await userCollection?.findOne({ email });
  if (!existingUser) return { errors: { email: ['Email not registered'], password: [] }, email };

  //Compare the password with the hashed password in the database.
  const matchPassword = await bcrypt.compare(password, existingUser.password);

  if (!matchPassword) return { errors: { email: [], password: ['invalid password'] }, email };

  //If the user is not saved successfully, return an error.
  await createSession(existingUser._id.toString());

  //Redirect to the dashboard page after successful registration.
  redirect('/createcv');
}

export async function logout() {
  //Delete the session cookie to log out the user.
  const cookieStore = await cookies();
  cookieStore.delete('session');
  redirect('/login');
}
