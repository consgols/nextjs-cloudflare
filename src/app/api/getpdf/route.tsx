import React from 'react';
import { NextRequest } from 'next/server';
import { renderToStream, Font, type DocumentProps } from '@react-pdf/renderer';
import { CreatePDF } from '@/components/pdfgenerator';

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const formData = searchParams.get('data');
  const toDl = searchParams.get('dl') === 'true';
  const origin = req.headers.get('origin') ?? new URL(req.url).origin;

  Font.register({
    family: 'Poppins',
    fonts: [
      { src: `${origin}/assets/fonts/regular.ttf` },
      { src: `${origin}/assets/fonts/bold.ttf`, fontWeight: 'bold' },
    ],
  });

  const element: React.ReactElement<DocumentProps> = (
    <CreatePDF formData={formData ? (JSON.parse(decodeURIComponent(formData)) as CvData) : undefined} />
  );

  const stream = await renderToStream(element);

  return new Response(stream as unknown as ReadableStream, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `${toDl ? 'attachment' : 'inline'}; filename="avensia_cv.pdf"`,
    },
  });
}
