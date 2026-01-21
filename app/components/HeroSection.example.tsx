/**
 * HeroSection Component Usage Examples
 *
 * This file demonstrates different ways to use the HeroSection component
 * across various page types in the AIRA Publishing Hydrogen storefront.
 */

import {HeroSection} from './HeroSection';

// ============================================================================
// EXAMPLE 1: Full-screen homepage hero with image and CTA
// ============================================================================
export function HomepageHeroExample() {
  return (
    <HeroSection
      size="full"
      title="Welcome to AIRA Publishing"
      subtitle="Discover curated collections and exceptional products"
      image={{
        id: 'gid://shopify/MediaImage/123',
        url: 'https://cdn.shopify.com/...',
        altText: 'Hero background',
        width: 1920,
        height: 1080,
      }}
      cta={{
        text: 'Shop Now',
        url: '/collections/featured',
      }}
    />
  );
}

// ============================================================================
// EXAMPLE 2: Medium-height collection page hero
// ============================================================================
export function CollectionPageHeroExample() {
  return (
    <HeroSection
      size="medium"
      title="Summer Collection"
      subtitle="Fresh arrivals for the season"
      image={{
        url: 'https://cdn.shopify.com/...',
        altText: 'Summer collection',
      }}
    />
  );
}

// ============================================================================
// EXAMPLE 3: Small banner without image (solid background)
// ============================================================================
export function BannerHeroExample() {
  return (
    <HeroSection
      size="small"
      title="Free Shipping Over $50"
      backgroundColor="#1a1a1a"
      textColor="white"
    />
  );
}

// ============================================================================
// EXAMPLE 4: Large hero with left-aligned content
// ============================================================================
export function LeftAlignedHeroExample() {
  return (
    <HeroSection
      size="large"
      title="New Arrivals"
      subtitle="Explore the latest additions to our catalog"
      alignment="left"
      image={{
        url: 'https://cdn.shopify.com/...',
        altText: 'New arrivals',
      }}
      cta={{
        text: 'Browse Collection',
        url: '/collections/new-arrivals',
      }}
    />
  );
}

// ============================================================================
// EXAMPLE 5: Right-aligned hero with dark text on light background
// ============================================================================
export function RightAlignedLightHeroExample() {
  return (
    <HeroSection
      size="medium"
      title="Limited Edition"
      subtitle="Exclusive items available now"
      alignment="right"
      textColor="black"
      image={{
        url: 'https://cdn.shopify.com/...',
        altText: 'Limited edition products',
      }}
    />
  );
}

// ============================================================================
// EXAMPLE 6: Simple text-only hero (no CTA, no image)
// ============================================================================
export function SimpleTextHeroExample() {
  return (
    <HeroSection
      size="small"
      title="About AIRA Publishing"
      subtitle="Curating excellence since 2020"
      backgroundColor="#2d3748"
      textColor="white"
      alignment="center"
    />
  );
}

// ============================================================================
// EXAMPLE 7: Product category hero with custom styling
// ============================================================================
export function CategoryHeroExample() {
  return (
    <HeroSection
      size="medium"
      title="Books & Literature"
      subtitle="Immerse yourself in stories that inspire"
      image={{
        url: 'https://cdn.shopify.com/...',
        altText: 'Books category',
      }}
      cta={{
        text: 'Explore Books',
        url: '/collections/books',
      }}
      className="mb-12"
    />
  );
}

// ============================================================================
// SIZE COMPARISON GUIDE
// ============================================================================
/**
 * Size Guidelines:
 *
 * - full (100vh):  Homepage main hero, campaign landing pages
 * - large (75vh):  Feature sections, seasonal promotions
 * - medium (50vh): Collection headers, category pages, blog headers
 * - small (33vh):  Page banners, announcements, simple headers
 */

// ============================================================================
// RESPONSIVE BEHAVIOR
// ============================================================================
/**
 * The HeroSection component is fully responsive:
 *
 * Typography:
 * - Title scales from 2xl (mobile) to 8xl (desktop) based on hero size
 * - Subtitle scales from base to 2xl
 * - Padding adapts: 6 (mobile) → 12 (tablet) → 16 (desktop)
 *
 * Images:
 * - Hydrogen Image component handles responsive srcsets automatically
 * - object-cover ensures proper aspect ratio on all screens
 * - Lazy loading on non-full heroes for performance
 */

// ============================================================================
// ACCESSIBILITY FEATURES
// ============================================================================
/**
 * Built-in accessibility:
 *
 * - Semantic HTML (h1 for title)
 * - Proper heading hierarchy
 * - Alt text support for images
 * - High contrast text options
 * - Keyboard-navigable CTAs (Link component)
 */
