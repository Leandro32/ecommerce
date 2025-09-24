"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Button,
  Badge,
  Input,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { useTranslation } from "react-i18next";
import { useCart } from "../context/CartContext";
import { useSearch } from "../hooks/use-search";
import LanguageSwitcher from "./LanguageSwitcher";

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface HeaderProps {
  categories: Category[];
}

const Header: React.FC<HeaderProps> = ({ categories }) => {
  const { t } = useTranslation(["navigation", "common"]);
  const pathname = usePathname();
  const router = useRouter();
  const { cartItems } = useCart();
  const [searchQuery, setSearchQuery] = React.useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    router.push(`/products?search=${encodeURIComponent(searchQuery)}`);
  };

  const cartItemCount = cartItems.reduce(
    (total, item) => total + item.quantity,
    0,
  );

  const isActive = (path: string) => {
    return pathname === path;
  };

  const handleCategoryNavigation = (categorySlug: string) => {
    router.push(`/products/${categorySlug}`);
  };

  return (
    <Navbar
      className="fixed top-0 w-full z-50 border-b border-divider bg-background/80 backdrop-blur-md"
      maxWidth="7xl"
      height="3.5rem"
    >
      <NavbarBrand as={Link} href="/" className="gap-2">
        <Icon icon="lucide:shopping-bag" className="text-primary text-xl" />
        <p className="font-semibold text-inherit">NOVA</p>
      </NavbarBrand>

      <NavbarContent className="hidden md:flex gap-4" justify="center">
        <NavbarItem isActive={isActive("/")} as={Link} href="/">
          {t("navigation:main.home")}
        </NavbarItem>
        <Dropdown>
          <NavbarItem>
            <DropdownTrigger>
              <Button
                disableRipple
                variant="light"
                className="p-0 text-sm font-normal"
                endContent={
                  <Icon icon="lucide:chevron-down" className="text-sm" />
                }
              >
                {t("navigation:main.categories")}
              </Button>
            </DropdownTrigger>
          </NavbarItem>
          <DropdownMenu aria-label="Categories">
            {categories.map((category) => (
              <DropdownItem
                key={category.id}
                textValue={category.name}
                onPress={() => handleCategoryNavigation(category.slug)}
              >
                {category.name}
              </DropdownItem>
            ))}
          </DropdownMenu>
        </Dropdown>
        <NavbarItem isActive={isActive("/products")} as={Link} href="/products">
          {t("navigation:main.products")}
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
              placeholder={t("navigation:main.search")}
              size="sm"
              startContent={
                <Icon
                  icon="lucide:search"
                  className="text-default-400 text-sm"
                />
              }
              type="search"
              value={searchQuery}
              onValueChange={setSearchQuery}
            />
          </form>
        </NavbarItem>
        <NavbarItem>
          <LanguageSwitcher />
        </NavbarItem>
        <NavbarItem as={Link} href="/account">
          <div
            className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-default-100 cursor-pointer"
            role="button"
            tabIndex={0}
            aria-label="Account"
          >
            <Icon icon="lucide:user" className="text-lg" />
          </div>
        </NavbarItem>
        <NavbarItem as={Link} href="/cart">
          <Badge
            content={cartItemCount > 0 ? cartItemCount : null}
            color="primary"
            shape="circle"
            size="sm"
          >
            <div
              className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-default-100 cursor-pointer"
              role="button"
              tabIndex={0}
              aria-label="Cart"
            >
              <Icon icon="lucide:shopping-cart" className="text-lg" />
            </div>
          </Badge>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
};

export default Header;
