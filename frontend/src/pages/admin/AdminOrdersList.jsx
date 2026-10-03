import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import { Edit } from 'lucide-react';

const AdminOrdersList = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch('/api/orders', {
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        });
        const data = await res.json();
        setOrders(data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchOrders();
  }, [user]);

  const updateStatus = async (id, status) => {
    try {
      const res = await fetch(`/api/orders/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`
        },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        const updatedOrder = await res.json();
        setOrders(orders.map(o => o._id === id ? updatedOrder : o));
      }
    } catch (err) {
      alert('Failed to update status');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-primary">Manage Orders</h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-sm text-gray-500 uppercase tracking-wider">
                <th className="p-4 font-semibold">Order ID</th>
                <th className="p-4 font-semibold">Customer</th>
                <th className="p-4 font-semibold">Date</th>
                <th className="p-4 font-semibold">Total</th>
                <th className="p-4 font-semibold">Payment</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold text-right">Update Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-gray-500">Loading orders...</td>
                </tr>
              ) : orders.map(order => (
                <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 text-sm font-medium text-primary">
                    <Link to={`/orders/${order._id}`} className="hover:text-accent">#{order._id.substring(0, 8)}...</Link>
                  </td>
                  <td className="p-4 text-sm text-gray-600">{order.user ? order.user.name : 'Guest'}</td>
                  <td className="p-4 text-sm text-gray-600">{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td className="p-4 text-sm font-bold text-primary">₹{order.totalPrice.toLocaleString()}</td>
                  <td className="p-4">
                    <div className="text-sm">
                      <span className="font-medium text-gray-700">{order.paymentMethod === 'online' ? 'Online' : 'COD'}</span>
                      <br/>
                      <span className={`text-xs font-bold ${
                        order.paymentStatus === 'paid' ? 'text-green-600' :
                        order.paymentStatus === 'failed' ? 'text-red-600' : 'text-orange-500'
                      }`}>
                        {order.paymentStatus ? order.paymentStatus.toUpperCase() : 'PENDING'}
                      </span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      order.status === 'Delivered' ? 'bg-green-100 text-green-700' : 
                      order.status === 'Cancelled' ? 'bg-red-100 text-red-700' : 
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <select 
                      className="border border-gray-300 rounded text-sm p-1 focus:outline-accent"
                      value={order.status}
                      onChange={(e) => updateStatus(order._id, e.target.value)}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
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

export default AdminOrdersList;
