import { useState } from 'react';
import { getSpecsForCategory, REVIEWS } from '../../data/productConfig';
import styles from './ProductDetails.module.scss';

const PANELS = [
  { id: 'description', label: 'Description' },
  { id: 'specs',       label: 'Specifications' },
  { id: 'reviews',     label: 'Reviews' },
];

// Category-appropriate description blurbs
const CATEGORY_DESC = {
  "men's clothing":   { lead: 'Designed for life in motion.', features: ['Premium breathable fabric', 'Reinforced stitching at stress points', 'Machine washable at 30°C', 'Ethically sourced materials', 'Available in multiple colourways'] },
  "women's clothing": { lead: 'Style meets comfort, every day.', features: ['Soft-touch fabric with stretch', 'Flattering silhouette for all body types', 'Easy-care machine washable', 'Sustainable fabric sourcing', 'Versatile styling options'] },
  "electronics":      { lead: 'Built to keep up with your workflow.', features: ['Plug-and-play, no drivers needed', 'USB 3.0 & USB-C compatible', 'Compact and travel-ready', 'Shock-resistant casing', '2-year manufacturer warranty'] },
  "jewelery":         { lead: 'Crafted to be worn, treasured and passed on.', features: ['Hallmarked precious metal', 'Conflict-free certified stones', 'Hand-finished to a mirror polish', 'Presented in a gift box', 'Lifetime resize service'] },
};

export function ProductDetails({ description, category }) {
  const [open, setOpen] = useState('description');
  const specs = getSpecsForCategory(category);
  const descInfo = CATEGORY_DESC[category] || CATEGORY_DESC["men's clothing"];

  function toggle(id) {
    setOpen(prev => prev === id ? null : id);
  }

  return (
    <section className={styles.section} aria-label="Product details">
      <div className={styles.accordion}>
        {PANELS.map(panel => (
          <AccordionItem
            key={panel.id}
            id={panel.id}
            label={panel.label}
            isOpen={open === panel.id}
            onToggle={() => toggle(panel.id)}
          >
            {panel.id === 'description' && (
              <DescriptionPanel text={description} lead={descInfo.lead} features={descInfo.features} />
            )}
            {panel.id === 'specs' && (
              <SpecsPanel specs={specs} />
            )}
            {panel.id === 'reviews' && (
              <ReviewsPanel />
            )}
          </AccordionItem>
        ))}
      </div>
    </section>
  );
}

function AccordionItem({ id, label, isOpen, onToggle, children }) {
  const contentId = `accordion-content-${id}`;
  const btnId     = `accordion-btn-${id}`;

  return (
    <div className={`${styles.item} ${isOpen ? styles.itemOpen : ''}`}>
      <button
        id={btnId}
        className={styles.trigger}
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={contentId}
      >
        <span>{label}</span>
        <span className={styles.chevron} aria-hidden="true">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </span>
      </button>
      <div
        id={contentId}
        role="region"
        aria-labelledby={btnId}
        className={styles.panel}
        hidden={!isOpen}
      >
        <div className={styles.panelInner}>{children}</div>
      </div>
    </div>
  );
}

function DescriptionPanel({ text, lead, features }) {
  return (
    <div className={styles.description}>
      <p className={styles.descLead}>{lead}</p>
      <p>{text}</p>
      <ul className={styles.features}>
        {features.map(f => <li key={f}>{f}</li>)}
      </ul>
    </div>
  );
}

function SpecsPanel({ specs }) {
  return (
    <table className={styles.specsTable}>
      <tbody>
        {specs.map(({ key, value }) => (
          <tr key={key}>
            <th>{key}</th>
            <td>{value}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function ReviewsPanel() {
  const avg = (REVIEWS.reduce((s, r) => s + r.rating, 0) / REVIEWS.length).toFixed(1);

  return (
    <div className={styles.reviews}>
      <div className={styles.reviewsSummary}>
        <span className={styles.avgScore}>{avg}</span>
        <div>
          <StarRow value={parseFloat(avg)} size={18} />
          <p className={styles.reviewCount}>Based on {REVIEWS.length} reviews</p>
        </div>
      </div>
      <div className={styles.reviewList}>
        {REVIEWS.map(r => (
          <article key={r.id} className={styles.reviewCard}>
            <header className={styles.reviewHeader}>
              <div>
                <p className={styles.reviewTitle}>{r.title}</p>
                <div className={styles.reviewMeta}>
                  <StarRow value={r.rating} size={13} />
                  <span className={styles.reviewAuthor}>{r.author}</span>
                  <span className={styles.reviewDate}>{r.date}</span>
                  {r.verified && <span className={styles.verified}>✓ Verified</span>}
                </div>
              </div>
            </header>
            <p className={styles.reviewBody}>{r.body}</p>
          </article>
        ))}
      </div>
    </div>
  );
}

function StarRow({ value, size = 14 }) {
  return (
    <span style={{ display: 'flex', gap: '2px', color: '#B07D25' }} aria-hidden="true">
      {[1,2,3,4,5].map(n => (
        <svg key={n} width={size} height={size} viewBox="0 0 24 24"
          fill={n <= Math.round(value) ? 'currentColor' : 'none'}
          stroke="currentColor" strokeWidth="2">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
    </span>
  );
}
