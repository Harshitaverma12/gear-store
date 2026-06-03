import { useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import { useWishlist } from '../context/WishlistContext';
import styles from './ShopPage.module.scss';

export function ShopPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const urlCategory = searchParams.get('category') || null;
  const isSale = searchParams.get('sale') === 'true';
  const searchQuery = searchParams.get('search') || '';

  const [sortBy, setSortBy] = useState('default');
  const { products, categories, loading, error } = useProducts(urlCategory, isSale);

  // Client-side search filter
  const filtered = searchQuery
    ? products.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : products;

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'price-asc')  return a.originalPrice - b.originalPrice;
    if (sortBy === 'price-desc') return b.originalPrice - a.originalPrice;
    if (sortBy === 'rating')     return b.rating.rate - a.rating.rate;
    return 0;
  });

  function handleCategoryClick(cat) {
    if (cat === 'sale') { isSale ? navigate('/') : navigate('/?sale=true'); }
    else if (cat === null) { navigate('/'); }
    else { urlCategory === cat ? navigate('/') : navigate(`/?category=${encodeURIComponent(cat)}`); }
  }

  const activeLabel = searchQuery ? `"${searchQuery}"`
    : isSale ? 'Sale'
    : urlCategory ? urlCategory.charAt(0).toUpperCase() + urlCategory.slice(1)
    : null;

  return (
    <div className={styles.page}>
      {/* Hero */}
      {!searchQuery && (
        <div className={styles.hero}>
          <p className={styles.heroEyebrow}>New Season</p>
          <h1 className={styles.heroTitle}>Built for<br/>the Wild</h1>
          <p className={styles.heroSub}>Gear that doesn't quit when you do.</p>
        </div>
      )}

      {/* Search result header */}
      {searchQuery && (
        <div className={styles.searchHeader}>
          <h1 className={styles.searchTitle}>Results for "{searchQuery}"</h1>
          <button className={styles.searchClearBtn} onClick={() => navigate('/')}>
            Clear search
          </button>
        </div>
      )}

      {/* Controls */}
      <div className={styles.controls}>
        <div className={styles.categories}>
          <button className={`${styles.catBtn} ${!urlCategory && !isSale && !searchQuery ? styles.catActive : ''}`}
            onClick={() => handleCategoryClick(null)}>All</button>
          {categories.map(cat => (
            <button key={cat}
              className={`${styles.catBtn} ${urlCategory === cat ? styles.catActive : ''}`}
              onClick={() => handleCategoryClick(cat)}>
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
          <button className={`${styles.catBtn} ${styles.catSale} ${isSale ? styles.catActive : ''}`}
            onClick={() => handleCategoryClick('sale')}>Sale</button>
        </div>
        <div className={styles.sortWrap}>
          <label htmlFor="sort" className={styles.sortLabel}>Sort:</label>
          <select id="sort" className={styles.sortSelect} value={sortBy}
            onChange={e => setSortBy(e.target.value)}>
            <option value="default">Featured</option>
            <option value="price-asc">Price: Low → High</option>
            <option value="price-desc">Price: High → Low</option>
            <option value="rating">Top Rated</option>
          </select>
        </div>
      </div>

      {!loading && !error && (
        <p className={styles.resultCount}>
          {sorted.length} product{sorted.length !== 1 ? 's' : ''}
          {activeLabel ? ` for ${activeLabel}` : ''}
        </p>
      )}

      {loading && <ProductGridSkeleton />}
      {error && <div className={styles.error}><p>{error}</p><button onClick={() => window.location.reload()}>Try again</button></div>}
      {!loading && !error && sorted.length === 0 && (
        <div className={styles.empty}>
          <p>No products found{searchQuery ? ` for "${searchQuery}"` : ''}.</p>
          <button className={styles.emptyBtn} onClick={() => navigate('/')}>Browse all</button>
        </div>
      )}
      {!loading && !error && sorted.length > 0 && (
        <div className={styles.grid}>
          {sorted.map((product, i) => <ProductCard key={product.id} product={product} index={i} />)}
        </div>
      )}
    </div>
  );
}

function ProductCard({ product, index }) {
  const { dispatch, isWishlisted } = useWishlist();
  const wishlisted = isWishlisted(product.id);
  const displayPrice = product.onSale ? product.salePrice : product.originalPrice;

  function toggleWishlist(e) {
    e.preventDefault();
    e.stopPropagation();
    dispatch({
      type: 'TOGGLE',
      payload: { id: product.id, name: product.name, thumbnail: product.thumbnail,
        originalPrice: product.originalPrice, salePrice: product.salePrice,
        onSale: product.onSale, category: product.category, rating: product.rating },
    });
  }

  return (
    <Link to={`/product/${product.id}`} className={styles.card}
      style={{ animationDelay: `${index * 40}ms` }}
      aria-label={`${product.name}, ₹${displayPrice.toFixed(2)}`}>
      <div className={styles.cardImgWrap}>
        <img src={product.thumbnail} alt={product.name} className={styles.cardImg} loading="lazy" />
        {product.onSale && <span className={styles.salePill}>Sale</span>}
        {/* Wishlist heart */}
        <button
          className={`${styles.heartBtn} ${wishlisted ? styles.heartActive : ''}`}
          onClick={toggleWishlist}
          aria-label={wishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
          aria-pressed={wishlisted}
        >
          <svg width="18" height="18" viewBox="0 0 24 24"
            fill={wishlisted ? 'currentColor' : 'none'}
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
        </button>
        <div className={styles.cardOverlay}><span className={styles.viewBtn}>View Product</span></div>
      </div>
      <div className={styles.cardBody}>
        <p className={styles.cardCategory}>{product.category}</p>
        <h2 className={styles.cardName}>{product.name}</h2>
        <div className={styles.cardFooter}>
          <div className={styles.cardPricing}>
            {product.onSale ? (
              <><span className={styles.cardSalePrice}>₹{product.salePrice.toFixed(2)}</span>
              <span className={styles.cardOrigPrice}>₹{product.originalPrice.toFixed(2)}</span></>
            ) : (
              <span className={styles.cardPrice}>₹{product.originalPrice.toFixed(2)}</span>
            )}
          </div>
          <div className={styles.cardRating} aria-label={`${product.rating.rate} stars`}>
            <StarIcon /><span>{product.rating.rate}</span>
            <span className={styles.cardRatingCount}>({product.rating.count})</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

const StarIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
);

function ProductGridSkeleton() {
  return (
    <div className={styles.grid}>
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className={styles.skeletonCard}>
          <div className={styles.skeletonImg} />
          <div className={styles.skeletonBody}>
            <div className={`${styles.skeletonLine} ${styles.skeletonShort}`} />
            <div className={`${styles.skeletonLine} ${styles.skeletonMed}`} />
            <div className={`${styles.skeletonLine} ${styles.skeletonPrice}`} />
          </div>
        </div>
      ))}
    </div>
  );
}
