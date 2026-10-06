import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Filter, ShoppingCart, Search, ChevronRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import ProductImage from '../components/ui/ProductImage';

const Shop = () => {
  const { categoryName } = useParams();
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/products');
        if (!res.ok) throw new Error('Failed to fetch products');
        const data = await res.json();
        if (Array.isArray(data)) {
          setProducts(data);
        } else {
          throw new Error('Invalid data format received from server');
        }
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const displayProducts = React.useMemo(() => {
    let filtered = products;
    if (categoryName) {
      const targetCat = categoryName.replace(/-/g, ' ').toLowerCase();
      // Handle "tvs" as a special case for "televisions" if needed, but assuming direct match for now
      filtered = filtered.filter(p => (p.category || '').toLowerCase().includes(targetCat) || targetCat.includes((p.category || '').toLowerCase()));
    }
    return filtered;
  }, [products, categoryName]);

  return (
    <div className="bg-gray-50 min-h-screen pb-16">
      {/* Page Header */}
      <div className="bg-white border-b border-gray-100 py-8 mb-8">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-extrabold text-primary mb-2 tracking-tight">EXPLORE OUR APPLIANCES</h1>
              <div className="flex items-center text-sm text-gray-500 gap-2">
                <Link to="/" className="hover:text-primary transition-colors">Home</Link>
                <ChevronRight size={14} />
                <span className="font-semibold text-primary">All Products</span>
              </div>
            </div>
            
            {/* Mobile Filter Toggle */}
            <div className="md:hidden flex">
              <button className="flex items-center gap-2 btn-outline px-4 py-2 w-full justify-center">
                <Filter size={18} /> Filters
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar Filters - Desktop */}
          <div className="hidden md:block w-64 flex-shrink-0">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-24">
              <div className="flex items-center gap-2 mb-6 pb-4 border-b border-gray-100">
                <Filter size={20} className="text-accent" />
                <h2 className="font-bold text-lg text-primary">Filters</h2>
              </div>
              
              <div className="mb-8">
                <h3 className="font-bold text-primary mb-4 text-sm uppercase tracking-wider">Categories</h3>
                <div className="space-y-3">
                  {['Televisions', 'Refrigerators', 'Washing Machines', 'Air Conditioners', 'Kitchen Appliances'].map((cat, idx) => (
                    <label key={idx} className="flex items-center gap-3 cursor-pointer group">
                      <div className="relative flex items-center justify-center">
                        <input type="checkbox" className="peer appearance-none w-5 h-5 border-2 border-gray-200 rounded text-accent checked:border-accent checked:bg-accent focus:ring-accent transition-all cursor-pointer" />
                        <svg className="absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"></path></svg>
                      </div>
                      <span className="text-sm font-medium text-gray-600 group-hover:text-primary transition-colors">{cat}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-bold text-primary mb-4 text-sm uppercase tracking-wider">Brands</h3>
                <div className="space-y-3">
                  {['LG', 'Samsung', 'Bosch', 'Voltas', 'Sony', 'Whirlpool'].map((brand, idx) => (
                    <label key={idx} className="flex items-center gap-3 cursor-pointer group">
                      <div className="relative flex items-center justify-center">
                        <input type="checkbox" className="peer appearance-none w-5 h-5 border-2 border-gray-200 rounded text-accent checked:border-accent checked:bg-accent focus:ring-accent transition-all cursor-pointer" />
                        <svg className="absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"></path></svg>
                      </div>
                      <span className="text-sm font-medium text-gray-600 group-hover:text-primary transition-colors">{brand}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Product Grid */}
          <div className="flex-1">
            <div className="hidden md:flex justify-between items-center mb-8 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
              <span className="font-semibold text-gray-500">Showing <span className="text-primary">{displayProducts.length}</span> Products</span>
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-gray-500">Sort by:</span>
                <select className="border border-gray-200 bg-gray-50 rounded-lg py-2 px-4 font-medium text-sm text-primary focus:outline-none focus:border-primary focus:bg-white transition-colors cursor-pointer">
                  <option>Recommended</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                  <option>Newest Arrivals</option>
                </select>
              </div>
            </div>
            
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className="w-full h-80 bg-white rounded-2xl border border-gray-100 animate-pulse"></div>
                ))}
              </div>
            ) : error ? (
              <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-r-lg mb-6">
                <h3 className="text-red-800 font-bold mb-2 text-lg">Unable to load products</h3>
                <p className="text-red-700 mb-4">{error}</p>
                <button onClick={() => window.location.reload()} className="btn-primary py-2 text-sm bg-red-600 hover:bg-red-700">Try Again</button>
              </div>
            ) : displayProducts.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
                <Search className="mx-auto h-16 w-16 text-gray-200 mb-4" />
                <h3 className="text-xl font-bold text-primary mb-2">No products found</h3>
                <p className="text-gray-500 font-medium">Try adjusting your filters or search criteria.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {displayProducts.map(product => (
                  <div key={product._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 group flex flex-col">
                    <div className="aspect-[4/3] bg-gray-50 flex items-center justify-center relative p-6">
                      {product.originalPrice > product.salePrice && (
                        <span className="absolute top-3 left-3 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded shadow-sm z-10">
                          {Math.round(((product.originalPrice - product.salePrice) / product.originalPrice) * 100)}% OFF
                        </span>
                      )}
                        <ProductImage 
                          src={product.images?.[0]} 
                          alt={product.name} 
                          className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500" 
                          containerClassName="w-full h-full bg-white rounded-lg shadow-sm flex items-center justify-center border border-gray-100"
                        />
                    </div>
                    <div className="p-5 flex flex-col flex-grow">
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">{product.brand}</p>
                      <Link to={`/product/${product._id}`} className="hover:text-accent transition-colors">
                        <h3 className="font-bold text-primary text-[15px] mb-2 line-clamp-2 leading-snug">{product.name}</h3>
                      </Link>
                      
                      <div className="mt-auto pt-4 flex flex-col gap-3">
                        <div className="flex items-end gap-2">
                          <span className="text-lg font-extrabold text-primary">₹{product.salePrice.toLocaleString('en-IN')}</span>
                          {product.originalPrice > product.salePrice && (
                            <span className="text-xs font-semibold text-gray-400 line-through mb-0.5">₹{product.originalPrice.toLocaleString('en-IN')}</span>
                          )}
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
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shop;
