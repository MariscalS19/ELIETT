import { getCachedProductById } from '@/backend/db/products';
import ImageCarrousel from '../_components/ImageCarrousel';
import SizeSelector from '../_components/SizeSelector';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import styles from './ProductPage.module.css';
import { LuArrowLeft } from 'react-icons/lu';
import { FaWhatsapp } from 'react-icons/fa';

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

    const formattedPrice = Number(product.gdl_price).toLocaleString('es-MX');

    const message = `Hello ELIETT, I want to buy the product:\n\n *${product.name}*\n Model: ${product.model}\n Price: $${formattedPrice} MXN\n\n`;
    const whatsappUrl = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`;

    return (
        <section className={styles.pageWrapper}>
            <div className={styles.topNav}>
                <Link href='/' className={styles.backLink}>
                    <LuArrowLeft /> Go Back
                </Link>
            </div>

            <div className={styles.productGrid}>
                <div className={styles.gallerySection}>
                    <ImageCarrousel
                        images={product.images}
                        productName={product.name}
                    />
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
                            <SizeSelector inventory={product.inventory} />
                        </div>
                    )}

                    <div className={styles.sectionBlock}>
                        <h3 className={styles.sectionTitle}>Description</h3>
                        <p className={styles.description}>
                            {product.description}
                        </p>
                        {product.composition && (
                            <p className={styles.composition}>
                                <strong>Composition:</strong>{' '}
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
                            <FaWhatsapp className={styles.whatsappIcon} />
                            Order via WhatsApp
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
}
