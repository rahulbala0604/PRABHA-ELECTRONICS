import React, { useState, useEffect } from 'react';
import { Package, ShoppingBag, Users, IndianRupee } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalProducts: 0,
    activeProducts: 0,
    totalOrders: 0,
    totalCustomers: 0,
    totalEnquiries: 0,
    newEnquiries: 0,
    resolvedEnquiries: 0,
    recentEnquiries: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/admin/stats', {
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        });
        const data = await res.json();
        setStats(data);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };
    if(user) fetchStats();
  }, [user]);

  return (
    <div>
      <h1 className="text-3xl font-extrabold text-primary mb-8 tracking-tight">Dashboard Overview</h1>
      
      {loading ? (
        <div className="animate-pulse grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[1, 2, 3, 4].map(i => <div key={i} className="bg-gray-200 h-32 rounded-2xl"></div>)}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 border border-blue-100">
              <Package size={24} />
            </div>
            <div>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Total Products</p>
              <h3 className="text-2xl font-extrabold text-primary">{stats.totalProducts}</h3>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center text-green-600 border border-green-100">
              <ShoppingBag size={24} />
            </div>
            <div>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Total Enquiries</p>
              <h3 className="text-2xl font-extrabold text-primary">{stats.totalEnquiries}</h3>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600 border border-purple-100">
              <Users size={24} />
            </div>
            <div>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Total Customers</p>
              <h3 className="text-2xl font-extrabold text-primary">{stats.totalCustomers}</h3>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600 border border-orange-100">
              <IndianRupee size={24} />
            </div>
            <div>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">New Enquiries</p>
              <h3 className="text-2xl font-extrabold text-primary">{stats.newEnquiries}</h3>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 min-h-[300px]">
          <h2 className="text-xl font-bold text-primary mb-6">Recent Enquiries</h2>
          {stats.recentEnquiries && stats.recentEnquiries.length > 0 ? (
            <div className="space-y-4">
              {stats.recentEnquiries.map(enq => (
                <div key={enq._id} className="flex justify-between items-center border-b border-gray-50 pb-4 last:border-0 last:pb-0">
                  <div>
                    <p className="font-bold text-primary">{enq.customerName}</p>
                    <p className="text-xs font-semibold text-gray-400">{new Date(enq.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-primary mb-1">{enq.location}</p>
                    <span className={`text-[10px] font-extrabold uppercase tracking-wider px-2 py-1 rounded border ${enq.status === 'Resolved' ? 'bg-green-50 text-green-600 border-green-200' : 'bg-orange-50 text-orange-600 border-orange-200'}`}>{enq.status}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
             <div className="flex flex-col items-center justify-center h-40 text-center">
               <p className="text-gray-400 font-medium">No recent enquiries found.</p>
             </div>
          )}
        </div>
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 min-h-[300px]">
          <h2 className="text-xl font-bold text-primary mb-6">Enquiry Metrics</h2>
          <div className="space-y-4">
             <div className="flex justify-between items-center bg-orange-50 border border-orange-100 p-5 rounded-2xl">
                <span className="font-bold text-orange-800">New Enquiries</span>
                <span className="font-extrabold text-2xl text-orange-600">{stats.newEnquiries}</span>
             </div>
             <div className="flex justify-between items-center bg-green-50 border border-green-100 p-5 rounded-2xl">
                <span className="font-bold text-green-800">Resolved Enquiries</span>
                <span className="font-extrabold text-2xl text-green-600">{stats.resolvedEnquiries}</span>
             </div>
             <div className="flex justify-between items-center bg-blue-50 border border-blue-100 p-5 rounded-2xl">
                <span className="font-bold text-blue-800">Active Products</span>
                <span className="font-extrabold text-2xl text-blue-600">{stats.activeProducts}</span>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
