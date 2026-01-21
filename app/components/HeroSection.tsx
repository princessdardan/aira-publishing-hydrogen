import {Image} from '@shopify/hydrogen';
import {Link} from 'react-router';

export type HeroSize = 'full' | 'large' | 'medium' | 'small';

export interface HeroSectionProps {
  /**
   * Hero size variant
   * - full: Full viewport height (100vh) - ideal for homepage
   * - large: 75vh - prominent feature sections
   * - medium: 50vh - collection/product page headers
   * - small: 33vh - page banners
   */
  size?: HeroSize;

  /**
   * Hero title (h1)
   */
  title: string;

  /**
   * Optional subtitle or description
   */
  subtitle?: string;

  /**
   * Background image from Shopify (partial image object with id, url, altText, width, height)
   */
  image?: {
    id?: string | null;
    url: string;
    altText?: string | null;
    width?: number | null;
    height?: number | null;
  } | null;

  /**
   * Fallback background color when no image
   */
  backgroundColor?: string;

  /**
   * Text color - defaults to white
   */
  textColor?: 'white' | 'black';

  /**
   * Content alignment
   */
  alignment?: 'left' | 'center' | 'right';

  /**
   * Optional CTA button
   */
  cta?: {
    text: string;
    url: string;
  };

  /**
   * Additional CSS classes
   */
  className?: string;
}

const SIZE_CLASSES: Record<HeroSize, string> = {
  full: 'hero-section--full',
  large: 'hero-section--large',
  medium: 'hero-section--medium',
  small: 'hero-section--small',
};

const ALIGNMENT_CLASSES: Record<NonNullable<HeroSectionProps['alignment']>, string> = {
  left: 'hero-section__content--left',
  center: 'hero-section__content--center',
  right: 'hero-section__content--right',
};

const TEXT_COLOR_CLASSES: Record<NonNullable<HeroSectionProps['textColor']>, string> = {
  white: 'white',
  black: 'black',
};

export function HeroSection({
  size = 'medium',
  title,
  subtitle,
  image,
  backgroundColor = '#000',
  textColor = 'white',
  alignment = 'center',
  cta,
  className = '',
}: HeroSectionProps) {
  const sizeClass = SIZE_CLASSES[size];
  const alignmentClass = ALIGNMENT_CLASSES[alignment];
  const textColorClass = TEXT_COLOR_CLASSES[textColor];

  // Determine image alignment class based on alignment prop
  const imageAlignmentClass =
    alignment === 'left' ? 'hero-section__image--left' :
    alignment === 'right' ? 'hero-section__image--right' :
    'hero-section__image--center';

  return (
    <section
      className={`hero-section ${sizeClass} ${className}`}
      style={{
        backgroundColor: image ? undefined : backgroundColor,
      }}
    >
      {/* Background Image */}
      {image && (
        <div className="hero-section__image-wrapper">
          <Image
            data={{
              ...image,
              altText: image.altText || title || 'Hero background image',
            }}
            sizes="100vw"
            className={`hero-section__image ${imageAlignmentClass}`}
            loading={size === 'full' ? 'eager' : 'lazy'}
          />
        </div>
      )}

      {/* Dark overlay for text readability */}
      {image && (
        <div className="hero-section__overlay" aria-hidden="true" />
      )}

      {/* Content */}
      <div className={`hero-section__content ${alignmentClass}`}>
        <div className="hero-section__inner">
          <h1 className={`hero-section__title hero-section__title--${textColorClass}`}>
            {title}
          </h1>

          {subtitle && (
            <p className={`hero-section__subtitle hero-section__subtitle--${textColorClass}`}>
              {subtitle}
            </p>
          )}

          {cta && (
            <div>
              <Link to={cta.url} className="hero-section__cta">
                {cta.text}
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
