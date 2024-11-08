import React from 'react';
import { View, SafeAreaView, Text } from 'react-native';
import CustomNavBar from '../../components/navbar/CustomNavBar';
import Header from '../../components/header/CustomHeader';
import { styles } from '../styles';

export default function AdminMenu() {
  
  const paths = ['Home', 'Admin Menu'];

  const handleNavigate = (index: number) => {
    const route = paths.slice(0, index + 1).join('/');
    console.log(route);
  };

  return (
    <SafeAreaView style={styles.container}>
      <CustomNavBar />

      <View style={styles.content}>
        <Text style={styles.header}>Conteúdo da Página</Text>
      </View>
    </SafeAreaView>
  );
}
