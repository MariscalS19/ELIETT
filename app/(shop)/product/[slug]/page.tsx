import { notFound } from 'next/navigation';
import { getCachedProductById } from '@/backend/db/products';
import ProductDetailClient from './_components/ProductDetailClient';

interface ProductPageProps {
    params: Promise<{
        slug: string;
    }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
    const { slug } = await params;

    const match = slug.match(/-(\d+)$/);
    const productId = match ? Number(match[1]) : null;

    if (!productId || isNaN(productId)) {
        notFound();
    }

    const product = await getCachedProductById(productId);

    if (!product) {
        notFound();
    }

    return <ProductDetailClient product={product} />;
}
