import styles from './page.module.css';
import Image from 'next/image';
import { getPublicProducts } from '@/backend/db/lib';

export default async function Home() {
    // const products = await getPublicProducts();

    return (
        <div className={styles.page}>
            <section className={styles.header}>
                <div className={styles.header_img_container}>
                    <Image
                        className={styles.header_img}
                        src='/mainCover.webp'
                        alt='Background image'
                        fill
                        priority
                        sizes='100vw'
                        quality={100}
                    />
                    <div className={styles.header_img_overlay}>
                        <div className={styles.header_img_notice}>
                            <p>We are working on it</p>
                            <span>Come back soon !!!</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* <section className={styles.home_grid}>
                {products.map((product) => {
                    const image =
                        product.images.find((item) => item.position === 1)
                            ?.image_url ||
                        product.images[0]?.image_url ||
                        '/mainCover.webp';

                    return (
                        <div className={styles.home_item} key={product.id}>
                            <div className={styles.img_container}>
                                <Image
                                    className={styles.item_img}
                                    src={image}
                                    alt={`Image of ${product.name}`}
                                    fill
                                    unoptimized
                                    sizes='100vw'
                                    quality={85}
                                />
                            </div>
                            <h3 className={styles.item_name}>{product.name}</h3>
                        </div>
                    );
                })}
            </section> */}
        </div>
    );
}
