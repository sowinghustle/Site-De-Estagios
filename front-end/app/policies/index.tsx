import React from 'react';
import { View, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';

import CustomButton from '../../components/button/CustomButton'

import { styles } from '../styles';

export default function Policies() {

  const router = useRouter();

  const PaginaSignUp = () => {
    router.push('/signup');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.innerContainer}>
        
        <h1 style={{ textAlign: 'center'}}>
          Pagina de Politicas e Diretrizes
        </h1>

        <CustomButton 
          title="Voltar" 
          type="primary" 
          onPress={PaginaSignUp} 
        />

      </View>
    </SafeAreaView>
  );
}
