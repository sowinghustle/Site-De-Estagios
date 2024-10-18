import React, { useState } from 'react';
import { View, SafeAreaView } from 'react-native';

import CustomButton from '../../components/button/CustomButton';
import CustomInput from '../../components/input/CustomInput';

import styles from '../styles';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const handleSignIn = () => {

    // ++++++++++++++++++++++++++++++++++++++
    // Adicionar a lógica de autenticação
    // ++++++++++++++++++++++++++++++++++++++

    if (email && senha) 
    {
      alert('Acessando o sistema');
    } 
    else 
    {
      alert('Por favor, preencha todos os campos');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.innerContainer}>

        <CustomInput 
          label="Endereço de email"
          placeholder="Digite seu email"
          errorMessage={!email ? "Digite um email" : undefined}
          onChangeText={setEmail}
        />

        <CustomInput 
          label="Senha"
          placeholder="Digite sua senha"
          iconName="eye"
          errorMessage={!senha ? "Digite uma senha" : undefined}
          onChangeText={setSenha}
          secureTextEntry={true}
        />

        <CustomButton 
          title="Acessar o Sistema" 
          type="primary" 
          onPress={handleSignIn} 
        />

      </View>
    </SafeAreaView>
  );
}
