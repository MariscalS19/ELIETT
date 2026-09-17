'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import styles from './ModalPage.module.css';
import { LuX } from 'react-icons/lu';

const WHATSAPP_PHONE = process.env.NEXT_PUBLIC_WHATSAPP_PHONE;

interface ProductMock {
    id: string;
    name: string;
    model: string;
    price: number;
    description: string;
    images: string[];
    sizes: string[];
}

export default function ProductModal({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const router = useRouter();
    const { id } = use(params);

    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [selectedSize, setSelectedSize] = useState<string>('S');

    const product: ProductMock = {
        id,
        name: 'Blazer Estructurado Premium',
        model: 'ELIETT-OUT-01',
        price: 2450,
        description:
            'Confeccionado en lana ligera con solapas definidas y corte ajustado. Ideal para capas de transición de temporada.',
        images: ['/mainCover.webp', '/mainCover.webp', '/mainCover.webp'],
        sizes: ['XS', 'S', 'M', 'L'],
    };

    useEffect(() => {
        if (product.images.length <= 1) return;
        const interval = setInterval(() => {
            setCurrentImageIndex((prev) => (prev + 1) % product.images.length);
        }, 3500);
        return () => clearInterval(interval);
    }, [product.images.length]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') router.back();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [router]);

    const handleWhatsAppOrder = () => {
        const message = [
            `Hola ELIETT, me interesa comprar este producto:\n`,
            `🛍️ *${product.name}*`,
            `- *Modelo:* ${product.model}`,
            `- *Talla:* ${selectedSize}`,
            `- *Precio:* $${product.price} MXN\n`,
            `¿Tienen disponibilidad para envío?`,
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

                <div className={styles.carouselContainer}>
                    <div className={styles.imageWrap}>
                        <Image
                            src={product.images[currentImageIndex]}
                            alt={product.name}
                            fill
                            unoptimized
                            className={styles.carouselImage}
                        />
                    </div>

                    <div className={styles.dotsWrap}>
                        {product.images.map((_, idx) => (
                            <span
                                key={idx}
                                className={`${styles.dot} ${idx === currentImageIndex ? styles.activeDot : ''}`}
                                onClick={() => setCurrentImageIndex(idx)}
                            />
                        ))}
                    </div>
                </div>

                <div className={styles.detailsBody}>
                    <span className={styles.modelCode}>{product.model}</span>
                    <h2 className={styles.productTitle}>{product.name}</h2>
                    <p className={styles.priceTag}>
                        ${product.price.toLocaleString('es-MX')} MXN
                    </p>

                    <hr className={styles.divider} />

                    <div className={styles.sectionBlock}>
                        <label className={styles.sectionLabel}>
                            Select Size: <strong>{selectedSize}</strong>
                        </label>
                        <div className={styles.sizeGrid}>
                            {product.sizes.map((size) => (
                                <button
                                    key={size}
                                    className={`${styles.sizeBtn} ${selectedSize === size ? styles.selectedSize : ''}`}
                                    onClick={() => setSelectedSize(size)}>
                                    {size}
                                </button>
                            ))}
                        </div>
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
                            <svg
                                width='20'
                                height='20'
                                viewBox='0 0 24 24'
                                fill='currentColor'>
                                <path d='M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z' />
                            </svg>
                            Order via WhatsApp
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
