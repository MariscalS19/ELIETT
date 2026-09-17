import Navbar from '@/components/Navbar';

export default function ShopLayout({
    children,
    modal,
}: Readonly<{
    children: React.ReactNode;
    modal: React.ReactNode;
}>) {
    return (
        <>
            <Navbar />
            <main> {children} </main>
            {modal}
        </>
    );
}
