import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button, Divider } from "@heroui/react";
import { Icon } from "@iconify/react";
import { useAuth } from "../../context/auth-context";

export const Sidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  const isActive = (path: string) => {
    return location.pathname.startsWith(path);
  };

  const navItems = [
    { path: "/admin/dashboard", label: "Dashboard", icon: "lucide:layout-dashboard" },
    { path: "/admin/products", label: "Products", icon: "lucide:package" },
    { path: "/admin/orders", label: "Orders", icon: "lucide:shopping-cart" },
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-4 flex items-center gap-2">
        <Icon icon="lucide:shopping-bag" className="text-primary text-xl" />
        <h1 className="text-xl font-semibold">Admin Panel</h1>
      </div>
      
      <Divider />
      
      <div className="flex flex-col p-2 flex-grow">
        {navItems.map((item) => (
          <Link key={item.path} to={item.path}>
            <Button
              variant={isActive(item.path) ? "solid" : "flat"}
              color={isActive(item.path) ? "primary" : "default"}
              className="justify-start mb-1 w-full"
              startContent={<Icon icon={item.icon} />}
            >
              {item.label}
            </Button>
          </Link>
        ))}
      </div>
      
      <Divider />
      
      <div className="p-4">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white">
            {user?.name.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{user?.name}</p>
            <p className="text-xs text-gray-500 truncate">{user?.email}</p>
          </div>
        </div>
        <Button 
          color="danger" 
          variant="flat" 
          onPress={handleLogout}
          startContent={<Icon icon="lucide:log-out" />}
          className="w-full"
        >
          Logout
        </Button>
      </div>
    </aside>
  );
};