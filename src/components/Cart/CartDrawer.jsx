import { useEffect } from 'react';
import { useCart } from '../../context/CartContext';
import styles from './CartDrawer.module.scss';

export function CartDrawer({ isOpen, onClose }) {
  const { cart, dispatch, totalPrice } = useCart();

  useEffect(() => {
    if (!isOpen) return;
    const h = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', h);
    return () => document.removeEventListener('keydown', h);
  }, [isOpen, onClose]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const totalSavings = cart.items.reduce((sum, i) => {
    // only count savings if the item was marked on-sale (price already discounted at add time)
    return sum;
  }, 0);

  const itemCount = cart.items.reduce((s, i) => s + i.quantity, 0);

  return (
    <>
      <div className={`${styles.backdrop} ${isOpen ? styles.backdropVisible : ''}`}
        onClick={onClose} aria-hidden="true" />

      <aside className={`${styles.drawer} ${isOpen ? styles.drawerOpen : ''}`}
        aria-label="Shopping cart" aria-hidden={!isOpen}>

        <div className={styles.drawerHeader}>
          <div>
            <h2 className={styles.drawerTitle}>Cart</h2>
            {itemCount > 0 && <p className={styles.itemCount}>{itemCount} item{itemCount !== 1 ? 's' : ''}</p>}
          </div>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close cart">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <div className={styles.drawerBody}>
          {cart.items.length === 0 ? (
            <div className={styles.empty}>
              <CartEmptyIcon />
              <p className={styles.emptyText}>Your cart is empty</p>
              <button className={styles.continueBtn} onClick={onClose}>Continue Shopping</button>
            </div>
          ) : (
            <ul className={styles.itemList}>
              {cart.items.map(item => (
                <li key={item.key} className={styles.cartItem}>
                  <img src={item.image} alt={item.name} className={styles.itemImg} />
                  <div className={styles.itemInfo}>
                    <p className={styles.itemName}>{item.name}</p>
                    <p className={styles.itemMeta}>
                      {item.color.charAt(0).toUpperCase() + item.color.slice(1)} · {item.size?.toUpperCase()}
                    </p>
                    <p className={styles.itemUnitPrice}>₹{item.price.toFixed(2)} each</p>
                    <div className={styles.itemBottom}>
                      {/* Qty stepper */}
                      <div className={styles.stepper}>
                        <button className={styles.stepBtn}
                          onClick={() => {
                            if (item.quantity <= 1) dispatch({ type: 'REMOVE_ITEM', payload: item.key });
                            else dispatch({ type: 'UPDATE_QUANTITY', payload: { key: item.key, quantity: item.quantity - 1 } });
                          }}
                          aria-label="Decrease quantity">−</button>
                        <span className={styles.stepValue}>{item.quantity}</span>
                        <button className={styles.stepBtn}
                          onClick={() => dispatch({ type: 'UPDATE_QUANTITY', payload: { key: item.key, quantity: item.quantity + 1 } })}
                          aria-label="Increase quantity">+</button>
                      </div>
                      <span className={styles.itemTotal}>₹{(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  </div>
                  <button className={styles.removeBtn}
                    onClick={() => dispatch({ type: 'REMOVE_ITEM', payload: item.key })}
                    aria-label={`Remove ${item.name}`}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {cart.items.length > 0 && (
          <div className={styles.drawerFooter}>
            <div className={styles.priceBreakdown}>
              <div className={styles.priceRow}>
                <span>Subtotal</span>
                <span>₹{totalPrice.toFixed(2)}</span>
              </div>
              <div className={styles.priceRow}>
                <span>Delivery</span>
                <span className={styles.free}>FREE</span>
              </div>
              <div className={styles.priceRow}>
                <span className={styles.gstLabel}>GST (18%)</span>
                <span>₹{(totalPrice * 0.18).toFixed(2)}</span>
              </div>
              <div className={`${styles.priceRow} ${styles.totalRow}`}>
                <span>Total</span>
                <span>₹{(totalPrice * 1.18).toFixed(2)}</span>
              </div>
            </div>
            <button className={styles.checkoutBtn}>Proceed to Checkout</button>
            <button className={styles.clearBtn} onClick={() => dispatch({ type: 'CLEAR' })}>
              Clear cart
            </button>
          </div>
        )}
      </aside>
    </>
  );
}

const CartEmptyIcon = () => (
  <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" style={{color:'#ccc'}}>
    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
    <line x1="3" y1="6" x2="21" y2="6"/>
    <path d="M16 10a4 4 0 0 1-8 0"/>
  </svg>
);
