import { View } from 'react-native';
import { Link } from 'expo-router';
import CustomButton from '@/components/button/CustomButton';

export default function HomeScreen() {
  return (
    <View>
      <Link href='/signup/'>Registre-se</Link>
      <Link href='/signin/'>Entrar</Link>
      <CustomButton title="PrimaryButton" type="primary" />
      <CustomButton title="SecondaryButton" type="secondary" />
    </View>
  );
}
