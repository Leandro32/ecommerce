import React from "react";
import { Input, Button, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@heroui/react";
import { Icon } from "@iconify/react";
import { mockProducts } from "../../data/mock-data";
import { useDebounce } from "../../hooks/useDebounce";

interface Product {
  id: string;
  name: string;
  sku: string;
  price: number;
  stock: number;
}

interface LineItem {
  id: string;
  name: string;
  sku: string;
  price: number;
  quantity: number;
}

interface LineItemBuilderProps {
  items: LineItem[];
  onChange: (items: LineItem[]) => void;
}

export const LineItemBuilder: React.FC<LineItemBuilderProps> = ({ items, onChange }) => {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [searchResults, setSearchResults] = React.useState<Product[]>([]);
  const [isSearching, setIsSearching] = React.useState(false);
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  React.useEffect(() => {
    if (!debouncedSearchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    // Simulate API search
    setTimeout(() => {
      const results = mockProducts.filter(product => 
        product.name.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
        product.sku.toLowerCase().includes(debouncedSearchQuery.toLowerCase())
      ).slice(0, 5);
      
      setSearchResults(results);
      setIsSearching(false);
    }, 300);
  }, [debouncedSearchQuery]);
  
  const handleAddProduct = (product: Product) => {
    const existingItemIndex = items.findIndex(item => item.id === product.id);
    
    if (existingItemIndex >= 0) {
      const updatedItems = [...items];
      updatedItems[existingItemIndex].quantity += 1;
      onChange(updatedItems);
    } else {
      onChange([...items, {
        id: product.id,
        name: product.name,
        sku: product.sku,
        price: product.price,
        quantity: 1
      }]);
    }
    
    setSearchQuery("");
    setSearchResults([]);
  };
  
  const handleUpdateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveItem(id);
      return;
    }
    
    const updatedItems = items.map(item => 
      item.id === id ? { ...item, quantity } : item
    );
    
    onChange(updatedItems);
  };
  
  const handleRemoveItem = (id: string) => {
    onChange(items.filter(item => item.id !== id));
  };
  
  return (
    <div className="space-y-4">
      <div className="relative">
        <Input
          label="Search Products"
          placeholder="Search by name or SKU..."
          value={searchQuery}
          onValueChange={setSearchQuery}
          startContent={
            isSearching ? (
              <Icon icon="lucide:loader" className="text-default-400 animate-spin" />
            ) : (
              <Icon icon="lucide:search" className="text-default-400" />
            )
          }
          isClearable
        />
        
        {searchResults.length > 0 && (
          <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
            {searchResults.map(product => (
              <div
                key={product.id}
                className="flex items-center justify-between p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100"
                onClick={() => handleAddProduct(product)}
              >
                <div>
                  <div className="font-medium">{product.name}</div>
                  <div className="text-xs text-gray-500">SKU: {product.sku}</div>
                </div>
                <div className="text-right">
                  <div className="font-medium">${product.price.toFixed(2)}</div>
                  <div className="text-xs text-gray-500">
                    {product.stock} in stock
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {items.length > 0 ? (
        <Table removeWrapper aria-label="Order items">
          <TableHeader>
            <TableColumn>PRODUCT</TableColumn>
            <TableColumn>PRICE</TableColumn>
            <TableColumn>QUANTITY</TableColumn>
            <TableColumn>TOTAL</TableColumn>
            <TableColumn>ACTIONS</TableColumn>
          </TableHeader>
          <TableBody items={items}>
            {(item: LineItem) => (
              <TableRow key={item.id}>
                <TableCell>
                  <div>
                    <div className="font-medium">{item.name}</div>
                    <div className="text-xs text-gray-500">SKU: {item.sku}</div>
                  </div>
                </TableCell>
                <TableCell>${item.price.toFixed(2)}</TableCell>
                <TableCell>
                  <div className="flex items-center w-24">
                    <Button
                      isIconOnly
                      size="sm"
                      variant="flat"
                      onPress={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                    >
                      <Icon icon="lucide:minus" />
                    </Button>
                    <Input
                      type="number"
                      value={item.quantity.toString()}
                      onValueChange={(value) => handleUpdateQuantity(item.id, parseInt(value) || 1)}
                      className="w-12 mx-1"
                      classNames={{
                        input: "text-center"
                      }}
                    />
                    <Button
                      isIconOnly
                      size="sm"
                      variant="flat"
                      onPress={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                    >
                      <Icon icon="lucide:plus" />
                    </Button>
                  </div>
                </TableCell>
                <TableCell>${(item.price * item.quantity).toFixed(2)}</TableCell>
                <TableCell>
                  <Button
                    isIconOnly
                    size="sm"
                    variant="light"
                    color="danger"
                    onPress={() => handleRemoveItem(item.id)}
                  >
                    <Icon icon="lucide:trash" />
                  </Button>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      ) : (
        <div className="text-center py-8 border border-dashed border-gray-300 rounded-md">
          <Icon icon="lucide:shopping-cart" className="text-gray-400 text-3xl mx-auto mb-2" />
          <p className="text-gray-500">No products added yet</p>
          <p className="text-sm text-gray-400">Search for products to add them to the order</p>
        </div>
      )}
    </div>
  );
};