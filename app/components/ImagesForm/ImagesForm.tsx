'use client';

import { useState, useEffect, useRef, ChangeEvent, useCallback } from 'react';
import imageCompression, {
    type Options as ImageCompressionOptions,
} from 'browser-image-compression';
import Sortable from 'sortablejs';
import styles from './ImagesForm.module.css';
import { ProductImageInput } from '@/types';

const COMPRESSION_OPTIONS: ImageCompressionOptions = {
    maxSizeMB: 1.2,
    maxWidthOrHeight: 2880,
    useWebWorker: true,
    fileType: 'image/webp',
    initialQuality: 0.88,
};

const buildWebpName = (fileName: string) => {
    const baseName = fileName.replace(/\.[^/.]+$/, '') || 'image';
    return `${baseName}.webp`;
};

const toWebpFile = (file: File, blob: Blob) =>
    new File([blob], buildWebpName(file.name), {
        type: 'image/webp',
        lastModified: file.lastModified,
    });

const normalizeImages = (list: ProductImageInput[]) =>
    list.map((image, index) => ({
        ...image,
        position: index + 1,
    }));

interface ImagesFormProps {
    initialImages?: ProductImageInput[];
    onImagesChange: (imagenes: ProductImageInput[]) => void;
}

export default function ImagesForm({
    initialImages = [],
    onImagesChange,
}: ImagesFormProps) {
    const [images, setImages] = useState<ProductImageInput[]>([]);
    const inputRef = useRef<HTMLInputElement | null>(null);
    const onImagesChangeRef = useRef(onImagesChange);
    onImagesChangeRef.current = onImagesChange;

    const sortableInstanceRef = useRef<Sortable | null>(null);

    const [compressingMessage, setCompressingMessage] = useState<string | null>(
        null
    );
    const [compressionError, setCompressionError] = useState<string | null>(
        null
    );

    useEffect(() => {
        setImages(() => normalizeImages(initialImages));
    }, [initialImages]);

    const gridRefCallback = useCallback((node: HTMLDivElement | null) => {
        if (sortableInstanceRef.current) {
            sortableInstanceRef.current.destroy();
            sortableInstanceRef.current = null;
        }

        if (node) {
            sortableInstanceRef.current = new Sortable(node, {
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

                    setImages((currentImages) => {
                        const updated = [...currentImages];
                        const [movedItem] = updated.splice(oldIndex, 1);
                        updated.splice(newIndex, 0, movedItem);

                        const normalized = normalizeImages(updated);

                        setTimeout(() => {
                            onImagesChangeRef.current(normalized);
                        }, 0);

                        return normalized;
                    });
                },
            });
        }
    }, []);

    const handleImagesChange = async (e: ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;

        const selectedFiles = Array.from(e.target.files);
        const processed: ProductImageInput[] = [];
        setCompressionError(null);

        try {
            for (const [index, file] of selectedFiles.entries()) {
                setCompressingMessage(
                    `Compressing image ${index + 1} of ${selectedFiles.length}...`
                );

                const compressedBlob = await imageCompression(
                    file,
                    COMPRESSION_OPTIONS
                );
                const compressedFile = toWebpFile(file, compressedBlob);
                const previewUrl = URL.createObjectURL(compressedFile);

                processed.push({
                    id: crypto.randomUUID() as any,
                    image_url: previewUrl,
                    position: 0,
                    fileName: compressedFile.name,
                    file: compressedFile,
                });
            }

            setImages((currentList) => {
                const updatedList = normalizeImages([
                    ...currentList,
                    ...processed,
                ]);
                setTimeout(() => {
                    onImagesChangeRef.current(updatedList);
                }, 0);
                return updatedList;
            });
        } catch (error) {
            processed.forEach((image) => {
                if (image.image_url.startsWith('blob:')) {
                    URL.revokeObjectURL(image.image_url);
                }
            });
            setCompressionError(
                'Could not compress one or more images. Please try again.'
            );
            console.error('Error compressing images', error);
        } finally {
            setCompressingMessage(null);
            e.target.value = '';
        }
    };

    const deleteImage = (id?: number | string, url?: string) => {
        if (url?.startsWith('blob:')) {
            URL.revokeObjectURL(url);
        }
        if (id === undefined) return;

        setImages((currentList) => {
            const updatedList = normalizeImages(
                currentList.filter((img) => img.id !== id)
            );
            setTimeout(() => {
                onImagesChangeRef.current(updatedList);
            }, 0);
            return updatedList;
        });
    };

    return (
        <div className={styles.imagesSectionContainer}>
            <span className={styles.formLabel}>Add Images (Drag to order)</span>

            {images.length > 0 && (
                <div className={styles.previewContainer}>
                    {/* 🔥 Cambiamos ref={gridRef} por ref={gridRefCallback} */}
                    <div ref={gridRefCallback} className={styles.previewGrid}>
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
                                    {img.fileName}
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
                    onClick={() => inputRef.current?.click()}
                    disabled={Boolean(compressingMessage)}>
                    Select images
                </button>
                <input
                    ref={inputRef}
                    type='file'
                    multiple
                    accept='image/*'
                    onChange={handleImagesChange}
                    style={{ display: 'none' }}
                />
                {compressingMessage && <p>{compressingMessage}</p>}
                {compressionError && (
                    <p style={{ color: 'red' }}>{compressionError}</p>
                )}
            </div>
        </div>
    );
}
