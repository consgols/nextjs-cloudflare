/**
 * Converts a base64 DataURL (from FileReader.readAsDataURL) into a File object.
 * If no filename is provided, one will be auto-generated from the MIME type.
 */
export function dataURLtoFile(dataUrl: string, filename?: string): File {
  const [header, base64] = dataUrl.split(',');
  const mimeMatch = header.match(/:(.*?);/);
  if (!mimeMatch) throw new Error('Invalid data URL');

  const mime = mimeMatch[1];
  const binary = atob(base64);
  const len = binary.length;
  const bytes = new Uint8Array(len);

  for (let i = 0; i < len; i++) {
    bytes[i] = binary.charCodeAt(i);
  }

  // Infer file extension from MIME type (e.g. "image/png" → "png")
  const ext = mime.split('/')[1] || 'bin';
  const name = filename ?? `file.${ext}`;

  return new File([bytes], name, { type: mime });
}
