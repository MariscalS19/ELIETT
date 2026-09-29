'use client';

import { useCart } from '@/app/(shop)/_context/CartContext';
import styles from './CartDrawer.module.css';
import { LuX, LuTrash2, LuShoppingCart } from 'react-icons/lu';
import { FaWhatsapp } from 'react-icons/fa';
import { useEffect } from 'react';

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
                        className={styles.closeButton}>
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
                                    <div>
                                        <h4>{item.name}</h4>
                                        <p>
                                            Size: {item.size} | $
                                            {item.price.toLocaleString('es-MX')}{' '}
                                            MXN
                                        </p>
                                    </div>
                                    <div className={styles.actions}>
                                        <button
                                            onClick={() =>
                                                updateQuantity(
                                                    item.id,
                                                    item.size,
                                                    item.quantity - 1
                                                )
                                            }>
                                            -
                                        </button>
                                        <span>{item.quantity}</span>
                                        <button
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
                                            onClick={() =>
                                                removeFromCart(
                                                    item.id,
                                                    item.size
                                                )
                                            }>
                                            <LuTrash2 size={16} />
                                        </button>
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
                            <FaWhatsapp />
                            Order via WhatsApp
                        </button>
                    </footer>
                )}
            </aside>
        </div>
    );
}
