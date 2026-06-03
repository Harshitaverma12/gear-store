import { createContext, useContext, useReducer, useEffect } from 'react';

const WishlistContext = createContext(null);
const STORAGE_KEY = 'terranova_wishlist';

function loadWishlist() {
  try {
    const s = localStorage.getItem(STORAGE_KEY);
    if (s) return JSON.parse(s);
  } catch {}
  return { items: [] };
}

function reducer(state, action) {
  switch (action.type) {
    case 'TOGGLE': {
      const exists = state.items.find(i => i.id === action.payload.id);
      return { items: exists ? state.items.filter(i => i.id !== action.payload.id) : [...state.items, action.payload] };
    }
    default: return state;
  }
}

export function WishlistProvider({ children }) {
  const [wishlist, dispatch] = useReducer(reducer, undefined, loadWishlist);
  useEffect(() => { localStorage.setItem(STORAGE_KEY, JSON.stringify(wishlist)); }, [wishlist]);
  const isWishlisted = (id) => wishlist.items.some(i => i.id === id);
  return (
    <WishlistContext.Provider value={{ wishlist, dispatch, isWishlisted, total: wishlist.items.length }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error('useWishlist must be used within WishlistProvider');
  return ctx;
}
