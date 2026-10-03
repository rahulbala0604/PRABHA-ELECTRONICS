import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, User, Settings } from 'lucide-react';

const Account = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-primary mb-8">My Account</h1>
      
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <div className="w-full md:w-64 flex-shrink-0">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 bg-primary text-white text-center">
              <div className="w-16 h-16 bg-accent rounded-full mx-auto flex items-center justify-center text-xl font-bold mb-3">
                {user?.name.charAt(0)}
              </div>
              <h3 className="font-bold">{user?.name}</h3>
              <p className="text-sm text-gray-300">{user?.email}</p>
            </div>
            <div className="flex flex-col p-2">
              <Link to="/account" className="flex items-center gap-3 p-3 text-accent font-medium bg-gray-50 rounded-md">
                <User size={18} /> Profile Info
              </Link>

              {user?.isAdmin && (
                <Link to="/admin" className="flex items-center gap-3 p-3 text-gray-700 hover:bg-gray-50 rounded-md transition-colors">
                  <Settings size={18} /> Admin Dashboard
                </Link>
              )}
              <button 
                onClick={handleLogout}
                className="flex items-center gap-3 p-3 text-red-500 hover:bg-red-50 rounded-md transition-colors text-left"
              >
                <LogOut size={18} /> Logout
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1">
          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-primary mb-6">Profile Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Full Name</label>
                <p className="font-medium text-gray-900 border-b border-gray-200 pb-2">{user?.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Email Address</label>
                <p className="font-medium text-gray-900 border-b border-gray-200 pb-2">{user?.email}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Account Type</label>
                <p className="font-medium text-gray-900 border-b border-gray-200 pb-2">{user?.isAdmin ? 'Administrator' : 'Customer'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;
