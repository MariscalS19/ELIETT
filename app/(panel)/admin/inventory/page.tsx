import InventoryOverview from './_components/InventoryOverview';
import { fetchAdminProductsFromDB } from '@/backend/db/products';

export default async function InventoryPage() {
    const products = await fetchAdminProductsFromDB();

    return <InventoryOverview initialProducts={products} />;
}
