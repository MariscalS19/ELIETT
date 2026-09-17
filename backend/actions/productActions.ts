'use server';

import { revalidatePath, updateTag } from 'next/cache';
import {
    createProduct,
    updateProduct,
    deleteProduct,
    updateProductVisibility,
} from '@/backend/db/products';
import { uploadProductImageFile } from '@/backend/helpers/fileHelper';
import { validateProductPayload } from '@/backend/utils/productValidation';
import {
    parseProductFormData,
    processImagesForStorage,
} from '@/backend/helpers/productParsers';
import type { Product, ProductFormState } from '@/types';

type ActionResponse =
    | { success: true; product?: Product; message?: string }
    | { success: false; error: string };

/**
 * Creates a new product based on the provided FormData or ProductFormState.
 * If the input is FormData, it will be parsed and validated. If the input is ProductFormState, it will be validated directly.
 * The function also processes any images for storage and updates the cache and revalidates the relevant paths.
 * @param formData The FormData or ProductFormState containing the product data.
 * @returns A Promise that resolves to an ActionResponse indicating success or failure, along with the created product if successful.
 */
export async function createProductAction(
    formData: ProductFormState | FormData
): Promise<ActionResponse> {
    const payload =
        formData instanceof FormData
            ? await parseProductFormData(formData)
            : formData;

    const validationError = validateProductPayload(payload);
    if (validationError) return { success: false, error: validationError };

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

    updateTag('products');
    revalidatePath('/admin/inventory');

    return { success: true, product, message: 'Product created successfully.' };
}

/**
 * Edits an existing product based on the provided FormData or ProductFormState.
 * If the input is FormData, it will be parsed and validated. If the input is ProductFormState, it will be validated directly.
 * The function also processes any images for storage and updates the cache and revalidates the relevant paths.
 * @param formData The FormData or ProductFormState containing the product data.
 * @returns A Promise that resolves to an ActionResponse indicating success or failure, along with the updated product if successful.
 */
export async function editProductAction(
    formData: ProductFormState | FormData
): Promise<ActionResponse> {
    const payload =
        formData instanceof FormData
            ? await parseProductFormData(formData)
            : formData;

    const validationError = validateProductPayload(payload);
    if (validationError) return { success: false, error: validationError };

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

    updateTag('products');
    updateTag(`product-${product.id}`);
    revalidatePath('/admin/inventory');

    return { success: true, product };
}

/**
 * Toggles the visibility of a product by updating its is_public status.
 * @param productId The ID of the product to update.
 * @param isPublic The new visibility status (true for public, false for hidden).
 * @returns A Promise that resolves to an ActionResponse indicating success or failure.
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

    updateTag('products');
    updateTag(`product-${productId}`);
    revalidatePath('/admin/inventory');

    return {
        success: true,
        message: 'Product visibility updated successfully.',
    };
}

/**
 * Deletes a product by its ID.
 * @param productId The ID of the product to delete.
 * @returns A Promise that resolves to an ActionResponse indicating success or failure.
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

    updateTag('products');
    updateTag(`product-${productId}`);
    revalidatePath('/admin/inventory');

    return { success: true, message: 'Product deleted successfully.' };
}

/**
 * Uploads a new product image by processing the provided FormData containing the image file.
 * The function uses the uploadProductImageFile helper to handle the actual file upload and returns the resulting URL.
 * @param formData The FormData containing the image file.
 * @returns A Promise that resolves to an ActionResponse indicating success or failure, along with the uploaded image URL if successful.
 */
export async function uploadProductImageAction(formData: FormData) {
    const file = formData.get('image');
    if (!(file instanceof File)) {
        return { success: false, error: 'No image file was provided.' };
    }

    try {
        const url = await uploadProductImageFile(file);
        return { success: true, url };
    } catch (error) {
        const message =
            error instanceof Error ? error.message : 'Image upload failed.';
        return { success: false, error: message };
    }
}
