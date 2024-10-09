import { View, SafeAreaView } from 'react-native';
import { Link } from 'expo-router';
import CustomButton from '@/components/button/CustomButton';

import '../global.css'

export default function HomeScreen() {
  return (
    <SafeAreaView>
      <View>
        <Link href={'/signup'}>Registre-se</Link>
        <Link href={'/signin'}>Entrar</Link>
      </View>
    </SafeAreaView>
  );
}
