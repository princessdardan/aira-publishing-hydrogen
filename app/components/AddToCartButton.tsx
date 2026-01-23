import {type FetcherWithComponents} from 'react-router';
import {CartForm, type OptimisticCartLineInput} from '@shopify/hydrogen';

export function AddToCartButton({
  analytics,
  children,
  disabled,
  lines,
  onClick,
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
}: {
  analytics?: unknown;
  children: React.ReactNode;
  disabled?: boolean;
  lines: Array<OptimisticCartLineInput>;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large' | 'compact';
  fullWidth?: boolean;
}) {
  return (
    <CartForm route="/cart" inputs={{lines}} action={CartForm.ACTIONS.LinesAdd}>
      {(fetcher: FetcherWithComponents<any>) => {
        const isLoading = fetcher.state !== 'idle';
        const buttonClasses = [
          'add-to-cart-button',
          `add-to-cart-button--${variant}`,
          `add-to-cart-button--${size}`,
          fullWidth ? 'add-to-cart-button--full-width' : '',
          isLoading ? 'add-to-cart-button--loading' : '',
        ]
          .filter(Boolean)
          .join(' ');

        return (
          <>
            <input
              name="analytics"
              type="hidden"
              value={JSON.stringify(analytics)}
            />
            <button
              type="submit"
              onClick={onClick}
              disabled={disabled ?? isLoading}
              className={buttonClasses}
            >
              {isLoading ? (
                <>
                  <span className="add-to-cart-button-spinner" aria-hidden="true"></span>
                  <span>Adding...</span>
                </>
              ) : (
                children
              )}
            </button>
          </>
        );
      }}
    </CartForm>
  );
}
