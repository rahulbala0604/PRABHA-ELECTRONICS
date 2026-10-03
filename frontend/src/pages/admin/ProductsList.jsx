import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import { Edit, Trash2, Plus } from 'lucide-react';
import ProductImage from '../../components/ui/ProductImage';
import { useToast } from '../../context/ToastContext';
import ConfirmationModal from '../../components/ui/ConfirmationModal';

const ProductsList = () => {
  const { user } = useAuth();
  const { success, error } = useToast();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showInactive, setShowInactive] = useState(false);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, id: null });

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/products${showInactive ? '?admin=true' : ''}`);
      const data = await res.json();
      setProducts(data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [showInactive]);

  const confirmDelete = (id) => {
    setDeleteModal({ isOpen: true, id });
  };

  const handleDelete = async () => {
    if (!deleteModal.id) return;
    try {
      const res = await fetch(`/api/products/${deleteModal.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${user.token}` }
      });
      if (res.ok) {
        success('Product deactivated successfully');
        fetchProducts();
      } else {
        const data = await res.json();
        if (res.status === 401) {
          error('Your admin session has expired. Please login again.');
        } else {
          error(data.message || 'Failed to deactivate product');
        }
      }
    } catch (err) {
      error('Unable to deactivate the product. Please try again.');
    } finally {
      setDeleteModal({ isOpen: false, id: null });
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-primary">Products</h1>
        <div className="flex items-center gap-4">
          <label className="flex items-center cursor-pointer">
            <div className="relative">
              <input type="checkbox" className="sr-only" checked={showInactive} onChange={() => setShowInactive(!showInactive)} />
              <div className={`block w-10 h-6 rounded-full transition-colors ${showInactive ? 'bg-primary' : 'bg-gray-300'}`}></div>
              <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${showInactive ? 'transform translate-x-4' : ''}`}></div>
            </div>
            <div className="ml-3 text-sm font-medium text-gray-700">Show Inactive</div>
          </label>
          <Link to="/admin/products/add" className="btn-primary flex items-center gap-2 py-2 px-4 text-sm">
            <Plus size={16} /> Add New Product
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-sm text-gray-500 uppercase tracking-wider">
                <th className="p-4 font-semibold">Product Name</th>
                <th className="p-4 font-semibold">Brand</th>
                <th className="p-4 font-semibold">Price</th>
                <th className="p-4 font-semibold">Stock/Status</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                Array(5).fill(0).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="p-4"><div className="h-10 bg-gray-200 rounded w-48"></div></td>
                    <td className="p-4"><div className="h-4 bg-gray-200 rounded w-24"></div></td>
                    <td className="p-4"><div className="h-4 bg-gray-200 rounded w-20"></div></td>
                    <td className="p-4"><div className="h-8 bg-gray-200 rounded w-16 mb-1"></div><div className="h-6 bg-gray-200 rounded w-16"></div></td>
                    <td className="p-4"><div className="h-8 bg-gray-200 rounded w-16 ml-auto"></div></td>
                  </tr>
                ))
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-gray-500">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-3">
                        <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg>
                      </div>
                      <p className="font-semibold text-gray-600">No products found</p>
                      <p className="text-sm text-gray-400 mt-1">Get started by adding a new product to your catalogue.</p>
                      <Link to="/admin/products/add" className="mt-4 text-primary hover:text-accent font-medium text-sm">
                        + Add Product
                      </Link>
                    </div>
                  </td>
                </tr>
              ) : products.map(product => (
                <tr key={product._id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 flex-shrink-0">
                        <ProductImage 
                          src={product.images?.[0]} 
                          alt={product.name} 
                          className="w-full h-full object-cover rounded" 
                          containerClassName="w-full h-full bg-gray-200 rounded flex items-center justify-center"
                        />
                      </div>
                      <span className="font-medium text-gray-900 line-clamp-1">{product.name}</span>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-gray-600">{product.brand}</td>
                  <td className="p-4 text-sm font-semibold text-primary">₹{product.salePrice.toLocaleString()}</td>
                  <td className="p-4">
                    <div className="flex flex-col gap-1">
                      <span className={`px-2 py-1 rounded w-max text-xs font-medium ${product.stock > 0 ? 'text-green-700 bg-green-50' : 'text-red-700 bg-red-50'}`}>
                        {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                      </span>
                      <span className={`px-2 py-1 rounded w-max text-xs font-medium ${product.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-700'}`}>
                        {product.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </td>
                  <td className="p-4 flex justify-end gap-2">
                    <Link to={`/admin/products/${product._id}/edit`} className="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors" title="Edit">
                      <Edit size={16} />
                    </Link>
                    <button onClick={() => confirmDelete(product._id)} className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors" title="Deactivate">
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden divide-y divide-gray-100">
          {loading ? (
             Array(5).fill(0).map((_, i) => (
               <div key={i} className="p-4 flex flex-col gap-3 animate-pulse">
                 <div className="flex items-start gap-3">
                   <div className="w-16 h-16 bg-gray-200 rounded"></div>
                   <div className="flex-1 space-y-2">
                     <div className="h-3 bg-gray-200 rounded w-16"></div>
                     <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                     <div className="h-4 bg-gray-200 rounded w-20"></div>
                   </div>
                 </div>
               </div>
             ))
          ) : products.length === 0 ? (
            <div className="p-8 text-center text-gray-500 flex flex-col items-center">
               <svg className="w-12 h-12 text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg>
               <p className="font-semibold text-gray-600">No products found</p>
               <Link to="/admin/products/add" className="mt-3 btn-primary py-2 px-4 text-sm w-full max-w-[200px]">
                 Add Product
               </Link>
            </div>
          ) : products.map(product => (
             <div key={product._id} className="p-4 flex flex-col gap-3">
                <div className="flex items-start gap-3">
                  <div className="w-16 h-16 flex-shrink-0">
                    <ProductImage 
                      src={product.images?.[0]} 
                      alt={product.name} 
                      className="w-full h-full object-cover rounded" 
                      containerClassName="w-full h-full bg-gray-200 rounded flex items-center justify-center" 
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-500 uppercase font-bold">{product.brand}</p>
                    <h3 className="font-bold text-gray-900 leading-tight mb-1">{product.name}</h3>
                    <div className="text-sm font-bold text-primary">₹{product.salePrice.toLocaleString()}</div>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <div className="flex flex-wrap gap-2">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${product.stock > 0 ? 'text-green-700 bg-green-50' : 'text-red-700 bg-red-50'}`}>
                      {product.stock > 0 ? `${product.stock} in stock` : 'Out'}
                    </span>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${product.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-700'}`}>
                      {product.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <Link to={`/admin/products/${product._id}/edit`} className="p-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors" title="Edit">
                      <Edit size={16} />
                    </Link>
                    <button onClick={() => confirmDelete(product._id)} className="p-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-md transition-colors" title="Deactivate">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
             </div>
          ))}
        </div>
      </div>

      <ConfirmationModal 
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, id: null })}
        onConfirm={handleDelete}
        title="Deactivate Product?"
        message="This product will no longer appear in the customer catalogue. Are you sure you want to proceed?"
        confirmText="Deactivate Product"
      />
    </div>
  );
};

export default ProductsList;
