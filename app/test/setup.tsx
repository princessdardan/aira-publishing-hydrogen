import {expect, afterEach, vi} from 'vitest';
import {cleanup} from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';

// Extend Vitest's expect with React Testing Library matchers
expect.extend(matchers);

// Cleanup after each test
afterEach(() => {
  cleanup();
});

// Mock Shopify Hydrogen Image component
vi.mock('@shopify/hydrogen', () => ({
  Image: ({data, className, loading, sizes}: any) => (
    <img
      src={data.url}
      alt={data.altText || ''}
      className={className}
      data-loading={loading}
      data-sizes={sizes}
      data-testid="shopify-image"
    />
  ),
}));

// Mock React Router Link component
vi.mock('react-router', async () => {
  const actual = await vi.importActual('react-router');
  return {
    ...actual,
    Link: ({to, className, children}: any) => (
      <a href={to} className={className} data-testid="react-router-link">
        {children}
      </a>
    ),
  };
});
