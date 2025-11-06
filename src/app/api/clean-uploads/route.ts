import { NextResponse } from 'next/server';
import { cleanUploadsFolder } from '@/app/lib/utils/files';

export async function POST() {
  try {
    await cleanUploadsFolder();
    return NextResponse.json({ success: true, message: 'Uploads folder cleaned successfully.' });
  } catch (err) {
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 });
  }
}
