import { StyleSheet } from 'react-native';

const primaryButtonStyles = StyleSheet.create({
  
  button: 
  {
    backgroundColor: 'blue',
    width: '100%',
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 5,
  },
  buttonText: 
  {
    color: 'white',
    fontSize: 16,
  },
  buttonIcon: 
  {
    marginLeft: 5,
  },

});

const secondaryButtonStyles = StyleSheet.create({
  
  button: 
  {
    backgroundColor: 'gray',
    width: '100%',
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 5,
  },
  buttonText: 
  {
    color: 'white',
    fontSize: 16,
  },
  buttonIcon: 
  {
    marginLeft: 5,
  },


});

export { primaryButtonStyles, secondaryButtonStyles };
