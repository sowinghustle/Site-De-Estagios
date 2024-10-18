import React, { useState } from 'react';
import { View, SafeAreaView } from 'react-native';

import CustomButton from '../../components/button/CustomButton';
import CustomInput from '../../components/input/CustomInput';

import styles from '../styles';

export default function SignIn() 
{

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [emailError, setEmailError] = useState('');
  const [senhaError, setSenhaError] = useState('');

  const handleSignIn = () => {

    setEmailError('');
    setSenhaError('');

    if (email && senha) {
      alert('Acessando o sistema');
    } 
    else
    {
      if (!email) 
      {
        setEmailError("Digite um email");
      }
      if (!senha) 
      {
        setSenhaError("Digite uma senha");
      }
      alert('Por favor, preencha todos os campos');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.innerContainer}>

        <CustomInput 
          label="Endereço de email"
          placeholder="Digite seu email"
          onChangeText={setEmail}
          errorMessage={emailError}
        />

        <CustomInput 
          label="Senha"
          placeholder="Digite sua senha"
          iconName="eye"
          onChangeText={setSenha}
          secureTextEntry={true}
          errorMessage={senhaError}
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
