import React, { useState } from 'react';
import { View, SafeAreaView } from 'react-native';

import CustomButton from '../../components/button/CustomButton';
import CustomInput from '../../components/input/CustomInput';

import styles from '../styles';

export default function SignIn() 
{

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.innerContainer}>

        <CustomInput 
          label="Endereço de email"
          placeholder="Digite seu email"
          errorMessage="Digite um email"
        />

        <CustomInput 
          label="Senha"
          placeholder="Digite sua senha"
          iconName="eye"
          iconType="font-awesome"
          errorMessage="Digite uma senha"
        />

        <CustomButton 
          title="Acessar o Sistema" 
          type="primary" 
          onPress={() => alert('Button pressed!')} 
        />

      </View>
    </SafeAreaView>
  );
}
