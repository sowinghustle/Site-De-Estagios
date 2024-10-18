import { View, SafeAreaView } from 'react-native';
import { Link } from 'expo-router';

import styles from './styles';

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.innerContainer}>
        <Link style={styles.link} href={'/signup'}>Registre-se</Link>
        <Link style={styles.link} href={'/signin'}>Entrar</Link>
      </View>
    </SafeAreaView>
  );
}
