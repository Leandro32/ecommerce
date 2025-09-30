import React from "react";
import { Button, Input, Card, CardBody, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Pagination, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Chip } from "@heroui/react";
import { Icon } from "@iconify/react";
import { Link, useSearchParams } from "react-router-dom";
import { mockProducts, mockCategories } from "../data/mock-data";

export const ProductsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isLoading, setIsLoading] = React.useState(true);
  const [page, setPage] = React.useState(1);
  
  const searchQuery = searchParams.get("q") || "";
  const categoryFilter = searchParams.get("category") || "";
  
  const rowsPerPage = 10;
  
  React.useEffect(() => {
    // Simulate API loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  const handleSearch = (value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set("q", value);
    } else {
      params.delete("q");
    }
    params.set("page", "1");
    setSearchParams(params);
    setPage(1);
  };
  
  const handleCategoryFilter = (category: string) => {
    const params = new URLSearchParams(searchParams);
    if (category) {
      params.set("category", category);
    } else {
      params.delete("category");
    }
    params.set("page", "1");
    setSearchParams(params);
    setPage(1);
  };
  
  // Filter products based on search and category
  const filteredProducts = React.useMemo(() => {
    return mockProducts.filter(product => {
      const matchesSearch = !searchQuery || 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.sku.toLowerCase().includes(searchQuery.toLowerCase());
        
      const matchesCategory = !categoryFilter || product.category === categoryFilter;
      
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, categoryFilter]);
  
  // Paginate products
  const paginatedProducts = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return filteredProducts.slice(start, end);
  }, [filteredProducts, page]);
  
  const totalPages = Math.ceil(filteredProducts.length / rowsPerPage);
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Products</h1>
        <Button 
          color="primary"
          startContent={<Icon icon="lucide:plus" />}
          as={Link}
          to="/admin/products/new"
        >
          Add Product
        </Button>
      </div>
      
      <Card>
        <CardBody>
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <Input
              placeholder="Search products..."
              value={searchQuery}
              onValueChange={handleSearch}
              startContent={<Icon icon="lucide:search" className="text-default-400" />}
              isClearable
              className="w-full md:w-80"
            />
            
            <div className="flex gap-2 ml-auto">
              <Dropdown>
                <DropdownTrigger>
                  <Button 
                    variant="flat" 
                    endContent={<Icon icon="lucide:chevron-down" className="text-small" />}
                  >
                    {categoryFilter ? `Category: ${categoryFilter}` : "All Categories"}
                  </Button>
                </DropdownTrigger>
                <DropdownMenu 
                  aria-label="Category filter"
                  onAction={(key) => handleCategoryFilter(key.toString())}
                  selectedKeys={categoryFilter ? [categoryFilter] : []}
                  selectionMode="single"
                >
                  <DropdownItem key="">All Categories</DropdownItem>
                  {mockCategories.map((category) => (
                    <DropdownItem key={category}>{category}</DropdownItem>
                  ))}
                </DropdownMenu>
              </Dropdown>
            </div>
          </div>
          
          <Table 
            aria-label="Products table"
            removeWrapper
            isHeaderSticky
            bottomContent={
              <div className="flex w-full justify-center">
                <Pagination
                  isCompact
                  showControls
                  showShadow
                  color="primary"
                  page={page}
                  total={totalPages}
                  onChange={setPage}
                />
              </div>
            }
          >
            <TableHeader>
              <TableColumn>PRODUCT</TableColumn>
              <TableColumn>SKU</TableColumn>
              <TableColumn>CATEGORY</TableColumn>
              <TableColumn>PRICE</TableColumn>
              <TableColumn>STOCK</TableColumn>
              <TableColumn>ACTIONS</TableColumn>
            </TableHeader>
            <TableBody 
              isLoading={isLoading}
              loadingContent={<div className="p-3">Loading products...</div>}
              emptyContent={<div className="p-3">No products found</div>}
              items={paginatedProducts}
            >
              {(item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-md bg-gray-100 flex items-center justify-center">
                        <Icon icon="lucide:image" className="text-gray-400" />
                      </div>
                      <div>
                        <div className="font-medium">{item.name}</div>
                        <div className="text-xs text-gray-500">ID: {item.id}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{item.sku}</TableCell>
                  <TableCell>
                    <Chip size="sm" variant="flat">{item.category}</Chip>
                  </TableCell>
                  <TableCell>${item.price.toFixed(2)}</TableCell>
                  <TableCell>
                    <Chip 
                      size="sm" 
                      color={item.stock > 10 ? "success" : item.stock > 0 ? "warning" : "danger"}
                    >
                      {item.stock} in stock
                    </Chip>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button 
                        isIconOnly 
                        size="sm" 
                        variant="light"
                        as={Link}
                        to={`/admin/products/${item.id}/edit`}
                      >
                        <Icon icon="lucide:edit" className="text-default-500" />
                      </Button>
                      <Button 
                        isIconOnly 
                        size="sm" 
                        variant="light" 
                        color="danger"
                      >
                        <Icon icon="lucide:trash" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardBody>
      </Card>
    </div>
  );
};