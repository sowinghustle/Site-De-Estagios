import React from 'react';
import { View } from 'react-native';
import Button from '../../components/button/CustomButton';

export default function signin() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Button title="Acessar o Sistema" onPress={() => alert('Button pressed!')} />
    </View>
  );
}
