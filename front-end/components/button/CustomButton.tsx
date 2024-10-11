import React from 'react';
import { Button } from 'react-native-elements';
import { primaryButtonStyles, secondaryButtonStyles } from './styles';

interface CustomButtonProps {
  title: string;
  type: 'primary' | 'secondary';
  onPress: () => void;
}

const CustomButton: React.FC<CustomButtonProps> = ({ title, onPress, type }) => {
  
  const buttonStylesMap = {
    primary: primaryButtonStyles.button,
    secondary: secondaryButtonStyles.button,
  };

  const buttonTextStylesMap = {
    primary: primaryButtonStyles.buttonText,
    secondary: secondaryButtonStyles.buttonText,
  };

  const buttonStyle = buttonStylesMap[type] || buttonStylesMap.primary;
  const buttonTextStyle = buttonTextStylesMap[type] || buttonTextStylesMap.primary;

  return (
    <Button
      title={title}
      buttonStyle={buttonStyle}
      titleStyle={buttonTextStyle}
      onPress={onPress}
    />
  );
};

export default CustomButton;
