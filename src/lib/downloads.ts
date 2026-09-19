import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

export type DownloadFilename = 'poster_print.pdf' | 'poster_digital.pdf' | 'script.pdf';
/** Fail the build on an unmaterialized LFS pointer instead of publishing a broken PDF. */
export function isPdfAvailable(filename: DownloadFilename): boolean {
  // Build modules are bundled into a temporary directory; import.meta.url would
  // point there rather than at src/lib. npm scripts run from the project root.
  const file = resolve('public', 'downloads', filename);
  if (!existsSync(file)) return false;
  const header = readFileSync(file).subarray(0, 5).toString('ascii');
  if (header !== '%PDF-') throw new Error(`${filename}: keine PDF-Datei. Git LFS installieren und git lfs pull ausführen.`);
  return true;
}
