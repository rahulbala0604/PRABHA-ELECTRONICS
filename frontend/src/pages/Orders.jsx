import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { Package } from 'lucide-react';

const Orders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch('/api/orders/mine', {
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
    if (user) fetchOrders();
  }, [user]);

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <h1 className="text-3xl font-bold text-primary mb-8">My Orders</h1>
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-100">
          <Package className="mx-auto h-16 w-16 text-gray-300 mb-4" />
          <h2 className="text-xl font-bold text-primary mb-2">No orders found</h2>
          <p className="text-gray-500 mb-6">You haven't placed any orders yet.</p>
          <Link to="/shop" className="btn-primary">Start Shopping</Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map(order => (
            <div key={order._id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="bg-gray-50 p-4 border-b border-gray-100 flex flex-wrap justify-between items-center gap-4">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Order Placed</p>
                  <p className="text-sm font-medium text-gray-900">{new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Total Amount</p>
                  <p className="text-sm font-medium text-gray-900">₹{order.totalPrice.toLocaleString('en-IN')}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Order ID</p>
                  <Link to={`/orders/${order._id}`} className="text-sm font-bold text-accent hover:underline">#{order._id}</Link>
                </div>
                <div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    order.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                    order.status === 'Cancelled' ? 'bg-red-100 text-red-700' :
                    'bg-blue-100 text-blue-700'
                  }`}>
                    {order.status}
                  </span>
                </div>
              </div>
              <div className="p-6">
                {order.orderItems.map((item, idx) => (
                  <div key={idx} className="flex gap-4 mb-4 pb-4 border-b border-gray-50 last:mb-0 last:pb-0 last:border-0">
                    <div className="w-16 h-16 bg-gray-100 rounded flex items-center justify-center text-xs text-gray-400">Img</div>
                    <div className="flex-1">
                      <Link to={`/product/${item.product}`} className="font-semibold text-primary hover:text-accent transition-colors line-clamp-1">
                        {item.name}
                      </Link>
                      <p className="text-sm text-gray-500 mt-1">Qty: {item.qty} | Price: ₹{item.price.toLocaleString('en-IN')}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
