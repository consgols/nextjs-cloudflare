// app/api/upload/route.ts
import { NextResponse } from 'next/server';
import { mkdir, writeFile, access } from 'fs/promises';
import { constants } from 'fs';
import path from 'path';
import crypto from 'crypto';
import sharp from 'sharp';

export const runtime = 'nodejs'; // sharp requires Node runtime

const TARGET_BYTES = 2 * 1024 * 1024; // 2 MB
const BACKGROUND_COLOR = '#ffffff'; // used to flatten transparent images to JPG

export async function POST(req: Request) {
  const formData = await req.formData();
  const file = formData.get('file') as File | null;

  if (!file) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 });
  }

  // Allow JPEG, PNG, WEBP as input
  const allowed = new Set(['image/jpeg', 'image/png', 'image/webp']);
  if (!allowed.has(file.type)) {
    return NextResponse.json({ error: 'Unsupported image type' }, { status: 415 });
  }

  const inputBuffer = Buffer.from(await file.arrayBuffer());
  const { outBuffer } = await compressToJpgMaxSize(inputBuffer, TARGET_BYTES, BACKGROUND_COLOR);

  // Hash AFTER compression so identical outputs dedupe
  const hash = crypto.createHash('sha256').update(outBuffer).digest('hex').slice(0, 32);

  // Create or reuse uploads directory
  const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
  await mkdir(uploadsDir, { recursive: true });

  // Define the filename and full path
  const filename = `${hash}.jpg`;
  const filePath = path.join(uploadsDir, filename);

  try {
    //Check if file already exists
    await access(filePath, constants.F_OK);
  } catch {
    //File does not exist → write it
    await writeFile(filePath, outBuffer);
  }

  return NextResponse.json({ url: `/uploads/${filename}`, hash, bytes: outBuffer.length });
}

async function compressToJpgMaxSize(input: Buffer, maxBytes: number, bgColor: string): Promise<{ outBuffer: Buffer }> {
  const base = sharp(input, { failOn: 'none' }).withMetadata();
  const meta = await base.metadata();

  // If input has alpha, flatten onto a background so JPEG looks correct
  const prepared = meta.hasAlpha ? base.clone().flatten({ background: bgColor }) : base.clone();

  // First attempt — high quality JPEG
  let buf = await prepared.clone().jpeg({ quality: 85, mozjpeg: true }).toBuffer();
  if (buf.length <= maxBytes) return { outBuffer: buf };

  // Progressive quality & downscale steps until <= maxBytes
  const qualitySteps = [80, 75, 70, 65, 60, 55, 50, 45, 40, 35, 30, 25];
  const scaleSteps = [1, 0.9, 0.8, 0.7, 0.6, 0.5];

  const width = meta.width ?? null;

  for (const scale of scaleSteps) {
    const img = width ? prepared.clone().resize(Math.max(1, Math.round(width * scale))) : prepared.clone();

    for (const q of qualitySteps) {
      buf = await img.clone().jpeg({ quality: q, mozjpeg: true }).toBuffer();
      if (buf.length <= maxBytes) return { outBuffer: buf };
    }
  }

  // Absolute fallback — strong downsize + medium quality
  buf = await prepared.clone().resize(1024).jpeg({ quality: 60, mozjpeg: true }).toBuffer();
  return { outBuffer: buf };
}
