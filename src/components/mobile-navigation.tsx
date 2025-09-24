import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Badge } from "@heroui/react";
import { Icon } from "@iconify/react";
import { useCart } from "../hooks/use-cart";
import { motion } from "framer-motion";

const MobileNavigation: React.FC = () => {
  const location = useLocation();
  const { cartItems } = useCart();

  const cartItemCount = cartItems.reduce(
    (total, item) => total + item.quantity,
    0,
  );

  const isActive = (path: string) => {
    return (
      location.pathname === path || location.pathname.startsWith(path + "/")
    );
  };

  const navItems = [
    { path: "/", icon: "lucide:home", label: "Home" },
    { path: "/products", icon: "lucide:grid", label: "Products" },
    { path: "/search", icon: "lucide:search", label: "Search" },
    {
      path: "/cart",
      icon: "lucide:shopping-cart",
      label: "Cart",
      badge: cartItemCount,
    },
    { path: "/account", icon: "lucide:user", label: "Account" },
  ];

  return (
    <motion.nav
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-divider"
    >
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => (
          <Link
            key={item.path}
            href={item.path}
            className="flex flex-col items-center justify-center w-full h-full"
          >
            <div className="relative">
              {item.badge > 0 && (
                <Badge
                  content={item.badge}
                  color="primary"
                  shape="circle"
                  size="sm"
                  className="absolute -top-1 -right-2"
                />
              )}
              <Icon
                icon={item.icon}
                className={`text-xl ${isActive(item.path) ? "text-primary" : "text-default-500"}`}
              />
            </div>
            <span
              className={`text-tiny mt-1 ${isActive(item.path) ? "text-primary font-medium" : "text-default-500"}`}
            >
              {item.label}
            </span>
          </Link>
        ))}
      </div>
    </motion.nav>
  );
};

export default MobileNavigation;
