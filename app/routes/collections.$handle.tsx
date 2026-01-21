import {redirect, useLoaderData} from 'react-router';
import type {Route} from './+types/collections.$handle';
import {getPaginationVariables, Analytics} from '@shopify/hydrogen';
import {PaginatedResourceSection} from '~/components/PaginatedResourceSection';
import {redirectIfHandleIsLocalized} from '~/lib/redirect';
import {ProductCard, PRODUCT_CARD_FRAGMENT} from '~/components/ProductCard';
import {HeroSection} from '~/components/HeroSection';
import {
  CollectionCarousel,
  COLLECTION_CAROUSEL_FRAGMENT,
} from '~/components/CollectionCarousel';
import type {
  ProductCardFragment,
  CollectionCarouselFragment,
} from 'storefrontapi.generated';

export const meta: Route.MetaFunction = ({data}) => {
  return [{title: `Hydrogen | ${data?.collection.title ?? ''} Collection`}];
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
async function loadCriticalData({context, params, request}: Route.LoaderArgs) {
  const {handle} = params;
  const {storefront} = context;
  const paginationVariables = getPaginationVariables(request, {
    pageBy: 8,
  });

  if (!handle) {
    throw redirect('/collections');
  }

  const [{collection}] = await Promise.all([
    storefront.query(COLLECTION_QUERY, {
      variables: {handle, ...paginationVariables},
      // Add other queries here, so that they are loaded in parallel
    }),
  ]);

  if (!collection) {
    throw new Response(`Collection ${handle} not found`, {
      status: 404,
    });
  }

  // The API handle might be localized, so redirect to the localized handle
  redirectIfHandleIsLocalized(request, {handle, data: collection});

  return {
    collection,
    subcollections: collection?.metafield?.references?.nodes || [],
  };
}

/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 */
function loadDeferredData({context}: Route.LoaderArgs) {
  return {};
}

export default function Collection() {
  const {collection, subcollections} = useLoaderData<typeof loader>();

  // Prioritize hero metafield image, fallback to collection image
  const heroImage = collection.heroImage?.reference?.image || collection.image;

  return (
    <div className="collection">
      <HeroSection
        size="medium"
        title={collection.title}
        subtitle={collection.description}
        image={heroImage}
      />
      {subcollections.length > 0 && (
        <CollectionCarousel
          collections={subcollections}
          title={`Explore ${collection.title}`}
        />
      )}
      <div className="py-8">
        <PaginatedResourceSection<ProductCardFragment>
          connection={collection.products}
          resourcesClassName="products-grid"
        >
          {({node: product, index}) => (
            <ProductCard
              key={product.id}
              product={product}
              variant="grid"
              loading={index < 8 ? 'eager' : undefined}
              showVendor={true}
            />
          )}
        </PaginatedResourceSection>
      </div>
      <Analytics.CollectionView
        data={{
          collection: {
            id: collection.id,
            handle: collection.handle,
          },
        }}
      />
    </div>
  );
}

// NOTE: https://shopify.dev/docs/api/storefront/2022-04/objects/collection
const COLLECTION_QUERY = `#graphql
  ${PRODUCT_CARD_FRAGMENT}
  ${COLLECTION_CAROUSEL_FRAGMENT}
  query Collection(
    $handle: String!
    $country: CountryCode
    $language: LanguageCode
    $first: Int
    $last: Int
    $startCursor: String
    $endCursor: String
  ) @inContext(country: $country, language: $language) {
    collection(handle: $handle) {
      id
      handle
      title
      description
      image {
        id
        url
        altText
        width
        height
      }
      heroImage: metafield(namespace: "custom", key: "hero_section_image") {
        reference {
          ... on MediaImage {
            id
            image {
              id
              url
              altText
              width
              height
            }
          }
        }
      }
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
      products(
        first: $first,
        last: $last,
        before: $startCursor,
        after: $endCursor
      ) {
        nodes {
          ...ProductCard
        }
        pageInfo {
          hasPreviousPage
          hasNextPage
          endCursor
          startCursor
        }
      }
    }
  }
` as const;
