import React, { useState } from 'react';
import { View, SafeAreaView, Text, Image } from 'react-native';
import { Link } from 'expo-router';

import CustomButton from '../../components/button/CustomButton';
import CustomInput from '../../components/input/CustomInput';

import { styles, signin } from '../styles';

export default function SignIn() {
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
    <SafeAreaView style={signin.container}>
      <View style={signin.innerContainer}>
        
        <Image 
          source={require('../../assets/images/Logo1.png')}
          style={signin.logoImage}
          resizeMode="contain"
        />

        <Text style={signin.header}>Bem vindo ao nosso sistema!</Text>

        <CustomInput 
          label="Nome Completo"
          placeholder="Digite seu nome"
          onChangeText={setEmail}
          errorMessage={emailError}
        />

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

        <CustomInput 
          label="Confirmação de Senha"
          placeholder="Digite sua senha"
          iconName="eye"
          onChangeText={setSenha}
          secureTextEntry={true}
          errorMessage={senhaError}
        />

        <Text style={signin.linkForgotPassword}>Estou de acordo com as <Link style={styles.link} href={'/password'}>politicas e diretrizes</Link></Text>

        <CustomButton 
          title="Acessar o Sistema" 
          type="primary" 
          onPress={handleSignIn} 
        />
        
        <Text style={signin.linkText}> Já tem uma conta? <Link style={styles.link} href={'/signup'}>Acessar Agora</Link></Text>

      </View>
    </SafeAreaView>
  );
}
