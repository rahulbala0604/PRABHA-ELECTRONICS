import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { success } = useToast();

  const redirect = location.search ? location.search.split('=')[1] : '/account';

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await login(email, password);
      success('Signed in successfully.');
      navigate(redirect);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-16 flex justify-center">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-2xl font-bold text-primary mb-6 text-center">Sign In</h2>
        
        {error && <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm">{error}</div>}
        
        <form onSubmit={submitHandler}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Email or Username</label>
            <input 
              type="text" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-accent"
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-accent"
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className={`w-full btn-primary py-2.5 ${loading ? 'opacity-70' : ''}`}
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>
        
        <div className="mt-6 text-center text-sm text-gray-600">
          New Customer?{' '}
          <Link to={`/register?redirect=${redirect}`} className="text-accent hover:underline font-semibold">
            Register Here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
