'use client';

import Image from 'next/image';
import type { Product } from '@/types';
import styles from './ProductCard.module.css';

type ProductCardProps = {
    product: Product;
    onEdit: (product: Product) => void;
    onToggleVisibility: (productId: number, currentVisibility: boolean) => void;
    onDelete: (productId: number) => void;
};

export default function ProductCard({
    product,
    onEdit,
    onToggleVisibility,
    onDelete,
}: ProductCardProps) {
    const mainImage =
        product.images?.find((img) => img.position === 1)?.image_url ??
        '/mainCover.webp';

    return (
        <article className={styles.productCard} onClick={() => onEdit(product)}>
            <div className={styles.imageWrap}>
                <Image
                    src={mainImage}
                    alt={product.name}
                    fill
                    sizes='(max-width: 768px) 100vw, 320px'
                    style={{ objectFit: 'cover' }}
                    quality={85}
                    unoptimized
                />
            </div>

            <div className={styles.cardBody}>
                <div className={styles.cardHeader}>
                    <div>
                        <p className={styles.productModel}>{product.model}</p>
                        <h3>{product.name}</h3>
                    </div>
                    <span
                        className={
                            product.is_public
                                ? styles.publicBadge
                                : styles.hiddenBadge
                        }>
                        {product.is_public ? 'Published' : 'Hidden'}
                    </span>
                </div>

                <p className={styles.description}>{product.description}</p>

                <div className={styles.metaRow}>
                    <span>SKU: {product.base_sku}</span>
                    <span>{product.color}</span>
                </div>

                <div className={styles.sizesRow}>
                    {product.inventory.map((variant) => (
                        <div key={variant.sku} className={styles.sizeItem}>
                            <span>{variant.size}</span>
                            <strong>{variant.stock}</strong>
                        </div>
                    ))}
                </div>

                <div className={styles.cardFooter}>
                    <div className={styles.toggleGroup}>
                        <span>Visible</span>
                        <button
                            type='button'
                            role='switch'
                            aria-checked={product.is_public}
                            className={
                                product.is_public
                                    ? styles.switchOn
                                    : styles.switchOff
                            }
                            onClick={(e) => {
                                e.stopPropagation();
                                onToggleVisibility(
                                    product.id,
                                    !!product.is_public
                                );
                            }}
                            aria-label={`Toggle visibility for ${product.name}`}>
                            <span className={styles.switchThumb} />
                        </button>
                    </div>

                    <button
                        type='button'
                        className={styles.deleteButton}
                        onClick={(e) => {
                            e.stopPropagation();
                            onDelete(product.id);
                        }}>
                        Delete
                    </button>
                </div>
            </div>
        </article>
    );
}
