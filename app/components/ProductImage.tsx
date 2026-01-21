import type {ProductVariantFragment} from 'storefrontapi.generated';
import {Image} from '@shopify/hydrogen';

export function ProductImage({
  image,
  aspectRatio = '1/1',
  loading = 'eager',
  showZoom = false,
}: {
  image: ProductVariantFragment['image'];
  aspectRatio?: '1/1' | '4/3' | '16/9' | '3/4';
  loading?: 'eager' | 'lazy';
  showZoom?: boolean;
}) {
  if (!image) {
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
    <div className={`product-image ${showZoom ? 'product-image--zoomable' : ''}`}>
      <Image
        alt={image.altText || 'Product Image'}
        aspectRatio={aspectRatio}
        data={image}
        key={image.id}
        sizes="(min-width: 45em) 50vw, 100vw"
        loading={loading}
      />
    </div>
  );
}
