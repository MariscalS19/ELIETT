'use client';

import styles from './Navbar.module.css';
import Image from 'next/image';
import { LuInstagram, LuShoppingCart } from 'react-icons/lu';
import { useCart } from '@/app/(shop)/_context/CartContext';

function Navbar() {
    const { totalItems, openCart } = useCart();

    return (
        <nav className={styles.navbar}>
            <div className={styles.links}></div>

            <div className={styles.logo_container}>
                <Image
                    src='/eliett_black_logo.svg'
                    alt='ELIETT logo'
                    fill
                    unoptimized
                    priority
                />
            </div>

            <div className={styles.icons}>
                <button
                    type='button'
                    onClick={openCart}
                    className={styles.cart_button}
                    aria-label='Open cart'>
                    <LuShoppingCart className={styles.cart_icon} />
                    {totalItems > 0 && (
                        <span className={styles.cart_count}>{totalItems}</span>
                    )}
                </button>
                <a
                    href='https://www.instagram.com/the.eliett'
                    target='_blank'
                    rel='noopener noreferrer'
                    className={styles.insta_button}
                    aria-label='Instagram'>
                    <LuInstagram className={styles.insta_icon} />
                </a>
            </div>
        </nav>
    );
}

export default Navbar;
