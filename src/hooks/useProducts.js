import { useState, useEffect } from 'react';
import { getGalleryImages, SALE_DISCOUNT, scalePrice } from '../data/productConfig';

const API_BASE = 'https://fakestoreapi.com';

export function useProducts(category = null, saleOnly = false) {
  const [allProducts, setAllProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchAll() {
      try {
        setLoading(true);
        setError(null);

        const [productsRes, categoriesRes] = await Promise.all([
          fetch(`${API_BASE}/products`),
          fetch(`${API_BASE}/products/categories`),
        ]);

        if (!productsRes.ok) throw new Error(`HTTP ${productsRes.status}`);

        const [rawProducts, rawCategories] = await Promise.all([
          productsRes.json(),
          categoriesRes.ok ? categoriesRes.json() : Promise.resolve([]),
        ]);

        if (cancelled) return;

        const shaped = rawProducts.map(p => ({
          id: p.id,
          name: p.title,
          brand: 'Terranova Gear Co.',
          description: p.description,
          originalPrice: scalePrice(p.price),
          salePrice: parseFloat((scalePrice(p.price) * (1 - SALE_DISCOUNT)).toFixed(2)),
          onSale: p.id % 3 === 0,
          category: p.category,
          rating: p.rating,
          thumbnail: p.image,                                        // actual product image from API
          images: getGalleryImages(p.id, p.category, p.image),      // API image first + category extras
        }));

        setAllProducts(shaped);
        setCategories(rawCategories);
      } catch (err) {
        if (!cancelled) setError('Failed to load products. Please try again.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchAll();
    return () => { cancelled = true; };
  }, []);

  let products = allProducts;
  if (saleOnly) {
    products = products.filter(p => p.onSale);
  } else if (category) {
    products = products.filter(p => p.category === category);
  }

  return { products, categories, loading, error };
}
