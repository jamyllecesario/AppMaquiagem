import React, { useEffect, useState } from 'react';
import { View, ScrollView, Alert } from 'react-native';
import { Appbar, Text, Button, List, TextInput } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCart } from '../context/CartContext';
import tw from 'twrnc';
import { Formik } from 'formik';
import * as Yup from 'yup';
import MaskInput from 'react-native-mask-input';
import * as Notifications from 'expo-notifications';

const FeedbackSchema = Yup.object().shape({
  nome: Yup.string().required('Nome obrigatório'),
  email: Yup.string().email('Email inválido').required('Email obrigatório'),
  nota: Yup.number().min(1).max(5).required('Nota de 1 a 5'),
  comentario: Yup.string().required('Comentário obrigatório'),
  data: Yup.string().required('Data obrigatória'),
});

export default function FinalizarCompraScreen({ navigation }) {
  const { cart, setCart } = useCart();
  const [cliente, setCliente] = useState(null);
  const [feedbacks, setFeedbacks] = useState([]);

  useEffect(() => {
    const carregarClienteEFeedbacks = async () => {
      const dadosCliente = await AsyncStorage.getItem('clientes');
      if (dadosCliente) {
        const listaClientes = JSON.parse(dadosCliente);
        if (listaClientes.length > 0) {
          setCliente(listaClientes[0]); // pega o primeiro cadastrado
        }
      }

      const dadosFeedback = await AsyncStorage.getItem('feedbacks');
      if (dadosFeedback) {
        setFeedbacks(JSON.parse(dadosFeedback));
      }
    };
    carregarClienteEFeedbacks();
  }, []);

  const total = cart.reduce((sum, item) => sum + parseFloat(item.price || 0), 0).toFixed(2);

  const confirmarCompra = () => {
    Alert.alert(
      'Compra Confirmada',
      `Obrigado pela sua compra, ${cliente.nome}! Total: R$ ${total}`,
      [
        {
          text: 'OK',
          onPress: () => {
            setCart([]); // limpa carrinho
            navigation.navigate('Main'); // volta pra home
          },
        },
      ]
    );
  };

  const salvarFeedback = async (valores, resetForm) => {
    const novo = { ...valores, id: Date.now() };
    const novaLista = [...feedbacks, novo];
    setFeedbacks(novaLista);
    await AsyncStorage.setItem('feedbacks', JSON.stringify(novaLista));

    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Obrigado pelo feedback!',
        body: 'Sua avaliação foi registrada com sucesso!',
      },
      trigger: null,
    });

    resetForm();
  };

  if (!cliente) {
    return (
      <View style={tw`flex-1 bg-pink-50 justify-center items-center p-6`}>
        <Text style={tw`mb-4 text-center text-pink-700 text-lg font-semibold`}>
          Você precisa cadastrar um cliente antes de finalizar a compra.
        </Text>
        <Button mode="contained" onPress={() => navigation.navigate('CadastroCliente')} style={tw`bg-pink-600 px-6 py-2 rounded-full`}>
          Cadastrar Cliente
        </Button>
      </View>
    );
  }

  return (
    <View style={tw`flex-1 bg-pink-50`}>
      <Appbar.Header style={tw`bg-pink-400`}>
        <Appbar.Content title="Finalizar Compra" titleStyle={tw`text-white font-bold`} />
      </Appbar.Header>

      <ScrollView contentContainerStyle={tw`p-6`}>
        <Text style={tw`text-pink-700 text-xl font-bold mb-4`}>Cliente</Text>
        <View style={tw`bg-white p-4 rounded-lg shadow-md mb-6`}>
          <Text style={tw`text-pink-900 mb-1`}>Nome: {cliente.nome}</Text>
          <Text style={tw`text-pink-900 mb-1`}>Email: {cliente.email}</Text>
          <Text style={tw`text-pink-900 mb-1`}>Telefone: {cliente.telefone}</Text>
          <Text style={tw`text-pink-900 mb-1`}>CPF: {cliente.cpf}</Text>
          <Text style={tw`text-pink-900`}>Endereço: {cliente.endereco}</Text>
        </View>

        <Text style={tw`text-pink-700 text-xl font-bold mb-4`}>Produtos</Text>
        <View style={tw`bg-white p-4 rounded-lg shadow-md mb-6`}>
          {cart.map(item => (
            <List.Item
              key={item.cartItemId}
              title={item.name}
              description={`R$ ${item.price}`}
              titleStyle={tw`text-pink-800`}
              descriptionStyle={tw`text-pink-600`}
            />
          ))}
          <Text style={tw`text-right font-bold text-lg text-pink-700 mt-4`}>Total: R$ {total}</Text>
        </View>

        <Button
          mode="contained"
          style={tw`bg-pink-600 rounded-full py-2 mb-8`}
          onPress={confirmarCompra}
          disabled={cart.length === 0}
        >
          Confirmar Compra
        </Button>

        {/* Formulário de Feedback */}
        <Text style={tw`text-pink-700 text-xl font-bold mb-4`}>Avaliação da Compra</Text>

        <View style={tw`bg-white p-4 rounded-lg shadow-md mb-8`}>
          <Formik
            initialValues={{
              nome: cliente.nome || '',
              email: cliente.email || '',
              nota: '',
              comentario: '',
              data: '',
            }}
            validationSchema={FeedbackSchema}
            onSubmit={(values, { resetForm }) => salvarFeedback(values, resetForm)}
          >
            {({ handleChange, handleSubmit, values, errors, touched }) => (
              <>
                <TextInput
                  label="Nome"
                  value={values.nome}
                  onChangeText={handleChange('nome')}
                  error={touched.nome && !!errors.nome}
                  style={tw`mb-3`}
                  mode="outlined"
                  outlineColor="#f9a8d4"
                  activeOutlineColor="#db2777"
                />
                <TextInput
                  label="Email"
                  value={values.email}
                  onChangeText={handleChange('email')}
                  error={touched.email && !!errors.email}
                  style={tw`mb-3`}
                  keyboardType="email-address"
                  mode="outlined"
                  outlineColor="#f9a8d4"
                  activeOutlineColor="#db2777"
                />
                <TextInput
                  label="Nota (1 a 5)"
                  value={values.nota}
                  onChangeText={handleChange('nota')}
                  keyboardType="numeric"
                  error={touched.nota && !!errors.nota}
                  style={tw`mb-3`}
                  mode="outlined"
                  outlineColor="#f9a8d4"
                  activeOutlineColor="#db2777"
                />
                <TextInput
                  label="Comentário"
                  value={values.comentario}
                  onChangeText={handleChange('comentario')}
                  multiline
                  error={touched.comentario && !!errors.comentario}
                  style={tw`mb-3`}
                  mode="outlined"
                  outlineColor="#f9a8d4"
                  activeOutlineColor="#db2777"
                  numberOfLines={3}
                />
                <MaskInput
                  value={values.data}
                  onChangeText={handleChange('data')}
                  mask={[/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/]}
                  placeholder="DD/MM/AAAA"
                  style={[tw`border p-3 mb-4 rounded`, { borderColor: '#f9a8d4', backgroundColor: 'white' }]}
                />
                {touched.data && errors.data && (
                  <Text style={tw`text-red-600 mb-3`}>{errors.data}</Text>
                )}

                <Button
                  mode="contained"
                  onPress={handleSubmit}
                  style={tw`bg-pink-600 rounded-full py-2`}
                >
                  Enviar Avaliação
                </Button>
              </>
            )}
          </Formik>
        </View>

        {/* Lista de Feedbacks Recebidos */}
        <List.Section title="Avaliações Recebidas" style={tw`mb-12`}>
          {feedbacks.length === 0 && (
            <Text style={tw`text-pink-700 text-center py-6`}>Nenhuma avaliação recebida ainda.</Text>
          )}
          {feedbacks.map(fb => (
            <List.Item
              key={fb.id}
              title={`${fb.nome} - Nota: ${fb.nota}`}
              description={fb.comentario}
              titleStyle={tw`text-pink-800`}
              descriptionStyle={tw`text-pink-600`}
              style={tw`bg-white rounded-lg mb-3 shadow-md`}
            />
          ))}
        </List.Section>
      </ScrollView>
    </View>
  );
}
