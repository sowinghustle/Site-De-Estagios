import { View, SafeAreaView } from 'react-native';
import { Link } from 'expo-router';

import '../global.css'

export default function HomeScreen() {
  return (
    <SafeAreaView>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Link href={'/signup'}>Registre-se</Link>
        <Link href={'/signin'}>Entrar</Link>
      </View>
    </SafeAreaView>
  );
}
