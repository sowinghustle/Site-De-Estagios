import { StyleSheet } from 'react-native';

const primaryButtonStyles = StyleSheet.create({
  button: 
  {
    backgroundColor: '#B11116',
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 2,
  },
  buttonText: 
  {
    color: '#ffffff',
  },
});

const secondaryButtonStyles = StyleSheet.create({
  button: 
  {
    backgroundColor: 'transparent',
    borderColor: '#B11116',
    borderWidth: 1,
    width: '100%',
  },
  buttonText: 
  {
    color: '#B11116',
  },
});

export { primaryButtonStyles, secondaryButtonStyles };
