import Navbar from '@/components/Navbar';
import { CartProvider } from './_context/CartContext';
import CartDrawer from '@/components/CartDrawer';
export default function ShopLayout({
    children,
    modal,
}: Readonly<{
    children: React.ReactNode;
    modal: React.ReactNode;
}>) {
    return (
        <CartProvider>
            <Navbar />
            <main> {children} </main>
            {modal}
            <CartDrawer />
        </CartProvider>
    );
}
