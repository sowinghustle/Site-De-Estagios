import { View } from 'react-native';
import CustomButton from '@/components/button/CustomButton';

export default function HomeScreen() {
  return (
    <View>
      <CustomButton title="Testando o Botão 1" type="primary" />
      <CustomButton title="Testando o Botão 2" type="secondary" buttonIcon="AddIcon" />
    </View>
  );
}
