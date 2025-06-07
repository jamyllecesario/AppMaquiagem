import React, { useEffect } from 'react';
import { StatusBar, Alert } from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import AppNavigator from './src/navigation/AppNavigator';
import { CartProvider } from './src/context/CartContext';
import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
  }),
});


export default function App() {
  useEffect(() => {
    const pedirPermissaoNotificacao = async () => {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permissão Negada', 'O app precisa de permissão para enviar notificações.');
      }
    };
    pedirPermissaoNotificacao();
  }, []);

  return (
    <PaperProvider>
      <CartProvider>
        <StatusBar barStyle="dark-content" />
        <AppNavigator />
      </CartProvider>
    </PaperProvider>
  );
}
