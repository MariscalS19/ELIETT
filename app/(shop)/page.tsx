import styles from './page.module.css';
import Image from 'next/image';
export default function Home() {
    return (
        <main className={styles.main}>
            <div className={styles.home_img_container}>
                <Image
                    className={styles.home_img}
                    src='/ui/mainCover.webp'
                    alt='Background image'
                    fill
                    priority
                    sizes='100vw'
                    quality={100}
                    unoptimized
                />
                <div className={styles.home_img_overlay}>
                    <div className={styles.home_img_notice}>
                        <p>We are working on it</p>
                        <span>Come back soon !!!</span>
                    </div>
                </div>
            </div>
        </main>
    );
}
