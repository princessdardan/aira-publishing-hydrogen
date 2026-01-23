import {Link} from 'react-router';
import {useRef} from 'react';
import type {CollectionCarouselFragment} from 'storefrontapi.generated';

interface CollectionCarouselProps {
  collections: CollectionCarouselFragment[];
  title?: string;
}

export function CollectionCarousel({
  collections,
  title = 'Shop by Collection',
}: CollectionCarouselProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = scrollContainerRef.current.offsetWidth;
      const newScrollPosition =
        scrollContainerRef.current.scrollLeft +
        (direction === 'left' ? -scrollAmount : scrollAmount);
      scrollContainerRef.current.scrollTo({
        left: newScrollPosition,
        behavior: 'smooth',
      });
    }
  };

  if (!collections || collections.length === 0) {
    return null;
  }

  return (
    <section className="collection-carousel-section">
      <div className="collection-carousel-container">
        <h3 className="collection-carousel-heading">{title}</h3>

        <div className="collection-carousel-wrapper">
          <button
            onClick={() => scroll('left')}
            className="collection-carousel-nav collection-carousel-nav-left"
            aria-label="Scroll left"
          >
            ‹
          </button>

          <div className="collection-carousel-scroll" ref={scrollContainerRef}>
            {collections.map((collection) => (
              <Link
                key={collection.id}
                to={`/collections/${collection.handle}`}
                className="collection-card"
                prefetch="intent"
              >
                {collection.image ? (
                  <img
                    src={collection.image.url}
                    alt={collection.image.altText || collection.title}
                    className="collection-card-image"
                    loading="lazy"
                  />
                ) : (
                  <div className="collection-card-placeholder">
                    <span className="collection-card-placeholder-text">
                      {collection.title}
                    </span>
                  </div>
                )}
                <div className="collection-card-overlay">
                  <span className="collection-card-title">{collection.title}</span>
                </div>
              </Link>
            ))}
          </div>

          <button
            onClick={() => scroll('right')}
            className="collection-carousel-nav collection-carousel-nav-right"
            aria-label="Scroll right"
          >
            ›
          </button>
        </div>
      </div>
    </section>
  );
}

// GraphQL fragment for the collection carousel
export const COLLECTION_CAROUSEL_FRAGMENT = `#graphql
  fragment CollectionCarousel on Collection {
    id
    title
    handle
    image {
      id
      url
      altText
      width
      height
    }
  }
` as const;
