// Create the missing use-categories hook
import React from 'react';

interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
}

// Mock categories data
const mockCategories: Category[] = [
  {
    id: 'category-1',
    name: 'Clothing',
    slug: 'clothing',
    image: 'https://img.heroui.chat/image/clothing?w=300&h=300&u=1'
  },
  {
    id: 'category-2',
    name: 'Shoes',
    slug: 'shoes',
    image: 'https://img.heroui.chat/image/shoes?w=300&h=300&u=1'
  },
  {
    id: 'category-3',
    name: 'Accessories',
    slug: 'accessories',
    image: 'https://img.heroui.chat/image/fashion?w=300&h=300&u=1'
  },
  {
    id: 'category-4',
    name: 'Sportswear',
    slug: 'sportswear',
    image: 'https://img.heroui.chat/image/sports?w=300&h=300&u=1'
  },
  {
    id: 'category-5',
    name: 'Outerwear',
    slug: 'outerwear',
    image: 'https://img.heroui.chat/image/clothing?w=300&h=300&u=2'
  },
  {
    id: 'category-6',
    name: 'New Arrivals',
    slug: 'new-arrivals',
    image: 'https://img.heroui.chat/image/fashion?w=300&h=300&u=2'
  }
];

export const useCategories = () => {
  const [categories, setCategories] = React.useState<Category[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  
  React.useEffect(() => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setCategories(mockCategories);
      setIsLoading(false);
    }, 300);
  }, []);
  
  return { categories, isLoading };
};
