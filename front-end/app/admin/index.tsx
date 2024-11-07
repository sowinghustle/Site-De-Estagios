import React from 'react';
import { View, SafeAreaView } from 'react-native';
import CustomNavBar from '../../components/navbar/CustomNavBar';
import { styles } from '../styles';

export default function AdminMenu() {
  return (
    <SafeAreaView style={styles.container}>
      <CustomNavBar />
      <View style={styles.content}>
        <h1> Conteudo da Pagina </h1>
      </View>
    </SafeAreaView>
  );
}
