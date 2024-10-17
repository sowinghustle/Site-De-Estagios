import { View, SafeAreaView } from 'react-native';
import { Link } from 'expo-router';

import styles from './styles';

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.innerContainer}>
        <Link href={'/signup'}>Registre-se</Link>
        <Link href={'/signin'}>Entrar</Link>
      </View>
    </SafeAreaView>
  );
}
