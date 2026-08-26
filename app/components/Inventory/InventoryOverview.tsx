'use client';

import { useState, useMemo, useEffect } from 'react';
import {
    deleteProductAction,
    toggleProductVisibility,
    editProductAction,
    createProductAction,
} from '@/backend/actions/productActions';
import type { Product, ProductFormState } from '@/types';

import ProductFormDrawer from '../Product/ProductFormDrawer';
import ProductCard from '../Product/ProductCard';
import InventoryStats from './InventoryStats';
import styles from './inventory.module.css';
import { LuPlus } from 'react-icons/lu';
import { sileo } from 'sileo';

type InventoryOverviewProps = {
    initialProducts: Product[];
};

export default function InventoryOverview({
    initialProducts,
}: InventoryOverviewProps) {
    const [products, setProducts] = useState<Product[]>(initialProducts);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(
        null
    );

    useEffect(() => {
        setProducts(initialProducts);
    }, [initialProducts]);

    const stats = useMemo(() => {
        const published = products.filter((p) => p.is_public).length;
        const totalStock = products.reduce((sum, product) => {
            return (
                sum +
                product.inventory.reduce(
                    (invSum, variant) => invSum + variant.stock,
                    0
                )
            );
        }, 0);

        return {
            published,
            totalStock,
            hidden: products.length - published,
        };
    }, [products]);

    const handleOpenCreate = () => {
        setSelectedProduct(null);
        setIsDrawerOpen(true);
    };

    const handleOpenEdit = (product: Product) => {
        setSelectedProduct(product);
        setIsDrawerOpen(true);
    };

    const handleSaveProduct = async (formData: FormData) => {
        if (selectedProduct) {
            const result = await editProductAction(formData);

            if (result.success && result.product) {
                setProducts((prev: Product[]) =>
                    prev.map((p) =>
                        p.id === result.product!.id ? result.product! : p
                    )
                );
            } else if (!result.success) {
                alert(
                    result.error || 'Ocurrió un error al guardar el producto.'
                );
                throw new Error(result.error || 'Error al guardar el producto');
            }
        } else {
            const result = await createProductAction(formData);

            if (result.success && result.product) {
                setProducts((prev: Product[]) => [result.product!, ...prev]);
            } else if (!result.success) {
                alert(result.error || 'Ocurrió un error al crear el producto.');
                throw new Error(result.error || 'Error al crear el producto');
            }
        }
    };

    const handleTogglePublic = async (productId: number, isPublic: boolean) => {
        setProducts((prev) =>
            prev.map((p) =>
                p.id === productId ? { ...p, is_public: !isPublic } : p
            )
        );

        const result = await toggleProductVisibility(productId, !isPublic);

        if (!result.success) {
            setProducts((prev) =>
                prev.map((p) =>
                    p.id === productId ? { ...p, is_public: isPublic } : p
                )
            );
            sileo.error({
                title: 'Error changing visibility',
                description:
                    'There was an error changing the visibility of the product. Please try again.',
            });
        }
    };

    const handleDelete = async (productId: number) => {
        if (!confirm('¿Estás seguro de eliminar este producto?')) return;

        const previousProducts = [...products];
        setProducts((prev) => prev.filter((p) => p.id !== productId));

        const result = await deleteProductAction(productId);

        if (!result.success) {
            setProducts(previousProducts);
            alert('Error al eliminar el producto.');
        }
    };

    return (
        <>
            <section className={styles.panel}>
                <div className={styles.panelHeader}>
                    <div>
                        <p className={styles.eyebrow}>Inventory</p>
                        <h2>Active Products</h2>
                    </div>

                    <button
                        type='button'
                        className={styles.primaryButton}
                        onClick={handleOpenCreate}>
                        <LuPlus />
                        Add product
                    </button>
                </div>

                <InventoryStats
                    totalProducts={products.length}
                    published={stats.published}
                    hidden={stats.hidden}
                    totalStock={stats.totalStock}
                />

                <div className={styles.productGrid}>
                    {products.map((product) => (
                        <ProductCard
                            key={product.id}
                            product={product}
                            onEdit={handleOpenEdit}
                            onToggleVisibility={handleTogglePublic}
                            onDelete={handleDelete}
                        />
                    ))}
                </div>
            </section>

            <ProductFormDrawer
                isOpen={isDrawerOpen}
                product={selectedProduct}
                onClose={() => setIsDrawerOpen(false)}
                onSave={handleSaveProduct}
            />
        </>
    );
}
