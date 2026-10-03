import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Eye } from 'lucide-react';

const AdminEnquiriesList = () => {
  const { user } = useAuth();
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEnquiries = async () => {
      try {
        const res = await fetch('/api/enquiries', {
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        });
        const data = await res.json();
        setEnquiries(data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchEnquiries();
  }, [user]);

  const updateStatus = async (id, status) => {
    try {
      const res = await fetch(`/api/enquiries/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`
        },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        const updated = await res.json();
        setEnquiries(enquiries.map(e => e._id === id ? updated : e));
      }
    } catch (err) {
      alert('Failed to update status');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-primary">Manage Enquiries</h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-sm text-gray-500 uppercase tracking-wider">
                <th className="p-4 font-semibold">Date</th>
                <th className="p-4 font-semibold">Customer</th>
                <th className="p-4 font-semibold">Location</th>
                <th className="p-4 font-semibold">Products</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold text-right">Update Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-gray-500">Loading enquiries...</td>
                </tr>
              ) : enquiries.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-gray-500">No enquiries found.</td>
                </tr>
              ) : enquiries.map(enq => (
                <tr key={enq._id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 text-sm text-gray-600">{new Date(enq.createdAt).toLocaleDateString()}</td>
                  <td className="p-4">
                    <p className="font-bold text-primary">{enq.customerName}</p>
                    <p className="text-xs text-gray-500">{enq.phone}</p>
                  </td>
                  <td className="p-4 text-sm text-gray-600">{enq.location}</td>
                  <td className="p-4 text-sm text-gray-600">
                    <ul className="list-disc list-inside">
                      {enq.products.map(p => (
                        <li key={p._id} className="line-clamp-1">{p.name} (x{p.qty})</li>
                      ))}
                    </ul>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      enq.status === 'Resolved' ? 'bg-green-100 text-green-700' : 
                      enq.status === 'Contacted' ? 'bg-blue-100 text-blue-700' : 
                      'bg-orange-100 text-orange-700'
                    }`}>
                      {enq.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <select 
                      className="border border-gray-300 rounded text-sm p-1 focus:outline-accent"
                      value={enq.status}
                      onChange={(e) => updateStatus(enq._id, e.target.value)}
                    >
                      <option value="New">New</option>
                      <option value="Contacted">Contacted</option>
                      <option value="Resolved">Resolved</option>
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

export default AdminEnquiriesList;
