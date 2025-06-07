// AppMaquiagem/src/components/BotaoCor.jsx
import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import tw from 'twrnc';

export default function BotaoCor({ cor, selecionado, onPress }) {
  return (
    <TouchableOpacity onPress={onPress}>
      <View
        style={tw`
          w-10 h-10 rounded-full m-1 border-2
          ${selecionado ? 'border-black' : 'border-gray-300'}
        `}
      >
        <View style={{ flex: 1, backgroundColor: cor, borderRadius: 999 }} />
      </View>
    </TouchableOpacity>
  );
}
<View style={tw`p-4 bg-pink-100 rounded-xl`}>
  <Text style={tw`text-lg text-pink-700 font-bold`}>Batom</Text>
</View>