import { useState, useEffect } from 'react';
import { getGalleryImages, SALE_DISCOUNT, scalePrice } from '../data/productConfig';

const API_BASE = 'https://fakestoreapi.com';

export function useProduct(productId) {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!productId) return;
    let cancelled = false;

    async function fetchProduct() {
      try {
        setLoading(true);
        setError(null);
        setProduct(null);

        await new Promise(r => setTimeout(r, 400));

        const res = await fetch(`${API_BASE}/products/${productId}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();

        if (cancelled) return;

        const originalPrice = scalePrice(data.price);
        const salePrice = parseFloat((originalPrice * (1 - SALE_DISCOUNT)).toFixed(2));
        const onSale = data.id % 3 === 0;

        setProduct({
          id: data.id,
          name: data.title,
          brand: 'Terranova Gear Co.',
          description: data.description,
          originalPrice,
          salePrice,
          onSale,
          category: data.category,
          rating: data.rating,
          thumbnail: data.image,
          images: getGalleryImages(data.id, data.category, data.image), // correct mapping
        });
      } catch (err) {
        if (!cancelled) setError('Failed to load product. Please try again.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchProduct();
    return () => { cancelled = true; };
  }, [productId]);

  return { product, loading, error };
}
