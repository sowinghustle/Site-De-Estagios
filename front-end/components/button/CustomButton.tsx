import React from 'react';
import { Button } from 'react-native-elements';

interface MyButtonProps 
{
  title: string;
  onPress: () => void;
}

const MyButton: React.FC<MyButtonProps> = ({ title, onPress }) => {
  return (
    <Button title={title} onPress={onPress} />
  );
};

export default MyButton;
