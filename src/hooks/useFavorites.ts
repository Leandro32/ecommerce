import { useState, useEffect, useCallback } from 'react';

const FAVORITES_KEY = 'ecommerce-favorites';

export const useFavorites = () => {
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);

  useEffect(() => {
    try {
      const storedFavorites = localStorage.getItem(FAVORITES_KEY);
      if (storedFavorites) {
        setFavoriteIds(JSON.parse(storedFavorites));
      }
    } catch (error) {
      console.error("Failed to parse favorites from localStorage", error);
    }
  }, []);

  const toggleFavorite = useCallback((productId: string) => {
    setFavoriteIds(prevIds => {
      const newIds = prevIds.includes(productId)
        ? prevIds.filter(id => id !== productId)
        : [...prevIds, productId];
      
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(newIds));
      return newIds;
    });
  }, []);

  const isFavorite = useCallback((productId: string) => {
    return favoriteIds.includes(productId);
  }, [favoriteIds]);

  return { favoriteIds, toggleFavorite, isFavorite };
};
