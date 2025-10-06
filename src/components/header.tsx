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
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { useTranslation } from "react-i18next";
import { useCart } from "../context/CartContext";
import LanguageSwitcher from "./LanguageSwitcher";

interface HeaderProps {
  // categories: Category[]; // Categories are no longer passed as a prop
}

const Header: React.FC<HeaderProps> = ({}) => {
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

  return (
    <Navbar
      className="fixed top-0 w-full z-50 border-b border-divider bg-background/80 backdrop-blur-md"
      maxWidth="7xl"
      height="3.5rem"
    >
      <NavbarBrand as={Link} href="/" className="gap-2">
        <Icon icon="lucide:shopping-bag" className="text-primary text-xl" />
        <p className="font-semibold text-inherit">AURA</p>
      </NavbarBrand>

      <NavbarContent className="hidden md:flex gap-4" justify="center">
        <NavbarItem isActive={isActive("/")} as={Link} href="/">
          {t("navigation:main.home")}
        </NavbarItem>
        {/* Categories dropdown removed as categories are no longer part of the product model */}
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
