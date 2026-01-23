import {useState, useRef, useEffect} from 'react';
import {NavLink} from 'react-router';
import {ChevronDown} from 'lucide-react';
import type {HeaderQuery} from 'storefrontapi.generated';
import {Portal} from '~/components/Portal';

type MenuItem = NonNullable<HeaderQuery['menu']>['items'][number];

interface MegaMenuProps {
  item: MenuItem;
  primaryDomainUrl: string;
  publicStoreDomain: string;
  onClose?: () => void;
}

export function MegaMenu({
  item,
  primaryDomainUrl,
  publicStoreDomain,
  onClose,
}: MegaMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [position, setPosition] = useState({top: 0, left: 0});
  const menuRef = useRef<HTMLDivElement>(null);
  const portalMenuRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const hasChildren = item.items && item.items.length > 0;
  const isMegaMenu = hasChildren && item.items.length >= 3;

  // Desktop detection
  useEffect(() => {
    const checkDesktop = () => setIsDesktop(window.innerWidth >= 768);
    checkDesktop();
    window.addEventListener('resize', checkDesktop);
    return () => window.removeEventListener('resize', checkDesktop);
  }, []);

  // Calculate position for portaled menu
  useEffect(() => {
    if (isOpen && isDesktop && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setPosition({
        top: rect.bottom + 8,
        left: isMegaMenu ? rect.left + rect.width / 2 : rect.left,
      });
    }
  }, [isOpen, isDesktop, isMegaMenu]);

  // Clean URL helper
  const getCleanUrl = (url: string) => {
    if (
      url.includes('myshopify.com') ||
      url.includes(publicStoreDomain) ||
      url.includes(primaryDomainUrl)
    ) {
      return new URL(url).pathname;
    }
    return url;
  };

  // Handle mouse events for desktop hover
  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 200);
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setIsOpen(!isOpen);
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      const isOutsideWrapper = menuRef.current && !menuRef.current.contains(target);
      const isOutsidePortal = portalMenuRef.current && !portalMenuRef.current.contains(target);

      // Only close if click is outside both the wrapper AND the portaled menu
      if (isOutsideWrapper && isOutsidePortal) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [isOpen]);

  if (!hasChildren) {
    // Simple link without dropdown
    const url = item.url ? getCleanUrl(item.url) : '#';
    return (
      <NavLink
        to={url}
        prefetch="intent"
        onClick={onClose}
        className={({isActive, isPending}) =>
          `header-menu-item${isActive ? ' header-menu-item--active' : ''}${isPending ? ' header-menu-item--pending' : ''}`
        }
      >
        {item.title}
      </NavLink>
    );
  }

  return (
    <div
      className="mega-menu-wrapper"
      ref={menuRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        ref={triggerRef}
        className="mega-menu-trigger"
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        {item.title}
        <ChevronDown
          size={16}
          className={`mega-menu-icon ${isOpen ? 'mega-menu-icon--open' : ''}`}
        />
      </button>

      {isOpen &&
        (isDesktop ? (
          <Portal>
            <div
              ref={portalMenuRef}
              className={isMegaMenu ? 'mega-menu' : 'dropdown-menu'}
              style={{
                position: 'fixed',
                top: `${position.top}px`,
                left: `${position.left}px`,
                ...(isMegaMenu && {transform: 'translateX(-50%)'}),
              }}
            >
              <div
                className={isMegaMenu ? 'mega-menu-grid' : 'dropdown-menu-list'}
              >
                {item.items.map((child) => {
                  const childUrl = child.url ? getCleanUrl(child.url) : '#';
                  const hasGrandchildren =
                    child.items && child.items.length > 0;

                  return (
                    <div key={child.id} className="mega-menu-section">
                      <NavLink
                        to={childUrl}
                        prefetch="intent"
                        onClick={() => {
                          setIsOpen(false);
                          onClose?.();
                        }}
                        className="mega-menu-heading"
                      >
                        {child.title}
                      </NavLink>

                      {hasGrandchildren && (
                        <ul className="mega-menu-sublist">
                          {child.items.map((grandchild) => {
                            const grandchildUrl = grandchild.url
                              ? getCleanUrl(grandchild.url)
                              : '#';
                            return (
                              <li key={grandchild.id}>
                                <NavLink
                                  to={grandchildUrl}
                                  prefetch="intent"
                                  onClick={() => {
                                    setIsOpen(false);
                                    onClose?.();
                                  }}
                                  className="mega-menu-link"
                                >
                                  {grandchild.title}
                                </NavLink>
                              </li>
                            );
                          })}
                        </ul>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </Portal>
        ) : (
          <div className={isMegaMenu ? 'mega-menu' : 'dropdown-menu'}>
            <div
              className={isMegaMenu ? 'mega-menu-grid' : 'dropdown-menu-list'}
            >
              {item.items.map((child) => {
                const childUrl = child.url ? getCleanUrl(child.url) : '#';
                const hasGrandchildren = child.items && child.items.length > 0;

                return (
                  <div key={child.id} className="mega-menu-section">
                    <NavLink
                      to={childUrl}
                      prefetch="intent"
                      onClick={() => {
                        setIsOpen(false);
                        onClose?.();
                      }}
                      className="mega-menu-heading"
                    >
                      {child.title}
                    </NavLink>

                    {hasGrandchildren && (
                      <ul className="mega-menu-sublist">
                        {child.items.map((grandchild) => {
                          const grandchildUrl = grandchild.url
                            ? getCleanUrl(grandchild.url)
                            : '#';
                          return (
                            <li key={grandchild.id}>
                              <NavLink
                                to={grandchildUrl}
                                prefetch="intent"
                                onClick={() => {
                                  setIsOpen(false);
                                  onClose?.();
                                }}
                                className="mega-menu-link"
                              >
                                {grandchild.title}
                              </NavLink>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
    </div>
  );
}
