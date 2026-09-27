import styles from './SizeSelector.module.css';
import { ProductVariant } from '@/types';

interface SizeSelectorProps {
    inventory: ProductVariant[];
    selectedSize: string;
    onSelectSize: (size: string) => void;
}

export default function SizeSelector({
    inventory,
    selectedSize,
    onSelectSize,
}: SizeSelectorProps) {
    return (
        <div className={styles.sizeGrid}>
            {inventory.map((variant) => {
                const isSelected = selectedSize === variant.size;
                const isOutOfStock = variant.stock === 0;

                return (
                    <button
                        key={variant.id || variant.size}
                        type='button'
                        className={`${styles.sizeBadge} ${
                            isSelected ? styles.sizeBadgeActive : ''
                        }`}
                        disabled={isOutOfStock}
                        onClick={() => onSelectSize(variant.size)}>
                        {variant.size}
                    </button>
                );
            })}
        </div>
    );
}
