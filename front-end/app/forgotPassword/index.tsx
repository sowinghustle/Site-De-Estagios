import React, { useState } from 'react';
import { View, SafeAreaView, Text, Image } from 'react-native';
import { Link } from 'expo-router';

import CustomButton from '../../components/button/CustomButton';
import CustomInput from '../../components/input/CustomInput';

import { styles, signin } from '../styles';

export default function ForgotPassword() 
{
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');

  const handleSignIn = () => {
    
    setEmailError('');

    if (email) {

      alert('Recuperando senha');
    } 
    else 
    {
      if (!email) 
      {
        setEmailError("Digite um email");
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

        <Text style={signin.header}>Esqueceu sua senha? Não se preocupe!</Text>

        <CustomInput 
          label="Endereço de email"
          placeholder="Digite seu email"
          onChangeText={setEmail}
          errorMessage={emailError}
        />

        <CustomButton 
          title="Recuperar Senha" 
          type="primary" 
          onPress={handleSignIn} 
        />
        
        <Text style={signin.linkText}>Quer tentar novamente? <Link style={styles.link} href={'/signin'}>Acessar Agora</Link></Text>

      </View>
    </SafeAreaView>
  );
}
