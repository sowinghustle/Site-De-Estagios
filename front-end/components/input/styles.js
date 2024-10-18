import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  
  inputContainer: 
  {
    backgroundColor: '#fff',
    borderRadius: 4,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    marginVertical: 10,
  },
  inputStyle: 
  {
    paddingLeft: 10,
    paddingRight: 10,
  },
  labelStyle:
 {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  errorStyle: 
  {
    color: '#B11116',
    marginTop: 5,
  },

});

export default styles;
