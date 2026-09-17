import fs from 'fs/promises';
import path from 'path';

export default function resolveStoredFilePath(
    imageUrl: string | null | undefined
): string | null {
    if (!imageUrl || !imageUrl.startsWith('/uploads/')) {
        return null;
    }

    const rootPath = process.env.SHARED_UPLOADS_PATH;
    if (!rootPath) {
        return null;
    }

    const relativePath = imageUrl.replace(/^\/uploads\//, '');
    const resolved = path.resolve(rootPath, relativePath);
    const normalizedRoot = path.resolve(rootPath) + path.sep;

    if (!resolved.startsWith(normalizedRoot)) {
        return null;
    }

    return resolved;
}

export async function deleteStoredFile(
    imageUrl: string | null | undefined
): Promise<void> {
    const filePath = resolveStoredFilePath(imageUrl);
    if (!filePath) return;

    try {
        await fs.unlink(filePath);
    } catch {
        // Ignore errors, as the file might not exist or be inaccessible.
    }
}
