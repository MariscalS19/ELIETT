import Navbar from '@/components/Navbar';
import { CartProvider } from './_context/CartContext';
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
        </CartProvider>
    );
}
