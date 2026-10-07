import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from './ToastContext';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';

const CartContext = createContext();

export const useCart = () => {
  return useContext(CartContext);
};

export const CartProvider = ({ children }) => {
  const { success, warning } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem('prabhaCart');
    return savedCart ? JSON.parse(savedCart) : [];
  });
  
  const [isInitialized, setIsInitialized] = useState(false);

  // Fetch cart when user logs in
  useEffect(() => {
    const fetchCart = async () => {
      if (user) {
        try {
          const res = await fetch('/api/cart', {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          });
          
          if (res.ok) {
            const data = await res.json();
            // Format backend items and filter out invalid products (e.g. deleted products)
            const backendItems = data
              .filter(item => item.product)
              .map(item => ({
                ...item.product,
                quantity: item.quantity
              }));
            
            setCartItems(backendItems);
          }
        } catch (error) {
          console.error('Failed to fetch cart', error);
        }
      } else {
        // User logged out, clear cart if we were previously initialized
        if (isInitialized) {
            setCartItems([]);
        }
      }
      setIsInitialized(true);
    };

    fetchCart();
  }, [user]);

  useEffect(() => {
    localStorage.setItem('prabhaCart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = async (product, quantity = 1) => {
    if (!user) {
      warning('Please login to add items to your cart.');
      navigate('/login');
      return;
    }
    
    let newQuantity = quantity;
    const existingItem = cartItems.find(item => item._id === product._id);
    if (existingItem) {
      newQuantity += existingItem.quantity;
    }
    
    // Optimistic update
    setCartItems(prevItems => {
      if (existingItem) {
        return prevItems.map(item => item._id === product._id ? { ...item, quantity: newQuantity } : item);
      }
      return [...prevItems, { ...product, quantity }];
    });
    success(`${product.name} added to enquiry cart`);
    
    // API Sync
    try {
      await fetch('/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ productId: product._id, quantity: newQuantity })
      });
    } catch (err) {
      console.error(err);
    }
  };

  const removeFromCart = async (productId) => {
    setCartItems(prevItems => prevItems.filter(item => item._id !== productId));
    
    if (user) {
      try {
        await fetch(`/api/cart/${productId}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${user.token}` }
        });
      } catch (err) {
        console.error(err);
      }
    }
  };

  const updateQuantity = async (productId, quantity) => {
    if (quantity < 1) return;
    setCartItems(prevItems => prevItems.map(item => item._id === productId ? { ...item, quantity } : item));
    
    if (user) {
      try {
        await fetch('/api/cart', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify({ productId, quantity })
        });
      } catch (err) {
        console.error(err);
      }
    }
  };

  const clearCart = async () => {
    setCartItems([]);
    if (user) {
      try {
        await fetch('/api/cart', {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${user.token}` }
        });
      } catch (err) {
        console.error(err);
      }
    }
  };

  const cartTotal = cartItems.reduce(
    (total, item) => total + (item.salePrice || 0) * item.quantity,
    0
  );

  const cartCount = cartItems.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartTotal,
        cartCount
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
