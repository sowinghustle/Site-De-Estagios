import { View } from 'react-native';
import CustomButton from '@/components/button/CustomButton';

export default function HomeScreen() {
  return (
    <View>
      <CustomButton title="PrimaryButton" type="primary" />
      <CustomButton title="SecondaryButton" type="secondary" />
    </View>
  );
}
