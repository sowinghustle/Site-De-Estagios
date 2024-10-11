import React from 'react';
import { View, SafeAreaView } from 'react-native';
import CustomButton from '../../components/button/CustomButton';

export default function SignIn() 
{
  return (
    <SafeAreaView>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <CustomButton title="Acessar o Sistema" type="primary" onPress={() => alert('Button pressed!')} />
      </View>
    </SafeAreaView>
  );
}
