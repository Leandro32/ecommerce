'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Button, Input, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, Image } from '@heroui/react';
import { Icon } from '@iconify/react';
import { Product } from '../../types/product';
import { useDebounce } from '../../hooks/useDebounce';

interface OrderItem {
  productId: string;
  productName: string;
  productPrice: number;
  productImageUrl: string;
  quantity: number;
}

interface LineItemBuilderProps {
  onItemsChange: (items: OrderItem[]) => void;
  initialItems?: OrderItem[];
}

const LineItemBuilder: React.FC<LineItemBuilderProps> = ({ onItemsChange, initialItems = [] }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [selectedItems, setSelectedItems] = useState<OrderItem[]>(initialItems);

  useEffect(() => {
    if (debouncedSearchTerm) {
      const fetchProducts = async () => {
        try {
          const res = await fetch(`/api/v1/admin/products?search=${debouncedSearchTerm}`);
          if (!res.ok) {
            throw new Error('Failed to fetch products');
          }
          const json = await res.json();
          setSearchResults(json.data);
        } catch (error) {
          console.error('Error searching products:', error);
          setSearchResults([]);
        }
      };
      fetchProducts();
    } else {
      setSearchResults([]);
    }
  }, [debouncedSearchTerm]);

  useEffect(() => {
    onItemsChange(selectedItems);
  }, [selectedItems, onItemsChange]);

  const handleAddItem = useCallback((product: Product) => {
    setSelectedItems(prevItems => {
      const existingItem = prevItems.find(item => item.productId === product.id);
      if (existingItem) {
        return prevItems.map(item =>
          item.productId === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [
          ...prevItems,
          {
            productId: product.id,
            productName: product.name,
            productPrice: product.price,
            productImageUrl: product.imageUrl,
            quantity: 1,
          },
        ];
      }
    });
    setSearchTerm(''); // Clear search after adding
  }, []);

  const handleQuantityChange = useCallback((productId: string, newQuantity: number) => {
    setSelectedItems(prevItems => {
      if (newQuantity <= 0) {
        return prevItems.filter(item => item.productId !== productId);
      }
      return prevItems.map(item =>
        item.productId === productId ? { ...item, quantity: newQuantity } : item
      );
    });
  }, []);

  const handleRemoveItem = useCallback((productId: string) => {
    setSelectedItems(prevItems => prevItems.filter(item => item.productId !== productId));
  }, []);

  const subtotal = selectedItems.reduce((sum, item) => sum + item.productPrice * item.quantity, 0);

  return (
    <div>
      <Input
        placeholder="Search products by name or description..."
        value={searchTerm}
        onValueChange={setSearchTerm}
        startContent={<Icon icon="lucide:search" className="text-default-400" />}
        className="mb-4"
      />

      {searchResults.length > 0 && (
        <div className="border rounded-lg mb-4 max-h-60 overflow-y-auto">
          <Table aria-label="Search results">
            <TableHeader>
              <TableColumn>Product</TableColumn>
              <TableColumn>Price</TableColumn>
              <TableColumn>Action</TableColumn>
            </TableHeader>
            <TableBody>
              {searchResults.map(product => (
                <TableRow key={product.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Image src={product.imageUrl} alt={product.name} width={30} height={30} className="rounded" />
                      <span>{product.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>${product.price.toFixed(2)}</TableCell>
                  <TableCell>
                    <Button size="sm" variant="flat" onPress={() => handleAddItem(product)}>
                      Add
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <h3 className="text-lg font-semibold mb-3">Selected Items</h3>
      {selectedItems.length === 0 ? (
        <p className="text-default-500">No items selected yet.</p>
      ) : (
        <Table aria-label="Selected order items">
          <TableHeader>
            <TableColumn>Product</TableColumn>
            <TableColumn>Quantity</TableColumn>
            <TableColumn>Price</TableColumn>
            <TableColumn>Total</TableColumn>
            <TableColumn>Actions</TableColumn>
          </TableHeader>
          <TableBody>
            {selectedItems.map(item => (
              <TableRow key={item.productId}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Image src={item.productImageUrl} alt={item.productName} width={30} height={30} className="rounded" />
                    <span>{item.productName}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    value={String(item.quantity)}
                    onValueChange={(value) => handleQuantityChange(item.productId, Number(value))}
                    min={1}
                    className="w-20"
                    size="sm"
                  />
                </TableCell>
                <TableCell>${item.productPrice.toFixed(2)}</TableCell>
                <TableCell>${(item.productPrice * item.quantity).toFixed(2)}</TableCell>
                <TableCell>
                  <Button isIconOnly size="sm" variant="light" color="danger" onPress={() => handleRemoveItem(item.productId)}>
                    <Icon icon="lucide:trash" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <div className="flex justify-end mt-4 text-lg font-semibold">
        <span>Subtotal: ${subtotal.toFixed(2)}</span>
      </div>
    </div>
  );
};

export default LineItemBuilder;
