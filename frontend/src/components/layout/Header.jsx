import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, User, Menu, X, Heart, MessageCircle } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { cartCount } = useCart();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <header className="bg-surface sticky top-0 z-50 shadow-soft transition-all duration-300 border-b border-gray-100">
      {/* Top Bar */}
      <div className="bg-primary text-gray-200 text-xs py-2 hidden md:block">
        <div className="container mx-auto px-6 flex justify-between items-center">
          <p className="font-medium tracking-wide">Premium Home Appliances Showroom | Free Delivery on Selected Items</p>
          <div className="flex gap-6 items-center">
            <a href="tel:+919876543210" className="hover:text-white transition-colors flex items-center gap-1">
              <span>Support: +91 98765 43210</span>
            </a>
            <span className="opacity-30">|</span>
            <Link to="/about" className="hover:text-white transition-colors">About</Link>
            <span className="opacity-30">|</span>
            <Link to="/contact" className="hover:text-white transition-colors">Contact</Link>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="container mx-auto px-4 md:px-6 py-4">
        <div className="flex items-center justify-between gap-4 lg:gap-8">
          
          {/* Mobile Menu Toggle (Left) */}
          <button 
            className="md:hidden text-primary hover:text-accent focus:outline-none transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>

          {/* Logo */}
          <Link to="/" className="text-2xl md:text-3xl font-extrabold tracking-tight flex-shrink-0">
            <span className="text-primary">PRABHA</span>
            <span className="text-accent ml-1.5">ELECTRONICS</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8 font-semibold text-text">
            <Link to="/" className="hover:text-accent transition-colors">Home</Link>
            <Link to="/shop" className="hover:text-accent transition-colors">Shop</Link>
            <div className="group relative py-2 cursor-pointer">
              <span className="hover:text-accent transition-colors">Categories</span>
              <div className="absolute top-full left-0 w-48 bg-white shadow-xl rounded-lg border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 flex flex-col py-2 z-50">
                <Link to="/category/televisions" className="px-4 py-2 hover:bg-gray-50 hover:text-accent text-sm font-medium transition-colors">Televisions</Link>
                <Link to="/category/refrigerators" className="px-4 py-2 hover:bg-gray-50 hover:text-accent text-sm font-medium transition-colors">Refrigerators</Link>
                <Link to="/category/washing-machines" className="px-4 py-2 hover:bg-gray-50 hover:text-accent text-sm font-medium transition-colors">Washing Machines</Link>
                <Link to="/category/air-conditioners" className="px-4 py-2 hover:bg-gray-50 hover:text-accent text-sm font-medium transition-colors">Air Conditioners</Link>
                <Link to="/category/kitchen-appliances" className="px-4 py-2 hover:bg-gray-50 hover:text-accent text-sm font-medium transition-colors">Kitchen Appliances</Link>
              </div>
            </div>
            <Link to="/about" className="hover:text-accent transition-colors hidden xl:block">About</Link>
            <Link to="/contact" className="hover:text-accent transition-colors hidden xl:block">Contact</Link>
          </nav>

          {/* Desktop Search */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md relative group">
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search appliances..." 
              className="w-full py-2.5 px-5 pr-12 rounded-full border border-gray-200 bg-gray-50 text-text placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white transition-all duration-300"
            />
            <button type="submit" className="absolute right-1 top-1 bottom-1 px-3 bg-primary text-white rounded-full hover:bg-primary-light transition-colors flex items-center justify-center">
              <Search size={18} />
            </button>
          </form>

          {/* Actions */}
          <div className="flex items-center gap-4 md:gap-6">
            <a href="https://wa.me/919876543210" target="_blank" rel="noreferrer" className="hidden lg:flex items-center gap-2 text-green-600 hover:text-green-700 font-semibold transition-colors">
              <MessageCircle size={22} />
              <span className="text-sm">WhatsApp</span>
            </a>

            <Link to="/enquiry-cart" className="relative p-2 text-text hover:text-accent transition-colors flex items-center gap-2 group">
              <div className="relative">
                <ShoppingCart size={24} className="group-hover:scale-110 transition-transform" />
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-accent text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold shadow-sm border border-white">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="hidden xl:block font-semibold text-sm">Enquiry Cart</span>
            </Link>

            {user ? (
              <div className="hidden md:flex items-center gap-2 relative group cursor-pointer p-2 hover:text-accent transition-colors">
                <User size={24} />
                <span className="text-sm font-semibold max-w-[80px] truncate">{user.name.split(' ')[0]}</span>
                <div className="absolute top-full right-0 w-40 bg-white shadow-xl rounded-lg border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 py-2 z-50">
                    <Link to="/account" className="block px-4 py-2 hover:bg-gray-50 text-sm font-medium text-text">My Profile</Link>
                    <Link to="/orders" className="block px-4 py-2 hover:bg-gray-50 text-sm font-medium text-text">My Enquiries</Link>
                    <button onClick={logout} className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm font-medium text-red-500">Logout</button>
                </div>
              </div>
            ) : (
              <Link to="/login" className="hidden md:flex items-center gap-2 p-2 hover:text-accent transition-colors font-semibold">
                <User size={24} />
                <span className="text-sm hidden xl:block">Sign In</span>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu & Search Dropdown */}
      <div className={`md:hidden bg-surface border-t border-gray-100 transition-all duration-300 overflow-hidden ${isMobileMenuOpen ? 'max-h-screen border-b shadow-lg' : 'max-h-0'}`}>
        <div className="p-4">
          <form onSubmit={handleSearch} className="relative mb-6">
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search appliances..." 
              className="w-full py-3 px-5 pr-12 rounded-lg border border-gray-200 bg-gray-50 text-text focus:outline-none focus:border-primary transition-colors"
            />
            <button type="submit" className="absolute right-2 top-2 bottom-2 px-3 text-primary">
              <Search size={20} />
            </button>
          </form>

          <nav className="flex flex-col space-y-1 font-semibold text-lg">
            <Link to="/" className="px-4 py-3 rounded-lg hover:bg-gray-50 hover:text-primary transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
            <Link to="/shop" className="px-4 py-3 rounded-lg hover:bg-gray-50 hover:text-primary transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Shop</Link>
            
            <div className="px-4 py-2 mt-2">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Categories</span>
            </div>
            <div className="flex flex-col space-y-1 pl-4 border-l-2 border-gray-100 ml-4 mb-2">
              <Link to="/category/televisions" className="px-4 py-2 text-base text-gray-600 hover:text-primary transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Televisions</Link>
              <Link to="/category/refrigerators" className="px-4 py-2 text-base text-gray-600 hover:text-primary transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Refrigerators</Link>
              <Link to="/category/washing-machines" className="px-4 py-2 text-base text-gray-600 hover:text-primary transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Washing Machines</Link>
              <Link to="/category/air-conditioners" className="px-4 py-2 text-base text-gray-600 hover:text-primary transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Air Conditioners</Link>
            </div>

            <div className="px-4 py-2 mt-2">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Contact</span>
            </div>
            <a href="https://wa.me/919876543210" className="px-4 py-3 rounded-lg flex items-center gap-3 text-green-600 hover:bg-green-50 transition-colors" onClick={() => setIsMobileMenuOpen(false)}>
              <MessageCircle size={20} />
              WhatsApp Us
            </a>

            {user ? (
               <div className="pt-4 mt-4 border-t border-gray-100 flex flex-col space-y-1">
                 <Link to="/account" className="px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors" onClick={() => setIsMobileMenuOpen(false)}>My Profile</Link>
                 <button onClick={() => { logout(); setIsMobileMenuOpen(false); }} className="text-left px-4 py-3 rounded-lg text-red-500 hover:bg-red-50 transition-colors">Logout</button>
               </div>
            ) : (
               <Link to="/login" className="mt-4 px-4 py-3 rounded-lg bg-primary text-white text-center hover:bg-primary-light transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Sign In / Register</Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
