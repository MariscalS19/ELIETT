import type { ProductFormState } from '@/types';

export function validateProductPayload(
    payload: ProductFormState
): string | null {
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
        if (!img || !img.image_url) return 'All images must have an image_url.';
    }

    if (!Array.isArray(inventory) || inventory.length === 0) {
        return 'Inventory variants are required.';
    }

    for (const variant of inventory) {
        if (variant.size == null || variant.sku == null) {
            return 'Each inventory variant must have a size and sku.';
        }
        if (
            variant.stock == null ||
            Number.isNaN(variant.stock) ||
            variant.stock < 0
        ) {
            return 'Each inventory variant must have a non-negative stock number.';
        }
    }

    return null;
}
