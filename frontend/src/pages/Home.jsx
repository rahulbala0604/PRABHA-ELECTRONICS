import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Truck, Clock, CreditCard, MessageCircle, MapPin, ChevronRight, ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';

const Home = () => {
  const { addToCart } = useCart();
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/products');
        if (res.ok) {
          const data = await res.json();
          setFeaturedProducts(data.slice(0, 4)); // Get top 4 products
        }
      } catch (error) {
        console.error("Failed to fetch featured products", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-surface overflow-hidden border-b border-gray-100">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-100/50 z-0"></div>
        <div className="container mx-auto px-4 md:px-6 py-20 md:py-28 relative z-10 flex flex-col lg:flex-row items-center gap-12">
          <div className="lg:w-1/2 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 text-accent font-semibold text-sm mb-6">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse"></span>
              Premium Showroom
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-primary leading-tight mb-6 tracking-tight">
              EVERYTHING YOUR <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">HOME NEEDS.</span>
            </h1>
            <p className="text-lg text-gray-600 mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium">
              Quality appliances. Trusted brands. Personal service. Explore our collection of home appliances and enquire directly with Prabha Electronics.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link to="/shop" className="btn-primary flex items-center justify-center gap-2">
                EXPLORE PRODUCTS <ChevronRight size={18} />
              </Link>
              <a href="https://wa.me/919876543210" target="_blank" rel="noreferrer" className="btn-outline flex items-center justify-center gap-2">
                <MessageCircle size={18} /> WHATSAPP US
              </a>
            </div>
          </div>
          <div className="lg:w-1/2 flex justify-center relative">
            <div className="absolute -inset-4 bg-gradient-to-tr from-accent/20 to-primary/10 rounded-[2.5rem] blur-2xl -z-10"></div>
            <div className="w-full max-w-lg aspect-[4/3] bg-white rounded-2xl shadow-premium border border-gray-100 flex flex-col items-center justify-center p-8 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gray-50/50 group-hover:bg-transparent transition-colors duration-500"></div>
                <div className="text-primary text-center z-10">
                    <span className="text-6xl mb-4 block">🏢</span>
                    <p className="font-bold text-xl mb-2">Showroom Visual</p>
                    <p className="text-sm text-gray-500 font-medium">Premium Home Appliances</p>
                </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4 tracking-tight">SHOP BY CATEGORY</h2>
              <div className="w-20 h-1.5 bg-accent mx-auto rounded-full"></div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
                {[
                    { name: 'Televisions', icon: '📺', count: '120+' },
                    { name: 'Refrigerators', icon: '🧊', count: '85+' },
                    { name: 'Washing Machines', icon: '👕', count: '64+' },
                    { name: 'Air Conditioners', icon: '❄️', count: '90+' },
                    { name: 'Kitchen Appliances', icon: '🍳', count: '150+' }
                ].map((category, idx) => (
                    <Link to={`/category/${category.name.toLowerCase().replace(' ', '-')}`} key={idx} className="bg-gray-50 p-6 rounded-2xl border border-gray-100 hover:shadow-lg hover:border-accent/50 transition-all duration-300 group flex flex-col items-center text-center">
                        <div className="w-16 h-16 bg-white rounded-xl shadow-sm flex items-center justify-center text-3xl mb-4 group-hover:scale-110 group-hover:-translate-y-1 transition-all duration-300">
                          {category.icon}
                        </div>
                        <h3 className="font-bold text-primary mb-1">{category.name}</h3>
                        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{category.count} Products</span>
                    </Link>
                ))}
            </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-gray-50 border-y border-gray-100">
        <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-4">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4 tracking-tight">FEATURED APPLIANCES</h2>
                <div className="w-20 h-1.5 bg-accent rounded-full"></div>
              </div>
              <Link to="/shop" className="text-primary font-semibold hover:text-accent flex items-center gap-1 transition-colors">
                View All <ChevronRight size={18} />
              </Link>
            </div>

            {loading ? (
              <div className="flex justify-center gap-6 overflow-hidden py-4">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="w-full md:w-1/4 h-80 bg-white rounded-2xl border border-gray-100 animate-pulse"></div>
                ))}
              </div>
            ) : featuredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {featuredProducts.map(product => (
                  <div key={product._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 group flex flex-col">
                    <div className="aspect-[4/3] bg-gray-50 flex items-center justify-center relative p-6">
                      <div className="w-full h-full bg-white rounded-lg shadow-sm flex items-center justify-center group-hover:scale-105 transition-transform duration-500 border border-gray-100">
                        <span className="text-gray-300 text-sm font-medium">{product.category}</span>
                      </div>
                    </div>
                    <div className="p-5 flex flex-col flex-grow">
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">{product.brand}</p>
                      <Link to={`/product/${product._id}`} className="hover:text-accent transition-colors">
                        <h3 className="font-bold text-primary text-[15px] mb-2 line-clamp-2 leading-snug">{product.name}</h3>
                      </Link>
                      
                      <div className="mt-auto pt-4 flex flex-col gap-3">
                        <div className="flex items-end gap-2">
                          <span className="text-lg font-extrabold text-primary">₹{product.salePrice.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="flex items-center gap-2">
                           <span className="w-2 h-2 rounded-full bg-green-500"></span>
                           <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">In Stock</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 mt-1">
                          <Link to={`/product/${product._id}`} className="flex items-center justify-center text-xs font-bold text-primary border border-gray-200 rounded py-2 hover:bg-gray-50 transition-colors">
                            ENQUIRE
                          </Link>
                          <button 
                            onClick={(e) => { e.preventDefault(); addToCart(product); }}
                            className="flex items-center justify-center gap-1.5 text-xs font-bold bg-primary text-white rounded py-2 hover:bg-primary-light transition-colors"
                          >
                            <ShoppingCart size={14} /> + CART
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
                <p className="text-gray-500 font-medium">No featured products available at the moment.</p>
              </div>
            )}
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4 tracking-tight">WHY PRABHA ELECTRONICS?</h2>
            <div className="w-20 h-1.5 bg-accent mx-auto rounded-full"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            {[
              { icon: <ShieldCheck size={32} />, title: 'Trusted Brands', desc: 'Quality products from recognized brands.' },
              { icon: <MessageCircle size={32} />, title: 'Personal Assistance', desc: 'Talk directly with our showroom team.' },
              { icon: <ShoppingCart size={32} />, title: 'Wide Selection', desc: 'Explore appliances for every part of your home.' },
              { icon: <Clock size={32} />, title: 'Easy Enquiry', desc: 'Select products and send enquiry through WhatsApp.' },
              { icon: <MapPin size={32} />, title: 'Local Service', desc: 'Personal showroom support in your city.' },
            ].map((feature, idx) => (
              <div key={idx} className="flex flex-col items-center text-center group">
                <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center text-accent mb-6 group-hover:bg-accent group-hover:text-white transition-all duration-300 shadow-sm border border-gray-100">
                  {feature.icon}
                </div>
                <h4 className="font-bold text-primary mb-2">{feature.title}</h4>
                <p className="text-sm text-gray-500 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Showroom CTA */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary z-0"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent opacity-20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary opacity-40 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/3"></div>
        
        <div className="container mx-auto px-4 md:px-6 relative z-10 text-center">
          <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-6 tracking-tight">
            LOOKING FOR THE <span className="text-accent">RIGHT APPLIANCE?</span>
          </h2>
          <p className="text-lg text-gray-300 mb-10 max-w-2xl mx-auto font-medium">
            Not sure which product is right for you? Talk to our team. We'll help you find the perfect appliance for your home and budget.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a href="https://wa.me/919876543210" target="_blank" rel="noreferrer" className="btn-primary flex items-center justify-center gap-2">
              <MessageCircle size={20} /> WHATSAPP US
            </a>
            <a href="tel:+919876543210" className="btn-outline border-white text-white hover:bg-white hover:text-primary flex items-center justify-center gap-2">
              CALL NOW
            </a>
            <Link to="/contact" className="btn-outline border-white text-white hover:bg-white hover:text-primary flex items-center justify-center gap-2">
              VISIT SHOWROOM
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
