// ListaProdutosScreen.js
import React, { useEffect, useState } from 'react';
import { ScrollView, View, Image, Alert, ActivityIndicator } from 'react-native';
import { Appbar, Card, Button, Text } from 'react-native-paper';
import tw from 'twrnc';
import api from '../services/api';
import { useCart } from '../context/CartContext';

export default function ListaProdutosScreen() {
  const { addToCart } = useCart();
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const carregarProdutos = async () => {
      try {
        const res = await api.get('products?limit=100');

        // Filtrar produtos com nomes relacionados à maquiagem
        const maquiagem = res.data.products.filter(prod =>
          /makeup|cosmetic|beauty|lipstick|foundation|eyeliner|mascara/i
            .test(prod.title + ' ' + prod.category)
        );

        const formatados = maquiagem.map(prod => ({
          id: prod.id,
          name: prod.title,
          price: prod.price.toFixed(2),
          image_link: prod.images[0],
          product_type: prod.category,
        }));

        setProdutos(formatados);
      } catch (error) {
        console.error(error);
        Alert.alert('Erro', 'Não foi possível carregar os produtos.');
      } finally {
        setLoading(false);
      }
    };

    carregarProdutos();
  }, []);

  if (loading) {
    return (
      <View style={tw`flex-1 justify-center items-center bg-pink-100`}>
        <ActivityIndicator size="large" color="#db2777" />
        <Text style={tw`mt-4 text-pink-700`}>Carregando produtos de maquiagem...</Text>
      </View>
    );
  }

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
            elevation={4}
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
                Preço: R$ {prod.price}
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
