'use client';
import { useState } from 'react';
import styles from '../_components/SizeSelector.module.css';
import { ProductVariant } from '@/types';

interface SizeSelectorProps {
    inventory: ProductVariant[];
}

export default function SizeSelector({ inventory }: SizeSelectorProps) {
    const [selectedSizeId, setSelectedSizeId] = useState<number | undefined>(
        undefined
    );

    return (
        <div className={styles.sizeGrid}>
            {inventory.map((variant) => {
                const isSelected = selectedSizeId === variant.id;
                return (
                    <button
                        key={variant.id}
                        type='button'
                        className={`${styles.sizeBadge} ${isSelected ? styles.sizeBadgeActive : ''}`}
                        disabled={variant.stock === 0}
                        onClick={() => setSelectedSizeId(variant.id)}>
                        {variant.size}
                    </button>
                );
            })}
        </div>
    );
}
