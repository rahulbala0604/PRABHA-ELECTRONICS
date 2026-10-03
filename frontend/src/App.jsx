import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetails from './pages/ProductDetails';
import EnquiryCart from './pages/EnquiryCart';
import Login from './pages/Login';
import Register from './pages/Register';
import Account from './pages/Account';
import Orders from './pages/Orders';
import OrderDetails from './pages/OrderDetails';
import AdminLayout from './pages/admin/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import ProductsList from './pages/admin/ProductsList';
import ProductEdit from './pages/admin/ProductEdit';
import CategoryList from './pages/admin/CategoryList';
import BrandList from './pages/admin/BrandList';
import AdminOrdersList from './pages/admin/AdminOrdersList';
import AdminEnquiriesList from './pages/admin/AdminEnquiriesList';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute, AdminRoute } from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
        <div className="min-h-screen bg-gray-50 flex flex-col">
          <Header />
          
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/product/:id" element={<ProductDetails />} />
              <Route path="/cart" element={<Navigate to="/enquiry-cart" replace />} />
              <Route path="/checkout" element={<Navigate to="/enquiry-cart" replace />} />
              <Route path="/enquiry-cart" element={<EnquiryCart />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              <Route element={<ProtectedRoute />}>
                <Route path="/account" element={<Account />} />
                <Route path="/orders" element={<Orders />} />
                <Route path="/orders/:id" element={<OrderDetails />} />
              </Route>
              
              <Route path="/order-success" element={<div className="container mx-auto p-20 text-center"><h2 className="text-3xl font-bold text-green-600 mb-4">Enquiry Sent!</h2><p className="text-gray-600 mb-8">Your product enquiry has been prepared for WhatsApp.</p><a href="/shop" className="btn-primary">Continue Shopping</a></div>} />
              
              <Route element={<AdminRoute />}>
                 <Route path="/admin" element={<AdminLayout />}>
                    <Route index element={<Dashboard />} />
                    <Route path="products" element={<ProductsList />} />
                    <Route path="products/add" element={<ProductEdit />} />
                    <Route path="products/:id/edit" element={<ProductEdit />} />
                    <Route path="categories" element={<CategoryList />} />
                    <Route path="brands" element={<BrandList />} />
                    <Route path="orders" element={<AdminOrdersList />} />
                    <Route path="enquiries" element={<AdminEnquiriesList />} />
                    <Route path="customers" element={<div className="p-4"><h2 className="text-2xl font-bold">Manage Customers</h2><p>Coming soon...</p></div>} />
                    <Route path="offers" element={<div className="p-4"><h2 className="text-2xl font-bold">Manage Offers</h2><p>Coming soon...</p></div>} />
                 </Route>
              </Route>
              <Route path="*" element={<div className="container mx-auto p-20 text-center"><h2 className="text-3xl font-bold">404 - Page Not Found</h2></div>} />
            </Routes>
          </main>

          <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
            {/* Tooltip / Label */}
            <div className="bg-white px-4 py-2 rounded-xl shadow-lg border border-gray-100 text-sm font-bold text-gray-700 opacity-0 transform translate-y-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0 pointer-events-none hidden md:block relative">
              Talk to our showroom
              <div className="absolute -bottom-1.5 right-6 w-3 h-3 bg-white border-b border-r border-gray-100 transform rotate-45"></div>
            </div>
            
            <a 
              href="https://wa.me/919876543210" 
              target="_blank" 
              rel="noreferrer"
              className="group flex items-center justify-center w-16 h-16 bg-[#25D366] hover:bg-[#128C7E] text-white rounded-full shadow-premium transition-all duration-300 hover:scale-110 relative"
              title="Chat on WhatsApp"
            >
              <div className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-20"></div>
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="currentColor" className="relative z-10">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
            </a>
          </div>

          <Footer />
        </div>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
