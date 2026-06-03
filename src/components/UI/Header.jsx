import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { CartDrawer } from '../Cart/CartDrawer';
import styles from './Header.module.scss';

const API_BASE = 'https://fakestoreapi.com';

export function Header() {
  const { totalItems } = useCart();
  const { total: wishlistTotal } = useWishlist();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const activeCategory = searchParams.get('category');
  const isSale = searchParams.get('sale') === 'true';

  useEffect(() => {
    fetch(`${API_BASE}/products/categories`)
      .then(r => r.json()).then(setCategories).catch(() => {});
  }, []);

  // Focus input when search opens
  useEffect(() => {
    if (searchOpen) setTimeout(() => searchInputRef.current?.focus(), 50);
  }, [searchOpen]);

  // Close search on Escape
  useEffect(() => {
    const fn = (e) => { if (e.key === 'Escape') { setSearchOpen(false); setSearchQuery(''); } };
    window.addEventListener('keydown', fn);
    return () => window.removeEventListener('keydown', fn);
  }, []);

  function handleNavClick(e, type, value) {
    e.preventDefault();
    if (type === 'sale') { isSale ? navigate('/') : navigate('/?sale=true'); }
    else { activeCategory === value ? navigate('/') : navigate(`/?category=${encodeURIComponent(value)}`); }
  }

  function handleSearch(e) {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    navigate(`/?search=${encodeURIComponent(searchQuery.trim())}`);
    setSearchOpen(false);
    setSearchQuery('');
  }

  return (
    <>
      <header className={styles.header}>
        <div className={styles.inner}>
          <Link to="/" className={styles.logo} aria-label="Terranova Gear Co.">
            <span className={styles.logoMark}>T</span>
            <span className={styles.logoText}>TERRANOVA</span>
          </Link>

          <nav className={styles.nav} aria-label="Main navigation">
            {categories.map(cat => (
              <a key={cat} href={`/?category=${encodeURIComponent(cat)}`}
                className={`${styles.navLink} ${activeCategory === cat ? styles.navLinkActive : ''}`}
                onClick={(e) => handleNavClick(e, 'category', cat)}>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </a>
            ))}
            <a href="/?sale=true"
              className={`${styles.navLink} ${styles.navLinkSale} ${isSale ? styles.navLinkActive : ''}`}
              onClick={(e) => handleNavClick(e, 'sale')}>
              Sale
            </a>
          </nav>

          <div className={styles.actions}>
            {/* Search */}
            <button className={styles.iconBtn} onClick={() => setSearchOpen(o => !o)}
              aria-label="Search products">
              <SearchIcon />
            </button>

            {/* Wishlist */}
            <Link to="/wishlist" className={styles.iconBtn} aria-label={`Wishlist, ${wishlistTotal} items`}>
              <HeartIcon />
              {wishlistTotal > 0 && (
                <span className={styles.badge} aria-hidden="true">{wishlistTotal}</span>
              )}
            </Link>

            {/* Cart */}
            <button className={styles.iconBtn} onClick={() => setDrawerOpen(true)}
              aria-label={`Open cart, ${totalItems} items`}>
              <CartIcon />
              {totalItems > 0 && (
                <span className={styles.badge} aria-hidden="true">
                  {totalItems > 99 ? '99+' : totalItems}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Search bar — slides down */}
        <div className={`${styles.searchBar} ${searchOpen ? styles.searchBarOpen : ''}`}
          aria-hidden={!searchOpen}>
          <form className={styles.searchForm} onSubmit={handleSearch}>
            <SearchIcon />
            <input
              ref={searchInputRef}
              type="search"
              className={styles.searchInput}
              placeholder="Search for products…"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              aria-label="Search products"
            />
            {searchQuery && (
              <button type="button" className={styles.searchClear}
                onClick={() => setSearchQuery('')} aria-label="Clear">×</button>
            )}
            <button type="submit" className={styles.searchSubmit}>Search</button>
          </form>
        </div>
      </header>

      <CartDrawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  );
}

const SearchIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);
const HeartIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
  </svg>
);
const CartIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
    <line x1="3" y1="6" x2="21" y2="6"/>
    <path d="M16 10a4 4 0 0 1-8 0"/>
  </svg>
);
