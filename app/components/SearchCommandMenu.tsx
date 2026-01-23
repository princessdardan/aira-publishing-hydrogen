import {useEffect, useState, useRef, useCallback} from 'react';
import {useFetcher, useNavigate} from 'react-router';
import {Search, Loader} from 'lucide-react';
import {Money} from '@shopify/hydrogen';
import type {MoneyV2} from '@shopify/hydrogen/storefront-api-types';
import {Portal} from '~/components/Portal';

interface SearchResult {
  id: string;
  handle: string;
  title: string;
  featuredImage?: {
    url: string;
    altText?: string;
  };
  priceRange: {
    minVariantPrice: MoneyV2;
  };
  compareAtPriceRange: {
    minVariantPrice: MoneyV2;
  };
}

interface SearchCommandMenuProps {
  open: boolean;
  onClose: () => void;
  initialQuery?: string;
}

export function SearchCommandMenu({
  open,
  onClose,
  initialQuery = '',
}: SearchCommandMenuProps) {
  const [query, setQuery] = useState(initialQuery);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const fetcher = useFetcher<{
    suggestions: SearchResult[];
    results: SearchResult[];
    term: string;
  }>();
  const navigate = useNavigate();
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch initial suggestions when menu opens
  useEffect(() => {
    if (open && !query) {
      void fetcher.load('/api/search.json');
    }
  }, [open, query, fetcher]);

  // Focus input when menu opens
  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  // Debounced search
  const performSearch = useCallback(
    (searchQuery: string) => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }

      debounceRef.current = setTimeout(() => {
        void fetcher.load(`/api/search.json?q=${encodeURIComponent(searchQuery)}`);
      }, 300);
    },
    [fetcher],
  );

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setSelectedIndex(0);

    if (value.trim()) {
      performSearch(value);
    } else {
      // Fetch suggestions if query is empty
      void fetcher.load('/api/search.json');
    }
  };

  // Get current results to display
  const displayResults = query.trim()
    ? fetcher.data?.results || []
    : fetcher.data?.suggestions || [];

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) =>
        prev < displayResults.length - 1 ? prev + 1 : prev,
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (displayResults.length > 0 && selectedIndex >= 0) {
        // Navigate to selected product
        void navigate(`/products/${displayResults[selectedIndex].handle}`);
        onClose();
      } else if (query.trim()) {
        // Navigate to search results page
        void navigate(`/search?q=${encodeURIComponent(query)}`);
        onClose();
      }
    }
  };

  // Click outside to close
  const handleBackdropInteraction = (
    e: React.MouseEvent | React.KeyboardEvent,
  ) => {
    if ('key' in e) {
      // Keyboard event
      if (e.key === 'Escape') {
        onClose();
      }
    } else {
      // Mouse event
      if (e.target === e.currentTarget) {
        onClose();
      }
    }
  };

  // Navigate to product
  const handleProductClick = (handle: string) => {
    void navigate(`/products/${handle}`);
    onClose();
  };

  if (!open) return null;

  const isLoading = fetcher.state === 'loading';

  return (
    <Portal>
      <div
        className="search-command-backdrop"
        onClick={handleBackdropInteraction}
        onKeyDown={handleBackdropInteraction}
        role="button"
        tabIndex={-1}
        aria-label="Close search"
      >
        <div
          className="search-command-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Search"
        >
          <div className="search-command-input-wrapper">
            <Search size={20} className="search-command-icon" />
            <input
              ref={inputRef}
              type="search"
              placeholder="Search products..."
              value={query}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              className="search-command-input"
              autoComplete="off"
            />
            {isLoading && (
              <Loader size={20} className="search-command-loader" />
            )}
          </div>

          <div className="search-command-results">
            {displayResults.length > 0 ? (
              <>
                <div className="search-command-results-header">
                  {query.trim() ? 'Search Results' : 'Suggested Products'}
                </div>
                <div className="search-command-results-grid">
                  {displayResults.map((product, index) => {
                    const isOnSale =
                      product.compareAtPriceRange.minVariantPrice.amount >
                      product.priceRange.minVariantPrice.amount;

                    return (
                      <button
                        key={product.id}
                        className={`search-command-product ${index === selectedIndex ? 'search-command-product--selected' : ''}`}
                        onClick={() => handleProductClick(product.handle)}
                        onMouseEnter={() => setSelectedIndex(index)}
                      >
                        {product.featuredImage && (
                          <img
                            src={product.featuredImage.url}
                            alt={product.featuredImage.altText || product.title}
                            className="search-command-product-image"
                            loading="lazy"
                          />
                        )}
                        <div className="search-command-product-info">
                          <div className="search-command-product-title">
                            {product.title}
                          </div>
                          <div className="search-command-product-price">
                            <Money data={product.priceRange.minVariantPrice} />
                            {isOnSale && (
                              <span className="search-command-product-compare-price">
                                <Money
                                  data={
                                    product.compareAtPriceRange.minVariantPrice
                                  }
                                />
                              </span>
                            )}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </>
            ) : (
              <div className="search-command-empty">
                {isLoading ? (
                  <div className="search-command-loading">Searching...</div>
                ) : query.trim() ? (
                  <div>
                    <p>No products found for {'"'}{query}{'"'}</p>
                    <p className="search-command-empty-hint">
                      Try different keywords or browse our collections
                    </p>
                  </div>
                ) : (
                  <div className="search-command-loading">
                    Loading suggestions...
                  </div>
                )}
              </div>
            )}
          </div>

          {query.trim() && displayResults.length > 0 && (
            <div className="search-command-footer">
              Press <kbd>Enter</kbd> to see all results for {'"'}{query}{'"'}
            </div>
          )}
        </div>
      </div>
    </Portal>
  );
}
