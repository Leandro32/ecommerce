// Create the missing use-brands hook
import React from 'react';

interface Brand {
  id: string;
  name: string;
  logo?: string;
}

// Mock brands data
const mockBrands: Brand[] = [
  { id: 'brand-1', name: 'Brand 1' },
  { id: 'brand-2', name: 'Brand 2' },
  { id: 'brand-3', name: 'Brand 3' },
  { id: 'brand-4', name: 'Brand 4' },
  { id: 'brand-5', name: 'Brand 5' },
  { id: 'brand-6', name: 'Brand 6' }
];

export const useBrands = () => {
  const [brands, setBrands] = React.useState<Brand[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  
  React.useEffect(() => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setBrands(mockBrands);
      setIsLoading(false);
    }, 300);
  }, []);
  
  return { brands, isLoading };
};
