import InventoryOverview from '@/app/components/Inventory';
import { fetchProducts } from '@/backend/actions/productActions';

export default async function InventoryPage() {
    const products = await fetchProducts();

    return <InventoryOverview initialProducts={products} />;
}
