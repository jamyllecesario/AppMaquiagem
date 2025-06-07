
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Tabs from './Tabs';

import FinalizarCompraScreen from '../screens/FinalizarCompraScreen';
import CadastroClienteScreen from '../screens/CadastroClienteScreen';
import FeedbackScreen from '../screens/FeedbackScreen';
import EstoqueScreen from '../screens/EstoqueScreen';

const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Main" component={Tabs} options={{ headerShown: false }} />
        <Stack.Screen name="FinalizarCompra" component={FinalizarCompraScreen} />
        <Stack.Screen name="CadastroCliente" component={CadastroClienteScreen} />
        <Stack.Screen name="Feedback" component={FeedbackScreen} />
        <Stack.Screen name="Estoque" component={EstoqueScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
