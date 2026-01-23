import {useEffect, useState} from 'react';
import {createPortal} from 'react-dom';

interface PortalProps {
  children: React.ReactNode;
  container?: HTMLElement;
}

/**
 * Portal component for rendering content outside DOM hierarchy.
 * Useful for modals, tooltips, and overlays to escape stacking contexts.
 *
 * @param children - Content to render in portal
 * @param container - Target element (defaults to document.body)
 */
export function Portal({children, container}: PortalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // SSR safety: don't render until client-side
  if (!mounted) return null;

  const target = container || document.body;
  return createPortal(children, target);
}
