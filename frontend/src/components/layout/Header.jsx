import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, ShoppingCart, User, Menu, X, Heart, MessageCircle, ChevronRight } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { businessConfig } from '../../config/businessConfig';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { cartCount } = useCart();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isMobileMenuOpen]);

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
            <a href={`tel:${businessConfig.phone.replace(/[^0-9+]/g, '')}`} className="hover:text-white transition-colors flex items-center gap-1">
              <span>Support: {businessConfig.phone}</span>
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
          <Link to="/" className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight flex-shrink-0 uppercase">
            <span className="text-primary">{businessConfig.name.split(' ')[0]}</span>
            <span className="text-accent ml-1.5">{businessConfig.name.split(' ').slice(1).join(' ')}</span>
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
            <a href={`https://wa.me/${businessConfig.whatsappNumber}`} target="_blank" rel="noreferrer" className="hidden lg:flex items-center gap-2 text-green-600 hover:text-green-700 font-semibold transition-colors">
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

      {/* Mobile Menu Drawer Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-[60] md:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsMobileMenuOpen(false)}
        ></div>
      )}

      {/* Mobile Menu Drawer */}
      <div className={`fixed inset-y-0 left-0 w-[85%] max-w-sm bg-white z-[70] transform transition-transform duration-300 ease-in-out flex flex-col md:hidden ${isMobileMenuOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}`}>
        <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-primary text-white">
          <span className="font-extrabold text-xl tracking-wide">MENU</span>
          <button 
            onClick={() => setIsMobileMenuOpen(false)}
            className="p-2 hover:bg-white/10 rounded-md transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
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

          <nav className="flex flex-col space-y-2 font-medium">
            <Link to="/" className={`px-4 py-3 rounded-lg flex items-center justify-between transition-colors ${location.pathname === '/' ? 'bg-primary/10 text-primary font-bold' : 'text-gray-700 hover:bg-gray-50'}`} onClick={() => setIsMobileMenuOpen(false)}>
              Home {location.pathname === '/' && <ChevronRight size={18} />}
            </Link>
            <Link to="/shop" className={`px-4 py-3 rounded-lg flex items-center justify-between transition-colors ${location.pathname === '/shop' ? 'bg-primary/10 text-primary font-bold' : 'text-gray-700 hover:bg-gray-50'}`} onClick={() => setIsMobileMenuOpen(false)}>
              Shop Appliances {location.pathname === '/shop' && <ChevronRight size={18} />}
            </Link>
            <Link to="/about" className={`px-4 py-3 rounded-lg flex items-center justify-between transition-colors ${location.pathname === '/about' ? 'bg-primary/10 text-primary font-bold' : 'text-gray-700 hover:bg-gray-50'}`} onClick={() => setIsMobileMenuOpen(false)}>
              About Us {location.pathname === '/about' && <ChevronRight size={18} />}
            </Link>
            <Link to="/contact" className={`px-4 py-3 rounded-lg flex items-center justify-between transition-colors ${location.pathname === '/contact' ? 'bg-primary/10 text-primary font-bold' : 'text-gray-700 hover:bg-gray-50'}`} onClick={() => setIsMobileMenuOpen(false)}>
              Contact Showroom {location.pathname === '/contact' && <ChevronRight size={18} />}
            </Link>
            
            <div className="pt-4 pb-2 mt-2 border-t border-gray-100">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider px-4">Categories</span>
            </div>
            <div className="flex flex-col space-y-1">
              {['televisions', 'refrigerators', 'washing-machines', 'air-conditioners'].map(cat => (
                <Link 
                  key={cat}
                  to={`/category/${cat}`} 
                  className={`px-4 py-2.5 rounded-lg text-sm flex items-center justify-between transition-colors ${location.pathname === `/category/${cat}` ? 'bg-primary/10 text-primary font-bold' : 'text-gray-600 hover:bg-gray-50'}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span className="capitalize">{cat.replace('-', ' ')}</span>
                  {location.pathname === `/category/${cat}` && <ChevronRight size={16} />}
                </Link>
              ))}
            </div>
          </nav>
        </div>
        
        <div className="p-4 border-t border-gray-100 bg-gray-50">
          <a href={`https://wa.me/${businessConfig.whatsappNumber}`} className="w-full mb-3 py-3 rounded-lg flex items-center justify-center gap-2 bg-[#25D366] text-white font-bold hover:bg-[#128C7E] transition-colors" onClick={() => setIsMobileMenuOpen(false)}>
            <MessageCircle size={20} />
            WhatsApp Us
          </a>
          
          {user ? (
              <div className="flex gap-2">
                <Link to="/account" className="flex-1 py-3 text-center rounded-lg border border-gray-200 bg-white text-gray-700 font-medium hover:bg-gray-50" onClick={() => setIsMobileMenuOpen(false)}>Profile</Link>
                <button onClick={() => { logout(); setIsMobileMenuOpen(false); }} className="flex-1 py-3 text-center rounded-lg border border-red-200 bg-red-50 text-red-600 font-medium hover:bg-red-100">Logout</button>
              </div>
          ) : (
              <Link to="/login" className="block w-full py-3 rounded-lg border border-primary bg-white text-primary text-center font-bold hover:bg-primary hover:text-white transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Sign In / Register</Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
