export interface Product {
    id: number;
    base_sku: string;
    model: string;
    name: string;
    description: string;
    composition: string;
    color: string;
    is_public: boolean;
    gdl_price: number;
    foreigner_price: number;
    images: ProductImage[];
    inventory: ProductVariant[];
}

export interface ProductImage {
    id?: number;
    product_id?: number;
    image_url: string;
    position: number;
}

export type ProductImageInput = ProductImage & {
    previewUrl?: string;
    file?: File;
    fileName?: string;
};
export interface ProductVariant {
    id?: number;
    size: 'S' | 'M' | 'L';
    stock: number;
    sku: string;
}

export type ProductFormState = {
    id?: number;
    base_sku: string;
    model: string;
    name: string;
    description: string;
    composition: string;
    color: string;
    is_public: boolean;
    gdl_price: number | null;
    foreigner_price: number | null;
    inventory: (Omit<ProductVariant, 'stock'> & { stock: number | null })[];
    images?: ProductImageInput[];
};

export type ProductCard = Pick<
    Product,
    'id' | 'name' | 'model' | 'is_public' | 'gdl_price'
> & {
    image_url?: string;
};

export type ProductSummary = Pick<Product, 'id' | 'name' | 'is_public'> & {
    totalStock: number;
};
