import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Package, Truck, CreditCard, CheckCircle, Clock } from 'lucide-react';

const OrderDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await fetch(`/api/orders/${id}`, {
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        setOrder(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    if (user) fetchOrder();
  }, [id, user]);

  if (loading) return <div className="text-center py-20">Loading order details...</div>;
  if (error) return <div className="text-center py-20 text-red-600">{error}</div>;
  if (!order) return <div className="text-center py-20">Order not found.</div>;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-primary">Order #{order._id}</h1>
        <Link to="/orders" className="text-accent hover:underline text-sm font-semibold">&larr; Back to Orders</Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
        <div className="flex flex-col md:flex-row justify-between gap-6">
          <div>
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Order Date</h3>
            <p className="font-medium text-gray-900">{new Date(order.createdAt).toLocaleString()}</p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Order Status</h3>
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
              order.status === 'Delivered' ? 'bg-green-100 text-green-700' :
              order.status === 'Cancelled' ? 'bg-red-100 text-red-700' :
              'bg-blue-100 text-blue-700'
            }`}>
              {order.status}
            </span>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Payment Status</h3>
            <div className="flex items-center gap-2 font-medium text-gray-900">
              {order.paymentStatus === 'paid' ? <CheckCircle size={16} className="text-green-500" /> : <Clock size={16} className="text-orange-500" />}
              {order.paymentStatus === 'paid' ? `Paid on ${new Date(order.paidAt).toLocaleDateString()}` : order.paymentStatus === 'failed' ? 'Failed' : 'Pending'}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-3 mb-4 text-primary">
            <Truck size={20} className="text-accent" />
            <h2 className="text-lg font-bold">Shipping Details</h2>
          </div>
          <p className="font-semibold text-gray-900 mb-1">{order.shippingAddress.firstName} {order.shippingAddress.lastName}</p>
          <p className="text-gray-600 text-sm mb-1">{order.shippingAddress.address}</p>
          <p className="text-gray-600 text-sm mb-1">{order.shippingAddress.city} - {order.shippingAddress.postalCode}</p>
          <p className="text-gray-600 text-sm mb-4">Phone: {order.shippingAddress.phone}</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-3 mb-4 text-primary">
            <CreditCard size={20} className="text-accent" />
            <h2 className="text-lg font-bold">Payment Details</h2>
          </div>
          <p className="font-semibold text-gray-900 mb-1">Method: {order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'}</p>
          <div className="mt-4 pt-4 border-t border-gray-100 space-y-2 text-sm">
             <div className="flex justify-between"><span className="text-gray-600">Items Total:</span> <span className="font-medium">₹{order.itemsPrice.toLocaleString()}</span></div>
             <div className="flex justify-between"><span className="text-gray-600">Tax:</span> <span className="font-medium">₹{order.taxPrice.toLocaleString()}</span></div>
             <div className="flex justify-between"><span className="text-gray-600">Shipping:</span> <span className="font-medium">₹{order.shippingPrice.toLocaleString()}</span></div>
             <div className="flex justify-between pt-2 border-t border-gray-100 mt-2 text-base"><span className="font-bold text-gray-900">Grand Total:</span> <span className="font-bold text-accent">₹{order.totalPrice.toLocaleString()}</span></div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center gap-3 mb-6 text-primary">
          <Package size={20} className="text-accent" />
          <h2 className="text-lg font-bold">Order Items</h2>
        </div>
        <div className="space-y-4">
          {order.orderItems.map((item, idx) => (
            <div key={idx} className="flex gap-4 pb-4 border-b border-gray-50 last:border-0 last:pb-0">
              <div className="w-16 h-16 bg-gray-100 rounded"></div>
              <div className="flex-1 flex justify-between items-start">
                <div>
                  <Link to={`/product/${item.product}`} className="font-semibold text-primary hover:text-accent line-clamp-1">{item.name}</Link>
                  <p className="text-sm text-gray-500 mt-1">Qty: {item.qty}</p>
                </div>
                <p className="font-bold text-primary">₹{(item.price * item.qty).toLocaleString()}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
