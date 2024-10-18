import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  inputContainer: 
  {
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    marginVertical: 10,
    paddingHorizontal: 12,
  },
  inputStyle: 
  {
    paddingVertical: 12,
    fontSize: 16,
  },
  labelStyle: 
  {
    fontWeight: 'bold',
    fontSize: 16,
    marginTop: 5,
    color: '#000000',
  },
  errorStyle: 
  {
    color: '#B11116',
    marginTop: 5,
  },
});

export default styles;
