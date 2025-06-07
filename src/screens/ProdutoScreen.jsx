import React, { useEffect, useState } from 'react';
import { ScrollView, Alert } from 'react-native';
import { Appbar, Button, List, Text } from 'react-native-paper';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import tw from 'twrnc';

const productTypes = [
  { type: 'lipstick', label: 'Batom' },
  { type: 'foundation', label: 'Base' },
  { type: 'mascara', label: 'Rímel' },
  { type: 'eyeliner', label: 'Delineador' },
  { type: 'blush', label: 'Blush' },
  { type: 'nail_polish', label: 'Esmalte' },
  { type: 'tool', label: 'Pincel' }, 
];

const ProductsScreen = () => {
  const [allProducts, setAllProducts] = useState({});
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const results = await Promise.all(
          productTypes.map(p =>
            axios.get(`https://makeup-api.herokuapp.com/api/v1/products.json?product_type=${p.type}`)
          )
        );
        const newProducts = {};
        productTypes.forEach((p, index) => {
          
          newProducts[p.label] = results[index].data.slice(0, 4);
        });
        setAllProducts(newProducts);
      } catch (error) {
        Alert.alert('Erro', 'Falha ao buscar produtos.');
      }
    };

    fetchProducts();
  }, []);

  return (
    <>
      <Appbar.Header>
        <Appbar.Content title="Produtos de Maquiagem" />
      </Appbar.Header>

      <ScrollView style={tw`bg-gray-100`}>
        {Object.entries(allProducts).map(([category, products]) => (
          <List.Section key={category} title={category} style={tw`px-4`}>
            {products.map(product => {
              const precoFormatado = product.price ? Number(product.price).toFixed(2) : '0.00';
              return (
                <List.Item
                  key={product.id}
                  title={product.name}
                  description={`R$ ${precoFormatado}`}
                  style={tw`mb-3 bg-white rounded-lg shadow-md`}
                  right={() => (
                    <Button
                      mode="contained"
                      contentStyle={tw`px-4 py-1`}
                      onPress={() => addToCart(product)}
                    >
                      Add
                    </Button>
                  )}
                />
              );
            })}
          </List.Section>
        ))}
      </ScrollView>
    </>
  );
};

export default ProductsScreen;
