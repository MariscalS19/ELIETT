'use client';

import { useState, useEffect, SyntheticEvent } from 'react';
import type { Product, ProductFormState, ProductVariant } from '@/types';
import styles from './ProductFormDrawer.module.css';
import ImagesForm from '../ImagesForm';

type ProductFormDrawerProps = {
    isOpen: boolean;
    product: Product | null;
    onClose: () => void;
    onSave: (formData: FormData) => Promise<void>;
};

interface FormFieldProps {
    classname?: string;
    type?: 'input' | 'textarea';
    label: string;
    value: string;
    placeholder: string;
    rows?: number;
    onChange: (e: any) => void;
    prefix?: string;
}

const SIZES: Array<ProductVariant['size']> = ['S', 'M', 'L'];

/**
 * Creates an initial empty form state based on {@link ProductFormState} type.
 *
 * @returns The clean `ProductFormState` state object for the form.
 * @see {@link toFormState} To see how a real product is converted to this state.
 */
const buildEmptyForm = (): ProductFormState => ({
    base_sku: '',
    model: '',
    name: '',
    description: '',
    composition: '',
    color: '',
    is_public: true,
    gdl_price: 0,
    foreigner_price: 0,
    inventory: SIZES.map((size) => ({ size, stock: 0, sku: size })),
    images: [],
});

/**
 * Converts from `Product` to a `ProductFormState` object .
 * @param product - The Product to convert.
 * @returns The converted ProductFormState.
 */
const toFormState = (product?: Product | null): ProductFormState => {
    if (!product) return buildEmptyForm();

    return {
        id: product.id,
        base_sku: product.base_sku,
        model: product.model,
        name: product.name,
        description: product.description,
        composition: product.composition,
        color: product.color,
        is_public: product.is_public,
        gdl_price: product.gdl_price,
        foreigner_price: product.foreigner_price,
        inventory: product.inventory.map((variant) => ({ ...variant })),
        images: product.images.map((img) => ({
            id: img.id,
            image_url: img.image_url,
            position: img.position,
        })),
    };
};

function FormField({
    classname = styles.drawerField,
    type = 'input',
    label,
    value,
    placeholder,
    rows,
    onChange,
    prefix,
}: FormFieldProps) {
    return (
        <label className={classname}>
            <span>{label}</span>
            {type === 'input' ? (
                prefix ? (
                    <div className={styles.inputWithPrefix}>
                        <span className={styles.inputPrefix}>{prefix}</span>
                        <input
                            value={value}
                            onChange={onChange}
                            placeholder={placeholder}
                        />
                    </div>
                ) : (
                    <input
                        value={value}
                        onChange={onChange}
                        placeholder={placeholder}
                    />
                )
            ) : type === 'textarea' ? (
                <textarea
                    value={value}
                    onChange={onChange}
                    rows={rows}
                    placeholder={placeholder}></textarea>
            ) : (
                ''
            )}
        </label>
    );
}

