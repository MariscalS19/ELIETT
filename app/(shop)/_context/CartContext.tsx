'use client';

import {
    createContext,
    useContext,
    useState,
    useEffect,
    useMemo,
    useCallback,
    ReactNode,
} from 'react';

const WHATSAPP_PHONE = process.env.NEXT_PUBLIC_WHATSAPP_PHONE ?? '';
const CART_STORAGE_KEY = 'eliett_cart';

export interface CartItem {
    id: number;
    name: string;
    model: string;
    price: number;
    image: string;
    size: string;
    color?: string;
    quantity: number;
}

interface CartContextType {
    cart: CartItem[];
    addToCart: (item: CartItem) => void;
    updateQuantity: (id: number, size: string, quantity: number) => void;
    removeFromCart: (id: number, size: string) => void;
    clearCart: () => void;
    totalItems: number;
    totalPrice: number;
    sendCartToWhatsApp: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
    const [cart, setCart] = useState<CartItem[]>([]);
    const [isHydrated, setIsHydrated] = useState(false);

    useEffect(() => {
        try {
            const saved = localStorage.getItem(CART_STORAGE_KEY);
            if (saved) {
                setCart(JSON.parse(saved));
            }
        } catch (error) {
            console.error('Failed to load cart from localStorage:', error);
        } finally {
            setIsHydrated(true);
        }
    }, []);

    useEffect(() => {
        if (!isHydrated) return;
        try {
            localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
        } catch (error) {
            console.error('Failed to save cart to localStorage:', error);
        }
    }, [cart, isHydrated]);

    const addToCart = useCallback((newItem: CartItem) => {
        setCart((prevCart) => {
            const existingIndex = prevCart.findIndex(
                (item) => item.id === newItem.id && item.size === newItem.size
            );

            if (existingIndex > -1) {
                return prevCart.map((item, index) =>
                    index === existingIndex
                        ? {
                              ...item,
                              quantity: item.quantity + newItem.quantity,
                          }
                        : item
                );
            }

            return [...prevCart, newItem];
        });
    }, []);

    const updateQuantity = useCallback(
        (id: number, size: string, quantity: number) => {
            if (quantity <= 0) {
                removeFromCart(id, size);
                return;
            }

            setCart((prevCart) =>
                prevCart.map((item) =>
                    item.id === id && item.size === size
                        ? { ...item, quantity }
                        : item
                )
            );
        },
        []
    );

    const removeFromCart = useCallback((id: number, size: string) => {
        setCart((prevCart) =>
            prevCart.filter((item) => !(item.id === id && item.size === size))
        );
    }, []);

    const clearCart = useCallback(() => setCart([]), []);

    const { totalItems, totalPrice } = useMemo(() => {
        return cart.reduce(
            (acc, item) => {
                acc.totalItems += item.quantity;
                acc.totalPrice += item.price * item.quantity;
                return acc;
            },
            { totalItems: 0, totalPrice: 0 }
        );
    }, [cart]);

    const sendCartToWhatsApp = useCallback(() => {
        if (cart.length === 0) return;

        if (!WHATSAPP_PHONE) {
            console.warn('NEXT_PUBLIC_WHATSAPP_PHONE is not defined.');
        }

        const itemsList = cart
            .map(
                (item) =>
                    `• *${item.name}* (${item.model}) - Size: ${item.size} x${item.quantity} -> $${(
                        item.price * item.quantity
                    ).toLocaleString('es-MX')} MXN`
            )
            .join('\n');

        const message = [
            'Hello ELIETT, I would like to place an order for the following items:\n',
            itemsList,
            `\n*Total:* $${totalPrice.toLocaleString('es-MX')} MXN\n`,
            'Please let me know the next steps to complete the purchase. Thank you!',
        ].join('\n');

        const cleanPhone = WHATSAPP_PHONE.replace(/\D/g, '');
        const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank', 'noopener,noreferrer');
    }, [cart, totalPrice]);

    const value = useMemo(
        () => ({
            cart,
            addToCart,
            updateQuantity,
            removeFromCart,
            clearCart,
            totalItems,
            totalPrice,
            sendCartToWhatsApp,
        }),
        [
            cart,
            addToCart,
            updateQuantity,
            removeFromCart,
            clearCart,
            totalItems,
            totalPrice,
            sendCartToWhatsApp,
        ]
    );

    return (
        <CartContext.Provider value={value}>{children}</CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}
