import { promises as fs } from "fs";
import { join, dirname } from "path";
import { pathToFileURL, fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Recursively resolves all .js and .ts files in a given directory inside the `src` folder.
 * @param dirName The directory name inside `src` (e.g., "commands", "events")
 * @returns Array of file URLs to import
 */
export async function resolveFiles(dirName: string): Promise<string[]> {
  // Walk upwards from current file to find the `src` dir
  // Note: This file is in `src/utilities/pathResolver.ts`, so `src` is its parent directory
  const srcPath = join(__dirname, "..");
  const targetPath = join(srcPath, dirName);

  const fileUrls: string[] = [];

  async function walk(dir: string) {
    let files;
    try {
      files = await fs.readdir(dir, { withFileTypes: true });
    } catch (err) {
      // If directory doesn't exist, ignore and return empty
      return;
    }

    for (const file of files) {
      const fullPath = join(dir, file.name);
      if (file.isDirectory()) {
        await walk(fullPath);
      } else if (file.name.endsWith(".ts") || file.name.endsWith(".js")) {
        // Skip type definition files
        if (!file.name.endsWith(".d.ts")) {
          fileUrls.push(pathToFileURL(fullPath).href);
        }
      }
    }
  }

  await walk(targetPath);
  return fileUrls;
}
