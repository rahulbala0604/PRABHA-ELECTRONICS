import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Edit, Trash2, Plus, Save, X } from 'lucide-react';

const BrandList = () => {
  const { user } = useAuth();
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const [formData, setFormData] = useState({ name: '', description: '', logo: '', isActive: true });
  const [saving, setSaving] = useState(false);

  const fetchBrands = async () => {
    try {
      const res = await fetch('/api/brands');
      setBrands(await res.json());
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => { fetchBrands(); }, []);

  const openAddModal = () => {
    setFormData({ name: '', description: '', logo: '', isActive: true });
    setEditingId(null);
    setShowModal(true);
  };

  const openEditModal = (brand) => {
    setFormData({ name: brand.name, description: brand.description || '', logo: brand.logo || '', isActive: brand.isActive });
    setEditingId(brand._id);
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      const method = editingId ? 'PUT' : 'POST';
      const url = editingId ? `/api/brands/${editingId}` : '/api/brands';
      
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`
        },
        body: JSON.stringify(formData)
      });
      
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message);
      }
      
      await fetchBrands();
      setShowModal(false);
    } catch (err) {
      alert(err.message || 'Operation failed');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to deactivate this brand?')) {
      try {
        const res = await fetch(`/api/brands/${id}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${user.token}` }
        });
        if (res.ok) fetchBrands();
      } catch (err) {
        alert('Server error');
      }
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-primary">Brands</h1>
        <button onClick={openAddModal} className="btn-primary flex items-center gap-2 py-2 px-4 text-sm">
          <Plus size={16} /> Add Brand
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100 text-sm text-gray-500 uppercase tracking-wider">
              <th className="p-4 font-semibold">Brand Name</th>
              <th className="p-4 font-semibold">Status</th>
              <th className="p-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr><td colSpan="3" className="p-8 text-center text-gray-500">Loading...</td></tr>
            ) : brands.length === 0 ? (
              <tr><td colSpan="3" className="p-8 text-center text-gray-500">No brands found.</td></tr>
            ) : brands.map(brand => (
              <tr key={brand._id} className="hover:bg-gray-50">
                <td className="p-4 font-medium text-primary">{brand.name}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${brand.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-700'}`}>
                    {brand.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="p-4 flex justify-end gap-2">
                  <button onClick={() => openEditModal(brand)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-md" title="Edit">
                    <Edit size={16} />
                  </button>
                  <button onClick={() => handleDelete(brand._id)} className="p-2 text-red-600 hover:bg-red-50 rounded-md" title="Deactivate">
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b border-gray-100 bg-gray-50">
              <h2 className="text-lg font-bold text-primary">{editingId ? 'Edit Brand' : 'Add Brand'}</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-gray-700"><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Brand Name *</label>
                  <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-accent" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea rows="3" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-accent"></textarea>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Logo URL</label>
                  <input type="text" value={formData.logo} onChange={e => setFormData({...formData, logo: e.target.value})} className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-accent" />
                </div>
                <div className="flex items-center pt-2">
                  <input type="checkbox" id="isActive" checked={formData.isActive} onChange={e => setFormData({...formData, isActive: e.target.checked})} className="mr-2" />
                  <label htmlFor="isActive" className="text-sm text-gray-700">Active</label>
                </div>
              </div>
              <div className="mt-8 flex justify-end gap-3">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">Cancel</button>
                <button type="submit" disabled={saving} className={`btn-primary px-4 py-2 flex items-center gap-2 ${saving ? 'opacity-70' : ''}`}>
                  <Save size={16} /> {saving ? 'Saving...' : 'Save Brand'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BrandList;
