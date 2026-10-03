import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Save, ArrowLeft, Image as ImageIcon } from 'lucide-react';

const ProductEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const isAddMode = !id;
  
  const [loading, setLoading] = useState(!isAddMode);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    brand: '',
    category: '',
    description: '',
    originalPrice: 0,
    salePrice: 0,
    stock: 0,
    features: '',
    specifications: '',
    warranty: '',
    images: '',
    isActive: true
  });

  useEffect(() => {
    const fetchDropdowns = async () => {
      try {
        const [catRes, brandRes] = await Promise.all([
          fetch('/api/categories'),
          fetch('/api/brands')
        ]);
        if(catRes.ok) setCategories(await catRes.json());
        if(brandRes.ok) setBrands(await brandRes.json());
      } catch (err) {
        console.error("Failed to load categories/brands", err);
      }
    };
    fetchDropdowns();
  }, []);

  useEffect(() => {
    if (isAddMode) return;
    
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${id}`);
        const data = await res.json();
        
        if (!res.ok) throw new Error(data.message || 'Failed to fetch product');
        
        setFormData({
          name: data.name || '',
          sku: data.sku || '',
          brand: data.brand || '',
          category: data.category || '',
          description: data.description || '',
          originalPrice: data.originalPrice || 0,
          salePrice: data.salePrice || 0,
          stock: data.stock || 0,
          features: data.features ? data.features.join('\n') : '',
          specifications: data.specifications ? JSON.stringify(data.specifications, null, 2) : '',
          warranty: data.warranty || '',
          images: data.images ? data.images.join(',') : '',
          isActive: data.isActive !== false
        });
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    
    fetchProduct();
  }, [id, isAddMode]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    
    try {
      // Prepare payload
      const payload = {
        ...formData,
        features: formData.features.split('\n').filter(f => f.trim() !== ''),
        images: formData.images.split(',').map(i => i.trim()).filter(i => i !== ''),
        specifications: formData.specifications ? JSON.parse(formData.specifications) : {}
      };
      
      const method = isAddMode ? 'POST' : 'PUT';
      const url = isAddMode ? '/api/products' : `/api/products/${id}`;
      
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`
        },
        body: JSON.stringify(payload)
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Operation failed');
      
      navigate('/admin/products');
    } catch (err) {
      setError(err.message);
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Loading product data...</div>;

  return (
    <div className="max-w-4xl mx-auto pb-12">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link to="/admin/products" className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-2xl font-bold text-primary">{isAddMode ? 'Add New Product' : 'Edit Product'}</h1>
        </div>
        <button 
          onClick={handleSubmit} 
          disabled={saving}
          className={`btn-primary py-2 px-6 flex items-center gap-2 ${saving ? 'opacity-70 cursor-not-allowed' : ''}`}
        >
          <Save size={18} /> {saving ? 'Saving...' : 'Save Product'}
        </button>
      </div>
      
      {error && <div className="bg-red-50 text-red-600 p-4 rounded-md mb-6 text-sm font-medium">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* PRODUCT INFORMATION */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-primary mb-4 pb-2 border-b border-gray-100">Product Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
              <input type="text" name="name" required value={formData.name} onChange={handleChange} className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-accent" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">SKU</label>
              <input type="text" name="sku" value={formData.sku} onChange={handleChange} className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-accent" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
              <select name="brand" value={formData.brand} onChange={handleChange} className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-accent">
                <option value="">Select Brand</option>
                {brands.map(b => <option key={b._id} value={b.name}>{b.name}</option>)}
                {!brands.length && <option value="Samsung">Samsung (Fallback)</option>}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select name="category" value={formData.category} onChange={handleChange} className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-accent">
                <option value="">Select Category</option>
                {categories.map(c => <option key={c._id} value={c.name}>{c.name}</option>)}
                {!categories.length && <option value="Televisions">Televisions (Fallback)</option>}
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
              <textarea name="description" required rows="4" value={formData.description} onChange={handleChange} className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-accent"></textarea>
            </div>
          </div>
        </div>

        {/* PRICING */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-primary mb-4 pb-2 border-b border-gray-100">Pricing</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Selling Price (₹) *</label>
              <input type="number" min="0" name="salePrice" required value={formData.salePrice} onChange={handleChange} className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-accent" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Original Price / MRP (₹)</label>
              <input type="number" min="0" name="originalPrice" value={formData.originalPrice} onChange={handleChange} className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-accent" />
            </div>
          </div>
        </div>

        {/* INVENTORY */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-primary mb-4 pb-2 border-b border-gray-100">Inventory & Status</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Stock Quantity *</label>
              <input type="number" min="0" name="stock" required value={formData.stock} onChange={handleChange} className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-accent" />
            </div>
            <div className="flex items-center mt-6">
              <label className="flex items-center cursor-pointer">
                <div className="relative">
                  <input type="checkbox" name="isActive" checked={formData.isActive} onChange={handleChange} className="sr-only" />
                  <div className={`block w-14 h-8 rounded-full transition-colors ${formData.isActive ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                  <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${formData.isActive ? 'transform translate-x-6' : ''}`}></div>
                </div>
                <div className="ml-3 text-gray-700 font-medium">
                  {formData.isActive ? 'Active (Visible in Store)' : 'Inactive (Hidden)'}
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* DETAILS */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-primary mb-4 pb-2 border-b border-gray-100">Product Details</h2>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Features (One per line)</label>
              <textarea name="features" rows="4" value={formData.features} onChange={handleChange} placeholder="e.g. 4K Ultra HD&#10;Dolby Audio&#10;Smart TV" className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-accent text-sm"></textarea>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Specifications (JSON format)</label>
              <textarea name="specifications" rows="4" value={formData.specifications} onChange={handleChange} placeholder='{"Display": "LED", "Size": "55 inch"}' className="w-full font-mono text-xs border border-gray-300 rounded-md py-2 px-3 focus:outline-accent"></textarea>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Warranty Information</label>
              <input type="text" name="warranty" value={formData.warranty} onChange={handleChange} placeholder="e.g. 1 Year Manufacturer Warranty" className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-accent" />
            </div>
          </div>
        </div>

        {/* IMAGES */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-primary mb-4 pb-2 border-b border-gray-100 flex items-center gap-2">
            <ImageIcon size={18} /> Images
          </h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Image URLs (Comma separated)</label>
            <input type="text" name="images" value={formData.images} onChange={handleChange} placeholder="https://example.com/img1.jpg, https://example.com/img2.jpg" className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-accent text-sm" />
            <p className="text-xs text-gray-500 mt-2">In a production environment, this would integrate an image upload widget.</p>
          </div>
        </div>

      </form>
    </div>
  );
};

export default ProductEdit;
