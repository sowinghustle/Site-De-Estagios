import React from 'react';
import { Input, Icon } from 'react-native-elements';
import styles from './styles';

interface CustomInputProps 
{
  label?: string;
  placeholder?: string;
  iconName?: string;
  errorMessage?: string;
  inputStyle?: object;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
}

const CustomInput: React.FC<CustomInputProps> = ({ label, placeholder, iconName, errorMessage, inputStyle, onChangeText, secureTextEntry, ...props }) => {
  return (
    <Input
    containerStyle={styles.inputContainer}
    label={label}
    labelStyle={styles.labelStyle}
    placeholder={placeholder}
    rightIcon={iconName ? <Icon type="font-awesome" name={iconName} /> : undefined}
    errorStyle={styles.errorStyle}
    errorMessage={errorMessage}
    inputStyle={[styles.inputStyle, inputStyle]}
    onChangeText={onChangeText}
    secureTextEntry={secureTextEntry}
    {...props}
    />
  );
};

export default CustomInput;
