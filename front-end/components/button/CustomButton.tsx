import React from 'react';
import { Button, ButtonText, ButtonIcon } from '@gluestack-ui/themed';
import { primaryButtonStyles, secondaryButtonStyles } from './styles';

interface CustomButtonProps {
  title: string;
  buttonIcon?: string;
  type: 'primary' | 'secondary'; 
  [key: string]: any;
}

const CustomButton: React.FC<CustomButtonProps> = ({ title, buttonIcon, type, ...props })  => 
{

  let styles;
  switch (type) 
  {
    case 'primary':
      styles = primaryButtonStyles;
      break;

    case 'secondary':
      styles = secondaryButtonStyles;
      break;

    default:
      styles = primaryButtonStyles;
      break;
  }

  return (
    <Button
      size="md"
      variant="solid"
      style={styles.button}
      isDisabled={false}
      isFocusVisible={false}
      {...props}
    >
      <ButtonText style={styles.buttonText}>{title}</ButtonText>
      {buttonIcon && <ButtonIcon style={styles.buttonIcon} as={buttonIcon} />}
    </Button>
  );
};

export default CustomButton;
