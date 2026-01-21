import {Link} from 'react-router';

/**
 * Helper function to safely extract field values from metaobject fields
 */
function getFieldValue(
  fields: Array<{key: string; value?: string | null}>,
  key: string,
): string | null {
  const field = fields.find((f) => f.key === key);
  return field?.value ?? null;
}

/**
 * Helper function to extract image reference from metaobject fields
 */
function getImageReference(
  fields: Array<{key: string; reference?: any}>,
  key: string,
): {url: string; altText?: string} | null {
  const field = fields.find((f) => f.key === key);
  if (!field?.reference || field.reference.__typename !== 'MediaImage') {
    return null;
  }
  return {
    url: field.reference.image?.url ?? '',
    altText: field.reference.image?.altText ?? '',
  };
}

interface FeatureSectionsProps {
  features?: {
    nodes: Array<{
      id: string;
      fields: Array<{
        key: string;
        value?: string | null;
        reference?: any;
      }>;
    }>;
  } | null;
}

export function FeatureSections({features}: FeatureSectionsProps) {
  if (!features || features.nodes.length === 0) {
    return null;
  }

  return (
    <div className="feature-sections">
      {features.nodes.map((feature) => (
        <FeatureSection key={feature.id} metaobject={feature} />
      ))}
    </div>
  );
}

interface FeatureSectionProps {
  metaobject: {
    id: string;
    fields: Array<{
      key: string;
      value?: string | null;
      reference?: any;
    }>;
  };
}

function FeatureSection({metaobject}: FeatureSectionProps) {
  const {fields} = metaobject;

  // Extract values from metaobject fields
  const heading = getFieldValue(fields, 'heading');
  const description = getFieldValue(fields, 'description');
  const ctaText = getFieldValue(fields, 'cta_text');
  const ctaUrl = getFieldValue(fields, 'cta_url');
  const imagePosition = getFieldValue(fields, 'image_position') || 'left';
  const backgroundColor = getFieldValue(fields, 'background_color') || '#fff';
  const image = getImageReference(fields, 'image');

  // Don't render if required fields are missing
  if (!heading || !description || !ctaText || !ctaUrl) {
    return null;
  }

  return (
    <section
      className="feature-section"
      style={{backgroundColor}}
    >
      <div
        className={`feature-section-container ${
          imagePosition === 'right' ? 'feature-section-reverse' : ''
        }`}
      >
        <div className="feature-section-image">
          {image ? (
            <img
              src={image.url}
              alt={image.altText || heading}
              loading="lazy"
              className="feature-image"
            />
          ) : (
            <div className="feature-image-placeholder" />
          )}
        </div>

        <div className="feature-section-content">
          <h3 className="feature-section-title">
            <strong>{heading}</strong>
          </h3>
          <h5 className="feature-section-subtitle">{description}</h5>
          <Link to={ctaUrl} className="feature-section-cta" prefetch="intent">
            {ctaText}
          </Link>
        </div>
      </div>
    </section>
  );
}
