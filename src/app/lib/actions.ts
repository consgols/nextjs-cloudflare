'use server';

import { getCollection } from '@/lib/database/db';

export async function post(formData: CvData) {
  const collection = await getCollection('resumes');
  try {
    await collection?.insertOne(formData);
  } catch (err) {
    return { status: err, message: 'Error' };
  }

  return { status: 200, message: 'API is working', data: formData };
}

export async function get() {
  return { status: 200, message: 'API is working' };
}
