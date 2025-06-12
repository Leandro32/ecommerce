import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Button, Badge, Input, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from '@heroui/react';
import { Icon } from '@iconify/react';
import { useCart } from '../hooks/use-cart';
import { useSearch } from '../hooks/use-search';
import { useCategories } from '../hooks/use-categories';

const Header: React.FC = () => {
  const location = useLocation();
  const { cartItems } = useCart();
  const { searchQuery, setSearchQuery, handleSearch } = useSearch();
  const { categories } = useCategories();
  
  const cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <Navbar 
      className="fixed top-0 w-full z-50 border-b border-divider bg-background/80 backdrop-blur-md"
      maxWidth="xl"
      height="3.5rem"
    >
      <NavbarBrand as={Link} to="/" className="gap-2">
        <Icon icon="lucide:shopping-bag" className="text-primary text-xl" />
        <p className="font-semibold text-inherit">NOVA</p>
      </NavbarBrand>
      
      <NavbarContent className="hidden md:flex gap-4" justify="center">
        <NavbarItem isActive={isActive('/')}>
          <Link to="/" className="text-sm">Home</Link>
        </NavbarItem>
        <Dropdown>
          <NavbarItem>
            <DropdownTrigger>
              <Button
                disableRipple
                variant="light"
                className="p-0 text-sm font-normal"
                endContent={<Icon icon="lucide:chevron-down" className="text-sm" />}
              >
                Categories
              </Button>
            </DropdownTrigger>
          </NavbarItem>
          <DropdownMenu aria-label="Categories">
            {categories.map((category) => (
              <DropdownItem key={category.id} textValue={category.name}>
                <Link 
                  to={`/products/${category.slug}`}
                  className="w-full block"
                >
                  {category.name}
                </Link>
              </DropdownItem>
            ))}
          </DropdownMenu>
        </Dropdown>
        <NavbarItem isActive={isActive('/products')}>
          <Link to="/products" className="text-sm">All Products</Link>
        </NavbarItem>
      </NavbarContent>
      
      <NavbarContent justify="end">
        <NavbarItem className="hidden sm:flex">
          <form onSubmit={handleSearch} className="max-w-[180px] md:max-w-xs">
            <Input
              classNames={{
                base: "max-w-full",
                inputWrapper: "h-8",
              }}
              placeholder="Search..."
              size="sm"
              startContent={<Icon icon="lucide:search" className="text-default-400 text-sm" />}
              type="search"
              value={searchQuery}
              onValueChange={setSearchQuery}
            />
          </form>
        </NavbarItem>
        <NavbarItem>
          <Link to="/account">
            <Button isIconOnly variant="light" radius="full" size="sm" aria-label="Account">
              <Icon icon="lucide:user" className="text-lg" />
            </Button>
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link to="/cart">
            <Badge 
              content={cartItemCount > 0 ? cartItemCount : null} 
              color="primary" 
              shape="circle" 
              size="sm"
            >
              <Button isIconOnly variant="light" radius="full" size="sm" aria-label="Cart">
                <Icon icon="lucide:shopping-cart" className="text-lg" />
              </Button>
            </Badge>
          </Link>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
};

export default Header;