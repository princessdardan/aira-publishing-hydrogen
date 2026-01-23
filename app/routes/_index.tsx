import {Await, useLoaderData} from 'react-router';
import type {Route} from './+types/_index';
import {Suspense} from 'react';
import type {RecommendedProductsQuery} from 'storefrontapi.generated';
import {ProductCard, PRODUCT_CARD_FRAGMENT} from '~/components/ProductCard';
import {HeroSection} from '~/components/HeroSection';
import {CollectionCarousel} from '~/components/CollectionCarousel';
import {FeatureSections} from '~/components/FeatureSections';
import {HERO_SECTION_FRAGMENT} from '~/lib/fragments';
import {extractHeroData} from '~/lib/hero';

export const meta: Route.MetaFunction = () => {
  return [{title: 'Aira Publishing - Complete Solutions for Your Ontario Classroom'}];
};

export async function loader(args: Route.LoaderArgs) {
  // Start fetching non-critical data without blocking time to first byte
  const deferredData = loadDeferredData(args);

  // Await the critical data required to render initial state of the page
  const criticalData = await loadCriticalData(args);

  return {...deferredData, ...criticalData};
}

/**
 * Load data necessary for rendering content above the fold. This is the critical data
 * needed to render the page. If it's unavailable, the whole page should 400 or 500 error.
 */
async function loadCriticalData({context}: Route.LoaderArgs) {
  const [{collections}, {metaobjects: features}, subcollectionsData, shopHeroData] = await Promise.all([
    context.storefront.query(FEATURED_COLLECTION_QUERY),
    context.storefront.query(FEATURE_SECTIONS_QUERY),
    context.storefront.query(SUBCOLLECTIONS_QUERY, {
      variables: {
        handle: 'all', // Replace 'all' with the handle of your parent collection
      },
    }),
    context.storefront.query(SHOP_HERO_QUERY),
    // Add other queries here, so that they are loaded in parallel
  ]);

  // Extract hero data from shop metafield
  const heroData = extractHeroData(shopHeroData?.shop?.heroSection?.reference);

  // Log warning if hero metafield is not configured
  if (!shopHeroData?.shop?.heroSection) {
    console.warn(
      'Hero section metafield not found. Please create a metafield with:',
      '\n- Namespace: custom',
      '\n- Key: hero_section',
      '\n- Type: metaobject_reference (pointing to hero_section metaobject)',
    );
  }

  return {
    featuredCollection: collections.nodes[0],
    features,
    subcollections: subcollectionsData.collection?.metafield?.references?.nodes || [],
    heroData,
  };
}

/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 */
function loadDeferredData({context}: Route.LoaderArgs) {
  const recommendedProducts = context.storefront
    .query(RECOMMENDED_PRODUCTS_QUERY)
    .catch((error: Error) => {
      // Log query errors, but don't throw them so the page can still render
      console.error(error);
      return null;
    });

  return {
    recommendedProducts,
  };
}

export default function Homepage() {
  const data = useLoaderData<typeof loader>();

  // Use dynamic hero data from shop metafield, or fallback to hardcoded values
  const heroData = data.heroData || {
    heading: 'Make Lesson Planning Easy',
    subheading: 'COMPLETE SOLUTIONS FOR YOUR ONTARIO CLASSROOM',
    size: 'large' as const,
    contentAlignment: 'left' as const,
    cta: {
      text: 'SHOP NOW',
      url: '/collections/all',
    },
  };

  return (
    <div className="home">
      <HeroSection
        size={heroData.size}
        title={heroData.heading}
        subtitle={heroData.subheading ?? undefined}
        image={heroData.image ?? undefined}
        alignment={heroData.contentAlignment}
        cta={heroData.cta ?? undefined}
      />
      {data.subcollections && data.subcollections.length > 0 && (
        <CollectionCarousel
          collections={data.subcollections}
          title="Shop by Grade Level"
        />
      )}
      <FeatureSections features={data.features} />
      <RecommendedProducts products={data.recommendedProducts} />
    </div>
  );
}


function RecommendedProducts({
  products,
}: {
  products: Promise<RecommendedProductsQuery | null>;
}) {
  return (
    <div className="recommended-products">
      <h2>Recommended Products</h2>
      <Suspense fallback={<div>Loading...</div>}>
        <Await resolve={products}>
          {(response) => (
            <div className="recommended-products-grid">
              {response
                ? response.products.nodes.map((product, index) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      variant="grid"
                      loading={index < 4 ? 'eager' : 'lazy'}
                    />
                  ))
                : null}
            </div>
          )}
        </Await>
      </Suspense>
      <br />
    </div>
  );
}

const FEATURED_COLLECTION_QUERY = `#graphql
  fragment FeaturedCollection on Collection {
    id
    title
    description
    image {
      id
      url
      altText
      width
      height
    }
    handle
  }
  query FeaturedCollection($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    collections(first: 1, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        ...FeaturedCollection
      }
    }
  }
` as const;

const RECOMMENDED_PRODUCTS_QUERY = `#graphql
  ${PRODUCT_CARD_FRAGMENT}
  query RecommendedProducts ($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    products(first: 4, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        ...ProductCard
      }
    }
  }
` as const;

const FEATURE_SECTIONS_QUERY = `#graphql
  query FeatureSections($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    metaobjects(type: "feature_section", first: 10) {
      nodes {
        id
        fields {
          key
          value
          reference {
            __typename
            ... on MediaImage {
              id
              image {
                url
                altText
                width
                height
              }
            }
          }
        }
      }
    }
  }
` as const;

const SUBCOLLECTIONS_QUERY = `#graphql
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
  query SubcollectionsQuery(
    $handle: String!
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    collection(handle: $handle) {
      id
      handle
      title
      metafield(namespace: "custom", key: "subcollections") {
        id
        type
        references(first: 20) {
          nodes {
            ... on Collection {
              ...CollectionCarousel
            }
          }
        }
      }
    }
  }
` as const;

const SHOP_HERO_QUERY = `#graphql
  ${HERO_SECTION_FRAGMENT}
  query ShopHero($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    shop {
      id
      name
      heroSection: metafield(namespace: "custom", key: "hero_section") {
        id
        type
        value
        reference {
          ...HeroSection
        }
      }
    }
  }
` as const;
