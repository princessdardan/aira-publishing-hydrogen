import {Link} from 'react-router';
import {Image, Money} from '@shopify/hydrogen';
import type {ProductCardFragment} from 'storefrontapi.generated';
import {useVariantUrl} from '~/lib/variants';

/**
 * Display variants for the ProductCard component
 * - 'grid': Standard grid view (default) - shows image, title, price
 * - 'list': Horizontal list view - compact horizontal layout
 * - 'featured': Featured/hero view - larger image, more prominence
 * - 'compact': Minimal view - smaller image, condensed info
 */
export type ProductCardVariant = 'grid' | 'list' | 'featured' | 'compact';

export interface ProductCardProps {
  /** Product data from Shopify Storefront API */
  product: ProductCardFragment;

  /** Display variant - controls layout and styling */
  variant?: ProductCardVariant;

  /** Image loading strategy */
  loading?: 'eager' | 'lazy';

  /** Whether to show vendor/brand name */
  showVendor?: boolean;

  /** Whether to show compare-at (original) price when on sale */
  showCompareAtPrice?: boolean;

  /** Custom className for additional styling */
  className?: string;

  /** Callback when card is clicked (in addition to navigation) */
  onClick?: () => void;

  /** Whether to enable prefetch on hover */
  prefetch?: 'intent' | 'render' | 'none';
}

/**
 * ProductCard Component
 *
 * A flexible, reusable product card component that displays product information
 * in various layouts. Can be used in:
 * - Product grids (collections, search results)
 * - Carousels (recommended products, related items)
 * - Cart line items (with 'compact' variant)
 * - Featured product sections (with 'featured' variant)
 *
 * @example
 * ```tsx
 * // Grid view for collections
 * <ProductCard product={product} variant="grid" />
 *
 * // Featured hero product
 * <ProductCard product={product} variant="featured" loading="eager" />
 *
 * // Compact view for cart
 * <ProductCard product={product} variant="compact" showVendor={false} />
 * ```
 */
export function ProductCard({
  product,
  variant = 'grid',
  loading = 'lazy',
  showVendor = false,
  showCompareAtPrice = true,
  className = '',
  onClick,
  prefetch = 'intent',
}: ProductCardProps) {
  const variantUrl = useVariantUrl(product.handle);
  const image = product.featuredImage;
  const price = product.priceRange.minVariantPrice;
  const compareAtPrice = product.compareAtPriceRange?.minVariantPrice;
  const isOnSale = compareAtPrice && compareAtPrice.amount > price.amount;

  // Variant-specific styling
  const variantClasses = {
    grid: 'product-card product-card--grid',
    list: 'product-card product-card--list',
    featured: 'product-card product-card--featured',
    compact: 'product-card product-card--compact',
  };

  // Image sizes for different variants (responsive images)
  const imageSizes = {
    grid: '(min-width: 45em) 400px, 100vw',
    list: '(min-width: 45em) 200px, 50vw',
    featured: '(min-width: 45em) 600px, 100vw',
    compact: '(min-width: 45em) 100px, 25vw',
  };

  return (
    <article className={`${variantClasses[variant]} ${className}`}>
      <Link
        to={variantUrl}
        prefetch={prefetch}
        onClick={onClick}
        className="product-card__link"
      >
        {/* Product Image */}
        {image && (
          <div className="product-card__image-wrapper">
            <Image
              alt={image.altText || product.title}
              aspectRatio="1/1"
              data={image}
              loading={loading}
              sizes={imageSizes[variant]}
              className="product-card__image"
            />
            {isOnSale && (
              <span className="product-card__badge product-card__badge--sale">
                Sale
              </span>
            )}
          </div>
        )}

        {/* Product Info */}
        <div className="product-card__info">
          {showVendor && product.vendor && (
            <p className="product-card__vendor">{product.vendor}</p>
          )}

          <h3 className="product-card__title">{product.title}</h3>

          {/* Price Display */}
          <div className="product-card__price">
            {isOnSale && showCompareAtPrice ? (
              <div className="product-card__price--on-sale">
                <Money data={price} className="product-card__sale-price" />
                <Money
                  data={compareAtPrice}
                  className="product-card__compare-price"
                  as="s"
                />
              </div>
            ) : (
              <Money data={price} className="product-card__current-price" />
            )}
          </div>

          {/* Additional metadata for featured variant */}
          {variant === 'featured' && product.description && (
            <p className="product-card__description">
              {truncateText(product.description, 120)}
            </p>
          )}
        </div>
      </Link>
    </article>
  );
}

/**
 * Helper function to truncate text to a specific length
 */
function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
}

/**
 * GraphQL fragment for ProductCard
 *
 * This fragment defines all the data needed for the ProductCard component.
 * Use this in your queries to ensure you fetch all required fields.
 *
 * @example
 * ```graphql
 * query GetProducts {
 *   products(first: 10) {
 *     nodes {
 *       ...ProductCard
 *     }
 *   }
 * }
 * ${PRODUCT_CARD_FRAGMENT}
 * ```
 */
export const PRODUCT_CARD_FRAGMENT = `#graphql
  fragment ProductCard on Product {
    id
    title
    handle
    vendor
    description
    featuredImage {
      id
      url
      altText
      width
      height
    }
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
    }
    compareAtPriceRange {
      minVariantPrice {
        amount
        currencyCode
      }
    }
  }
` as const;
