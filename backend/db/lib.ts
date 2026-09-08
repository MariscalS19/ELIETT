import { pool } from './db';
import { Product, ProductFormState } from '@/types';
import { ResultSetHeader, RowDataPacket } from 'mysql2/promise';
import fs from 'fs/promises';
import path from 'path';

// Interface to map the rows returned by MySQL in the read queries
interface ProductRow extends Product, RowDataPacket {}

function resolveStoredFilePath(
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

// Helper to build the query with JSON aggregation
const SELECT_PRODUCTS_QUERY = `
    SELECT 
        p.*,
        COALESCE(
            (
                SELECT JSON_ARRAYAGG(
                    JSON_OBJECT(
                        'id', v.id,
                        'size', v.size,
                        'stock', v.stock,
                        'sku', v.sku
                    )
                ) 
                FROM product_variants v 
                WHERE v.product_id = p.id
            ), JSON_ARRAY()
        ) AS inventory,
        COALESCE(
            (
                SELECT JSON_ARRAYAGG(
                    JSON_OBJECT(
                        'id', img.id,
                        'image_url', img.image_url,
                        'position', img.position
                    )
                ) 
                FROM product_images img 
                WHERE img.product_id = p.id
                ORDER BY img.position ASC
            ), JSON_ARRAY()
        ) AS images
    FROM products p
`;

export async function getProducts(): Promise<Product[]> {
    const [rows] = await pool.query<ProductRow[]>(SELECT_PRODUCTS_QUERY);
    return rows;
}

export async function getPublicProducts(): Promise<Product[]> {
    const [rows] = await pool.query<ProductRow[]>(
        `${SELECT_PRODUCTS_QUERY} WHERE p.is_public = TRUE`
    );
    return rows;
}

export async function createProduct(p: ProductFormState): Promise<Product> {
    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();
        const [result] = await connection.execute<ResultSetHeader>(
            `INSERT INTO products (base_sku, model, name, description, composition, color, is_public,
            gdl_price, foreigner_price)
            VALUES (?,?,?,?,?,?,?,?,?)`,
            [
                p.base_sku,
                p.model,
                p.name,
                p.description,
                p.composition,
                p.color,
                p.is_public,
                p.gdl_price,
                p.foreigner_price,
            ]
        );
        const productId = result.insertId;

        //Insert variants
        for (const variant of p.inventory) {
            await connection.execute<ResultSetHeader>(
                `INSERT INTO product_variants (product_id, size, stock, sku) VALUES (?,?,?,?)`,
                [productId, variant.size, variant.stock, variant.sku]
            );
        }

        //Insert images urls
        for (const img of p.images ?? []) {
            await connection.execute<ResultSetHeader>(
                `INSERT INTO product_images (product_id, image_url, position) VALUES (?,?,?)`,
                [productId, img.image_url, img.position]
            );
        }

        await connection.commit();

        const product: Product = {
            id: productId,
            ...p,
            images: p.images ?? [],
        };
        return product;
    } catch (err) {
        await connection.rollback();
        throw err;
    } finally {
        connection.release();
    }
}

export async function updateProduct(p: ProductFormState): Promise<Product> {
    const connection = await pool.getConnection();
    if (p.id == null) {
        throw new Error('Product id is required for update.');
    }
    const productId = p.id;

    try {
        await connection.beginTransaction();
        const [result] = await connection.execute<ResultSetHeader>(
            `UPDATE products
             SET model = ?, name = ?, description = ?, composition = ?, color = ?, is_public = ?, gdl_price = ?, foreigner_price = ?
             WHERE id = ?`,
            [
                p.model ?? null,
                p.name ?? null,
                p.description ?? null,
                p.composition ?? null,
                p.color ?? null,
                p.is_public,
                p.gdl_price ?? null,
                p.foreigner_price ?? null,
                productId,
            ]
        );
        if (result.affectedRows === 0) {
            return Promise.reject(
                new Error('Product not found or could not be updated.')
            );
        }

        const [currentImages] = await connection.execute<RowDataPacket[]>(
            `SELECT id, image_url FROM product_images WHERE product_id = ?`,
            [productId]
        );

        const currentImageRows = currentImages as Array<{
            id: number;
            image_url: string | null;
        }>;
        const incomingImages = Array.isArray(p.images) ? p.images : [];
        const retainedImageIds = new Set<number>();

        // Update variants
        for (const variant of p.inventory) {
            await connection.execute<ResultSetHeader>(
                `UPDATE product_variants
                 SET size = ?, stock = ?, sku = ?
                 WHERE product_id = ? AND size = ?`,
                [
                    variant.size ?? null,
                    variant.stock ?? null,
                    variant.sku ?? null,
                    productId,
                    variant.size ?? null,
                ]
            );
        }

        // Sync images with the incoming payload so deleted images are removed.
        for (const [index, img] of incomingImages.entries()) {
            const position = img.position ?? index + 1;
            const hasDatabaseId =
                typeof img.id === 'number' && Number.isFinite(img.id);

            if (hasDatabaseId) {
                retainedImageIds.add(img.id as number);
                await connection.execute<ResultSetHeader>(
                    `UPDATE product_images
                     SET image_url = ?, position = ?
                     WHERE product_id = ? AND id = ?`,
                    [
                        img.image_url ?? null,
                        position,
                        productId,
                        img.id as number,
                    ]
                );
                continue;
            }

            await connection.execute<ResultSetHeader>(
                `INSERT INTO product_images (product_id, image_url, position)
                 VALUES (?, ?, ?)`,
                [productId, img.image_url ?? null, position]
            );
        }

        for (const imageRow of currentImageRows) {
            if (retainedImageIds.has(imageRow.id)) {
                continue;
            }

            const filePath = resolveStoredFilePath(imageRow.image_url);
            if (filePath) {
                try {
                    await fs.unlink(filePath);
                } catch {
                    // Ignore missing files; the database row still needs to be removed.
                }
            }

            await connection.execute<ResultSetHeader>(
                `DELETE FROM product_images WHERE product_id = ? AND id = ?`,
                [productId, imageRow.id]
            );
        }

        await connection.commit();

        const product: Product = {
            id: productId,
            ...p,
            images: p.images ?? [],
        };
        return product;
    } catch (err) {
        await connection.rollback();
        throw err;
    }
}

export async function updateProductVisibility(
    productId: number,
    isPublic: boolean
): Promise<boolean> {
    const [result] = await pool.execute<ResultSetHeader>(
        `UPDATE products SET is_public = ? WHERE id = ?`,
        [isPublic, productId]
    );
    return result.affectedRows > 0;
}

export async function deleteProduct(productId: number): Promise<boolean> {
    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();

        const [images] = await connection.execute<RowDataPacket[]>(
            `SELECT image_url FROM product_images WHERE product_id = ?`,
            [productId]
        );

        for (const image of images) {
            const filePath = resolveStoredFilePath(
                image.image_url as string | null
            );

            if (!filePath) continue;

            try {
                await fs.unlink(filePath);
            } catch {
                // Ignore missing files; we still want to delete the product record.
            }
        }

        await connection.execute<ResultSetHeader>(
            `DELETE FROM product_images WHERE product_id = ?`,
            [productId]
        );

        await connection.execute<ResultSetHeader>(
            `DELETE FROM product_variants WHERE product_id = ?`,
            [productId]
        );

        const [result] = await connection.execute<ResultSetHeader>(
            `DELETE FROM products WHERE id = ?`,
            [productId]
        );

        await connection.commit();
        return result.affectedRows > 0;
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
}
