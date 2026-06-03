import { Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { Header } from './components/UI/Header';
import { ShopPage } from './pages/ShopPage';
import { ProductPage } from './pages/ProductPage';
import { WishlistPage } from './pages/WishlistPage';
import styles from './App.module.scss';

export default function App() {
  return (
    <CartProvider>
      <WishlistProvider>
        <div className={styles.app}>
          <Header />
          <main>
            <Routes>
              <Route path="/" element={<ShopPage />} />
              <Route path="/product/:id" element={<ProductPage />} />
              <Route path="/wishlist" element={<WishlistPage />} />
            </Routes>
          </main>
          <footer className={styles.footer}>
            <p>© 2024 Terranova Gear Co. — Built for the wild.</p>
          </footer>
        </div>
      </WishlistProvider>
    </CartProvider>
  );
}
