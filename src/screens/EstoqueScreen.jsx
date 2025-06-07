
import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { Appbar, List, IconButton, FAB, Portal, Dialog, TextInput, Button } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Formik } from 'formik';
import * as Yup from 'yup';
import tw from 'twrnc';

const ProdutoSchema = Yup.object().shape({
  nome: Yup.string().required('Nome obrigatório'),
  cor: Yup.string().required('Cor obrigatória'),
  marca: Yup.string().required('Marca obrigatória'),
  preco: Yup.string().required('Preço obrigatório'),
  quantidade: Yup.string().required('Quantidade obrigatória'),
});

export default function EstoqueScreen() {
  const [produtos, setProdutos] = useState([]);
  const [visivel, setVisivel] = useState(false);
  const [produtoAtual, setProdutoAtual] = useState(null);

  useEffect(() => {
    const carregar = async () => {
      const dados = await AsyncStorage.getItem('estoque');
      if (dados) setProdutos(JSON.parse(dados));
    };
    carregar();
  }, []);

  const salvar = async (valores) => {
    let novaLista = [];
    if (produtoAtual) {
      novaLista = produtos.map(p => (p.id === produtoAtual.id ? { ...valores, id: produtoAtual.id } : p));
    } else {
      novaLista = [...produtos, { ...valores, id: Date.now() }];
    }
    setProdutos(novaLista);
    await AsyncStorage.setItem('estoque', JSON.stringify(novaLista));
    setVisivel(false);
  };

  const remover = async (id) => {
    const novaLista = produtos.filter(p => p.id !== id);
    setProdutos(novaLista);
    await AsyncStorage.setItem('estoque', JSON.stringify(novaLista));
  };

  return (
    <View style={tw`flex-1 bg-white`}>
      <Appbar.Header>
        <Appbar.Content title="Gerenciar Estoque" />
      </Appbar.Header>

      <List.Section>
        {produtos.map(p => (
          <List.Item
            key={p.id}
            title={`${p.nome} (${p.cor})`}
            description={`Marca: ${p.marca} | Quantidade: ${p.quantidade} | R$ ${p.preco}`}
            right={() => (
              <>
                <IconButton icon="pencil" onPress={() => { setProdutoAtual(p); setVisivel(true); }} />
                <IconButton icon="delete" onPress={() => remover(p.id)} />
              </>
            )}
          />
        ))}
      </List.Section>

      <FAB
        icon="plus"
        style={tw`absolute bottom-6 right-6 bg-pink-600`}
        onPress={() => { setProdutoAtual(null); setVisivel(true); }}
      />

      <Portal>
        <Dialog visible={visivel} onDismiss={() => setVisivel(false)}>
          <Dialog.Title>{produtoAtual ? 'Editar Produto' : 'Novo Produto'}</Dialog.Title>
          <Dialog.Content>
            <Formik
              initialValues={produtoAtual || { nome: '', cor: '', marca: '', preco: '', quantidade: '' }}
              validationSchema={ProdutoSchema}
              onSubmit={salvar}
            >
              {({ handleChange, handleSubmit, values }) => (
                <>
                  <TextInput label="Nome" value={values.nome} onChangeText={handleChange('nome')} />
                  <TextInput label="Cor" value={values.cor} onChangeText={handleChange('cor')} />
                  <TextInput label="Marca" value={values.marca} onChangeText={handleChange('marca')} />
                  <TextInput label="Preço" value={values.preco} onChangeText={handleChange('preco')} keyboardType="numeric" />
                  <TextInput label="Quantidade" value={values.quantidade} onChangeText={handleChange('quantidade')} keyboardType="numeric" />
                  <Button onPress={handleSubmit} style={tw`mt-4`} mode="contained">Salvar</Button>
                </>
              )}
            </Formik>
          </Dialog.Content>
        </Dialog>
      </Portal>
    </View>
  );
}
