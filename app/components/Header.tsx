import {Suspense, useState} from 'react';
import {Await, NavLink, useAsyncValue} from 'react-router';
import {
  type CartViewPayload,
  useAnalytics,
  useOptimisticCart,
} from '@shopify/hydrogen';
import type {HeaderQuery, CartApiQueryFragment} from 'storefrontapi.generated';
import {useAside} from '~/components/Aside';
import {Menu, Search, ShoppingCart, User} from 'lucide-react';
import {MegaMenu} from '~/components/MegaMenu';
import {SearchCommandMenu} from '~/components/SearchCommandMenu';

interface HeaderProps {
  header: HeaderQuery;
  cart: Promise<CartApiQueryFragment | null>;
  isLoggedIn: Promise<boolean>;
  publicStoreDomain: string;
}

type Viewport = 'desktop' | 'mobile';

export function Header({
  header,
  isLoggedIn,
  cart,
  publicStoreDomain,
}: HeaderProps) {
  const {shop, menu} = header;
  return (
    <header className="header">
      <div className="header-logo">
        <NavLink prefetch="intent" to="/" end>
          <div className="logo-container">
            <div className="logo-initials">AP</div>
            <span className="logo-text">Aira Publishing</span>
          </div>
        </NavLink>
      </div>
      <HeaderMenu
        menu={menu}
        viewport="desktop"
        primaryDomainUrl={header.shop.primaryDomain.url}
        publicStoreDomain={publicStoreDomain}
      />
      <HeaderCtas isLoggedIn={isLoggedIn} cart={cart} />
    </header>
  );
}

export function HeaderMenu({
  menu,
  primaryDomainUrl,
  viewport,
  publicStoreDomain,
}: {
  menu: HeaderProps['header']['menu'];
  primaryDomainUrl: HeaderProps['header']['shop']['primaryDomain']['url'];
  viewport: Viewport;
  publicStoreDomain: HeaderProps['publicStoreDomain'];
}) {
  const className = `header-menu-${viewport}`;
  const {close} = useAside();

  return (
    <nav className={className} role="navigation">
      {viewport === 'mobile' && (
        <NavLink
          end
          onClick={close}
          prefetch="intent"
          className={({isActive, isPending}) =>
            `header-menu-item${isActive ? ' header-menu-item--active' : ''}${isPending ? ' header-menu-item--pending' : ''}`
          }
          to="/"
        >
          Home
        </NavLink>
      )}
      {(menu || FALLBACK_HEADER_MENU).items.map((item) => (
        <MegaMenu
          key={item.id}
          item={item}
          primaryDomainUrl={primaryDomainUrl}
          publicStoreDomain={publicStoreDomain}
          onClose={viewport === 'mobile' ? close : undefined}
        />
      ))}
    </nav>
  );
}

function HeaderCtas({
  isLoggedIn,
  cart,
}: Pick<HeaderProps, 'isLoggedIn' | 'cart'>) {
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <>
      <nav className="header-ctas" role="navigation">
        <HeaderMenuMobileToggle />
        <NavLink
          prefetch="intent"
          to="/account"
          className={({isActive, isPending}) =>
            `${isActive ? 'active' : ''}${isPending ? ' pending' : ''}`
          }
          aria-label="Account"
        >
          <Suspense fallback={<User size={20} />}>
            <Await resolve={isLoggedIn} errorElement={<User size={20} />}>
              {(isLoggedIn) => <User size={20} />}
            </Await>
          </Suspense>
        </NavLink>
        <SearchToggle onOpen={() => setSearchOpen(true)} />
        <CartToggle cart={cart} />
      </nav>
      <SearchCommandMenu
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
      />
    </>
  );
}

function HeaderMenuMobileToggle() {
  const {open} = useAside();
  return (
    <button
      className="header-menu-mobile-toggle reset"
      onClick={() => open('mobile')}
      aria-label="Open menu"
    >
      <Menu size={24} />
    </button>
  );
}

function SearchToggle({onOpen}: {onOpen: () => void}) {
  return (
    <button className="reset" onClick={onOpen} aria-label="Search">
      <Search size={20} />
    </button>
  );
}

function CartBadge({count}: {count: number | null}) {
  const {open} = useAside();
  const {publish, shop, cart, prevCart} = useAnalytics();

  return (
    <a
      href="/cart"
      onClick={(e) => {
        e.preventDefault();
        open('cart');
        publish('cart_viewed', {
          cart,
          prevCart,
          shop,
          url: window.location.href || '',
        } as CartViewPayload);
      }}
      className="cart-toggle"
      aria-label={`Cart with ${count ?? 0} items`}
    >
      <ShoppingCart size={20} />
      {count !== null && count > 0 && <span className="cart-badge">{count}</span>}
    </a>
  );
}

function CartToggle({cart}: Pick<HeaderProps, 'cart'>) {
  return (
    <Suspense fallback={<CartBadge count={null} />}>
      <Await resolve={cart}>
        <CartBanner />
      </Await>
    </Suspense>
  );
}

function CartBanner() {
  const originalCart = useAsyncValue() as CartApiQueryFragment | null;
  const cart = useOptimisticCart(originalCart);
  return <CartBadge count={cart?.totalQuantity ?? 0} />;
}

const FALLBACK_HEADER_MENU = {
  id: 'gid://shopify/Menu/199655587896',
  items: [
    {
      id: 'gid://shopify/MenuItem/461609500728',
      resourceId: null,
      tags: [],
      title: 'Collections',
      type: 'HTTP' as const,
      url: '/collections',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461609533496',
      resourceId: null,
      tags: [],
      title: 'Blog',
      type: 'HTTP' as const,
      url: '/blogs/journal',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461609566264',
      resourceId: null,
      tags: [],
      title: 'Policies',
      type: 'HTTP' as const,
      url: '/policies',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461609599032',
      resourceId: 'gid://shopify/Page/92591030328',
      tags: [],
      title: 'About',
      type: 'PAGE' as const,
      url: '/pages/about',
      items: [],
    },
  ],
};
