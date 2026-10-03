import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, Grid, Box, MessageSquare, Menu, X, LogOut, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const AdminLayout = () => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const menuItems = [
    { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/admin' },
    { name: 'Products', icon: <Package size={20} />, path: '/admin/products' },
    { name: 'Categories', icon: <Grid size={20} />, path: '/admin/categories' },
    { name: 'Brands', icon: <Box size={20} />, path: '/admin/brands' },
    { name: 'Enquiries', icon: <MessageSquare size={20} />, path: '/admin/enquiries' },
  ];

  const handleLinkClick = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 font-sans">
      {/* Admin Header */}
      <header className="bg-primary text-white shadow-md z-40 sticky top-0 h-16 flex items-center justify-between px-4 lg:px-8">
        <div className="flex items-center gap-4">
          <button 
            className="lg:hidden p-2 hover:bg-white/10 rounded-md transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <Menu size={24} />
          </button>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse"></span>
            <span className="font-extrabold text-xl tracking-wide hidden sm:block">PRABHA ADMIN</span>
            <span className="font-extrabold text-xl tracking-wide sm:hidden">ADMIN</span>
          </div>
        </div>
        
        <div className="flex items-center gap-4 lg:gap-6">
          <div className="hidden sm:flex items-center gap-2 text-sm text-gray-300">
            <User size={16} />
            <span>{user?.name || 'Admin User'}</span>
          </div>
          <button 
            onClick={logout}
            className="flex items-center gap-2 text-sm font-medium hover:text-accent transition-colors px-3 py-1.5 rounded-md hover:bg-white/10"
          >
            <LogOut size={16} />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>

      <div className="flex flex-1 relative overflow-hidden">
        {/* Mobile Overlay */}
        {isMobileMenuOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          ></div>
        )}

        {/* Sidebar */}
        <aside 
          className={`fixed lg:static inset-y-0 left-0 w-64 bg-primary text-white border-r border-gray-100/10 shadow-premium z-50 transform transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 flex flex-col`}
        >
          <div className="p-4 flex items-center justify-between lg:hidden border-b border-white/10">
            <span className="font-bold text-lg text-accent">Menu</span>
            <button 
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 hover:bg-white/10 rounded-md"
            >
              <X size={20} />
            </button>
          </div>
          
          <nav className="flex-1 py-6 overflow-y-auto custom-scrollbar">
            <ul className="space-y-2 px-4">
              {menuItems.map((item) => {
                const isActive = location.pathname === item.path || (location.pathname.startsWith(item.path) && item.path !== '/admin');
                return (
                  <li key={item.name}>
                    <Link
                      to={item.path}
                      onClick={handleLinkClick}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                        isActive
                          ? 'bg-accent/20 text-accent font-bold shadow-sm border border-accent/10'
                          : 'text-gray-400 hover:bg-white/5 hover:text-white font-medium'
                      }`}
                    >
                      <div className={isActive ? 'text-accent' : 'text-gray-400'}>{item.icon}</div>
                      <span>{item.name}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0 overflow-y-auto">
          <div className="p-4 md:p-6 lg:p-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
