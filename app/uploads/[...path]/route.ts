import { NextRequest } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const MIME_TYPES: Record<string, string> = {
    '.avif': 'image/avif',
    '.gif': 'image/gif',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.svg': 'image/svg+xml',
    '.webp': 'image/webp',
};

function getUploadsRoot() {
    return process.env.SHARED_UPLOADS_PATH || null;
}

function resolveSafePath(rootPath: string, segments: string[]) {
    const targetPath = path.resolve(rootPath, ...segments);
    const normalizedRoot = path.resolve(rootPath) + path.sep;

    if (!targetPath.startsWith(normalizedRoot)) {
        return null;
    }

    return targetPath;
}

export async function GET(
    _request: NextRequest,
    { params }: { params: Promise<{ path: string[] }> }
) {
    const { path: segments } = await params;

    if (!segments?.length) {
        return new Response('Not found', { status: 404 });
    }

    const rootPath = getUploadsRoot();
    if (!rootPath) {
        return new Response('Uploads storage is not configured', {
            status: 500,
        });
    }

    const filePath = resolveSafePath(rootPath, segments);

    if (!filePath) {
        return new Response('Invalid path', { status: 400 });
    }

    try {
        const fileBuffer = await fs.readFile(filePath);
        const extension = path.extname(filePath).toLowerCase();
        const contentType = MIME_TYPES[extension] || 'application/octet-stream';

        return new Response(fileBuffer, {
            headers: {
                'Content-Type': contentType,
                'Cache-Control': 'public, max-age=31536000, immutable',
            },
        });
    } catch {
        return new Response('Not found', { status: 404 });
    }
}
