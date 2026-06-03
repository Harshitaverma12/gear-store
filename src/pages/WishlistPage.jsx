import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import styles from './WishlistPage.module.scss';

export function WishlistPage() {
  const { wishlist, dispatch } = useWishlist();
  const { items } = wishlist;

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Wishlist <span className={styles.count}>({items.length})</span></h1>
        {items.length > 0 && (
          <button className={styles.clearAll}
            onClick={() => items.forEach(i => dispatch({ type: 'TOGGLE', payload: i }))}>
            Clear all
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <div className={styles.empty}>
          <HeartEmptyIcon />
          <p className={styles.emptyText}>Your wishlist is empty</p>
          <p className={styles.emptySub}>Save items you love — they'll wait right here.</p>
          <Link to="/" className={styles.shopLink}>Browse Products</Link>
        </div>
      ) : (
        <div className={styles.grid}>
          {items.map(item => (
            <div key={item.id} className={styles.card}>
              <Link to={`/product/${item.id}`} className={styles.cardLink}>
                <div className={styles.imgWrap}>
                  <img src={item.thumbnail} alt={item.name} className={styles.img} />
                  {item.onSale && <span className={styles.salePill}>Sale</span>}
                </div>
                <div className={styles.info}>
                  <p className={styles.category}>{item.category}</p>
                  <p className={styles.name}>{item.name}</p>
                  <div className={styles.pricing}>
                    {item.onSale ? (
                      <><span className={styles.salePrice}>₹{item.salePrice.toFixed(2)}</span>
                      <span className={styles.origPrice}>₹{item.originalPrice.toFixed(2)}</span></>
                    ) : (
                      <span className={styles.price}>₹{item.originalPrice.toFixed(2)}</span>
                    )}
                  </div>
                  <div className={styles.rating}>
                    <StarIcon /> {item.rating.rate} ({item.rating.count})
                  </div>
                </div>
              </Link>
              <button className={styles.removeBtn}
                onClick={() => dispatch({ type: 'TOGGLE', payload: item })}
                aria-label={`Remove ${item.name} from wishlist`}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const HeartEmptyIcon = () => (
  <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" style={{color:'#ccc'}}>
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
  </svg>
);
const StarIcon = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="#B07D25" aria-hidden="true" style={{display:'inline',verticalAlign:'middle',marginRight:'2px'}}>
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
);
