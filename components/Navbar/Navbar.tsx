'use client';
import styles from './Navbar.module.css';
import Image from 'next/image';
import { LuInstagram } from 'react-icons/lu';
import { LuShoppingCart } from 'react-icons/lu';
import { useCart } from '@/app/(shop)/_context/CartContext';

function Navbar() {
    const { totalItems } = useCart();
    return (
        <nav className={styles.navbar}>
            <div className={styles.links}></div>

            <div className={styles.logo_container}>
                <Image
                    src='/eliett_black_logo.svg'
                    alt='ELLIET logo'
                    fill
                    unoptimized
                    priority
                />
            </div>

            <div className={styles.icons}>
                <a href='/cart' className={styles.cart_button}>
                    <LuShoppingCart className={styles.cart_icon} />
                    {totalItems > 0 && (
                        <span className={styles.cart_count}>{totalItems}</span>
                    )}
                </a>
                <a
                    href='https://www.instagram.com/the.eliett'
                    target='_blank'
                    rel='noopener noreferrer'
                    className={styles.insta_button}>
                    <LuInstagram className={styles.insta_icon} />
                </a>
            </div>
        </nav>
    );
}

export default Navbar;
