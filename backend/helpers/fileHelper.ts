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

export async function uploadProductImageFile(file: File): Promise<string> {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const baseUploadPath = process.env.SHARED_UPLOADS_PATH;

    if (!baseUploadPath) {
        throw new Error('Shared uploads path is not defined.');
    }

    const folder = 'products';
    const targetDirectory = path.join(baseUploadPath, folder);

    try {
        await fs.access(targetDirectory);
    } catch {
        await fs.mkdir(targetDirectory, { recursive: true });
    }

    const safeFileName = `${
        path
            .basename(file.name || 'image', path.extname(file.name || ''))
            .replace(/[^a-zA-Z0-9-_]+/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-|-$/g, '')
            .toLowerCase() || 'product'
    }-${Date.now()}-${Math.random().toString(36).slice(2, 8)}${path.extname(file.name || '')}`;

    const destinationPath = path.join(targetDirectory, safeFileName);
    await fs.writeFile(destinationPath, buffer);

    return `/uploads/${folder}/${safeFileName}`;
}
