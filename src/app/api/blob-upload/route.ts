import { NextResponse } from 'next/server';
import crypto from 'crypto';
import sharp from 'sharp';
import { put, head } from '@vercel/blob'; // 👈 only need these now

export const runtime = 'nodejs'; // sharp needs Node runtime

const TARGET_BYTES = 1 * 1024 * 1024; // 1 MB
const BACKGROUND_COLOR = '#ffffff'; // flatten transparent images to JPG

export async function POST(req: Request) {
  const formData = await req.formData();
  const file = formData.get('file') as File | null;

  if (!file) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 });
  }

  const allowed = new Set(['image/jpeg', 'image/png', 'image/webp']);
  if (!allowed.has(file.type)) {
    return NextResponse.json({ error: 'Unsupported image type' }, { status: 415 });
  }

  const inputBuffer = Buffer.from(await file.arrayBuffer());
  const { outBuffer } = await compressToJpgMaxSize(inputBuffer, TARGET_BYTES, BACKGROUND_COLOR);

  // Hash AFTER compression (dedupe identical outputs)
  const hash = crypto.createHash('sha256').update(outBuffer).digest('hex').slice(0, 32);
  const pathname = `${hash}.jpg`; // no "uploads/" prefix if you removed it

  // ✅ Faster existence check using head()
  try {
    const existing = await head(pathname);
    // Blob already exists → no need to upload
    return NextResponse.json({ url: existing.url, hash, bytes: outBuffer.length });
  } catch {
    // Not found → continue to upload
  }

  // Upload to Blob
  const blob = await put(pathname, outBuffer, {
    access: 'public',
    contentType: 'image/jpeg',
    addRandomSuffix: false,
    cacheControlMaxAge: 60 * 60 * 24 * 365, // 1 year
  });

  return NextResponse.json({ url: blob.url, hash, bytes: outBuffer.length });
}

async function compressToJpgMaxSize(input: Buffer, maxBytes: number, bgColor: string): Promise<{ outBuffer: Buffer }> {
  const base = sharp(input, { failOn: 'none' }).withMetadata();
  const meta = await base.metadata();

  const prepared = meta.hasAlpha ? base.clone().flatten({ background: bgColor }) : base.clone();

  // First attempt — high quality
  let buf = await prepared.clone().jpeg({ quality: 85, mozjpeg: true }).toBuffer();
  if (buf.length <= maxBytes) return { outBuffer: buf };

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

  // Fallback
  buf = await prepared.clone().resize(1024).jpeg({ quality: 60, mozjpeg: true }).toBuffer();
  return { outBuffer: buf };
}
