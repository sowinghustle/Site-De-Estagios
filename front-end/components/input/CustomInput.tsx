import React from 'react';
import { Input, Icon } from 'react-native-elements';
import styles from './styles';

interface CustomInputProps 
{
  label?: string;
  placeholder?: string;
  iconName?: string;
  iconType?: string;
  errorMessage?: string;
  inputStyle?: object;
  onChangeText?: (text: string) => void;
}

const CustomInput: React.FC<CustomInputProps> = ({ label, placeholder, iconName, iconType, errorMessage, inputStyle, ...props }) => {
  return (
    <Input
      label={label}
      placeholder={placeholder}
      rightIcon={iconName ? (<Icon type={iconType} name={iconName} />) : undefined}
      errorStyle={{ color: 'red' }}
      errorMessage={errorMessage}
      inputStyle={inputStyle}
      ...props
    />
  );
};

export default CustomInput;
