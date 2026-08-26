'use client';

import styles from './inventory.module.css';

type InventoryStatsProps = {
    totalProducts: number;
    published: number;
    hidden: number;
    totalStock: number;
};

export default function InventoryStats({
    totalProducts,
    published,
    hidden,
    totalStock,
}: InventoryStatsProps) {
    return (
        <div className={styles.summaryGrid}>
            <div className={styles.summaryCard}>
                <span>Total</span>
                <strong>{totalProducts}</strong>
            </div>
            <div className={styles.summaryCard}>
                <span>Published</span>
                <strong>{published}</strong>
            </div>
            <div className={styles.summaryCard}>
                <span>Hidden</span>
                <strong>{hidden}</strong>
            </div>
            <div className={styles.summaryCard}>
                <span>Stock</span>
                <strong>{totalStock}</strong>
            </div>
        </div>
    );
}
