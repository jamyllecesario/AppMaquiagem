import React from 'react';
import { ScrollView, View } from 'react-native';
import { Appbar, List, Button, IconButton, Text } from 'react-native-paper';
import { useCart } from '../context/CartContext';
import tw from 'twrnc';

export default function CarrinhoScreen({ navigation }) {
  const { cart, removeFromCart } = useCart();

  const total = cart.reduce((sum, item) => sum + parseFloat(item.price || 0), 0).toFixed(2);

  return (
    <View style={tw`flex-1 bg-pink-100`}>
      <Appbar.Header>
        <Appbar.Content title="Carrinho de Compras" />
      </Appbar.Header>

      <ScrollView contentContainerStyle={tw`p-4`}>
        {cart.length === 0 ? (
          <Text style={tw`text-center text-gray-400 mt-10 italic text-lg`}>
            Seu carrinho está vazio.
          </Text>
        ) : (
          cart.map(item => (
            <View
              key={item.cartItemId}
              style={tw`bg-white rounded-lg shadow-md p-4 mb-4`}
            >
              <List.Item
                title={item.name}
                titleStyle={tw`text-pink-800 font-semibold text-lg`}
                description={`R$ ${item.price}`}
                descriptionStyle={tw`text-gray-700`}
                right={() => (
                  <View style={tw`flex-row items-center`}>
                    <Button
                      mode="outlined"
                      onPress={() => removeFromCart(item.cartItemId)}
                      compact
                      style={tw`mr-2 border-pink-500`}
                      labelStyle={tw`text-pink-500`}
                    >
                      Remover
                    </Button>
                    <IconButton
                      icon="delete"
                      size={24}
                      onPress={() => removeFromCart(item.cartItemId)}
                      color="#db2777"
                    />
                  </View>
                )}
              />
            </View>
          ))
        )}

        {cart.length > 0 && (
          <Text style={tw`text-right font-bold text-xl mt-4 text-pink-700`}>
            Total: R$ {total}
          </Text>
        )}

        <Button
          mode="contained"
          style={tw`mt-6 bg-pink-600 rounded-full shadow-lg`}
          onPress={() => navigation.navigate('FinalizarCompra')}
          disabled={cart.length === 0}
          labelStyle={tw`text-white font-semibold`}
        >
          Finalizar Compra
        </Button>
      </ScrollView>
    </View>
  );
}
