import React from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "./sidebar";

export const AdminLayout: React.FC = () => {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 overflow-auto p-6">
        <Outlet />
      </main>
    </div>
  );
};