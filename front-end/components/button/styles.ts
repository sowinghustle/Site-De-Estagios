import { StyleSheet } from 'react-native';

const primaryButtonStyles = StyleSheet.create({
  button: {
    backgroundColor: '#B11116',
    width: '100%',
    paddingVertical: 15,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
  },
});

const secondaryButtonStyles = StyleSheet.create({
  button: {
    backgroundColor: 'white',
    borderColor: '#B11116',
    borderWidth: 1,
    width: '100%',
    paddingVertical: 15,
    borderRadius: 12,
  },
  buttonText: {
    color: '#B11116',
    fontSize: 18,
    fontWeight: 400,
  },
});

export { primaryButtonStyles, secondaryButtonStyles };
