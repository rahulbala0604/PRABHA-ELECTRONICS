import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import PublicLayout from './components/layout/PublicLayout';
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetails from './pages/ProductDetails';
import EnquiryCart from './pages/EnquiryCart';
import { businessConfig } from './config/businessConfig';
import Login from './pages/Login';
import Register from './pages/Register';
import Account from './pages/Account';

import AdminLayout from './pages/admin/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import ProductsList from './pages/admin/ProductsList';
import ProductEdit from './pages/admin/ProductEdit';
import CategoryList from './pages/admin/CategoryList';
import BrandList from './pages/admin/BrandList';

import AdminEnquiriesList from './pages/admin/AdminEnquiriesList';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { ProtectedRoute, AdminRoute } from './components/ProtectedRoute';
import ToastContainer from './components/ui/ToastContainer';

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <CartProvider>
          <ToastContainer />
        <BrowserRouter>
            <Routes>
              {/* Public Routes */}
              <Route element={<PublicLayout />}>
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
                </Route>
                

                
                <Route path="/contact" element={<div className="container mx-auto px-6 py-20 md:p-20 text-center"><h2 className="text-3xl font-bold text-primary mb-4">Contact Showroom</h2><p className="text-gray-600 mb-8">Visit us at {businessConfig.addressLine1}, {businessConfig.addressLine2} or call us at {businessConfig.phone}.</p><a href={`https://wa.me/${businessConfig.whatsappNumber}`} className="btn-primary inline-block">WhatsApp Us</a></div>} />
                <Route path="/about" element={<div className="container mx-auto px-6 py-20 md:p-20 text-center"><h2 className="text-3xl font-bold text-primary mb-4">About {businessConfig.name}</h2><p className="text-gray-600">Your trusted local destination for premium home appliances since {businessConfig.establishedYear}.</p></div>} />
                <Route path="/privacy" element={<div className="container mx-auto px-6 py-20 md:p-20 text-center"><h2 className="text-3xl font-bold text-primary mb-4">Privacy Policy</h2><p className="text-gray-600">Privacy Policy content coming soon.</p></div>} />
                <Route path="/terms" element={<div className="container mx-auto px-6 py-20 md:p-20 text-center"><h2 className="text-3xl font-bold text-primary mb-4">Terms of Service</h2><p className="text-gray-600">Terms of Service content coming soon.</p></div>} />
                <Route path="/categories" element={<Navigate to="/shop" replace />} />
                <Route path="*" element={<div className="container mx-auto px-6 py-20 md:p-20 text-center"><h2 className="text-3xl font-bold">404 - Page Not Found</h2></div>} />
              </Route>
              
              <Route element={<AdminRoute />}>
                 <Route path="/admin" element={<AdminLayout />}>
                    <Route index element={<Dashboard />} />
                    <Route path="products" element={<ProductsList />} />
                    <Route path="products/add" element={<ProductEdit />} />
                    <Route path="products/:id/edit" element={<ProductEdit />} />
                    <Route path="categories" element={<CategoryList />} />
                    <Route path="brands" element={<BrandList />} />

                    <Route path="enquiries" element={<AdminEnquiriesList />} />
                    <Route path="*" element={<div className="p-8 text-center"><h2 className="text-2xl font-bold text-gray-500 mt-10">404 - Admin Page Not Found</h2></div>} />
                 </Route>
              </Route>
            </Routes>
        </BrowserRouter>
        </CartProvider>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
