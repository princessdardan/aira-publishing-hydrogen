import {Image} from '@shopify/hydrogen';
import {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import type {ProductVariantFragment} from 'storefrontapi.generated';
import {Portal} from './Portal';

type CarouselImage = ProductVariantFragment['image'];
type ResolvedCarouselImage = NonNullable<CarouselImage>;

interface ProductImageCarouselProps {
  images: CarouselImage[];
  productTitle: string;
  /**
   * Optional className for size customization.
   * Use to override CSS variables like --carousel-main-max-width or --carousel-thumbnail-size
   */
  className?: string;
}

const SWIPE_THRESHOLD_PX = 40;

export function ProductImageCarousel({
  images,
  productTitle,
  className,
}: ProductImageCarouselProps) {
  const resolvedImages = useMemo(
    () => images.filter((image): image is ResolvedCarouselImage => !!image?.url),
    [images],
  );
  const totalImages = resolvedImages.length;
  const [activeIndex, setActiveIndex] = useState(0);
  const [fullscreenIndex, setFullscreenIndex] = useState<number | null>(null);
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    if (import.meta.env.DEV && typeof window !== 'undefined' && totalImages === 0) {
      // Helpful during development if products ship without images.
      console.warn('ProductImageCarousel: no images provided');
    }
  }, [totalImages]);

  useEffect(() => {
    if (activeIndex >= totalImages) {
      setActiveIndex(0);
    }
  }, [activeIndex, totalImages]);

  const goToIndex = useCallback(
    (index: number) => {
      if (totalImages <= 1) return;
      const normalized = (index + totalImages) % totalImages;
      setActiveIndex(normalized);
    },
    [totalImages],
  );

  const goNext = useCallback(() => {
    goToIndex(activeIndex + 1);
  }, [activeIndex, goToIndex]);

  const goPrevious = useCallback(() => {
    goToIndex(activeIndex - 1);
  }, [activeIndex, goToIndex]);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (totalImages <= 1) return;
      if (event.key === 'ArrowRight') {
        event.preventDefault();
        goNext();
      }
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        goPrevious();
      }
    },
    [goNext, goPrevious, totalImages],
  );

  const handleTouchStart = useCallback(
    (event: React.TouchEvent<HTMLDivElement>) => {
      touchStartX.current = event.touches[0]?.clientX ?? null;
    },
    [],
  );

  const handleTouchEnd = useCallback(
    (event: React.TouchEvent<HTMLDivElement>) => {
      if (touchStartX.current === null || totalImages <= 1) {
        touchStartX.current = null;
        return;
      }
      const touchEndX = event.changedTouches[0]?.clientX ?? touchStartX.current;
      const delta = touchEndX - touchStartX.current;
      if (Math.abs(delta) > SWIPE_THRESHOLD_PX) {
        if (delta > 0) {
          goPrevious();
        } else {
          goNext();
        }
      }
      touchStartX.current = null;
    },
    [goNext, goPrevious, totalImages],
  );

  const openFullscreen = useCallback((index: number) => {
    setFullscreenIndex(index);
  }, []);

  const closeFullscreen = useCallback(() => {
    setFullscreenIndex(null);
  }, []);

  const handleFullscreenKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeFullscreen();
      } else if (event.key === 'ArrowRight') {
        event.preventDefault();
        setFullscreenIndex((prev) => {
          if (prev === null) return null;
          return (prev + 1) % totalImages;
        });
      } else if (event.key === 'ArrowLeft') {
        event.preventDefault();
        setFullscreenIndex((prev) => {
          if (prev === null) return null;
          return (prev - 1 + totalImages) % totalImages;
        });
      }
    },
    [closeFullscreen, totalImages],
  );

  const handleBackdropClick = useCallback(
    (event: React.MouseEvent) => {
      // Only close if clicking the backdrop itself, not the image
      if (event.target === event.currentTarget) {
        closeFullscreen();
      }
    },
    [closeFullscreen],
  );

  // Prevent body scroll when fullscreen is open
  useEffect(() => {
    if (fullscreenIndex !== null) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = '';
      };
    }
  }, [fullscreenIndex]);

  if (totalImages === 0) {
    return (
      <div className="product-image product-image-placeholder">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <polyline points="21 15 16 10 5 21" />
        </svg>
        <span className="product-image-placeholder-text">No image available</span>
      </div>
    );
  }

  return (
    <div className={`product-carousel${className ? ` ${className}` : ''}`}>
      {/* Main carousel content wrapper */}
      <div className="product-carousel-main">
        {/* Carousel viewport with keyboard and touch navigation.
            Using div with role=region is semantically correct for a carousel container
            that needs to be keyboard-navigable per WCAG guidelines. */}
        {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions */}
        <div
          className="product-carousel-viewport product-image"
          role="region"
          aria-roledescription="carousel"
          aria-label="Product images"
          tabIndex={totalImages > 1 ? 0 : -1}
          onKeyDown={handleKeyDown}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <div
            className="product-carousel-track"
            style={{transform: `translateX(-${activeIndex * 100}%)`}}
          >
            {resolvedImages.map((image, index) => (
              <div className="product-carousel-slide" key={image.id ?? image.url ?? index}>
                <button
                  type="button"
                  onClick={() => openFullscreen(index)}
                  className="product-carousel-image-button"
                  aria-label="View fullscreen"
                >
                  <Image
                    alt={image.altText || productTitle}
                    aspectRatio={
                      image.width && image.height ? `${image.width}/${image.height}` : '1/1'
                    }
                    data={image}
                    loading={index === 0 ? 'eager' : 'lazy'}
                    sizes="(min-width: 45em) 50vw, 100vw"
                    className="product-carousel-image"
                  />
                </button>
              </div>
            ))}
          </div>
          {totalImages > 1 && (
            <div className="product-carousel-controls">
              <button
                type="button"
                className="product-carousel-button"
                onClick={goPrevious}
                aria-label="Previous image"
              >
                ‹
              </button>
              <button
                type="button"
                className="product-carousel-button"
                onClick={goNext}
                aria-label="Next image"
              >
                ›
              </button>
            </div>
          )}
        </div>

      </div>

      {totalImages > 1 && (
        <div className="product-carousel-thumbnails" role="tablist">
          {resolvedImages.map((image, index) => (
            <button
              key={`thumb-${image.id ?? image.url ?? index}`}
              type="button"
              className={`product-carousel-thumbnail${
                index === activeIndex ? ' is-active' : ''
              }`}
              onClick={() => goToIndex(index)}
              aria-label={`View image ${index + 1}`}
              aria-pressed={index === activeIndex}
            >
              <Image
                alt={image.altText || productTitle}
                data={image}
                loading="lazy"
                sizes="64px"
                className="product-carousel-thumbnail-image"
              />
            </button>
          ))}
        </div>
      )}

      {/* Fullscreen lightbox modal */}
      {fullscreenIndex !== null && (
        <Portal>
          {/* Backdrop wrapper handles click-outside-to-close */}
          {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
          <div
            className="product-carousel-lightbox"
            onClick={handleBackdropClick}
          >
            {/* Dialog content with keyboard navigation */}
            {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions */}
            <div
              className="product-carousel-lightbox-dialog"
              role="dialog"
              aria-modal="true"
              aria-label="Fullscreen image viewer"
              onKeyDown={handleFullscreenKeyDown}
              tabIndex={-1}
            >
              <button
                type="button"
                className="product-carousel-lightbox-close"
                onClick={closeFullscreen}
                aria-label="Close fullscreen"
              >
                ✕
              </button>

              <div className="product-carousel-lightbox-content">
                {totalImages > 1 && (
                  <>
                    <button
                      type="button"
                      className="product-carousel-lightbox-button product-carousel-lightbox-button-prev"
                      onClick={() => setFullscreenIndex((prev) => {
                        if (prev === null) return null;
                        return (prev - 1 + totalImages) % totalImages;
                      })}
                      aria-label="Previous image"
                    >
                      ‹
                    </button>
                    <button
                      type="button"
                      className="product-carousel-lightbox-button product-carousel-lightbox-button-next"
                      onClick={() => setFullscreenIndex((prev) => {
                        if (prev === null) return null;
                        return (prev + 1) % totalImages;
                      })}
                      aria-label="Next image"
                    >
                      ›
                    </button>
                  </>
                )}

                <div className="product-carousel-lightbox-image-wrapper">
                  <Image
                    alt={resolvedImages[fullscreenIndex]?.altText || productTitle}
                    data={resolvedImages[fullscreenIndex]!}
                    loading="eager"
                    sizes="100vw"
                    className="product-carousel-lightbox-image"
                  />
                </div>

                {totalImages > 1 && (
                  <div className="product-carousel-lightbox-counter">
                    {fullscreenIndex + 1} / {totalImages}
                  </div>
                )}
              </div>
            </div>
          </div>
        </Portal>
      )}
    </div>
  );
}
