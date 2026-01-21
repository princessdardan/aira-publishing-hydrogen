import {Money} from '@shopify/hydrogen';
import type {MoneyV2} from '@shopify/hydrogen/storefront-api-types';

export function ProductPrice({
  price,
  compareAtPrice,
  size = 'medium',
  showSavings = false,
}: {
  price?: MoneyV2;
  compareAtPrice?: MoneyV2 | null;
  size?: 'small' | 'medium' | 'large';
  showSavings?: boolean;
}) {
  const calculateSavings = () => {
    if (!price || !compareAtPrice) return null;
    const savings = parseFloat(compareAtPrice.amount) - parseFloat(price.amount);
    const percentage = Math.round((savings / parseFloat(compareAtPrice.amount)) * 100);
    return {amount: savings, percentage};
  };

  const savings = compareAtPrice && showSavings ? calculateSavings() : null;

  return (
    <div className={`product-price product-price--${size}`}>
      {compareAtPrice ? (
        <div className="product-price-on-sale">
          <div className="product-price-wrapper">
            {price ? (
              <span className="product-price-sale">
                <Money data={price} />
              </span>
            ) : null}
            <s className="product-price-compare">
              <Money data={compareAtPrice} />
            </s>
          </div>
          {savings && savings.percentage > 0 ? (
            <span className="product-price-badge">
              Save {savings.percentage}%
            </span>
          ) : null}
        </div>
      ) : price ? (
        <Money data={price} />
      ) : (
        <span>&nbsp;</span>
      )}
    </div>
  );
}
