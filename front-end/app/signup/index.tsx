import React from 'react';
import { View, SafeAreaView } from 'react-native';
import CustomButton from '../../components/button/CustomButton';

import styles from '../styles';

export default function signup() 
{
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.innerContainer}>
        <CustomButton title="Cadastrar-se" type="primary" onPress={() => alert('Button pressed!')} />
      </View>
    </SafeAreaView>
  );
}
