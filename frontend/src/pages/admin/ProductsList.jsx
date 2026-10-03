import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import { Edit, Trash2, Plus } from 'lucide-react';

const ProductsList = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products');
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
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to deactivate this product?')) {
      try {
        const res = await fetch(`/api/products/${id}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${user.token}` }
        });
        if (res.ok) {
          fetchProducts();
        } else {
          const data = await res.json();
          alert(data.message || 'Failed to delete');
        }
      } catch (err) {
        alert('Server error while deleting');
      }
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-primary">Products</h1>
        <Link to="/admin/products/add" className="btn-primary flex items-center gap-2 py-2 px-4 text-sm">
          <Plus size={16} /> Add New Product
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-sm text-gray-500 uppercase tracking-wider">
                <th className="p-4 font-semibold">Product Name</th>
                <th className="p-4 font-semibold">Brand</th>
                <th className="p-4 font-semibold">Price</th>
                <th className="p-4 font-semibold">Stock</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-gray-500">Loading products...</td>
                </tr>
              ) : products.map(product => (
                <tr key={product._id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-200 rounded flex-shrink-0"></div>
                      <span className="font-medium text-gray-900 line-clamp-1">{product.name}</span>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-gray-600">{product.brand}</td>
                  <td className="p-4 text-sm font-semibold text-primary">₹{product.salePrice.toLocaleString()}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${product.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-700'}`}>
                      {product.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${product.stock > 0 ? 'text-green-700' : 'text-red-700'}`}>
                      {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                    </span>
                  </td>
                  <td className="p-4 flex justify-end gap-2">
                    <Link to={`/admin/products/${product._id}/edit`} className="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors" title="Edit">
                      <Edit size={16} />
                    </Link>
                    <button onClick={() => handleDelete(product._id)} className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors" title="Deactivate">
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProductsList;