export default function ProductFormDrawer({
    isOpen,
    product,
    onClose,
    onSave,
}: ProductFormDrawerProps) {
    const [draftProduct, setDraftProduct] =
        useState<ProductFormState>(buildEmptyForm());
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Update draftProduct when the drawer opens or the product prop changes
    useEffect(() => {
        if (isOpen) {
            setDraftProduct(toFormState(product));
        }
    }, [isOpen, product]);

    // Close the drawer when the Escape key is pressed
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const isEditMode = Boolean(product?.id);

    /**
     * Updates the draft product state with a new value for a given key.
     * @template K - The key of the ProductFormState to update.
     * @param key
     * @param value
     */
    const updateDraft = <K extends keyof ProductFormState>(
        key: K,
        value: ProductFormState[K]
    ) => {
        setDraftProduct((current) => ({ ...current, [key]: value }));
    };

    const updateVariantStock = (
        size: ProductVariant['size'],
        stock: number
    ) => {
        setDraftProduct((current) => ({
            ...current,
            inventory: current.inventory.map((variant) =>
                variant.size === size ? { ...variant, stock } : variant
            ),
        }));
    };

    const handleSubmit = async (e: SyntheticEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        const normalizedInventory = draftProduct.inventory.map((variant) => ({
            ...variant,
            sku: `${draftProduct.base_sku || 'ELIETT'}-${variant.size}`,
        }));

        try {
            const safeImages = draftProduct.images ?? [];
            const payload = {
                ...draftProduct,
                inventory: normalizedInventory,
                images: safeImages.map((image) => ({
                    id: image.id,
                    image_url: image.image_url,
                    position: image.position,
                    fileName: image.fileName,
                    file: undefined,
                })),
            };

            const formData = new FormData();
            formData.append('payload', JSON.stringify(payload));

            safeImages.forEach((image, index) => {
                console.log(
                    `Imagen ${index}:`,
                    image.file,
                    image.file instanceof File
                );
                if (image.file instanceof File) {
                    formData.append('images', image.file, image.file.name);
                }
            });

            await onSave(formData);
            onClose();
        } catch (error) {
            console.error('Error al guardar el producto:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className={styles.drawerOverlay} onClick={onClose}>
            <aside
                className={styles.drawerPanel}
                role='dialog'
                aria-modal='true'
                aria-labelledby='drawer-title'
                onClick={(e) => e.stopPropagation()}>
                <form onSubmit={handleSubmit}>
                    <div className={styles.drawerHeader}>
                        <div>
                            <p className={styles.eyebrow}>Product</p>
                            <h3 id='drawer-title'>
                                {isEditMode ? 'Edit product' : 'Add product'}
                            </h3>
                        </div>
                        <button
                            type='button'
                            onClick={onClose}
                            className={styles.closeButton}
                            aria-label='Close form'>
                            ×
                        </button>
                    </div>

                    <div className={styles.drawerBody}>
                        <ImagesForm
                            initialImages={draftProduct.images || []}
                            onImagesChange={(newImages) => {
                                updateDraft('images', newImages);
                            }}
                        />

                        <div className={styles.drawerGrid}>
                            <FormField
                                label='Name'
                                value={draftProduct.name}
                                placeholder='Black pants'
                                onChange={(e) =>
                                    updateDraft('name', e.target.value)
                                }
                            />

                            <FormField
                                label='Model'
                                value={draftProduct.model}
                                placeholder='Model X'
                                onChange={(e) =>
                                    updateDraft('model', e.target.value)
                                }
                            />

                            <FormField
                                label='Base SKU'
                                value={draftProduct.base_sku}
                                placeholder='ELIETT-001'
                                onChange={(e) =>
                                    updateDraft('base_sku', e.target.value)
                                }
                            />

                            <FormField
                                label='Color'
                                value={draftProduct.color}
                                placeholder='Black'
                                onChange={(e) =>
                                    updateDraft('color', e.target.value)
                                }
                            />

                            <FormField
                                classname={styles.drawerFieldWide}
                                type='textarea'
                                rows={4}
                                label='Description'
                                value={draftProduct.description}
                                placeholder='Describe the product'
                                onChange={(e) =>
                                    updateDraft('description', e.target.value)
                                }
                            />

                            <FormField
                                classname={styles.drawerFieldWide}
                                type='textarea'
                                rows={3}
                                label='Composition'
                                value={draftProduct.composition}
                                placeholder='Composition details'
                                onChange={(e) =>
                                    updateDraft('composition', e.target.value)
                                }
                            />
                        </div>

                        <div className={styles.drawerGrid}>
                            <FormField
                                label='GDL Price'
                                prefix='$'
                                value={draftProduct.gdl_price.toString()}
                                placeholder='0.00'
                                onChange={(e) =>
                                    updateDraft(
                                        'gdl_price',
                                        parseFloat(e.target.value) || 0
                                    )
                                }
                            />

                            <FormField
                                label='Foreigner Price'
                                prefix='$'
                                value={draftProduct.foreigner_price.toString()}
                                placeholder='0.00'
                                onChange={(e) =>
                                    updateDraft(
                                        'foreigner_price',
                                        parseFloat(e.target.value) || 0
                                    )
                                }
                            />
                        </div>

                        <div className={styles.stockField}>
                            {SIZES.map((size) => {
                                const variant = draftProduct.inventory.find(
                                    (v) => v.size === size
                                );
                                return (
                                    <FormField
                                        key={size}
                                        label={`Stock ${size}`}
                                        value={variant?.stock.toString() || '0'}
                                        placeholder='0'
                                        onChange={(e) =>
                                            updateVariantStock(
                                                size,
                                                parseInt(e.target.value) || 0
                                            )
                                        }
                                    />
                                );
                            })}
                        </div>
                    </div>

                    <div className={styles.drawerFooter}>
                        <button
                            type='submit'
                            disabled={isSubmitting}
                            className={styles.submitButton}>
                            {isSubmitting ? 'Saving...' : 'Save Product'}
                        </button>
                    </div>
                </form>
            </aside>
        </div>
    );
}
