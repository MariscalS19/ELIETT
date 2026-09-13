'use server';

import { revalidatePath } from 'next/cache';
import {
    deleteProduct,
    getProducts,
    updateProduct,
    createProduct,
    updateProductVisibility,
} from '@/backend/db/lib';
import type { Product, ProductFormState, ProductImageInput } from '@/types';
import fs from 'fs/promises';
import path from 'path';

type ActionResponse =
    | { success: true; product?: Product; message?: string }
    | { success: false; error: string };

/**
 * Uploads a product image.
 * @param file The image file to upload.
 * @returns A promise resolving to the URL of the uploaded image.
 */
async function uploadProductImageActionFile(file: File): Promise<string> {
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
    }-${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 8)}${path.extname(file.name || '')}`;

    const destinationPath = path.join(targetDirectory, safeFileName);
    await fs.writeFile(destinationPath, buffer);

    return `/uploads/${folder}/${safeFileName}`;
}

/**
 * Normalizes the product JSON data.
 * @param raw The raw product data.
 * @returns The normalized product data.
 */
function normalizeProductJson(raw: Record<string, any>): ProductFormState {
    const payload = raw as ProductFormState;

    return {
        ...payload,
        inventory: Array.isArray(payload.inventory) ? payload.inventory : [],
        images: Array.isArray(payload.images) ? payload.images : [],
    };
}

/**
 * Parses the product form data.
 * @param formData The form data to parse.
 * @returns A promise resolving to the parsed product data.
 */
async function parseProductFormData(
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

            const uploadedUrl =
                await uploadProductImageActionFile(uploadedFile);
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

function validateProductPayload(payload: ProductFormState) {
    const {
        name,
        description,
        composition,
        color,
        gdl_price,
        foreigner_price,
        images,
        inventory,
    } = payload;

    if (!name || !description || !composition || !color) {
        return 'All text fields (name, description, composition, color) are required.';
    }

    if (gdl_price == null || Number.isNaN(gdl_price)) {
        return 'GDL price is required and must be a number.';
    }

    if (foreigner_price == null || Number.isNaN(foreigner_price)) {
        return 'Foreigner price is required and must be a number.';
    }

    if (!Array.isArray(images) || images.length === 0) {
        return 'At least one product image is required.';
    }

    for (const img of images) {
        if (!img || !img.image_url) {
            return 'All images must have an image_url.';
        }
    }

    if (!Array.isArray(inventory) || inventory.length === 0) {
        return 'Inventory variants are required.';
    }

    for (const variant of inventory) {
        if (variant.size == null || variant.sku == null) {
            return 'Each inventory variant must have a size and sku.';
        }
        const stock = (variant as any).stock;
        if (stock == null || Number.isNaN(stock) || stock < 0) {
            return 'Each inventory variant must have a non-negative stock number.';
        }
    }

    return null;
}

/**
 * Processes the images for storage.
 * @param images The images to process.
 * @returns A promise resolving to the processed images.
 */
async function processImagesForStorage(
    images: ProductImageInput[] = []
): Promise<ProductImageInput[]> {
    return Promise.all(
        images.map(async (image) => {
            if (!image.file) {
                return image;
            }

            const uploadedUrl = await uploadProductImageActionFile(image.file);
            return {
                ...image,
                image_url: uploadedUrl,
                file: undefined,
            };
        })
    );
}

/**
 * Creates a new product.
 * @param formData The form data for the new product.
 * @returns A promise resolving to the result of the operation.
 */
export async function createProductAction(
    formData: ProductFormState | FormData
): Promise<ActionResponse> {
    const payload =
        formData instanceof FormData
            ? await parseProductFormData(formData)
            : formData;

    const validationError = validateProductPayload(payload);
    if (validationError) {
        return { success: false, error: validationError };
    }

    const normalizedImages = await processImagesForStorage(
        payload.images ?? []
    );
    const product = await createProduct({
        ...payload,
        images: normalizedImages,
    });

    if (!product) {
        return {
            success: false,
            error: 'The product couldnt be created, please try again later',
        };
    }

    revalidatePath('/admin/inventory');
    revalidatePath('/');

    return {
        success: true,
        product,
        message: 'Product created successfully.',
    };
}

/**
 * Fetches all products.
 * @returns A promise resolving to the list of products.
 */
export async function fetchProducts(): Promise<Product[]> {
    const products = await getProducts();
    const normalizedProducts = products.map((product) => ({
        ...product,
        gdl_price: Number(product.gdl_price),
        foreigner_price: Number(product.foreigner_price),
    }));
    return normalizedProducts;
}

/**
 * Edits an existing product.
 * @param formData The form data for the product to edit.
 * @returns A promise resolving to the result of the operation.
 */
export async function editProductAction(
    formData: ProductFormState | FormData
): Promise<ActionResponse> {
    const payload =
        formData instanceof FormData
            ? await parseProductFormData(formData)
            : formData;

    const validationError = validateProductPayload(payload);
    if (validationError) {
        return { success: false, error: validationError };
    }

    const normalizedImages = await processImagesForStorage(
        payload.images ?? []
    );
    const product = await updateProduct({
        ...payload,
        images: normalizedImages,
    });

    if (!product) {
        return {
            success: false,
            error: 'The product couldnt be saved, please try again later',
        };
    }

    revalidatePath('/admin/inventory');
    revalidatePath('/');

    return {
        success: true,
        product,
    };
}

/**
 * Toggles the visibility of a product.
 * @param productId The ID of the product to toggle.
 * @param isPublic The new visibility status.
 * @returns A promise resolving to the result of the operation.
 */
export async function toggleProductVisibility(
    productId: number,
    isPublic: boolean
): Promise<ActionResponse> {
    const updated = await updateProductVisibility(productId, isPublic);

    if (!updated) {
        return {
            success: false,
            error: 'Product not found or visibility could not be updated.',
        };
    }

    revalidatePath('/admin/inventory');
    revalidatePath('/');

    return {
        success: true,
        message: 'Product visibility updated successfully.',
    };
}

/**
 * Deletes a product.
 * @param productId The ID of the product to delete.
 * @returns A promise resolving to the result of the operation.
 */
export async function deleteProductAction(
    productId: number
): Promise<ActionResponse> {
    const removed = await deleteProduct(productId);

    if (!removed) {
        return {
            success: false,
            error: 'Product not found or could not be deleted.',
        };
    }

    revalidatePath('/admin/inventory');
    revalidatePath('/');

    return {
        success: true,
        message: 'Product deleted successfully.',
    };
}

export async function optimizeImageAction(
    imageBuffer: Buffer,
    width?: number,
    height?: number
): Promise<Buffer> {
    // Server-side image processing removed; return original buffer unchanged.
    return imageBuffer;
}

export async function uploadProductImageAction(
    formData: FormData
): Promise<{ success: boolean; url?: string; error?: string }> {
    const file = formData.get('image');
    if (!(file instanceof File)) {
        return {
            success: false,
            error: 'No image file was provided.',
        };
    }

    try {
        const url = await uploadProductImageActionFile(file);
        return { success: true, url };
    } catch (error) {
        const message =
            error instanceof Error ? error.message : 'Image upload failed.';
        return { success: false, error: message };
    }
}
