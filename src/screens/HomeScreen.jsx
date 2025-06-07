import React from 'react';
import { View } from 'react-native';
import { Appbar, Button, Card, Text } from 'react-native-paper';
import tw from 'twrnc';

export default function HomeScreen({ navigation }) {
  return (
    <View style={tw`flex-1 bg-pink-100`}>
      <Appbar.Header>
        <Appbar.Content title="MakeGlow" />
      </Appbar.Header>

      <Card style={tw`m-4 p-4`}>
        <Card.Title title="Seja Bem-vinda !" />
        <Card.Content>
          <Text style={tw`text-base text-gray-700`}>"Pele linda, atitude forte, maquiagem real."</Text>
          <Button
            icon="lipstick"
            mode="contained"
            style={tw`mt-4 bg-pink-600`}
            onPress={() => navigation.navigate('Produtos')}
          >
            Ver Produtos
          </Button>

          {/* Botão novo para cadastro */}
          <Button
            mode="outlined"
            style={tw`mt-4`}
            onPress={() => navigation.navigate('CadastroCliente')}
          >
            Cadastrar Cliente
          </Button>
        </Card.Content>
      </Card>
    </View>
  );
}
