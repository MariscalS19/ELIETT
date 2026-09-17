import { uploadProductImageFile } from './fileHelper';
import type { ProductFormState, ProductImageInput } from '@/types';

/**
 * Normalizes a raw product JSON object into a ProductFormState object.
 * It ensures that the inventory and images properties are always arrays, even if they are missing or not arrays in the raw object.
 * @param raw The raw product JSON object to normalize.
 * @returns A normalized ProductFormState object.
 */
export function normalizeProductJson(
    raw: Record<string, any>
): ProductFormState {
    const payload = raw as ProductFormState;

    return {
        ...payload,
        inventory: Array.isArray(payload.inventory) ? payload.inventory : [],
        images: Array.isArray(payload.images) ? payload.images : [],
    };
}

/**
 * Parses a FormData object containing product data and returns a normalized ProductFormState object.
 * It handles both the payload and the uploaded image files, ensuring that new images are uploaded and their URLs are updated.
 * @param formData The FormData object containing product data and image files.
 * @returns A Promise that resolves to a normalized ProductFormState object.
 * @throws An error if the payload is missing or invalid.
 */
export async function parseProductFormData(
    formData: FormData
): Promise<ProductFormState> {
    const payloadRaw = formData.get('payload');

    if (!(payloadRaw instanceof File) && typeof payloadRaw !== 'string') {
        throw new Error('Missing product payload.');
    }

    const payload = JSON.parse(
        typeof payloadRaw === 'string' ? payloadRaw : await payloadRaw.text()
    ) as Record<string, any>;

    const uploadedFiles = formData.getAll('images') as File[];
    const productImages = Array.isArray(payload.images) ? payload.images : [];

    const normalizedImages = await Promise.all(
        productImages.map(async (image: ProductImageInput, index: number) => {
            const isNewImage =
                typeof image.image_url === 'string' &&
                image.image_url.startsWith('blob:');

            if (!isNewImage) {
                return {
                    ...image,
                    file: undefined,
                };
            }

            const uploadedFile = uploadedFiles.shift();
            if (!uploadedFile) {
                return {
                    ...image,
                    file: undefined,
                };
            }

            const uploadedUrl = await uploadProductImageFile(uploadedFile);
            return {
                ...image,
                image_url: uploadedUrl,
                file: undefined,
                fileName: image.fileName || uploadedFile.name,
                position: image.position ?? index + 1,
            };
        })
    );

    return normalizeProductJson({
        ...payload,
        images: normalizedImages,
    });
}

/**
 * Uploads new product images and returns the updated array of ProductImageInput objects.
 * If an image already has an image_url, it will be kept as is.
 * If an image has a file, it will be uploaded and the image_url will be updated.
 * The file property will be removed from the returned objects.
 * @param images Array of ProductImageInput objects to process.
 * @returns Promise that resolves to an array of ProductImageInput objects with updated image_url and without the file property.
 */
export async function processImagesForStorage(
    images: ProductImageInput[] = []
): Promise<ProductImageInput[]> {
    return Promise.all(
        images.map(async (image) => {
            if (!image.file) {
                return image;
            }

            const uploadedUrl = await uploadProductImageFile(image.file);
            return {
                ...image,
                image_url: uploadedUrl,
                file: undefined,
            };
        })
    );
}
