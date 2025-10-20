// helper: compress a canvas under a size budget
export async function compressCanvasUnderSize(
  srcCanvas: HTMLCanvasElement,
  {
    maxBytes = 1_000_000,
    type = 'image/webp', // 'image/jpeg' also OK; avoid PNG for photos
    startQuality = 0.92,
    minQuality = 0.4,
    downscaleStep = 0.85, // 15% smaller each iteration if needed
  } = {},
): Promise<{ blob: Blob; url: string; width: number; height: number; qualityUsed: number }> {
  const toBlob = (c: HTMLCanvasElement, t: string, q?: number) =>
    new Promise<Blob>((res, rej) => c.toBlob(b => (b ? res(b) : rej(new Error('toBlob null'))), t, q));

  // work on a separate canvas at 1× DPR so export isn't Retina-inflated
  const work = document.createElement('canvas');
  let targetW = srcCanvas.width;
  let targetH = srcCanvas.height;

  const redraw = () => {
    work.width = targetW;
    work.height = targetH;
    const wctx = work.getContext('2d')!;
    wctx.imageSmoothingQuality = 'high';
    // draw WITHOUT scaling by devicePixelRatio
    wctx.drawImage(srcCanvas, 0, 0, targetW, targetH);
  };

  for (let attempts = 0; attempts < 12; attempts++) {
    redraw();

    if (type === 'image/png') {
      const png = await toBlob(work, 'image/png');
      if (png.size <= maxBytes) {
        const url = URL.createObjectURL(png);
        return { blob: png, url, width: targetW, height: targetH, qualityUsed: 1 };
      }
    } else {
      // binary-search quality
      let lo = minQuality,
        hi = Math.min(1, Math.max(minQuality, startQuality));
      let best: { blob: Blob; q: number } | null = null;

      for (let i = 0; i < 8; i++) {
        const q = i === 0 ? hi : (lo + hi) / 2;
        const trial = await toBlob(work, type, q);
        if (trial.size <= maxBytes) {
          best = { blob: trial, q };
          lo = q;
        } else {
          hi = q;
        }
      }
      if (best) {
        const url = URL.createObjectURL(best.blob);
        return { blob: best.blob, url, width: targetW, height: targetH, qualityUsed: Number(best.q.toFixed(3)) };
      }
    }

    // still too big → downscale and retry
    const nextW = Math.max(1, Math.floor(targetW * downscaleStep));
    const nextH = Math.max(1, Math.floor(targetH * downscaleStep));
    if (nextW === targetW && nextH === targetH) break;
    targetW = nextW;
    targetH = nextH;
  }

  // fallback: min quality (or PNG as-is)
  const blob = await toBlob(
    work,
    type === 'image/png' ? 'image/png' : type,
    type === 'image/png' ? undefined : minQuality,
  );
  const url = URL.createObjectURL(blob);
  return { blob, url, width: targetW, height: targetH, qualityUsed: type === 'image/png' ? 1 : minQuality };
}
