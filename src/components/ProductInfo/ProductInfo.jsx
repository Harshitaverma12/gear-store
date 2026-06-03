import { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useVariantSelection } from '../../hooks/useVariantSelection';
import { mockAddToCartAPI } from '../../utils/cartApi';
import styles from './ProductInfo.module.scss';

export function ProductInfo({ product }) {
  const { dispatch } = useCart();
  const {
    variants,
    selectedColor, selectedSize, quantity,
    isSoldOut, isLowStock, maxQty,
    handleColorChange, handleSizeChange, handleQuantityChange,
  } = useVariantSelection(product.category);

  const { dispatch: wlDispatch, isWishlisted } = useWishlist();
  const wishlisted = isWishlisted(product.id);

  const [addState, setAddState] = useState('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [cartCount, setCartCount] = useState(0);
  const [sizeChartOpen, setSizeChartOpen] = useState(false);
  const [shareMsg, setShareMsg] = useState('');

  function handleWishlist() {
    wlDispatch({
      type: 'TOGGLE',
      payload: {
        id: product.id, name: product.name, thumbnail: product.images[0],
        originalPrice: product.originalPrice, salePrice: product.salePrice,
        onSale: product.onSale, category: product.category, rating: product.rating,
      },
    });
  }

  async function handleShare() {
    const url = window.location.href;
    const text = `Check out ${product.name} on Terranova Gear Co.`;
    if (navigator.share) {
      try { await navigator.share({ title: product.name, text, url }); } catch {}
    } else {
      await navigator.clipboard.writeText(url);
      setShareMsg('Link copied!');
      setTimeout(() => setShareMsg(''), 2500);
    }
  }

  const canAdd = selectedSize && !isSoldOut;
  const { colors, sizes, sizeLabel, sizeChart } = variants;

  const selectedColorObj = colors.find(c => c.id === selectedColor);
  const currentSizeObj   = sizes.find(s => s.id === selectedSize);

  async function handleAddToCart() {
    if (!canAdd) return;
    setAddState('loading');
    setErrorMsg('');
    try {
      await mockAddToCartAPI({
        productId: product.id,
        color: selectedColor,
        size: selectedSize,
        quantity,
        price: product.onSale ? product.salePrice : product.originalPrice,
        name: product.name,
        image: product.images[0],
      });
      dispatch({
        type: 'ADD_ITEM',
        payload: {
          productId: product.id,
          color: selectedColor,
          size: selectedSize,
          quantity,
          price: product.onSale ? product.salePrice : product.originalPrice,
          name: product.name,
          image: product.images[0],
        },
      });
      setAddState('success');
      setCartCount(c => c + quantity);
      setTimeout(() => setAddState('idle'), 2800);
    } catch (err) {
      setErrorMsg(err.message);
      setAddState('error');
      setTimeout(() => setAddState('idle'), 4000);
    }
  }

  const today = new Date();
  const deliveryStart = new Date(today); deliveryStart.setDate(today.getDate() + 3);
  const deliveryEnd   = new Date(today); deliveryEnd.setDate(today.getDate() + 5);
  const fmt = d => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  return (
    <div className={styles.panel}>
      {/* Brand + name */}
      <div className={styles.header}>
        <span className={styles.brand}>{product.brand}</span>
        <h1 className={styles.name}>{product.name}</h1>
      </div>

      {/* Price */}
      <div className={styles.pricing}>
        {product.onSale ? (
          <>
            <span className={styles.salePrice}>₹{product.salePrice.toFixed(2)}</span>
            <span className={styles.origPrice}>₹{product.originalPrice.toFixed(2)}</span>
            <span className={styles.badge}>Sale</span>
          </>
        ) : (
          <span className={styles.price}>₹{product.originalPrice.toFixed(2)}</span>
        )}
      </div>

      {/* Rating */}
      <div className={styles.rating} aria-label={`${product.rating.rate} out of 5 stars`}>
        <StarRating value={product.rating.rate} />
        <span className={styles.ratingText}>
          {product.rating.rate} ({product.rating.count} reviews)
        </span>
      </div>

      {/* Wishlist + Share action row */}
      <div className={styles.actionRow}>
        <button
          className={`${styles.wishlistBtn} ${wishlisted ? styles.wishlistActive : ''}`}
          onClick={handleWishlist}
          aria-pressed={wishlisted}
          aria-label={wishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
        >
          <HeartIcon filled={wishlisted} />
          {wishlisted ? 'Saved' : 'Wishlist'}
        </button>
        <button className={styles.shareBtn} onClick={handleShare} aria-label="Share product">
          <ShareIcon />
          {shareMsg || 'Share'}
        </button>
      </div>

      <hr className={styles.divider} />

      {/* Colour swatches */}
      <div className={styles.section}>
        <p className={styles.label}>
          Colour: <strong>{selectedColorObj?.label}</strong>
        </p>
        <div className={styles.swatches} role="group" aria-label="Choose colour">
          {colors.map(c => (
            <button
              key={c.id}
              className={`${styles.swatch} ${c.id === selectedColor ? styles.swatchActive : ''} ${c.border ? styles.swatchBorder : ''}`}
              style={{ '--swatch-color': c.hex }}
              onClick={() => handleColorChange(c.id)}
              aria-label={c.label}
              aria-pressed={c.id === selectedColor}
              title={c.label}
            />
          ))}
        </div>
      </div>

      {/* Size / Storage / Ring size selector */}
      <div className={styles.section}>
        <div className={styles.sizeHeader}>
          <p className={styles.label}>{sizeLabel}</p>
          <button
            className={styles.sizeChartLink}
            onClick={() => setSizeChartOpen(true)}
            aria-label="Open size chart"
          >
            <RulerIcon />
            Size Guide
          </button>
        </div>

        <div className={styles.sizeGrid} role="group" aria-label={`Choose ${sizeLabel}`}>
          {sizes.map(s => {
            const soldOut  = s.stock === 0;
            const lowStock = s.stock > 0 && s.stock <= 3;
            const active   = s.id === selectedSize;
            return (
              <button
                key={s.id}
                className={`
                  ${styles.sizeBtn}
                  ${active    ? styles.sizeActive   : ''}
                  ${soldOut   ? styles.sizeSoldOut   : ''}
                  ${lowStock  ? styles.sizeLowStock  : ''}
                `}
                onClick={() => handleSizeChange(s.id)}
                disabled={soldOut}
                aria-pressed={active}
                aria-label={`${s.label}${soldOut ? ', sold out' : lowStock ? `, only ${s.stock} left` : ''}`}
                title={soldOut ? 'Sold out' : lowStock ? `Only ${s.stock} left` : s.label}
              >
                {s.label}
                {lowStock && <span className={styles.lowBadge} />}
              </button>
            );
          })}
        </div>

        {isLowStock && currentSizeObj && (
          <p className={styles.stockWarn}>
            <span className={styles.warningDot} />
            Only {currentSizeObj.stock} left in this {sizeLabel.toLowerCase()}
          </p>
        )}
        {isSoldOut && selectedSize && (
          <p className={styles.soldOutText}>This {sizeLabel.toLowerCase()} is sold out</p>
        )}
      </div>

      {/* Quantity */}
      {selectedSize && !isSoldOut && (
        <div className={styles.section}>
          <p className={styles.label}>Quantity</p>
          <div className={styles.qty}>
            <button className={styles.qtyBtn} onClick={() => handleQuantityChange(quantity - 1)} disabled={quantity <= 1} aria-label="Decrease">−</button>
            <span className={styles.qtyValue}>{quantity}</span>
            <button className={styles.qtyBtn} onClick={() => handleQuantityChange(quantity + 1)} disabled={quantity >= maxQty} aria-label="Increase">+</button>
            <span className={styles.qtyMax}> / {maxQty} available</span>
          </div>
        </div>
      )}

      {/* Add to cart */}
      <button
        className={`${styles.addBtn} ${styles[`addBtn--${addState}`]}`}
        onClick={handleAddToCart}
        disabled={!canAdd || addState === 'loading'}
        aria-live="polite"
      >
        <span className={styles.btnContent}>
          {addState === 'loading' && <span className={styles.spinner} aria-hidden="true" />}
          {addState === 'success' && <CheckIcon />}
          {addState === 'loading' ? 'Adding...'
           : addState === 'success' ? 'Added to Cart!'
           : isSoldOut  ? 'Sold Out'
           : !selectedSize ? `Select a ${sizeLabel}`
           : 'Add to Cart'}
        </span>
      </button>

      {addState === 'error' && (
        <p className={styles.errorMsg} role="alert">{errorMsg}</p>
      )}

      {canAdd && (
        <div className={styles.delivery}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
            <path d="M5 17H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v3"/>
            <rect x="9" y="11" width="14" height="10" rx="2"/>
            <circle cx="12" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
          </svg>
          <span>Free delivery: <strong>{fmt(deliveryStart)}–{fmt(deliveryEnd)}</strong></span>
        </div>
      )}

      {cartCount > 0 && (
        <p className={styles.cartTally}>
          You have {cartCount} item{cartCount !== 1 ? 's' : ''} in your cart
        </p>
      )}

      {/* Size chart modal */}
      {sizeChartOpen && (
        <SizeChartModal chart={sizeChart} onClose={() => setSizeChartOpen(false)} />
      )}
    </div>
  );
}

// ─── Size Chart Modal ─────────────────────────────────────────────────────────
function SizeChartModal({ chart, onClose }) {
  return (
    <div className={styles.modalOverlay} onClick={onClose} role="dialog" aria-modal="true" aria-label="Size chart">
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>{chart.title}</h2>
          <button className={styles.modalClose} onClick={onClose} aria-label="Close size chart">×</button>
        </div>
        {chart.note && <p className={styles.modalNote}>{chart.note}</p>}
        <div className={styles.tableWrap}>
          <table className={styles.sizeTable}>
            <thead>
              <tr>
                {chart.headers.map(h => <th key={h}>{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {chart.rows.map((row, i) => (
                <tr key={i}>
                  {row.map((cell, j) => (
                    j === 0
                      ? <td key={j} className={styles.sizeTableSize}>{cell}</td>
                      : <td key={j}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function HeartIcon({ filled }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24"
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
    </svg>
  );
}

function ShareIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true">
      <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
    </svg>
  );
}

function StarRating({ value }) {
  return (
    <span className={styles.stars} aria-hidden="true">
      {[1,2,3,4,5].map(n => (
        <svg key={n} width="14" height="14" viewBox="0 0 24 24"
          fill={n <= Math.round(value) ? 'currentColor' : 'none'}
          stroke="currentColor" strokeWidth="2">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
    </span>
  );
}

function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function RulerIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21.3 8.7L8.7 21.3a2.41 2.41 0 0 1-3.4 0L2.7 18.7a2.41 2.41 0 0 1 0-3.4L15.3 2.7a2.41 2.41 0 0 1 3.4 0l2.6 2.6a2.41 2.41 0 0 1 0 3.4Z"/>
      <path d="m7.5 10.5 2 2"/><path d="m10.5 7.5 2 2"/><path d="m13.5 4.5 2 2"/><path d="m4.5 13.5 2 2"/>
    </svg>
  );
}
