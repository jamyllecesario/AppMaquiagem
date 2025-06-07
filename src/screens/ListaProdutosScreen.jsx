import React, { useEffect, useState } from 'react';
import { ScrollView, View, Image, Alert } from 'react-native';
import { Appbar, Card, Button, Text } from 'react-native-paper';
import { useCart } from '../context/CartContext';
import tw from 'twrnc';
import api from '../services/api';

const categorias = [
  { brand: 'maybelline', type: 'lipstick' },
  { brand: 'covergirl', type: 'mascara' },
  { brand: "l'oreal", type: 'foundation' },
  { brand: 'revlon', type: 'eyeliner' },
];

export default function ListaProdutosScreen() {
  const { addToCart } = useCart();
  const [produtos, setProdutos] = useState([]);

  useEffect(() => {
    const carregarProdutos = async () => {
      try {
        const respostas = await Promise.all(
          categorias.map(cat =>
            api.get(`products.json?brand=${cat.brand}&product_type=${cat.type}`)
          )
        );

        const todos = respostas.flatMap(res => res.data.slice(0, 5));
        setProdutos(todos);
      } catch (error) {
        Alert.alert('Erro', 'Erro ao carregar produtos.');
      }
    };

    carregarProdutos();
  }, []);

  return (
    <View style={tw`flex-1 bg-pink-100`}>
      <Appbar.Header>
        <Appbar.Content title="Produtos de Maquiagem" />
      </Appbar.Header>

      <ScrollView contentContainerStyle={tw`p-4 pb-12`}>
        {produtos.map(prod => (
          <Card
            key={prod.id}
            style={tw`mb-6 rounded-lg shadow-md bg-white p-4`}
            elevation={4} // para Android sombra
          >
            <Card.Title
              title={prod.name}
              titleStyle={tw`text-lg font-bold text-pink-800`}
              subtitle={prod.product_type}
              subtitleStyle={tw`text-sm text-pink-600`}
            />
            {prod.image_link && (
              <Image
                source={{ uri: prod.image_link }}
                style={tw`w-full h-48 rounded-md my-2`}
                resizeMode="contain"
              />
            )}
            <Card.Content>
              <Text style={tw`text-xl font-semibold text-pink-700`}>
                Preço: ${prod.price || '0.00'}
              </Text>
            </Card.Content>
            <Card.Actions>
              <Button
                icon="cart"
                mode="contained"
                onPress={() => addToCart(prod)}
                style={tw`bg-pink-600 rounded-full shadow-lg`}
                labelStyle={tw`text-white font-semibold`}
              >
                Adicionar ao carrinho
              </Button>
            </Card.Actions>
          </Card>
        ))}
      </ScrollView>
    </View>
  );
}
