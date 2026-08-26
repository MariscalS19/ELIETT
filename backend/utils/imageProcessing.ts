import fs from 'fs/promises';
import path from 'path';
import sharp from 'sharp';

const DEFAULT_WEBP_QUALITY = 80;
const MAX_IMAGE_WIDTH = 1920;

/**
 * Optimizes an image buffer to a WebP format with specified dimensions and quality.
 * @param imageBuffer - The image buffer to optimize.
 * @param width - The desired width of the output image.
 * @param height - The desired height of the output image.
 * @param quality - The quality of the output WebP image (default: 80).
 * @returns A promise resolving to the optimized image buffer.
 */
export async function optimizeImage(
    imageBuffer: Buffer,
    width?: number,
    height?: number,
    quality = DEFAULT_WEBP_QUALITY
): Promise<Buffer> {
    const transformer = sharp(imageBuffer).rotate();

    // If no width is specified, apply a default limit of 1920px
    const targetWidth = width || (!height ? MAX_IMAGE_WIDTH : undefined);

    if (targetWidth || height) {
        transformer.resize(targetWidth, height, {
            fit: 'cover',
            position: 'center',
            withoutEnlargement: true,
        });
    }

    return transformer
        .webp({
            quality,
            effort: 4,
            smartSubsample: true,
        })
        .toBuffer();
}

/**
 * Processes an uploaded image file, optimizes it, and saves it to the specified folder.
 * @param file - The uploaded image file (File or Blob).
 * @param folder - The folder to save the processed image (default: 'products').
 * @param options - Optional parameters for width, height, and quality.
 * @returns A promise resolving to the URL of the saved image.
 */
export async function processUploadedImage(
    file: File | Blob,
    folder = 'products',
    options?: { width?: number; height?: number; quality?: number }
): Promise<string> {
    const buffer = Buffer.from(await file.arrayBuffer());
    const fileName =
        'name' in file && typeof file.name === 'string' ? file.name : 'image';

    return saveProcessedImage(buffer, fileName, folder, options);
}

/**
 * Builds a safe file name for the processed image.
 * @param fileName - The original file name.
 * @returns A safe file name.
 */
export function buildSafeFileName(fileName: string): string {
    const base = path
        .basename(fileName, path.extname(fileName))
        .replace(/[^a-zA-Z0-9-_]+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '')
        .toLowerCase();

    return `${base || 'product'}-${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 8)}.webp`;
}

/**
 * Saves a processed image to the specified folder.
 * @param imageBuffer - The processed image buffer.
 * @param originalFileName - The original file name.
 * @param folder - The folder to save the image (default: 'products').
 * @param options - Optional parameters for width, height, and quality.
 * @returns A promise resolving to the URL of the saved image.
 */
export async function saveProcessedImage(
    imageBuffer: Buffer,
    originalFileName: string,
    folder = 'products',
    options?: { width?: number; height?: number; quality?: number }
): Promise<string> {
    const baseUploadPath =
        process.env.SHARED_UPLOADS_PATH ||
        path.join(process.cwd(), 'public', 'uploads');
    const targetDirectory = path.join(baseUploadPath, folder);

    try {
        await fs.access(targetDirectory);
    } catch {
        await fs.mkdir(targetDirectory, { recursive: true });
    }

    const processedBuffer = await optimizeImage(
        imageBuffer,
        options?.width,
        options?.height,
        options?.quality ?? DEFAULT_WEBP_QUALITY
    );

    const safeFileName = buildSafeFileName(originalFileName);
    const destinationPath = path.join(targetDirectory, safeFileName);

    await fs.writeFile(destinationPath, processedBuffer);

    return `/uploads/${folder}/${safeFileName}`;
}

export default optimizeImage;
