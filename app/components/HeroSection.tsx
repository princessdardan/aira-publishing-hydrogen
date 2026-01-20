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
   * Optional overlay opacity (0-100)
   */
  overlayOpacity?: number;

  /**
   * Optional overlay color
   */
  overlayColor?: string;

  /**
   * Additional CSS classes
   */
  className?: string;
}

const SIZE_CLASSES: Record<HeroSize, string> = {
  full: 'h-screen',
  large: 'h-[75vh]',
  medium: 'h-[50vh]',
  small: 'h-[33vh]',
};

const ALIGNMENT_CLASSES: Record<NonNullable<HeroSectionProps['alignment']>, string> = {
  left: 'items-start text-left',
  center: 'items-center text-center',
  right: 'items-end text-right',
};

const TEXT_COLOR_CLASSES: Record<NonNullable<HeroSectionProps['textColor']>, string> = {
  white: 'text-white',
  black: 'text-black',
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
  overlayOpacity = 40,
  overlayColor = '#000',
  className = '',
}: HeroSectionProps) {
  const sizeClass = SIZE_CLASSES[size];
  const alignmentClass = ALIGNMENT_CLASSES[alignment];
  const textColorClass = TEXT_COLOR_CLASSES[textColor];

  return (
    <section
      className={`hero-section relative w-full ${sizeClass} overflow-hidden ${className}`}
      style={{
        backgroundColor: image ? undefined : backgroundColor,
      }}
    >
      {/* Background Image */}
      {image && (
        <div className="absolute inset-0 w-full h-full">
          <Image
            data={{
              ...image,
              altText: image.altText || title || 'Hero background image',
            }}
            sizes={
              size === 'full'
                ? '100vw'
                : '(min-width: 1280px) 1280px, 100vw'
            }
            className="w-full h-full object-cover"
            loading={size === 'full' ? 'eager' : 'lazy'}
          />
        </div>
      )}

      {/* Overlay */}
      {image && overlayOpacity > 0 && (
        <div
          className="absolute inset-0 w-full h-full"
          style={{
            backgroundColor: overlayColor,
            opacity: overlayOpacity / 100,
          }}
        />
      )}

      {/* Content */}
      <div className={`relative z-10 h-full flex flex-col justify-center ${alignmentClass} px-6 md:px-12 lg:px-16`}>
        <div className="max-w-4xl">
          <h1
            className={`font-bold ${textColorClass} ${
              size === 'full' ? 'text-5xl md:text-7xl lg:text-8xl' :
              size === 'large' ? 'text-4xl md:text-6xl lg:text-7xl' :
              size === 'medium' ? 'text-3xl md:text-5xl lg:text-6xl' :
              'text-2xl md:text-4xl lg:text-5xl'
            } mb-4`}
          >
            {title}
          </h1>

          {subtitle && (
            <p
              className={`${textColorClass} ${
                size === 'full' || size === 'large'
                  ? 'text-lg md:text-xl lg:text-2xl'
                  : 'text-base md:text-lg lg:text-xl'
              } mb-8 max-w-2xl ${
                alignment === 'center' ? 'mx-auto' : ''
              }`}
            >
              {subtitle}
            </p>
          )}

          {cta && (
            <div>
              <Link
                to={cta.url}
                className={`inline-block px-8 py-4 font-semibold transition-colors rounded focus:outline-none focus:ring-4 ${
                  textColor === 'white'
                    ? 'bg-white text-black hover:bg-gray-100 focus:ring-white/50'
                    : 'bg-black text-white hover:bg-gray-900 focus:ring-black/50'
                } ${
                  size === 'full' || size === 'large'
                    ? 'text-lg'
                    : 'text-base'
                }`}
              >
                {cta.text}
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
