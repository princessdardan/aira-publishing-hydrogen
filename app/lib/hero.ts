/**
 * Hero Section Metaobject Utilities
 *
 * Helper functions for extracting and transforming hero_section metaobject data
 * from Shopify Storefront API responses into HeroSection component props.
 *
 * Follows the pattern established in FeatureSections.tsx
 */

import type {HeroSize} from '~/components/HeroSection';

/**
 * Image data structure matching HeroSection component image prop
 */
export interface HeroImage {
  id?: string | null;
  url: string;
  altText?: string | null;
  width?: number | null;
  height?: number | null;
}

/**
 * Complete hero section configuration data
 */
export interface HeroData {
  heading: string;
  subheading?: string | null;
  image?: HeroImage | null;
  size?: HeroSize;
  contentAlignment?: 'left' | 'center' | 'right';
  cta?: {
    text: string;
    url: string;
  } | null;
}

/**
 * Metaobject field structure from Shopify API
 */
export interface MetaobjectField {
  key: string;
  value?: string | null;
  reference?: {
    __typename?: string;
    id?: string;
    image?: {
      id?: string;
      url: string;
      altText?: string | null;
      width?: number | null;
      height?: number | null;
    };
  };
}

/**
 * Extract a text field value from metaobject fields array
 *
 * @param fields - Array of metaobject fields
 * @param key - Field key to extract
 * @returns Field value or null if not found
 */
export function getFieldValue(
  fields: Array<MetaobjectField>,
  key: string,
): string | null {
  const field = fields.find((f) => f.key === key);
  return field?.value ?? null;
}

/**
 * Extract a MediaImage reference from metaobject fields array
 *
 * @param fields - Array of metaobject fields
 * @param key - Field key to extract (should reference a MediaImage)
 * @returns Image data or null if not found or not a MediaImage
 */
export function getImageReference(
  fields: Array<MetaobjectField>,
  key: string,
): HeroImage | null {
  const field = fields.find((f) => f.key === key);

  // Validate that reference exists and is a MediaImage type
  if (!field?.reference || field.reference.__typename !== 'MediaImage') {
    return null;
  }

  const image = field.reference.image;

  // Ensure we have at minimum a URL
  if (!image?.url) {
    return null;
  }

  return {
    id: image.id ?? null,
    url: image.url,
    altText: image.altText ?? null,
    width: image.width ?? null,
    height: image.height ?? null,
  };
}

/**
 * Validate and normalize size value to HeroSize type
 *
 * @param value - Raw size value from metaobject
 * @returns Valid HeroSize or default 'medium'
 */
function normalizeSize(value: string | null | undefined): HeroSize {
  const validSizes: HeroSize[] = ['full', 'large', 'medium', 'small'];
  if (value && validSizes.includes(value as HeroSize)) {
    return value as HeroSize;
  }
  return 'medium'; // Default size
}

/**
 * Validate and normalize alignment value
 *
 * @param value - Raw alignment value from metaobject
 * @returns Valid alignment or default 'center'
 */
function normalizeAlignment(
  value: string | null | undefined,
): 'left' | 'center' | 'right' {
  const validAlignments = ['left', 'center', 'right'] as const;
  if (value && validAlignments.includes(value as any)) {
    return value as 'left' | 'center' | 'right';
  }
  return 'center'; // Default alignment
}

/**
 * Extract complete hero section data from a metaobject
 *
 * Transforms Shopify metaobject field structure into typed HeroData
 * suitable for passing to HeroSection component.
 *
 * @param metaobject - Metaobject from Shopify API (can be null/undefined)
 * @returns Extracted hero data or null if metaobject invalid
 *
 * @example
 * ```typescript
 * const heroData = extractHeroData(shop?.heroSection?.reference);
 * if (heroData) {
 *   return <HeroSection
 *     title={heroData.heading}
 *     subtitle={heroData.subheading}
 *     image={heroData.image}
 *     size={heroData.size}
 *     alignment={heroData.contentAlignment}
 *     cta={heroData.cta}
 *   />;
 * }
 * ```
 */
export function extractHeroData(metaobject: any): HeroData | null {
  // Handle null/undefined metaobject
  if (!metaobject?.fields || !Array.isArray(metaobject.fields)) {
    console.warn('Hero metaobject is missing or has no fields:', metaobject);
    return null;
  }

  const fields = metaobject.fields as Array<MetaobjectField>;

  // Extract required heading field
  const heading = getFieldValue(fields, 'heading');
  if (!heading) {
    return null; // Heading is required
  }

  // Extract optional fields
  const subheading = getFieldValue(fields, 'subheading');
  const image = getImageReference(fields, 'image');
  const sizeRaw = getFieldValue(fields, 'size');
  const alignmentRaw = getFieldValue(fields, 'content_alignment');
  const ctaLabel = getFieldValue(fields, 'cta_label');
  const ctaLink = getFieldValue(fields, 'cta_link');

  // Build CTA object if both label and link are present
  let cta: {text: string; url: string} | null = null;
  if (ctaLabel && ctaLink) {
    cta = {
      text: ctaLabel,
      url: ctaLink,
    };
  }

  return {
    heading,
    subheading,
    image,
    size: normalizeSize(sizeRaw),
    contentAlignment: normalizeAlignment(alignmentRaw),
    cta,
  };
}
