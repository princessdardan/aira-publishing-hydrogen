import type {Route} from './+types/api.search[.json]';
import {PRODUCT_CARD_FRAGMENT} from '~/components/ProductCard';

export async function loader({request, context}: Route.LoaderArgs) {
  const url = new URL(request.url);
  const searchTerm = url.searchParams.get('q') || '';

  try {
    if (!searchTerm.trim()) {
      // Return suggested products (best sellers) when no search term
      const {products} = await context.storefront.query(SUGGESTIONS_QUERY, {
        variables: {
          first: 8,
        },
      });

      return Response.json({
        suggestions: products.nodes || [],
        results: [],
        term: '',
      });
    }

    // Return search results when there's a search term
    const {products} = await context.storefront.query(SEARCH_PRODUCTS_QUERY, {
      variables: {
        first: 10,
        query: searchTerm,
      },
    });

    return Response.json({
      suggestions: [],
      results: products.nodes || [],
      term: searchTerm,
    });
  } catch (error) {
    console.error('Search API error:', error);
    return Response.json(
      {
        suggestions: [],
        results: [],
        term: searchTerm,
        error: 'Failed to fetch search results',
      },
      {status: 500},
    );
  }
}

const SUGGESTIONS_QUERY = `#graphql
  query SuggestedProducts($first: Int!) {
    products(first: $first, sortKey: BEST_SELLING) {
      nodes {
        ...ProductCard
      }
    }
  }
  ${PRODUCT_CARD_FRAGMENT}
` as const;

const SEARCH_PRODUCTS_QUERY = `#graphql
  query SearchProducts($first: Int!, $query: String!) {
    products(first: $first, query: $query) {
      nodes {
        ...ProductCard
      }
    }
  }
  ${PRODUCT_CARD_FRAGMENT}
` as const;
