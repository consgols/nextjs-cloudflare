import { readdir, unlink, stat, rm, mkdir } from 'fs/promises';
import path from 'path';

type Errno = NodeJS.ErrnoException;

function isErrno(e: unknown): e is Errno {
  return e instanceof Error && typeof (e as Partial<Errno>).code === 'string';
}

/**
 * Cleans the /public/uploads directory by deleting all files/subfolders inside it.
 * Keeps (or recreates) the uploads folder itself.
 */
export async function cleanUploadsFolder(): Promise<void> {
  const uploadsDir = path.join(process.cwd(), 'public', 'uploads');

  try {
    const items = await readdir(uploadsDir);

    // delete everything in parallel
    await Promise.all(
      items.map(async item => {
        const itemPath = path.join(uploadsDir, item);
        const itemStat = await stat(itemPath);
        if (itemStat.isDirectory()) {
          await rm(itemPath, { recursive: true, force: true });
        } else {
          await unlink(itemPath);
        }
      }),
    );

    // ensure folder still exists (noop if already there)
    await mkdir(uploadsDir, { recursive: true });
  } catch (err: unknown) {
    if (isErrno(err) && err.code === 'ENOENT') {
      // Folder doesn't exist — create it so callers can rely on it
      await mkdir(uploadsDir, { recursive: true });
      return;
    }
    // console.error('Error cleaning uploads folder:', err);
    throw err; // preserve original type
  }
}
