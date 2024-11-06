import React, { useState } from 'react';
import { View, SafeAreaView, Text, Image } from 'react-native';
import { Link } from 'expo-router';

import logo from '../../assets/images/LogoEstagioRed.png'
import CustomButton from '../../components/button/CustomButton';
import CustomInput from '../../components/input/CustomInput';
import CustomCheckBox from '../../components/checkbox/CustomCheckBox';

import { styles, signup } from '../styles';

export default function SignUp() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [emailError, setEmailError] = useState('');
  const [senhaError, setSenhaError] = useState('');

  const handleSignUp = () => {
    
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
    <SafeAreaView style={signup.container}>
      <View style={signup.innerContainer}>
        
        <Image 
          source={logo}
          style={signup.logoImage}
          resizeMode="contain"
        />

        <Text style={signup.header}>Bem vindo ao nosso sistema!</Text>

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

        <View style={signup.viewCheckBox}>
          <CustomCheckBox />
          <Text style={signup.linkForgotPassword}>Estou de acordo com as </Text>
          <Link style={styles.link} href={'/policies'}>politicas e diretrizes</Link>
        </View>

        <CustomButton 
          title="Acessar o Sistema" 
          type="primary" 
          onPress={handleSignUp} 
        />
        
        <Text style={signup.linkText}> Já tem uma conta? <Link style={styles.link} href={'/signin'}>Acessar Agora</Link></Text>

      </View>
    </SafeAreaView>
  );
}
