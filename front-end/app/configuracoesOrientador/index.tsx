import React from 'react';
import { View, SafeAreaView, Text } from 'react-native';
import { styles } from '../styles';
import { useRouter } from 'expo-router';

import CustomNavBar from '../../components/navbar/CustomNavBar';
import CustomSearch from '../../components/search/CustomSearch';
import CustomContainer from '../../components/container/CustomContainer';

export default function configuracoesOrientador() 
{
  
  const paths = ['Home', 'Minhas Configurações'];
  const router = useRouter();

  const handleNavigate = (index: number) => {
    const route = paths.slice(0, index + 1).join('/');
    console.log(route);
  };

  return (
    <SafeAreaView style={styles.container}>
      
      <CustomNavBar userType="orientador" />

      <View style={styles.content}>
        
        <CustomSearch />
        
        <CustomContainer title="Minhas Configurações">
          <Text>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Saepe impedit delectus at, facilis repudiandae hic quam? Doloremque corporis qui, omnis eveniet atque natus nobis molestias eaque ea iusto quae quidem.</Text>
        </CustomContainer>

      </View>

    </SafeAreaView>
  );
}
