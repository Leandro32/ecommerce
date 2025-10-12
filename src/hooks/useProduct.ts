'use client';

import { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { Product } from '../types/product';

async function getProduct(slug: string): Promise<Product | null> {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  try {
    const res = await fetch(`${baseUrl}/products/${slug}`);
    if (!res.ok) {
      if (res.status === 404) return null;
      throw new Error('Failed to fetch product');
    }
    const json = await res.json();
    return json.data;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export function useProduct(slug: string) {
  const { items } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError(null);

      // Check if product is in cart first
      const cartProduct = items.find(item => item.product.slug === slug);

      if (cartProduct) {
        setProduct(cartProduct.product);
        setLoading(false);
      } else {
        try {
          const apiProduct = await getProduct(slug);
          setProduct(apiProduct);
        } catch (e: any) {
          setError(e);
        } finally {
          setLoading(false);
        }
      }
    };

    if (slug) {
      fetchProduct();
    }

  }, [slug, items]);

  return { product, loading, error };
}
