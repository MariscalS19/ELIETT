'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './ProductModal.module.css';
import { LuX } from 'react-icons/lu';
import { FaWhatsapp } from 'react-icons/fa';
import { Product } from '@/types/product';

import ImageCarrousel from '@/components/ImagesCarousel';
import SizeSelector from '@/components/SizeSelector/SizeSelector';

const WHATSAPP_PHONE = process.env.NEXT_PUBLIC_WHATSAPP_PHONE;

export default function ProductModalClient({ product }: { product: Product }) {
    const router = useRouter();

    const availableVariant = product.inventory.find((v) => v.stock > 0);
    const [selectedSize, setSelectedSize] = useState<string>(
        availableVariant?.size || product.inventory[0]?.size || 'S'
    );

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') router.back();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [router]);

    const handleWhatsAppOrder = () => {
        const message = [
            `Helllo ELIETT, i'm interested in buying this product:\n`,
            `*${product.name}*`,
            `- *Model:* ${product.model}`,
            `- *Size:* ${selectedSize}`,
            `- *Price:* $${product.gdl_price} MXN\n`,
            `Please let me know the next steps to complete the purchase. Thank you!`,
        ].join('\n');

        const url = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
    };

    return (
        <div className={styles.overlay} onClick={() => router.back()}>
            <div className={styles.card} onClick={(e) => e.stopPropagation()}>
                <button
                    className={styles.closeButton}
                    onClick={() => router.back()}>
                    <LuX />
                </button>

                <div className={styles.imagesContainer}>
                    <ImageCarrousel
                        images={product.images}
                        productName={product.name}
                    />
                </div>

                <div className={styles.detailsBody}>
                    <span className={styles.modelCode}>{product.model}</span>
                    <h2 className={styles.productTitle}>{product.name}</h2>
                    <p className={styles.priceTag}>
                        ${product.gdl_price.toLocaleString('es-MX')} MXN
                    </p>

                    <hr className={styles.divider} />

                    <div className={styles.sectionBlock}>
                        <label className={styles.sectionLabel}>
                            Select Size: <strong>{selectedSize}</strong>
                        </label>
                        <SizeSelector inventory={product.inventory} />
                    </div>

                    <div className={styles.sectionBlock}>
                        <label className={styles.sectionLabel}>
                            Description
                        </label>
                        <p className={styles.descriptionText}>
                            {product.description}
                        </p>
                    </div>

                    <div className={styles.actionBlock}>
                        <button
                            className={styles.whatsappBtn}
                            onClick={handleWhatsAppOrder}>
                            <FaWhatsapp />
                            Order via WhatsApp
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
