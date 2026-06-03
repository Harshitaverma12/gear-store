import { useState, useCallback, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getVariantsForCategory, LOW_STOCK_THRESHOLD } from '../data/productConfig';

export function useVariantSelection(category) {
  const [searchParams, setSearchParams] = useSearchParams();
  const variants = getVariantsForCategory(category);
  const { colors, sizes } = variants;

  const initialColor = searchParams.get('color') || colors[0].id;
  const initialSize  = searchParams.get('size')  || null;

  const [selectedColor, setSelectedColor] = useState(
    colors.find(c => c.id === initialColor) ? initialColor : colors[0].id
  );
  const [selectedSize, setSelectedSize] = useState(
    sizes.find(s => s.id === initialSize && s.stock > 0) ? initialSize : null
  );
  const [quantity, setQuantity] = useState(1);

  // Reset selection when category changes (navigating between products)
  useEffect(() => {
    setSelectedColor(colors[0].id);
    setSelectedSize(null);
    setQuantity(1);
  }, [category]);

  // Sync URL
  useEffect(() => {
    const params = {};
    if (selectedColor) params.color = selectedColor;
    if (selectedSize)  params.size  = selectedSize;
    setSearchParams(params, { replace: true });
  }, [selectedColor, selectedSize, setSearchParams]);

  const currentSize = sizes.find(s => s.id === selectedSize);
  const maxQty      = currentSize?.stock ?? 1;
  const isSoldOut   = currentSize ? currentSize.stock === 0 : false;
  const isLowStock  = currentSize ? currentSize.stock > 0 && currentSize.stock <= LOW_STOCK_THRESHOLD : false;

  const handleColorChange = useCallback((colorId) => {
    setSelectedColor(colorId);
  }, []);

  const handleSizeChange = useCallback((sizeId) => {
    const size = sizes.find(s => s.id === sizeId);
    if (!size || size.stock === 0) return;
    setSelectedSize(sizeId);
    setQuantity(1);
  }, [sizes]);

  const handleQuantityChange = useCallback((val) => {
    const n = parseInt(val, 10);
    if (isNaN(n)) return;
    setQuantity(Math.max(1, Math.min(n, maxQty)));
  }, [maxQty]);

  return {
    variants,
    selectedColor,
    selectedSize,
    quantity,
    isSoldOut,
    isLowStock,
    maxQty,
    handleColorChange,
    handleSizeChange,
    handleQuantityChange,
  };
}
