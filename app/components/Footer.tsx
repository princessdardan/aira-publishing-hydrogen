import {Suspense, useState} from 'react';
import {Await, NavLink} from 'react-router';
import type {FooterQuery, HeaderQuery} from 'storefrontapi.generated';

interface FooterProps {
  footer: Promise<FooterQuery | null>;
  header: HeaderQuery;
  publicStoreDomain: string;
}

export function Footer({
  footer: footerPromise,
  header,
  publicStoreDomain,
}: FooterProps) {
  return (
    <Suspense>
      <Await resolve={footerPromise}>
        {(footer) => (
          <footer className="footer">
            <NewsletterSignup />
            {footer?.menu && header.shop.primaryDomain?.url && (
              <FooterMenu
                menu={footer.menu}
                primaryDomainUrl={header.shop.primaryDomain.url}
                publicStoreDomain={publicStoreDomain}
              />
            )}
            <FooterBottom />
          </footer>
        )}
      </Await>
    </Suspense>
  );
}

function NewsletterSignup() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    // Async operation without making the handler async
    void (async () => {
      try {
        // TODO: Replace with actual API call
        // Simulating API call for now
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Simulate successful signup
        setStatus('success');
        setEmail('');

        // Reset success message after 5 seconds
        setTimeout(() => {
          setStatus('idle');
        }, 5000);
      } catch (error) {
        setStatus('error');
        setErrorMessage('Failed to subscribe. Please try again.');
      }
    })();
  };

  return (
    <div className="footer-newsletter">
      <div className="footer-newsletter-container">
        <p className="footer-newsletter-text">
          Subscribe to our mailing list to hear about our newest solutions for
          your classroom!
        </p>
        <form onSubmit={handleSubmit} className="footer-newsletter-form">
          <label htmlFor="newsletter-email" className="footer-newsletter-label">
            Email
          </label>
          <div className="footer-newsletter-input-group">
            <input
              id="newsletter-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              className={`footer-newsletter-input ${status === 'error' ? 'footer-newsletter-input--error' : ''} ${status === 'success' ? 'footer-newsletter-input--success' : ''}`}
              required
              disabled={status === 'loading' || status === 'success'}
            />
            <button
              type="submit"
              className={`footer-newsletter-button ${status === 'loading' ? 'footer-newsletter-button--loading' : ''}`}
              disabled={status === 'loading' || status === 'success'}
            >
              {status === 'loading' ? (
                <>
                  <span className="footer-newsletter-spinner" aria-hidden="true"></span>
                  <span>Subscribing...</span>
                </>
              ) : status === 'success' ? (
                'Subscribed!'
              ) : (
                'Sign up'
              )}
            </button>
          </div>
          {status === 'success' && (
            <p className="footer-newsletter-message footer-newsletter-message--success">
              Thank you for subscribing! Check your email for confirmation.
            </p>
          )}
          {status === 'error' && (
            <p className="footer-newsletter-message footer-newsletter-message--error">
              {errorMessage}
            </p>
          )}
          {status === 'idle' && (
            <p className="footer-newsletter-privacy">
              By subscribing, you agree to our <NavLink to="/policies/privacy-policy" className="footer-newsletter-privacy-link">Privacy Policy</NavLink>
            </p>
          )}
        </form>
      </div>
    </div>
  );
}

function FooterMenu({
  menu,
  primaryDomainUrl,
  publicStoreDomain,
}: {
  menu: FooterQuery['menu'];
  primaryDomainUrl: FooterProps['header']['shop']['primaryDomain']['url'];
  publicStoreDomain: string;
}) {
  const menuItems = [
    {id: '1', title: 'About Us', url: '/pages/about-us'},
    {id: '2', title: 'Contact Us', url: '/pages/contact-us'},
  ];

  return (
    <nav className="footer-links" role="navigation">
      <div className="footer-links-container">
        {menuItems.map((item) => (
          <NavLink
            key={item.id}
            to={item.url}
            className={({isActive, isPending}) =>
              `footer-link${isActive ? ' footer-link--active' : ''}${isPending ? ' footer-link--pending' : ''}`
            }
            prefetch="intent"
          >
            {item.title}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}

function FooterBottom() {
  return (
    <div className="footer-bottom">
      <div className="footer-bottom-container">
        <p className="footer-copyright">
          © {new Date().getFullYear()}{' '}
          <NavLink to="/" className="footer-brand-link">
            Aira Publishing
          </NavLink>
        </p>
      </div>
    </div>
  );
}

const FALLBACK_FOOTER_MENU = {
  id: 'gid://shopify/Menu/199655620664',
  items: [
    {
      id: 'gid://shopify/MenuItem/461633060920',
      resourceId: 'gid://shopify/ShopPolicy/23358046264',
      tags: [],
      title: 'Privacy Policy',
      type: 'SHOP_POLICY',
      url: '/policies/privacy-policy',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461633093688',
      resourceId: 'gid://shopify/ShopPolicy/23358013496',
      tags: [],
      title: 'Refund Policy',
      type: 'SHOP_POLICY',
      url: '/policies/refund-policy',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461633126456',
      resourceId: 'gid://shopify/ShopPolicy/23358111800',
      tags: [],
      title: 'Shipping Policy',
      type: 'SHOP_POLICY',
      url: '/policies/shipping-policy',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461633159224',
      resourceId: 'gid://shopify/ShopPolicy/23358079032',
      tags: [],
      title: 'Terms of Service',
      type: 'SHOP_POLICY',
      url: '/policies/terms-of-service',
      items: [],
    },
  ],
};
