'use client';

import { useState, useEffect, useRef, ChangeEvent } from 'react';
import Sortable from 'sortablejs';
import styles from './ImagesForm.module.css';
import { ProductImageInput } from '@/types';

type LocalImagePreview = ProductImageInput & {
    fileName?: string;
};

interface ImagesFormProps {
    initialImages?: ProductImageInput[];
    onImagesChange: (imagenes: ProductImageInput[]) => void;
}

export default function ImagesForm({
    initialImages = [],
    onImagesChange,
}: ImagesFormProps) {
    const [images, setImages] = useState<LocalImagePreview[]>([]);
    const gridRef = useRef<HTMLDivElement | null>(null);
    const inputRef = useRef<HTMLInputElement | null>(null);

    const normalizeImages = (list: LocalImagePreview[]) =>
        list.map((image, index) => ({
            ...image,
            position: index + 1,
        }));

    const reorderImages = (
        list: LocalImagePreview[],
        fromIndex: number,
        toIndex: number
    ) => {
        if (fromIndex === toIndex) return normalizeImages(list);

        const updated = [...list];
        const [movedItem] = updated.splice(fromIndex, 1);
        updated.splice(toIndex, 0, movedItem);

        return normalizeImages(updated);
    };

    useEffect(() => {
        setImages((currentImages) =>
            normalizeImages(
                initialImages.map((image) => {
                    const currentImage = currentImages.find(
                        (item) =>
                            item.id === image.id &&
                            item.image_url === image.image_url
                    );

                    return {
                        ...image,
                        fileName:
                            currentImage?.fileName ||
                            (image as LocalImagePreview).fileName ||
                            image.image_url.split('/').pop() ||
                            'Imagen',
                    };
                })
            )
        );
    }, [initialImages]);

    // Inicializar SortableJS para permitir arrastrar y soltar
    useEffect(() => {
        if (!gridRef.current || images.length === 0) return;

        const sortableInstance = new Sortable(gridRef.current, {
            animation: 150,
            ghostClass: styles.ghostCard,
            handle: '.drag-handle',
            onEnd: (evt) => {
                const { oldIndex, newIndex } = evt;
                if (
                    oldIndex === undefined ||
                    newIndex === undefined ||
                    oldIndex === newIndex
                )
                    return;

                const normalized = reorderImages(images, oldIndex, newIndex);
                setImages(normalized);
                onImagesChange(normalized);
            },
        });

        return () => {
            sortableInstance.destroy();
        };
    }, [images, onImagesChange]);

    const handleImagesChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const selectedFiles = Array.from(e.target.files);
            const newImages: LocalImagePreview[] = selectedFiles.map(
                (file, index) => ({
                    id: Date.now() + index + Math.random(),
                    image_url: URL.createObjectURL(file),
                    position: images.length + index + 1,
                    fileName: file.name,
                    file,
                })
            );

            const updatedList = normalizeImages([...images, ...newImages]);
            setImages(updatedList);
            onImagesChange(updatedList);
            e.target.value = '';
        }
    };

    const deleteImage = (id?: number, url?: string) => {
        if (url?.startsWith('blob:')) {
            URL.revokeObjectURL(url);
        }
        if (id === undefined) return;

        const updatedList = normalizeImages(
            images.filter((img) => img.id !== id)
        );
        setImages(updatedList);
        onImagesChange(updatedList);
    };

    return (
        <div className={styles.imagesSectionContainer}>
            <span className={styles.formLabel}>Add Images (Drag to order)</span>
            {images.length > 0 && (
                <div className={styles.previewContainer}>
                    <div ref={gridRef} className={styles.previewGrid}>
                        {images.map((img, index) => (
                            <div
                                key={img.id}
                                className={`${styles.previewCard} drag-handle`}>
                                <span className={styles.badge}>
                                    {index + 1}
                                </span>

                                <img
                                    src={img.image_url}
                                    alt={`Preview ${index}`}
                                    className={styles.previewImage}
                                />

                                <div className={styles.previewTitle}>
                                    {img.fileName ||
                                        img.image_url.split('/').pop()}
                                </div>

                                <button
                                    type='button'
                                    onClick={() =>
                                        deleteImage(img.id, img.image_url)
                                    }
                                    className={styles.deleteButton}>
                                    Remove
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className={styles.drawerField}>
                <button
                    type='button'
                    className={styles.uploadButton}
                    onClick={() => inputRef.current?.click()}>
                    Select images
                </button>
                <span className={styles.uploadHint}>
                    The file name will appear below each preview.
                </span>
                <input
                    ref={inputRef}
                    type='file'
                    accept='image/*'
                    multiple
                    onChange={handleImagesChange}
                    className={styles.fileInput}
                />
            </div>
        </div>
    );
}
