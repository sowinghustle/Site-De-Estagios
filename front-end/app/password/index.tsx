import React from 'react';
import { View, SafeAreaView } from 'react-native';
import { Link } from 'expo-router';

import { styles, signin } from '../styles';

export default function SignIn() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.innerContainer}>

        <Link style={styles.link} href={'/signin'}>Voltar</Link>

      </View>
    </SafeAreaView>
  );
}
