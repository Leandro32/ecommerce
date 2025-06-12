// Create the missing use-search hook
import React from 'react';
import { useHistory } from 'react-router-dom';

export const useSearch = () => {
  const [searchQuery, setSearchQuery] = React.useState('');
  const history = useHistory();
  
  const handleSearch = (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }
    
    if (searchQuery.trim()) {
      history.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };
  
  return { searchQuery, setSearchQuery, handleSearch };
};
