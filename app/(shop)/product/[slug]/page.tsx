import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { LuArrowLeft } from 'react-icons/lu';
import { getCachedProductById } from '@/backend/db/products';
import styles from './ProductPage.module.css';

const WHATSAPP_PHONE = process.env.NEXT_PUBLIC_WHATSAPP_PHONE;

export default async function ProductPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;

    const match = slug.match(/-(\d+)$/);
    const productId = match ? Number(match[1]) : null;

    if (!productId || isNaN(productId)) {
        notFound();
    }

    const product = await getCachedProductById(productId);

    if (!product) {
        notFound();
    }

    const primaryImage = product.images?.[0]?.image_url || '/mainCover.webp';
    const formattedPrice = Number(product.gdl_price).toLocaleString('es-MX');

    const message = `Hola ELIETT, me interesa comprar el producto:\n\n📌 *${product.name}*\n🏷️ Modelo: ${product.model}\n💰 Precio: $${formattedPrice} MXN\n\n¿Tienen disponibilidad para envío?`;
    const whatsappUrl = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`;

    return (
        <main className={styles.pageWrapper}>
            <div className={styles.topNav}>
                <Link href='/' className={styles.backLink}>
                    <LuArrowLeft /> Go Back
                </Link>
            </div>

            <div className={styles.productGrid}>
                <div className={styles.gallerySection}>
                    <div className={styles.mainImageWrap}>
                        <Image
                            src={primaryImage}
                            alt={product.name}
                            fill
                            priority
                            unoptimized
                            className={styles.productImage}
                        />
                    </div>
                    {product.images && product.images.length > 1 && (
                        <div className={styles.secondaryGallery}>
                            {product.images.slice(1).map((img, idx) => (
                                <div
                                    key={img.id || idx}
                                    className={styles.subImageWrap}>
                                    <Image
                                        src={img.image_url}
                                        alt={`${product.name} - ${idx + 2}`}
                                        fill
                                        unoptimized
                                        className={styles.productImage}
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className={styles.infoSection}>
                    <div className={styles.stickyHeader}>
                        <span className={styles.modelTag}>{product.model}</span>
                        <h1 className={styles.title}>{product.name}</h1>
                        <p className={styles.price}>${formattedPrice} MXN</p>
                    </div>

                    <div className={styles.divider} />

                    {product.inventory && product.inventory.length > 0 && (
                        <div className={styles.sectionBlock}>
                            <h3 className={styles.sectionTitle}>
                                Available Sizes
                            </h3>
                            <div className={styles.sizeGrid}>
                                {product.inventory.map((variant) => (
                                    <span
                                        key={variant.id || variant.size}
                                        className={styles.sizeBadge}>
                                        {variant.size}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className={styles.sectionBlock}>
                        <h3 className={styles.sectionTitle}>Description</h3>
                        <p className={styles.description}>
                            {product.description}
                        </p>
                        {product.composition && (
                            <p className={styles.composition}>
                                <strong>Composición:</strong>{' '}
                                {product.composition}
                            </p>
                        )}
                    </div>

                    <div className={styles.actionBlock}>
                        <a
                            href={whatsappUrl}
                            target='_blank'
                            rel='noopener noreferrer'
                            className={styles.whatsappBtn}>
                            <svg
                                width='20'
                                height='20'
                                viewBox='0 0 24 24'
                                fill='currentColor'>
                                <path d='M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z' />
                            </svg>
                            Order via WhatsApp
                        </a>
                    </div>
                </div>
            </div>
        </main>
    );
}
