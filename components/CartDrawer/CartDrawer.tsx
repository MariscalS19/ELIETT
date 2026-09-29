'use client';

import { useCart } from '@/app/(shop)/_context/CartContext';
import styles from './CartDrawer.module.css';
import { LuX, LuTrash2, LuShoppingCart } from 'react-icons/lu';
import { FaWhatsapp } from 'react-icons/fa';
import { useEffect } from 'react';
import Image from 'next/image';

export default function CartDrawer() {
    const {
        cart,
        isCartOpen,
        closeCart,
        updateQuantity,
        removeFromCart,
        totalPrice,
        sendCartToWhatsApp,
    } = useCart();

    useEffect(() => {
        if (isCartOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }

        return () => {
            document.body.style.overflow = '';
        };
    }, [isCartOpen]);

    if (!isCartOpen) return null;

    return (
        <div className={styles.overlay} onClick={closeCart}>
            <aside
                className={styles.drawer}
                onClick={(e) => e.stopPropagation()}>
                <header className={styles.header}>
                    <div className={styles.title}>
                        <LuShoppingCart className={styles.cartIcon} />
                        <h2>Your Cart ({cart.length})</h2>
                    </div>
                    <button
                        type='button'
                        onClick={closeCart}
                        className={styles.closeButton}
                        aria-label='Close cart'>
                        <LuX size={20} />
                    </button>
                </header>

                <div className={styles.content}>
                    {cart.length === 0 ? (
                        <p className={styles.emptyText}>Your cart is empty.</p>
                    ) : (
                        <ul className={styles.itemList}>
                            {cart.map((item) => (
                                <li
                                    key={`${item.id}-${item.size}`}
                                    className={styles.item}>
                                    <div className={styles.imageWrapper}>
                                        <Image
                                            src={item.image}
                                            alt={item.name}
                                            fill
                                            sizes='80px'
                                            style={{ objectFit: 'cover' }}
                                        />
                                    </div>
                                    <div className={styles.itemDetails}>
                                        <h4>{item.name}</h4>
                                        <div className={styles.itemMeta}>
                                            <span>Size: {item.size}</span>
                                            <span>•</span>
                                            <span className={styles.itemPrice}>
                                                $
                                                {item.price.toLocaleString(
                                                    'es-MX'
                                                )}{' '}
                                                MXN
                                            </span>
                                        </div>
                                        <div className={styles.actions}>
                                            <button
                                                type='button'
                                                className={styles.qtyButton}
                                                onClick={() =>
                                                    updateQuantity(
                                                        item.id,
                                                        item.size,
                                                        item.quantity - 1
                                                    )
                                                }>
                                                -
                                            </button>
                                            <span className={styles.qtyCount}>
                                                {item.quantity}
                                            </span>
                                            <button
                                                type='button'
                                                className={styles.qtyButton}
                                                onClick={() =>
                                                    updateQuantity(
                                                        item.id,
                                                        item.size,
                                                        item.quantity + 1
                                                    )
                                                }>
                                                +
                                            </button>
                                            <button
                                                type='button'
                                                className={styles.deleteButton}
                                                title='Eliminar producto'
                                                onClick={() =>
                                                    removeFromCart(
                                                        item.id,
                                                        item.size
                                                    )
                                                }>
                                                <LuTrash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {cart.length > 0 && (
                    <footer className={styles.footer}>
                        <div className={styles.totalRow}>
                            <span>Total:</span>
                            <strong>
                                ${totalPrice.toLocaleString('es-MX')} MXN
                            </strong>
                        </div>
                        <button
                            type='button'
                            className={styles.checkoutButton}
                            onClick={sendCartToWhatsApp}>
                            <FaWhatsapp size={18} />
                            Order via WhatsApp
                        </button>
                    </footer>
                )}
            </aside>
        </div>
    );
}
