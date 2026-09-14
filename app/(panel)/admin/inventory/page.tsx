import InventoryOverview from './_components/InventoryOverview';
import { fetchProducts } from '@/backend/actions/productActions';

export default async function InventoryPage() {
    const products = await fetchProducts();

    return <InventoryOverview initialProducts={products} />;
}
