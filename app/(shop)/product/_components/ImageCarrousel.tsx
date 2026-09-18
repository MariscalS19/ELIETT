'use client';
import { ProductImage } from '@/types';
import { useState } from 'react';
import Image from 'next/image';
import styles from './ImageCarrousel.module.css';
import { LuChevronLeft, LuChevronRight } from 'react-icons/lu';

interface ImageCarrouselProps {
    images: ProductImage[];
    productName: string;
}

export default function ImageCarrousel({
    images,
    productName,
}: ImageCarrouselProps) {
    const imagesLength = images.length;
    const [currentImgIdx, setCurrentImgIdx] = useState(0);

    const handleNextimage = () => {
        setCurrentImgIdx((prevIdx) => (prevIdx + 1) % imagesLength);
    };

    const handlePreviousImage = () => {
        setCurrentImgIdx(
            (prevIdx) => (prevIdx + imagesLength - 1) % imagesLength
        );
    };
    if (!images || imagesLength === 0) return null;

    return (
        <div className={styles.carrouselContainer}>
            <div className={styles.productImageWrap}>
                <Image
                    key={images[currentImgIdx].id}
                    src={images[currentImgIdx].image_url}
                    alt={productName}
                    fill
                    priority
                    unoptimized
                    className={styles.productImage}
                />
            </div>

            {imagesLength > 1 && (
                <>
                    <button
                        className={styles.prevButton}
                        onClick={handlePreviousImage}>
                        <LuChevronLeft />
                    </button>
                    <button
                        className={styles.nextButton}
                        onClick={handleNextimage}>
                        <LuChevronRight />
                    </button>
                </>
            )}
        </div>
    );
}
