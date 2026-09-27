'use client';

import { useState } from 'react';
import Link from 'next/link';
import styles from './ProductDetailClient.module.css';
import { LuShoppingBag, LuArrowLeft } from 'react-icons/lu';
import { FaWhatsapp } from 'react-icons/fa';
import { Product } from '@/types/product';
import ImageCarrousel from '@/components/ImagesCarousel';
import SizeSelector from '@/components/SizeSelector/SizeSelector';
import { useCart } from '@/app/(shop)/_context/CartContext';

const WHATSAPP_PHONE = process.env.NEXT_PUBLIC_WHATSAPP_PHONE;

export default function ProductDetailClient({ product }: { product: Product }) {
    const { addToCart } = useCart();

    const availableVariant = product.inventory.find((v) => v.stock > 0);
    const [selectedSize, setSelectedSize] = useState<string>(
        availableVariant?.size || product.inventory[0]?.size || 'S'
    );

    const mainImage =
        product.images.find((item) => item.position === 1)?.image_url ||
        product.images[0]?.image_url ||
        '';

    const handleSingleWhatsAppOrder = () => {
        const message = [
            `Hello ELIETT, I'm interested in buying this product:\n`,
            `*${product.name}*`,
            `- *Model:* ${product.model}`,
            `- *Size:* ${selectedSize}`,
            `- *Price:* $${product.gdl_price.toLocaleString('es-MX')} MXN\n`,
            `Please let me know the next steps to complete the purchase. Thank you!`,
        ].join('\n');

        const url = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
    };

    const handleAddToCart = () => {
        addToCart({
            id: product.id,
            name: product.name,
            model: product.model,
            price: product.gdl_price,
            image: mainImage,
            size: selectedSize,
            color: product.color,
            quantity: 1,
        });
    };

    return (
        <div className={styles.pageWrapper}>
            <nav className={styles.topNav}>
                <Link href='/' className={styles.backLink}>
                    <LuArrowLeft /> Back to Shop
                </Link>
            </nav>

            <div className={styles.container}>
                <div className={styles.imagesContainer}>
                    <ImageCarrousel
                        images={product.images}
                        productName={product.name}
                    />
                </div>

                <div className={styles.detailsBody}>
                    <span className={styles.modelCode}>{product.model}</span>
                    <h1 className={styles.productTitle}>{product.name}</h1>
                    <p className={styles.priceTag}>
                        ${product.gdl_price.toLocaleString('es-MX')} MXN
                    </p>

                    <hr className={styles.divider} />

                    <div className={styles.sectionBlock}>
                        <label className={styles.sectionLabel}>
                            Select Size: <strong>{selectedSize}</strong>
                        </label>
                        <SizeSelector
                            inventory={product.inventory}
                            selectedSize={selectedSize}
                            onSelectSize={setSelectedSize}
                        />
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
                            type='button'
                            className={styles.cartBtn}
                            onClick={handleAddToCart}>
                            <LuShoppingBag />
                            Add to Bag
                        </button>

                        <button
                            type='button'
                            className={styles.whatsappBtn}
                            onClick={handleSingleWhatsAppOrder}>
                            <FaWhatsapp />
                            Order now via WhatsApp
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
