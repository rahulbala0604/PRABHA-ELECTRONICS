import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShoppingCart, Heart, ShieldCheck, Truck, RefreshCw, MessageCircle, ChevronRight, Share2, Star } from 'lucide-react';
import { useCart } from '../context/CartContext';

const ProductDetails = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${id}`);
        if (!res.ok) throw new Error('Product not found');
        const data = await res.json();
        setProduct(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  const handleWhatsAppEnquiry = () => {
    const message = `Hello Prabha Electronics, I am interested in: *${product.name}* (Ref ID: ${product._id}). Could you provide more details?`;
    window.open(`https://wa.me/919876543210?text=${encodeURIComponent(message)}`, '_blank');
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 md:px-6 py-12 flex justify-center">
        <div className="w-full max-w-6xl animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-8"></div>
          <div className="flex flex-col lg:flex-row gap-12">
            <div className="lg:w-1/2">
              <div className="bg-gray-200 rounded-2xl aspect-square mb-6"></div>
              <div className="flex gap-4">
                {[1, 2, 3, 4].map(i => <div key={i} className="w-20 h-20 bg-gray-200 rounded-xl"></div>)}
              </div>
            </div>
            <div className="lg:w-1/2 space-y-6">
              <div className="h-6 bg-gray-200 rounded w-1/4"></div>
              <div className="h-10 bg-gray-200 rounded w-3/4"></div>
              <div className="h-12 bg-gray-200 rounded w-1/3"></div>
              <div className="space-y-3 pt-6">
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                <div className="h-4 bg-gray-200 rounded w-4/6"></div>
              </div>
              <div className="flex gap-4 pt-8">
                <div className="h-14 bg-gray-200 rounded w-32"></div>
                <div className="h-14 bg-gray-200 rounded flex-1"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <h2 className="text-3xl font-bold text-primary mb-4">Product Not Found</h2>
        <p className="text-gray-500 mb-8">The appliance you are looking for might have been removed or is temporarily unavailable.</p>
        <Link to="/shop" className="btn-primary">Return to Shop</Link>
      </div>
    );
  }

  const discountPercentage = Math.round(((product.originalPrice - product.salePrice) / product.originalPrice) * 100);

  return (
    <div className="bg-white min-h-screen pb-20">
      <div className="container mx-auto px-4 md:px-6 py-8">
        {/* Breadcrumbs */}
        <div className="flex items-center text-sm text-gray-500 font-medium mb-8 overflow-x-auto whitespace-nowrap pb-2">
          <Link to="/" className="hover:text-primary transition-colors">Home</Link>
          <ChevronRight size={16} className="mx-2 flex-shrink-0" />
          <Link to="/shop" className="hover:text-primary transition-colors">Shop</Link>
          <ChevronRight size={16} className="mx-2 flex-shrink-0" />
          <Link to={`/category/${product.category.toLowerCase().replace(' ', '-')}`} className="hover:text-primary transition-colors">{product.category}</Link>
          <ChevronRight size={16} className="mx-2 flex-shrink-0" />
          <span className="text-primary font-bold truncate max-w-[200px] sm:max-w-md">{product.name}</span>
        </div>

        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
          {/* Left: Image Gallery */}
          <div className="lg:w-1/2 flex flex-col gap-4">
            <div className="bg-gray-50 rounded-3xl border border-gray-100 flex items-center justify-center aspect-square relative overflow-hidden group">
               {discountPercentage > 0 && (
                  <span className="absolute top-6 left-6 bg-red-500 text-white text-sm font-extrabold px-3 py-1.5 rounded-lg shadow-sm z-10">
                    {discountPercentage}% OFF
                  </span>
               )}
               <button className="absolute top-6 right-6 p-2.5 bg-white/80 backdrop-blur rounded-full text-gray-600 hover:text-accent hover:shadow-md transition-all z-10">
                 <Share2 size={20} />
               </button>
               {/* Product Image Placeholder */}
              <div className="w-full h-full bg-white m-4 rounded-2xl flex items-center justify-center shadow-sm border border-gray-100 group-hover:scale-105 transition-transform duration-500">
                <span className="text-gray-300 font-medium">Main Product Image</span>
              </div>
            </div>
            {/* Thumbnails */}
            <div className="grid grid-cols-4 gap-4">
              {[0, 1, 2, 3].map((index) => (
                <button 
                  key={index}
                  onClick={() => setActiveImage(index)}
                  className={`aspect-square rounded-2xl border-2 flex items-center justify-center transition-all overflow-hidden bg-gray-50
                    ${activeImage === index ? 'border-primary' : 'border-transparent hover:border-gray-200'}
                  `}
                >
                  <div className="w-full h-full bg-white m-1 rounded-xl shadow-sm border border-gray-100 flex items-center justify-center">
                    <span className="text-xs text-gray-400 font-medium">View {index + 1}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Right: Product Info */}
          <div className="lg:w-1/2 flex flex-col pt-4">
            <div className="flex items-center gap-3 mb-3">
              <span className="px-3 py-1 bg-gray-100 text-primary text-xs font-extrabold rounded-md uppercase tracking-wider">{product.brand}</span>
              <span className="px-3 py-1 bg-accent/10 text-accent text-xs font-extrabold rounded-md uppercase tracking-wider">SKU: {product._id.substring(0, 8)}</span>
            </div>
            
            <h1 className="text-3xl md:text-4xl font-extrabold text-primary mb-4 leading-tight tracking-tight">{product.name}</h1>
            
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center text-accent">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} size={18} fill={star <= Math.floor(product.rating || 5) ? "currentColor" : "none"} className={star > Math.floor(product.rating || 5) ? "text-gray-300" : ""} />
                ))}
              </div>
              <span className="text-sm font-medium text-gray-500 underline decoration-gray-300 underline-offset-4 cursor-pointer hover:text-primary transition-colors">
                {product.numReviews || 0} Reviews
              </span>
            </div>

            <div className="mb-8 pb-8 border-b border-gray-100">
              <div className="flex flex-col sm:flex-row sm:items-end gap-3 mb-2">
                <span className="text-4xl font-extrabold text-primary">₹{product.salePrice.toLocaleString('en-IN')}</span>
                {product.originalPrice > product.salePrice && (
                  <span className="text-xl font-medium text-gray-400 line-through mb-1">₹{product.originalPrice.toLocaleString('en-IN')}</span>
                )}
              </div>
              <p className="text-sm text-green-600 font-bold mb-4">Inclusive of all taxes</p>
              
              <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg border border-gray-100 inline-flex">
                <div className={`w-2.5 h-2.5 rounded-full ${product.stock > 0 ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span className={`text-sm font-bold uppercase tracking-wider ${product.stock > 0 ? 'text-green-600' : 'text-red-500'}`}>
                  {product.stock > 0 ? 'In Stock & Ready to Ship' : 'Out of Stock'}
                </span>
              </div>
            </div>

            {/* Highlights */}
            {product.features && product.features.length > 0 && (
              <div className="mb-8">
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Key Features</h3>
                <ul className="space-y-3">
                  {product.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <div className="mt-1 w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0"></div>
                      <span className="text-gray-700 font-medium leading-relaxed">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              {/* Quantity */}
              <div className="flex items-center justify-between border-2 border-gray-200 rounded-xl h-14 w-full sm:w-36 bg-gray-50">
                <button 
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="w-12 h-full flex items-center justify-center text-gray-500 hover:text-primary transition-colors font-bold text-lg"
                >
                  -
                </button>
                <input 
                  type="text" 
                  value={quantity} 
                  readOnly
                  className="w-12 h-full text-center bg-transparent font-bold text-primary focus:outline-none"
                />
                <button 
                  onClick={() => setQuantity(q => Math.min(product.stock || 99, q + 1))}
                  className="w-12 h-full flex items-center justify-center text-gray-500 hover:text-primary transition-colors font-bold text-lg"
                >
                  +
                </button>
              </div>
              
              <button 
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className={`flex-1 h-14 flex items-center justify-center gap-2 rounded-xl font-bold tracking-wide transition-all shadow-sm
                  ${product.stock > 0 ? 'bg-primary text-white hover:bg-primary-light hover:shadow-lg hover:-translate-y-0.5' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}
                `}
              >
                <ShoppingCart size={20} />
                {product.stock > 0 ? 'ADD TO ENQUIRY CART' : 'OUT OF STOCK'}
              </button>

              <button className="h-14 w-14 flex-shrink-0 flex items-center justify-center border-2 border-gray-200 rounded-xl text-gray-500 hover:text-red-500 hover:border-red-200 hover:bg-red-50 transition-all">
                <Heart size={22} />
              </button>
            </div>

            {/* WhatsApp Enquiry CTA */}
            <button 
              onClick={handleWhatsAppEnquiry}
              className="w-full mb-8 h-14 flex items-center justify-center gap-2 border-2 border-green-500 text-green-600 rounded-xl font-bold tracking-wide hover:bg-green-50 transition-all shadow-sm group"
            >
              <MessageCircle size={22} className="group-hover:scale-110 transition-transform" />
              ENQUIRE ON WHATSAPP
            </button>

            {/* Trust Indicators */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-5 bg-gray-50 rounded-2xl border border-gray-100">
               <div className="flex flex-col items-center text-center gap-2">
                 <ShieldCheck className="text-accent" size={28} />
                 <span className="text-xs font-bold text-primary uppercase">1 Year Warranty</span>
               </div>
               <div className="flex flex-col items-center text-center gap-2 border-t sm:border-t-0 sm:border-l border-gray-200 pt-4 sm:pt-0">
                 <Truck className="text-accent" size={28} />
                 <span className="text-xs font-bold text-primary uppercase">Free Delivery</span>
               </div>
               <div className="flex flex-col items-center text-center gap-2 border-t sm:border-t-0 sm:border-l border-gray-200 pt-4 sm:pt-0">
                 <RefreshCw className="text-accent" size={28} />
                 <span className="text-xs font-bold text-primary uppercase">7 Days Replace</span>
               </div>
            </div>
          </div>
        </div>

        {/* Details Tabs */}
        <div className="mt-20">
          <div className="flex items-center gap-8 border-b border-gray-200 mb-8 overflow-x-auto whitespace-nowrap pb-1">
            <button className="pb-4 font-bold text-primary border-b-2 border-primary text-lg px-2">Description</button>
            <button className="pb-4 font-bold text-gray-400 hover:text-gray-600 border-b-2 border-transparent text-lg px-2 transition-colors">Specifications</button>
            <button className="pb-4 font-bold text-gray-400 hover:text-gray-600 border-b-2 border-transparent text-lg px-2 transition-colors">Reviews</button>
          </div>
          
          <div className="bg-gray-50 p-8 md:p-10 rounded-3xl border border-gray-100 max-w-4xl">
            <h3 className="text-2xl font-bold text-primary mb-6">About this product</h3>
            <div className="prose prose-gray max-w-none">
              <p className="text-gray-600 leading-relaxed font-medium text-lg">
                {product.description || "Detailed product description will be provided here. This premium appliance is designed to bring efficiency and elegance to your home."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
