import {describe, it, expect} from 'vitest';
import {render, screen} from '@testing-library/react';
import {HeroSection, type HeroSectionProps} from '../HeroSection';

describe('HeroSection', () => {
  describe('Core Rendering', () => {
    it('renders title in h1 element', () => {
      render(<HeroSection title="Test Hero" />);
      const heading = screen.getByRole('heading', {level: 1});
      expect(heading).toBeInTheDocument();
      expect(heading).toHaveTextContent('Test Hero');
    });

    it('renders semantic section element', () => {
      const {container} = render(<HeroSection title="Test" />);
      const section = container.querySelector('section');
      expect(section).toBeInTheDocument();
      expect(section).toHaveClass('hero-section');
    });

    it('renders subtitle when provided', () => {
      render(<HeroSection title="Test" subtitle="Test subtitle" />);
      const subtitle = screen.getByText('Test subtitle');
      expect(subtitle).toBeInTheDocument();
      expect(subtitle.tagName).toBe('P');
    });

    it('does not render subtitle when not provided', () => {
      const {container} = render(<HeroSection title="Test" />);
      const paragraphs = container.querySelectorAll('p');
      expect(paragraphs).toHaveLength(0);
    });

    it('renders CTA button when provided', () => {
      render(
        <HeroSection
          title="Test"
          cta={{text: 'Click me', url: '/test'}}
        />,
      );
      const link = screen.getByTestId('react-router-link');
      expect(link).toBeInTheDocument();
      expect(link).toHaveTextContent('Click me');
      expect(link).toHaveAttribute('href', '/test');
    });

    it('does not render CTA when not provided', () => {
      render(<HeroSection title="Test" />);
      const link = screen.queryByTestId('react-router-link');
      expect(link).not.toBeInTheDocument();
    });

    it('applies custom className to section', () => {
      const {container} = render(
        <HeroSection title="Test" className="custom-class" />,
      );
      const section = container.querySelector('section');
      expect(section).toHaveClass('custom-class');
      expect(section).toHaveClass('hero-section');
    });
  });

  describe('Size Variants', () => {
    it('renders full size with h-screen class', () => {
      const {container} = render(<HeroSection title="Test" size="full" />);
      const section = container.querySelector('section');
      expect(section).toHaveClass('h-screen');
    });

    it('renders large size with h-[75vh] class', () => {
      const {container} = render(<HeroSection title="Test" size="large" />);
      const section = container.querySelector('section');
      expect(section).toHaveClass('h-[75vh]');
    });

    it('renders medium size with h-[50vh] class', () => {
      const {container} = render(<HeroSection title="Test" size="medium" />);
      const section = container.querySelector('section');
      expect(section).toHaveClass('h-[50vh]');
    });

    it('renders small size with h-[33vh] class', () => {
      const {container} = render(<HeroSection title="Test" size="small" />);
      const section = container.querySelector('section');
      expect(section).toHaveClass('h-[33vh]');
    });

    it('defaults to medium size when size not provided', () => {
      const {container} = render(<HeroSection title="Test" />);
      const section = container.querySelector('section');
      expect(section).toHaveClass('h-[50vh]');
    });

    it('applies size-specific title font classes for full size', () => {
      render(<HeroSection title="Test" size="full" />);
      const heading = screen.getByRole('heading', {level: 1});
      expect(heading).toHaveClass('text-5xl');
      expect(heading).toHaveClass('md:text-7xl');
      expect(heading).toHaveClass('lg:text-8xl');
    });

    it('applies size-specific title font classes for large size', () => {
      render(<HeroSection title="Test" size="large" />);
      const heading = screen.getByRole('heading', {level: 1});
      expect(heading).toHaveClass('text-4xl');
      expect(heading).toHaveClass('md:text-6xl');
      expect(heading).toHaveClass('lg:text-7xl');
    });

    it('applies size-specific title font classes for medium size', () => {
      render(<HeroSection title="Test" size="medium" />);
      const heading = screen.getByRole('heading', {level: 1});
      expect(heading).toHaveClass('text-3xl');
      expect(heading).toHaveClass('md:text-5xl');
      expect(heading).toHaveClass('lg:text-6xl');
    });

    it('applies size-specific title font classes for small size', () => {
      render(<HeroSection title="Test" size="small" />);
      const heading = screen.getByRole('heading', {level: 1});
      expect(heading).toHaveClass('text-2xl');
      expect(heading).toHaveClass('md:text-4xl');
      expect(heading).toHaveClass('lg:text-5xl');
    });

    it('applies larger subtitle font for full and large sizes', () => {
      const {rerender} = render(
        <HeroSection title="Test" size="full" subtitle="Subtitle" />,
      );
      let subtitle = screen.getByText('Subtitle');
      expect(subtitle).toHaveClass('text-lg');
      expect(subtitle).toHaveClass('md:text-xl');
      expect(subtitle).toHaveClass('lg:text-2xl');

      rerender(<HeroSection title="Test" size="large" subtitle="Subtitle" />);
      subtitle = screen.getByText('Subtitle');
      expect(subtitle).toHaveClass('text-lg');
      expect(subtitle).toHaveClass('md:text-xl');
      expect(subtitle).toHaveClass('lg:text-2xl');
    });

    it('applies smaller subtitle font for medium and small sizes', () => {
      const {rerender} = render(
        <HeroSection title="Test" size="medium" subtitle="Subtitle" />,
      );
      let subtitle = screen.getByText('Subtitle');
      expect(subtitle).toHaveClass('text-base');
      expect(subtitle).toHaveClass('md:text-lg');
      expect(subtitle).toHaveClass('lg:text-xl');

      rerender(<HeroSection title="Test" size="small" subtitle="Subtitle" />);
      subtitle = screen.getByText('Subtitle');
      expect(subtitle).toHaveClass('text-base');
      expect(subtitle).toHaveClass('md:text-lg');
      expect(subtitle).toHaveClass('lg:text-xl');
    });

    it('applies larger CTA font for full and large sizes', () => {
      const {rerender} = render(
        <HeroSection title="Test" size="full" cta={{text: 'CTA', url: '/'}} />,
      );
      let link = screen.getByTestId('react-router-link');
      expect(link).toHaveClass('text-lg');

      rerender(
        <HeroSection
          title="Test"
          size="large"
          cta={{text: 'CTA', url: '/'}}
        />,
      );
      link = screen.getByTestId('react-router-link');
      expect(link).toHaveClass('text-lg');
    });

    it('applies base CTA font for medium and small sizes', () => {
      const {rerender} = render(
        <HeroSection
          title="Test"
          size="medium"
          cta={{text: 'CTA', url: '/'}}
        />,
      );
      let link = screen.getByTestId('react-router-link');
      expect(link).toHaveClass('text-base');

      rerender(
        <HeroSection title="Test" size="small" cta={{text: 'CTA', url: '/'}} />,
      );
      link = screen.getByTestId('react-router-link');
      expect(link).toHaveClass('text-base');
    });
  });

  describe('Image Handling', () => {
    const mockImage = {
      url: 'https://example.com/image.jpg',
      altText: 'Test image',
      width: 1200,
      height: 800,
    };

    it('renders Shopify Image component when image provided', () => {
      render(<HeroSection title="Test" image={mockImage} />);
      const image = screen.getByTestId('shopify-image');
      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute('src', mockImage.url);
      expect(image).toHaveAttribute('alt', mockImage.altText);
    });

    it('does not render image when image prop not provided', () => {
      render(<HeroSection title="Test" />);
      const image = screen.queryByTestId('shopify-image');
      expect(image).not.toBeInTheDocument();
    });

    it('handles null image prop', () => {
      render(<HeroSection title="Test" image={null} />);
      const image = screen.queryByTestId('shopify-image');
      expect(image).not.toBeInTheDocument();
    });

    it('renders image with only required url property', () => {
      const minimalImage = {url: 'https://example.com/minimal.jpg'};
      render(<HeroSection title="Test" image={minimalImage} />);
      const image = screen.getByTestId('shopify-image');
      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute('src', minimalImage.url);
    });

    it('uses eager loading for full size heroes', () => {
      render(<HeroSection title="Test" size="full" image={mockImage} />);
      const image = screen.getByTestId('shopify-image');
      expect(image).toHaveAttribute('data-loading', 'eager');
    });

    it('uses lazy loading for non-full size heroes', () => {
      const sizes: Array<'large' | 'medium' | 'small'> = [
        'large',
        'medium',
        'small',
      ];
      sizes.forEach((size) => {
        const {unmount} = render(
          <HeroSection title="Test" size={size} image={mockImage} />,
        );
        const image = screen.getByTestId('shopify-image');
        expect(image).toHaveAttribute('data-loading', 'lazy');
        unmount();
      });
    });

    it('uses 100vw sizes for full size heroes', () => {
      render(<HeroSection title="Test" size="full" image={mockImage} />);
      const image = screen.getByTestId('shopify-image');
      expect(image).toHaveAttribute('data-sizes', '100vw');
    });

    it('uses responsive sizes for non-full size heroes', () => {
      render(<HeroSection title="Test" size="medium" image={mockImage} />);
      const image = screen.getByTestId('shopify-image');
      expect(image).toHaveAttribute(
        'data-sizes',
        '(min-width: 1280px) 1280px, 100vw',
      );
    });

    it('applies background color when no image', () => {
      const {container} = render(
        <HeroSection title="Test" backgroundColor="#ff0000" />,
      );
      const section = container.querySelector('section');
      expect(section).toHaveStyle({backgroundColor: '#ff0000'});
    });

    it('does not apply background color when image provided', () => {
      const {container} = render(
        <HeroSection title="Test" image={mockImage} backgroundColor="#ff0000" />,
      );
      const section = container.querySelector('section');
      expect(section).not.toHaveStyle({backgroundColor: '#ff0000'});
    });

    it('uses default background color #000 when not specified', () => {
      const {container} = render(<HeroSection title="Test" />);
      const section = container.querySelector('section');
      expect(section).toHaveStyle({backgroundColor: '#000'});
    });

    it('handles empty alt text', () => {
      const imageWithoutAlt = {
        url: 'https://example.com/image.jpg',
        altText: null,
      };
      render(<HeroSection title="Test" image={imageWithoutAlt} />);
      const image = screen.getByTestId('shopify-image');
      // Falls back to title when alt text is null
      expect(image).toHaveAttribute('alt', 'Test');
    });
  });

  describe('Overlay', () => {
    const mockImage = {
      url: 'https://example.com/image.jpg',
      altText: 'Test',
    };

    it('renders overlay when image is provided', () => {
      const {container} = render(
        <HeroSection title="Test" image={mockImage} />,
      );
      const overlays = container.querySelectorAll('.absolute.inset-0');
      // Should have 2 absolute inset-0 divs: one for image container, one for overlay
      expect(overlays.length).toBeGreaterThanOrEqual(2);
    });

    it('only renders overlay when image is present', () => {
      const {container} = render(
        <HeroSection title="Test" overlayOpacity={50} />,
      );
      const overlays = container.querySelectorAll('.absolute.inset-0');
      // No overlay should render without an image
      expect(overlays.length).toBe(0);
    });

    it('applies correct opacity from 0-100 scale', () => {
      const {container} = render(
        <HeroSection title="Test" image={mockImage} overlayOpacity={50} />,
      );
      const overlays = Array.from(container.querySelectorAll('.absolute.inset-0'));
      // Find the overlay div (not the image container)
      const overlay = overlays.find(
        (el) => !el.querySelector('[data-testid="shopify-image"]'),
      );
      expect(overlay).toHaveStyle({opacity: '0.5'});
    });

    it('uses default overlay opacity of 40', () => {
      const {container} = render(
        <HeroSection title="Test" image={mockImage} />,
      );
      const overlays = Array.from(container.querySelectorAll('.absolute.inset-0'));
      const overlay = overlays.find(
        (el) => !el.querySelector('[data-testid="shopify-image"]'),
      );
      expect(overlay).toHaveStyle({opacity: '0.4'});
    });

    it('applies custom overlay color', () => {
      const {container} = render(
        <HeroSection
          title="Test"
          image={mockImage}
          overlayColor="#ff0000"
        />,
      );
      const overlays = Array.from(container.querySelectorAll('.absolute.inset-0'));
      const overlay = overlays.find(
        (el) => !el.querySelector('[data-testid="shopify-image"]'),
      );
      expect(overlay).toHaveStyle({backgroundColor: '#ff0000'});
    });

    it('uses default overlay color #000', () => {
      const {container} = render(
        <HeroSection title="Test" image={mockImage} />,
      );
      const overlays = Array.from(container.querySelectorAll('.absolute.inset-0'));
      const overlay = overlays.find(
        (el) => !el.querySelector('[data-testid="shopify-image"]'),
      );
      expect(overlay).toHaveStyle({backgroundColor: '#000'});
    });

    it('does not render overlay with zero opacity', () => {
      const {container} = render(
        <HeroSection title="Test" image={mockImage} overlayOpacity={0} />,
      );
      const overlays = Array.from(container.querySelectorAll('.absolute.inset-0'));
      const overlay = overlays.find(
        (el) => !el.querySelector('[data-testid="shopify-image"]'),
      );
      // Overlay should not render when opacity is 0
      expect(overlay).toBeUndefined();
    });
  });

  describe('Text Color', () => {
    it('applies white text color class by default', () => {
      render(<HeroSection title="Test" />);
      const heading = screen.getByRole('heading', {level: 1});
      expect(heading).toHaveClass('text-white');
    });

    it('applies black text color class when specified', () => {
      render(<HeroSection title="Test" textColor="black" />);
      const heading = screen.getByRole('heading', {level: 1});
      expect(heading).toHaveClass('text-black');
    });

    it('applies text color to subtitle', () => {
      render(
        <HeroSection title="Test" subtitle="Subtitle" textColor="black" />,
      );
      const subtitle = screen.getByText('Subtitle');
      expect(subtitle).toHaveClass('text-black');
    });

    it('inverts CTA button colors for white text', () => {
      render(
        <HeroSection
          title="Test"
          textColor="white"
          cta={{text: 'CTA', url: '/'}}
        />,
      );
      const link = screen.getByTestId('react-router-link');
      expect(link).toHaveClass('bg-white');
      expect(link).toHaveClass('text-black');
      expect(link).toHaveClass('hover:bg-gray-100');
    });

    it('inverts CTA button colors for black text', () => {
      render(
        <HeroSection
          title="Test"
          textColor="black"
          cta={{text: 'CTA', url: '/'}}
        />,
      );
      const link = screen.getByTestId('react-router-link');
      expect(link).toHaveClass('bg-black');
      expect(link).toHaveClass('text-white');
      expect(link).toHaveClass('hover:bg-gray-900');
    });
  });

  describe('Alignment', () => {
    it('applies center alignment by default', () => {
      const {container} = render(<HeroSection title="Test" />);
      const contentWrapper = container.querySelector('.relative.z-10');
      expect(contentWrapper).toHaveClass('items-center');
      expect(contentWrapper).toHaveClass('text-center');
    });

    it('applies left alignment classes', () => {
      const {container} = render(<HeroSection title="Test" alignment="left" />);
      const contentWrapper = container.querySelector('.relative.z-10');
      expect(contentWrapper).toHaveClass('items-start');
      expect(contentWrapper).toHaveClass('text-left');
    });

    it('applies right alignment classes', () => {
      const {container} = render(
        <HeroSection title="Test" alignment="right" />,
      );
      const contentWrapper = container.querySelector('.relative.z-10');
      expect(contentWrapper).toHaveClass('items-end');
      expect(contentWrapper).toHaveClass('text-right');
    });

    it('centers subtitle with mx-auto when alignment is center', () => {
      render(
        <HeroSection title="Test" subtitle="Subtitle" alignment="center" />,
      );
      const subtitle = screen.getByText('Subtitle');
      expect(subtitle).toHaveClass('mx-auto');
    });

    it('does not add mx-auto to subtitle when alignment is left', () => {
      render(
        <HeroSection title="Test" subtitle="Subtitle" alignment="left" />,
      );
      const subtitle = screen.getByText('Subtitle');
      expect(subtitle).not.toHaveClass('mx-auto');
    });

    it('does not add mx-auto to subtitle when alignment is right', () => {
      render(
        <HeroSection title="Test" subtitle="Subtitle" alignment="right" />,
      );
      const subtitle = screen.getByText('Subtitle');
      expect(subtitle).not.toHaveClass('mx-auto');
    });
  });

  describe('Layout and Structure', () => {
    it('applies relative positioning to section', () => {
      const {container} = render(<HeroSection title="Test" />);
      const section = container.querySelector('section');
      expect(section).toHaveClass('relative');
    });

    it('applies full width to section', () => {
      const {container} = render(<HeroSection title="Test" />);
      const section = container.querySelector('section');
      expect(section).toHaveClass('w-full');
    });

    it('applies overflow-hidden to section', () => {
      const {container} = render(<HeroSection title="Test" />);
      const section = container.querySelector('section');
      expect(section).toHaveClass('overflow-hidden');
    });

    it('applies z-10 to content wrapper', () => {
      const {container} = render(<HeroSection title="Test" />);
      const contentWrapper = container.querySelector('.relative.z-10');
      expect(contentWrapper).toBeInTheDocument();
      expect(contentWrapper).toHaveClass('z-10');
    });

    it('applies responsive padding classes', () => {
      const {container} = render(<HeroSection title="Test" />);
      const contentWrapper = container.querySelector('.relative.z-10');
      expect(contentWrapper).toHaveClass('px-6');
      expect(contentWrapper).toHaveClass('md:px-12');
      expect(contentWrapper).toHaveClass('lg:px-16');
    });

    it('applies vertical centering with flexbox', () => {
      const {container} = render(<HeroSection title="Test" />);
      const contentWrapper = container.querySelector('.relative.z-10');
      expect(contentWrapper).toHaveClass('flex');
      expect(contentWrapper).toHaveClass('flex-col');
      expect(contentWrapper).toHaveClass('justify-center');
    });

    it('wraps content in max-w-4xl container', () => {
      const {container} = render(<HeroSection title="Test" />);
      const innerContainer = container.querySelector('.max-w-4xl');
      expect(innerContainer).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('renders with empty title string', () => {
      render(<HeroSection title="" />);
      const heading = screen.getByRole('heading', {level: 1});
      expect(heading).toBeInTheDocument();
      expect(heading).toHaveTextContent('');
    });

    it('renders with empty className string', () => {
      const {container} = render(<HeroSection title="Test" className="" />);
      const section = container.querySelector('section');
      expect(section).toBeInTheDocument();
    });

    it('renders with empty subtitle string', () => {
      render(<HeroSection title="Test" subtitle="" />);
      const paragraphs = Array.from(document.querySelectorAll('p'));
      // Empty subtitle should not render (falsy check in component)
      expect(paragraphs.length).toBe(0);
    });

    it('renders with all optional props omitted', () => {
      const {container} = render(<HeroSection title="Test" />);
      const section = container.querySelector('section');
      expect(section).toBeInTheDocument();
    });

    it('renders with all props provided', () => {
      const allProps: HeroSectionProps = {
        size: 'large',
        title: 'Full Test',
        subtitle: 'Complete subtitle',
        image: {
          url: 'https://example.com/image.jpg',
          altText: 'Test image',
          width: 1200,
          height: 800,
          id: 'img-1',
        },
        backgroundColor: '#333',
        textColor: 'black',
        alignment: 'left',
        cta: {text: 'Click here', url: '/destination'},
        overlayOpacity: 60,
        overlayColor: '#0000ff',
        className: 'custom',
      };

      const {container} = render(<HeroSection {...allProps} />);
      const section = container.querySelector('section');
      expect(section).toBeInTheDocument();
      expect(section).toHaveClass('custom');
      expect(screen.getByText('Full Test')).toBeInTheDocument();
      expect(screen.getByText('Complete subtitle')).toBeInTheDocument();
      expect(screen.getByTestId('shopify-image')).toBeInTheDocument();
      expect(screen.getByTestId('react-router-link')).toBeInTheDocument();
    });

    it('handles boundary overlay opacity values', () => {
      const {container, rerender} = render(
        <HeroSection title="Test" image={{url: 'test.jpg'}} overlayOpacity={0} />,
      );
      let overlays = Array.from(container.querySelectorAll('.absolute.inset-0'));
      let overlay = overlays.find(
        (el) => !el.querySelector('[data-testid="shopify-image"]'),
      );
      // Opacity 0 should not render overlay
      expect(overlay).toBeUndefined();

      rerender(
        <HeroSection
          title="Test"
          image={{url: 'test.jpg'}}
          overlayOpacity={100}
        />,
      );
      overlays = Array.from(container.querySelectorAll('.absolute.inset-0'));
      overlay = overlays.find(
        (el) => !el.querySelector('[data-testid="shopify-image"]'),
      );
      expect(overlay).toHaveStyle({opacity: '1'});
    });

    it('handles long title text without breaking layout', () => {
      const longTitle = 'A'.repeat(200);
      render(<HeroSection title={longTitle} />);
      const heading = screen.getByRole('heading', {level: 1});
      expect(heading).toBeInTheDocument();
      expect(heading).toHaveTextContent(longTitle);
    });

    it('handles special characters in title', () => {
      const specialTitle = '<script>alert("xss")</script> & "quotes" \'single\'';
      render(<HeroSection title={specialTitle} />);
      const heading = screen.getByRole('heading', {level: 1});
      // React escapes HTML automatically
      expect(heading).toHaveTextContent(specialTitle);
    });

    it('handles URL with special characters in CTA', () => {
      const specialUrl = '/products/test?ref=hero&utm_source=home';
      render(
        <HeroSection
          title="Test"
          cta={{text: 'Shop', url: specialUrl}}
        />,
      );
      const link = screen.getByTestId('react-router-link');
      expect(link).toHaveAttribute('href', specialUrl);
    });
  });

  describe('Accessibility', () => {
    it('uses semantic section element', () => {
      const {container} = render(<HeroSection title="Test" />);
      const section = container.querySelector('section');
      expect(section).toBeInTheDocument();
    });

    it('uses h1 for main heading', () => {
      render(<HeroSection title="Test" />);
      const heading = screen.getByRole('heading', {level: 1});
      expect(heading).toBeInTheDocument();
    });

    it('image receives alt text from image object', () => {
      const imageWithAlt = {
        url: 'https://example.com/test.jpg',
        altText: 'Descriptive alt text',
      };
      render(<HeroSection title="Test" image={imageWithAlt} />);
      const image = screen.getByTestId('shopify-image');
      expect(image).toHaveAttribute('alt', 'Descriptive alt text');
    });

    it('CTA uses link element for navigation', () => {
      render(
        <HeroSection title="Test" cta={{text: 'Click', url: '/page'}} />,
      );
      const link = screen.getByTestId('react-router-link');
      expect(link.tagName).toBe('A');
    });

    it('maintains readable contrast with text color options', () => {
      // This is a basic check - in real accessibility testing,
      // you'd measure actual contrast ratios
      const {rerender} = render(<HeroSection title="Test" textColor="white" />);
      let heading = screen.getByRole('heading', {level: 1});
      expect(heading).toHaveClass('text-white');

      rerender(<HeroSection title="Test" textColor="black" />);
      heading = screen.getByRole('heading', {level: 1});
      expect(heading).toHaveClass('text-black');
    });
  });

  describe('Component Integration', () => {
    it('works with all size variants and CTA combinations', () => {
      const sizes: Array<'full' | 'large' | 'medium' | 'small'> = [
        'full',
        'large',
        'medium',
        'small',
      ];
      sizes.forEach((size) => {
        const {unmount} = render(
          <HeroSection
            title="Test"
            size={size}
            cta={{text: 'Action', url: '/go'}}
          />,
        );
        expect(screen.getByRole('heading', {level: 1})).toBeInTheDocument();
        expect(screen.getByTestId('react-router-link')).toBeInTheDocument();
        unmount();
      });
    });

    it('works with all alignment and text color combinations', () => {
      const alignments: Array<'left' | 'center' | 'right'> = [
        'left',
        'center',
        'right',
      ];
      const colors: Array<'white' | 'black'> = ['white', 'black'];

      alignments.forEach((alignment) => {
        colors.forEach((textColor) => {
          const {unmount} = render(
            <HeroSection
              title="Test"
              alignment={alignment}
              textColor={textColor}
            />,
          );
          const heading = screen.getByRole('heading', {level: 1});
          expect(heading).toBeInTheDocument();
          unmount();
        });
      });
    });

    it('properly layers image, overlay, and content', () => {
      const {container} = render(
        <HeroSection
          title="Test"
          image={{url: 'test.jpg', altText: 'Test'}}
        />,
      );

      // Image container should be absolute inset-0
      const imageContainer = container.querySelector(
        '.absolute.inset-0:has([data-testid="shopify-image"])',
      );
      expect(imageContainer).toBeInTheDocument();

      // Overlay should be absolute inset-0
      const overlays = container.querySelectorAll('.absolute.inset-0');
      expect(overlays.length).toBeGreaterThanOrEqual(2);

      // Content should have z-10
      const content = container.querySelector('.relative.z-10');
      expect(content).toBeInTheDocument();
    });
  });
});
