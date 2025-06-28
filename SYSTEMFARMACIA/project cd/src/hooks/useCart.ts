import { useState } from 'react';
import { CartItem, Product } from '../types';

export const useCart = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const addToCart = (product: Product, cantidad: number = 1) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.producto.id === product.id);
      
      if (existingItem) {
        return prevItems.map(item =>
          item.producto.id === product.id
            ? {
                ...item,
                cantidad: item.cantidad + cantidad,
                subtotal: (item.cantidad + cantidad) * product.precio
              }
            : item
        );
      } else {
        return [...prevItems, {
          producto: product,
          cantidad,
          subtotal: cantidad * product.precio
        }];
      }
    });
  };

  const removeFromCart = (productId: number) => {
    setCartItems(prevItems => prevItems.filter(item => item.producto.id !== productId));
  };

  const updateQuantity = (productId: number, cantidad: number) => {
    if (cantidad <= 0) {
      removeFromCart(productId);
      return;
    }

    setCartItems(prevItems =>
      prevItems.map(item =>
        item.producto.id === productId
          ? {
              ...item,
              cantidad,
              subtotal: cantidad * item.producto.precio
            }
          : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + item.subtotal, 0);
  };

  const getCartItemsCount = () => {
    return cartItems.reduce((count, item) => count + item.cantidad, 0);
  };

  const formatPrice = (price: number) => {
    return `S/. ${price.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
  };

  return {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartItemsCount,
    formatPrice
  };
};