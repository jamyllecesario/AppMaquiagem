import React, { useEffect, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { Appbar, TextInput, Button, Text, Card, List } from 'react-native-paper';
import { Formik } from 'formik';
import * as Yup from 'yup';
import AsyncStorage from '@react-native-async-storage/async-storage';
import tw from 'twrnc';
import MaskInput from 'react-native-mask-input';
import * as Notifications from 'expo-notifications';

const FeedbackSchema = Yup.object().shape({
  nome: Yup.string().required('Nome obrigatório'),
  email: Yup.string().email('Email inválido').required('Email obrigatório'),
  nota: Yup.number().min(1).max(5).required('Nota de 1 a 5'),
  comentario: Yup.string().required('Comentário obrigatório'),
  data: Yup.string().required('Data obrigatória'),
});

export default function FeedbackScreen() {
  const [feedbacks, setFeedbacks] = useState([]);

  useEffect(() => {
    const carregar = async () => {
      const dados = await AsyncStorage.getItem('feedbacks');
      if (dados) setFeedbacks(JSON.parse(dados));
    };
    carregar();
  }, []);

  const salvarFeedback = async (valores) => {
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
  };

  return (
    <View style={tw`flex-1 bg-white`}>
      <Appbar.Header>
        <Appbar.Content title="Avaliação dos Clientes" />
      </Appbar.Header>

      <ScrollView contentContainerStyle={tw`p-4`}>
        <Card style={tw`mb-4`}>
          <Card.Content>
            <Formik
              initialValues={{ nome: '', email: '', nota: '', comentario: '', data: '' }}
              validationSchema={FeedbackSchema}
              onSubmit={salvarFeedback}
            >
              {({ handleChange, handleSubmit, values, errors }) => (
                <>
                  <TextInput label="Nome" value={values.nome} onChangeText={handleChange('nome')} error={!!errors.nome} />
                  <TextInput label="Email" value={values.email} onChangeText={handleChange('email')} error={!!errors.email} />
                  <TextInput label="Nota (1 a 5)" value={values.nota} onChangeText={handleChange('nota')} keyboardType="numeric" error={!!errors.nota} />
                  <TextInput label="Comentário" value={values.comentario} onChangeText={handleChange('comentario')} multiline error={!!errors.comentario} />
                  <MaskInput
                    value={values.data}
                    onChangeText={handleChange('data')}
                    mask={[/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/]}
                    placeholder="DD/MM/AAAA"
                    style={tw`border p-2 my-2 rounded`}
                  />
                  {errors.data && <Text style={tw`text-red-500 mb-2`}>{errors.data}</Text>}

                  <Button onPress={handleSubmit} mode="contained" style={tw`mt-2 bg-pink-600`}>
                    Enviar Avaliação
                  </Button>
                </>
              )}
            </Formik>
          </Card.Content>
        </Card>

        <List.Section title="Avaliações recebidas">
          {feedbacks.map(fb => (
            <List.Item
              key={fb.id}
              title={`${fb.nome} - Nota: ${fb.nota}`}
              description={fb.comentario}
            />
          ))}
        </List.Section>
      </ScrollView>
    </View>
  );
}
