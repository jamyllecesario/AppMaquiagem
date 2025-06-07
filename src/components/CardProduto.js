import React from 'react';
import { Card, Button, Text } from 'react-native-paper';
import { Image } from 'react-native';
import tw from 'twrnc';

export default function CardProduto({ produto, onPress }) {
  return (
    <Card style={tw`mb-4`}>
      <Card.Title title={produto.name} subtitle={produto.product_type || produto.categoria} />
      {produto.image_link ? (
        <Image source={{ uri: produto.image_link }} style={tw`w-full h-48`} resizeMode="contain" />
      ) : null}
      <Card.Content>
        <Text style={tw`text-base text-gray-700`}>Preço: ${produto.price || produto.preco || '0.00'}</Text>
      </Card.Content>
      <Card.Actions>
        <Button mode="contained" icon="cart" onPress={onPress} style={tw`bg-pink-600`}>
          Adicionar ao carrinho
        </Button>
      </Card.Actions>
    </Card>
  );
}
<View style={tw`p-4 bg-pink-100 rounded-xl`}>
  <Text style={tw`text-lg text-pink-700 font-bold`}>Batom</Text>
</View>