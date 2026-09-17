import styles from './page.module.css';
import Image from 'next/image';
import { getCachedPublicProducts } from '@/backend/db/products';
import Link from 'next/link';

const categoryCards = [
    {
        name: 'Outerwear',
        label: 'New layering',
        image: '/mainCover.webp',
    },
    {
        name: 'Dresses',
        label: 'Soft structure',
        image: '/mainCover.webp',
    },
    {
        name: 'Accessories',
        label: 'The finishing touch',
        image: '/mainCover.webp',
    },
    {
        name: 'Essentials',
        label: 'Everyday staples',
        image: '/mainCover.webp',
    },
];
const heroImage = '/mainCover.webp';

const currencyFormatter = new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    maximumFractionDigits: 0,
});

export default async function Home() {
    const products = await getCachedPublicProducts();
    const hasProducts = products.length > 0;

    return (
        <div className={styles.page}>
            <section className={styles.hero}>
                <div className={styles.heroImageWrap}>
                    <Image
                        className={styles.heroImage}
                        src={heroImage}
                        alt='ELIETT campaign'
                        fill
                        priority
                        sizes='100vw'
                        quality={100}
                    />
                    <div className={styles.heroOverlay}>
                        <div className={styles.heroContent}>
                            <h1 className={styles.heroTitle}>ELIETT Shop</h1>
                            <p className={styles.heroSubtitle}>
                                Clean silhouettes, precise structure and a
                                collection designed to rotate season after
                                season.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <section id='categories' className={styles.categorySection}>
                <div className={styles.sectionIntro}>
                    <p>Categories</p>
                    <h2>Shop by mood</h2>
                </div>

                <div className={styles.categoryGrid}>
                    {categoryCards.map((category) => (
                        <a
                            key={category.name}
                            href='#collection'
                            className={styles.categoryCard}>
                            <div className={styles.categoryImageWrap}>
                                <Image
                                    src={category.image}
                                    alt={category.name}
                                    fill
                                    unoptimized
                                    sizes='(max-width: 760px) 100vw, 25vw'
                                    className={styles.categoryImage}
                                />
                            </div>
                            <div className={styles.categoryContent}>
                                <span>{category.label}</span>
                                <h3>{category.name}</h3>
                            </div>
                        </a>
                    ))}
                </div>
            </section>

            <section id='collection' className={styles.collectionSection}>
                <div className={styles.sectionIntro}>
                    <p>Collection</p>
                    <h2>Current edit</h2>
                </div>

                {!hasProducts ? (
                    <article className={styles.emptyState}>
                        <h3>Launching this edit very soon</h3>
                        <p>
                            We are currently preparing our latest collection for
                            launch. Please check back soon to explore our
                            curated selection of products.
                        </p>
                    </article>
                ) : (
                    <div className={styles.mosaicGrid}>
                        {products.map((product, index) => {
                            const image =
                                product.images.find(
                                    (item) => item.position === 1
                                )?.image_url || product.images[0]?.image_url;

                            const productStock = product.inventory.reduce(
                                (sum, variant) => sum + variant.stock,
                                0
                            );

                            const pattern = [
                                styles.cardLarge,
                                styles.cardDefault,
                                styles.cardWide,
                                styles.cardTall,
                            ];
                            const cardClassName =
                                pattern[index % pattern.length];

                            return (
                                <Link
                                    href={`/product/${product.name.toLowerCase().replace(/\s+/g, '-')}-${product.id}`}
                                    key={product.id}
                                    className={`${styles.productCard} ${cardClassName}`}>
                                    <article>
                                        <div className={styles.cardImageWrap}>
                                            <Image
                                                className={styles.cardImage}
                                                src={image}
                                                alt={`Image of ${product.name}`}
                                                fill
                                                unoptimized
                                                sizes='(max-width: 760px) 100vw, 50vw'
                                                quality={85}
                                            />
                                            <span
                                                className={
                                                    productStock > 0
                                                        ? styles.inStockBadge
                                                        : styles.soldOutBadge
                                                }>
                                                {productStock > 0
                                                    ? 'In stock'
                                                    : 'Sold out'}
                                            </span>
                                        </div>

                                        <div className={styles.cardBody}>
                                            <p className={styles.model}>
                                                {product.model}
                                            </p>
                                            <h3>{product.name}</h3>
                                            <div className={styles.cardMeta}>
                                                <span>{product.color}</span>
                                                <span>
                                                    {currencyFormatter.format(
                                                        product.gdl_price
                                                    )}
                                                </span>
                                            </div>
                                        </div>
                                    </article>
                                </Link>
                            );
                        })}
                    </div>
                )}
            </section>
        </div>
    );
}
