import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { MessageCircle, Trash2, ChevronLeft, ShoppingBag } from 'lucide-react';

const EnquiryCart = () => {
  const { cartItems, removeFromCart, updateQuantity, clearCart } = useCart();
  const navigate = useNavigate();

  const [customerDetails, setCustomerDetails] = useState({
    name: '',
    phone: '',
    location: '',
    email: '',
    message: ''
  });
  
  const [isSending, setIsSending] = useState(false);

  const WHATSAPP_NUMBER = '919876543210'; // In reality this comes from context/settings

  const handleSendEnquiry = async (e) => {
    e.preventDefault();
    setIsSending(true);

    try {
      // 1. Save Enquiry to Backend
      const payload = {
        customerName: customerDetails.name,
        phone: customerDetails.phone,
        location: customerDetails.location,
        email: customerDetails.email,
        message: customerDetails.message,
        products: cartItems.map(item => ({
          name: item.name,
          qty: item.quantity,
          product: item._id
        }))
      };

      await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      // 2. Generate WhatsApp URL
      let waMessage = `Hello Prabha Electronics,\n\nI am interested in the following products:\n\n`;
      
      cartItems.forEach((item, index) => {
        waMessage += `${index + 1}. ${item.name}\n   Quantity: ${item.quantity}\n\n`;
      });
      
      waMessage += `Customer Details:\nName: ${customerDetails.name}\nPhone: ${customerDetails.phone}\nLocation: ${customerDetails.location}\n`;
      
      if (customerDetails.email) waMessage += `Email: ${customerDetails.email}\n`;
      if (customerDetails.message) waMessage += `Message:\n${customerDetails.message}\n`;
      
      waMessage += `\nPlease share the price and availability.\nThank you.`;

      const encodedMessage = encodeURIComponent(waMessage);
      const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;

      // 3. Clear cart and redirect
      clearCart();
      window.open(waUrl, '_blank');
      navigate('/order-success', { state: { isEnquiry: true } });

    } catch (error) {
      alert("Something went wrong while sending your enquiry.");
      setIsSending(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="bg-gray-50 min-h-screen py-16 flex items-center justify-center">
        <div className="container mx-auto px-4 text-center max-w-lg">
          <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border border-gray-100 text-gray-300">
            <ShoppingBag size={48} />
          </div>
          <h2 className="text-3xl font-extrabold text-primary mb-4 tracking-tight">YOUR ENQUIRY CART IS EMPTY</h2>
          <p className="text-gray-500 font-medium mb-8 leading-relaxed">
            Browse our appliances and add products you'd like to enquire about. Our team is ready to help you find the right fit.
          </p>
          <Link to="/shop" className="btn-primary w-full sm:w-auto inline-flex items-center justify-center gap-2">
            EXPLORE PRODUCTS
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      {/* Page Header */}
      <div className="bg-white border-b border-gray-100 py-8 mb-8">
        <div className="container mx-auto px-4 md:px-6 max-w-6xl">
          <Link to="/shop" className="inline-flex items-center text-sm font-semibold text-gray-500 hover:text-primary transition-colors mb-4">
            <ChevronLeft size={16} className="mr-1" /> Continue Shopping
          </Link>
          <h1 className="text-3xl font-extrabold text-primary tracking-tight">YOUR ENQUIRY</h1>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 max-w-6xl">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          
          {/* Left: Customer Details Form */}
          <div className="lg:w-7/12 order-2 lg:order-1">
            <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-primary mb-6 flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm">1</span>
                Customer Details
              </h2>
              
              <form id="enquiry-form" onSubmit={handleSendEnquiry}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Full Name *</label>
                    <input 
                      type="text" 
                      required 
                      value={customerDetails.name} 
                      onChange={e => setCustomerDetails({...customerDetails, name: e.target.value})} 
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 font-medium text-primary focus:outline-none focus:border-primary focus:bg-white transition-colors"
                      placeholder="e.g. John Doe" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Phone Number *</label>
                    <input 
                      type="tel" 
                      required 
                      value={customerDetails.phone} 
                      onChange={e => setCustomerDetails({...customerDetails, phone: e.target.value})} 
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 font-medium text-primary focus:outline-none focus:border-primary focus:bg-white transition-colors"
                      placeholder="+91 98765 43210" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">City / Location *</label>
                    <input 
                      type="text" 
                      required 
                      value={customerDetails.location} 
                      onChange={e => setCustomerDetails({...customerDetails, location: e.target.value})} 
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 font-medium text-primary focus:outline-none focus:border-primary focus:bg-white transition-colors"
                      placeholder="e.g. Indiranagar, Bangalore" 
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Email <span className="text-gray-400 font-medium normal-case">(Optional)</span></label>
                    <input 
                      type="email" 
                      value={customerDetails.email} 
                      onChange={e => setCustomerDetails({...customerDetails, email: e.target.value})} 
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 font-medium text-primary focus:outline-none focus:border-primary focus:bg-white transition-colors"
                      placeholder="john@example.com" 
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Message <span className="text-gray-400 font-medium normal-case">(Optional)</span></label>
                    <textarea 
                      rows="3" 
                      value={customerDetails.message} 
                      onChange={e => setCustomerDetails({...customerDetails, message: e.target.value})} 
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 font-medium text-primary focus:outline-none focus:border-primary focus:bg-white transition-colors resize-none"
                      placeholder="Any specific requirements or questions?"
                    ></textarea>
                  </div>
                </div>
              </form>
            </div>
          </div>

          {/* Right: Selected Products */}
          <div className="lg:w-5/12 order-1 lg:order-2">
            <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 sticky top-24">
              <h2 className="text-xl font-bold text-primary mb-6 flex items-center gap-3 pb-4 border-b border-gray-100">
                <span className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm">2</span>
                Selected Products ({cartItems.length})
              </h2>
              
              <div className="space-y-6 mb-8 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {cartItems.map(item => (
                  <div key={item._id} className="flex gap-4">
                    <div className="w-20 h-20 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-center flex-shrink-0 relative">
                       {/* Placeholder for real image */}
                      <span className="text-[10px] font-bold text-gray-300 uppercase">Image</span>
                      <div className="absolute -top-2 -right-2 bg-accent text-white text-xs w-6 h-6 rounded-full flex items-center justify-center font-bold">
                        {item.quantity}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">{item.brand}</p>
                      <Link to={`/product/${item._id}`} className="font-bold text-primary hover:text-accent line-clamp-2 leading-snug mb-2">
                        {item.name}
                      </Link>
                      
                      <div className="flex justify-between items-center mt-3">
                        <div className="flex items-center border border-gray-200 rounded-lg bg-gray-50 h-8">
                          <button onClick={() => updateQuantity(item._id, item.quantity - 1)} className="w-8 h-full flex items-center justify-center text-gray-600 hover:text-primary font-bold disabled:opacity-30" disabled={item.quantity <= 1}>-</button>
                          <span className="w-8 text-center text-sm font-bold text-primary">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item._id, item.quantity + 1)} className="w-8 h-full flex items-center justify-center text-gray-600 hover:text-primary font-bold">+</button>
                        </div>
                        <button onClick={() => removeFromCart(item._id)} className="text-gray-400 hover:text-red-500 transition-colors p-1">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-6 border-t border-gray-100">
                <button 
                  type="submit" 
                  form="enquiry-form"
                  disabled={isSending}
                  className={`w-full py-4 rounded-xl font-bold tracking-wide text-lg shadow-sm flex items-center justify-center gap-2 transition-all ${isSending ? 'bg-green-400 text-white cursor-not-allowed' : 'bg-green-500 hover:bg-green-600 text-white hover:shadow-lg hover:-translate-y-0.5'}`}
                >
                  <MessageCircle size={24} />
                  {isSending ? 'PREPARING WHATSAPP...' : 'SEND ENQUIRY ON WHATSAPP'}
                </button>
                <p className="text-center text-xs text-gray-400 mt-4 font-medium">
                  By sending an enquiry, you'll be redirected to WhatsApp to chat with our showroom team.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default EnquiryCart;
