'use client';
import { ProductImage } from '@/types';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import styles from './ImageCarousel.module.css';
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

    // Preload next and previous images for smoother transitions
    useEffect(() => {
        if (!images || imagesLength <= 1) return;

        const nextIndex = (currentImgIdx + 1) % imagesLength;
        const prevIndex = (currentImgIdx + imagesLength - 1) % imagesLength;

        [nextIndex, prevIndex].forEach((idx) => {
            const img = new window.Image();
            img.src = images[idx].image_url;
        });
    }, [currentImgIdx, images, imagesLength]);

    const handleNextimage = () => {
        setCurrentImgIdx((prevIdx) => (prevIdx + 1) % imagesLength);
    };

    const handlePreviousImage = () => {
        setCurrentImgIdx(
            (prevIdx) => (prevIdx + imagesLength - 1) % imagesLength
        );
    };

    if (!images || imagesLength === 0) return null;

    const currentImg = images[currentImgIdx];

    return (
        <div className={styles.carrouselContainer}>
            <div className={styles.productImageWrap}>
                <Image
                    key={`bg-${currentImg.id}`}
                    src={currentImg.image_url}
                    alt=''
                    fill
                    unoptimized
                    className={styles.backgroundImage}
                    aria-hidden='true'
                />

                <Image
                    key={currentImg.id}
                    src={currentImg.image_url}
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
                        type='button'
                        className={styles.prevButton}
                        onClick={handlePreviousImage}>
                        <LuChevronLeft />
                    </button>
                    <button
                        type='button'
                        className={styles.nextButton}
                        onClick={handleNextimage}>
                        <LuChevronRight />
                    </button>
                </>
            )}
        </div>
    );
}
