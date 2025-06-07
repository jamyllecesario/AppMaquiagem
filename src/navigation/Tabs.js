import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import ListaProdutosScreen from '../screens/ListaProdutosScreen';
import CarrinhoScreen from '../screens/CarrinhoScreen';
import { Ionicons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

export default function Tabs() {
  return (
    <Tab.Navigator screenOptions={({ route }) => ({
      tabBarIcon: ({ color, size }) => {
        let iconName;
        if (route.name === 'Home') iconName = 'home';
        else if (route.name === 'Produtos') iconName = 'bag';
        else if (route.name === 'Carrinho') iconName = 'cart';
        return <Ionicons name={iconName} size={size} color={color} />;
      },
    })}>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Produtos" component={ListaProdutosScreen} />
      <Tab.Screen name="Carrinho" component={CarrinhoScreen} />
    </Tab.Navigator>
  );
}
