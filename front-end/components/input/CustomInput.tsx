import React, { useState } from 'react';
import { Input, Icon } from 'react-native-elements';
import styles from './styles';

interface CustomInputProps {
  label?: string;
  placeholder?: string;
  iconName?: string;
  errorMessage?: string;
  inputStyle?: object;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
}

const CustomInput: React.FC<CustomInputProps> = ({
  label,
  placeholder,
  iconName,
  errorMessage,
  inputStyle,
  onChangeText,
  secureTextEntry,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Input
      containerStyle={styles.inputContainer}
      label={label}
      labelStyle={styles.labelStyle}
      placeholder={placeholder}
      rightIcon={
        iconName === 'eye' ? (
          <Icon
            type="font-awesome"
            name={showPassword ? 'eye-slash' : 'eye'}
            onPress={togglePasswordVisibility}
            containerStyle={{ cursor: 'pointer' }}
          />
        ) : iconName ? (
          <Icon type="font-awesome" name={iconName} />
        ) : undefined
      }
      errorStyle={styles.errorStyle}
      errorMessage={errorMessage && errorMessage.trim() ? errorMessage : undefined}
      inputStyle={[styles.inputStyle, inputStyle]}
      onChangeText={onChangeText}
      secureTextEntry={iconName === 'eye' ? !showPassword : secureTextEntry}
      {...props}
    />
  );
};

export default CustomInput;
