import React from 'react';
import { View, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';

import CustomButton from '../components/button/CustomButton';

import { styles } from './styles';

export default function HomeScreen() {

  const router = useRouter();

  const PaginaLogin = () => {
    router.push('/signin');
  };

  const PaginaRegister = () => {
    router.push('/signup');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.innerContainer}>
        
        <CustomButton 
          title="Login" 
          type="primary" 
          onPress={PaginaLogin} 
        />

        <CustomButton 
          title="Cadastro" 
          type="secondary" 
          onPress={PaginaRegister} 
        />
        
      </View>
    </SafeAreaView>
  );
}
