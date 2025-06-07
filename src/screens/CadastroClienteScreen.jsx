import React, { useEffect, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { Appbar, TextInput, Button, Text, List, IconButton } from 'react-native-paper';
import { Formik } from 'formik';
import * as Yup from 'yup';
import MaskInput from 'react-native-mask-input';
import AsyncStorage from '@react-native-async-storage/async-storage';
import tw from 'twrnc';

const ClienteSchema = Yup.object().shape({
  nome: Yup.string().required('Nome obrigatório'),
  email: Yup.string().email('Email inválido').required('Email obrigatório'),
  telefone: Yup.string().required('Telefone obrigatório'),
  cpf: Yup.string().required('CPF obrigatório'),
  endereco: Yup.string().required('Endereço obrigatório'),
});

export default function CadastroClienteScreen() {
  const [clientes, setClientes] = useState([]);

  useEffect(() => {
    const carregar = async () => {
      const dados = await AsyncStorage.getItem('clientes');
      if (dados) setClientes(JSON.parse(dados));
    };
    carregar();
  }, []);

  const salvarCliente = async (valores) => {
    const novoCliente = { ...valores, id: Date.now() };
    const novaLista = [...clientes, novoCliente];
    setClientes(novaLista);
    await AsyncStorage.setItem('clientes', JSON.stringify(novaLista));
  };

  const removerCliente = async (id) => {
    const novaLista = clientes.filter(c => c.id !== id);
    setClientes(novaLista);
    await AsyncStorage.setItem('clientes', JSON.stringify(novaLista));
  };

  return (
    <View style={tw`flex-1 bg-white`}>
      <Appbar.Header>
        <Appbar.Content title="Cadastro de Cliente" />
      </Appbar.Header>

      <ScrollView contentContainerStyle={tw`p-4`}>
        <Formik
          initialValues={{ nome: '', email: '', telefone: '', cpf: '', endereco: '' }}
          validationSchema={ClienteSchema}
          onSubmit={salvarCliente}
        >
          {({ handleChange, handleSubmit, values, errors }) => (
            <>
              <TextInput label="Nome" value={values.nome} onChangeText={handleChange('nome')} error={!!errors.nome} />
              <TextInput label="Email" value={values.email} onChangeText={handleChange('email')} error={!!errors.email} />

              <MaskInput
                value={values.telefone}
                onChangeText={handleChange('telefone')}
                mask={["(", /\d/, /\d/, ")", " ", /\d/, /\d/, /\d/, /\d/, /\d/, "-", /\d/, /\d/, /\d/, /\d/]}
                style={tw`border p-2 my-2 rounded`}
                placeholder="(99) 99999-9999"
              />
              {errors.telefone && <Text style={tw`text-red-500 mb-2`}>{errors.telefone}</Text>}

              <MaskInput
                value={values.cpf}
                onChangeText={handleChange('cpf')}
                mask={[/\d/, /\d/, /\d/, ".", /\d/, /\d/, /\d/, ".", /\d/, /\d/, /\d/, "-", /\d/, /\d/]}
                style={tw`border p-2 my-2 rounded`}
                placeholder="000.000.000-00"
              />
              {errors.cpf && <Text style={tw`text-red-500 mb-2`}>{errors.cpf}</Text>}

              <TextInput label="Endereço" value={values.endereco} onChangeText={handleChange('endereco')} error={!!errors.endereco} />
              <Button mode="contained" onPress={handleSubmit} style={tw`mt-4 bg-pink-600`}>
                Salvar Cliente
              </Button>
            </>
          )}
        </Formik>

        <List.Section title="Clientes cadastrados">
          {clientes.map(c => (
            <List.Item
              key={c.id}
              title={c.nome}
              description={`${c.email} - ${c.telefone}`}
              right={() => <IconButton icon="delete" onPress={() => removerCliente(c.id)} />}
            />
          ))}
        </List.Section>
      </ScrollView>
    </View>
  );
}
