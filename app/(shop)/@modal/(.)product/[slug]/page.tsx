import { getCachedProductById } from '@/backend/db/products';
import ProductModalClient from '../../_components/ProductModal';
import { notFound } from 'next/navigation';

export default async function ProductModalPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const mathch = slug.match(/-(\d+)$/);
    const productId = mathch ? Number(mathch[1]) : null;

    if (!productId || isNaN(productId)) {
        notFound();
    }
    const product = await getCachedProductById(productId);

    if (!product) {
        notFound();
    }

    return <ProductModalClient product={product} />;
}
