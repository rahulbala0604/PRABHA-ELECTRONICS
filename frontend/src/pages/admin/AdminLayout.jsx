import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingBag, Users, Settings, Tag, MessageSquare, Star, Grid, Box } from 'lucide-react';

const AdminLayout = () => {
  const location = useLocation();

  const menuItems = [
    { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/admin' },
    { name: 'Products', icon: <Package size={20} />, path: '/admin/products' },
    { name: 'Categories', icon: <Grid size={20} />, path: '/admin/categories' },
    { name: 'Brands', icon: <Box size={20} />, path: '/admin/brands' },
    { name: 'Orders', icon: <ShoppingBag size={20} />, path: '/admin/orders' },
    { name: 'Customers', icon: <Users size={20} />, path: '/admin/customers' },
    { name: 'Offers', icon: <Tag size={20} />, path: '/admin/offers' },
    { name: 'Enquiries', icon: <MessageSquare size={20} />, path: '/admin/enquiries' },
    { name: 'Reviews', icon: <Star size={20} />, path: '/admin/reviews' },
    { name: 'Settings', icon: <Settings size={20} />, path: '/admin/settings' },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar Desktop */}
      <div className="hidden md:flex flex-col w-64 bg-primary text-white flex-shrink-0 min-h-full border-r border-gray-100/10 shadow-premium z-10">
        <div className="p-6 text-center border-b border-white/10 mt-4 mb-4">
          <h2 className="text-xl font-extrabold text-white tracking-tight flex items-center justify-center gap-2">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse"></span>
            PRABHA <span className="text-accent">ADMIN</span>
          </h2>
        </div>
        <div className="flex-1 py-4 overflow-y-auto custom-scrollbar">
          <ul className="space-y-1.5 px-3">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path || (location.pathname.startsWith(item.path) && item.path !== '/admin');
              return (
                <li key={item.name}>
                  <Link
                    to={item.path}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                      isActive
                        ? 'bg-accent/20 text-accent font-bold shadow-sm'
                        : 'text-gray-400 hover:bg-white/5 hover:text-white font-medium hover:translate-x-1'
                    }`}
                  >
                    <div className={isActive ? 'text-accent' : 'text-gray-400'}>{item.icon}</div>
                    <span>{item.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <div className="p-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
