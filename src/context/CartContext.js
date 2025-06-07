import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const carregarCarrinho = async () => {
      const dados = await AsyncStorage.getItem('cart');
      if (dados) setCart(JSON.parse(dados));
    };
    carregarCarrinho();
  }, []);

  const addToCart = async (produto) => {
    const cartItemId = Date.now().toString() + Math.random().toString(36).substr(2, 5);
    const produtoComIdUnico = { ...produto, cartItemId };
    const novoCarrinho = [...cart, produtoComIdUnico];
    setCart(novoCarrinho);
    await AsyncStorage.setItem('cart', JSON.stringify(novoCarrinho));
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Item Adicionado',
        body: `${produto.name} foi adicionado ao carrinho.`,
      },
      trigger: null,
    });
  };

  const removeFromCart = async (cartItemId) => {
    const atualizado = cart.filter(item => item.cartItemId !== cartItemId);
    setCart(atualizado);
    await AsyncStorage.setItem('cart', JSON.stringify(atualizado));
  };

  return (
    <CartContext.Provider value={{ cart, setCart, addToCart, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
