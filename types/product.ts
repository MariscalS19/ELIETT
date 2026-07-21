export type Size = 'S' | 'M' | 'L';
export type Region = 'GDL' | 'FOREIGNER';

export interface SizeInventory {
    size: Size;
    stock: number;
}

export interface Product {
    id: number;
    base_sku: string;
    model: string;
    name: string;
    description: string;
    composition: string;
    color: string;
    image_url: string;
    gdl_price: number;
    foreigner_price: number;
    inventory: SizeInventory[];
}