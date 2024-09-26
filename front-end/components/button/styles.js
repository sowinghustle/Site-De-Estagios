import { StyleSheet } from 'react-native';

const primaryButtonStyles = StyleSheet.create({
  
  button: 
  {
    backgroundColor: '#B11116',
    width: '100%',
    height: 58,
    paddingVertical: 10,
    paddingHorizontal: 0,
    borderRadius: 12,
    opacity: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 5,
  },
  buttonText: 
  {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
  buttonIcon: 
  {
    marginLeft: 5,
  },

});

const secondaryButtonStyles = StyleSheet.create({
  
  button: 
  {
    backgroundColor: '#fff',
    width: '100%',
    height: 58,
    paddingVertical: 10,
    paddingHorizontal: 0,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#B11116',
    opacity: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 5,
  },
  buttonText: 
  {
    color: '#B11116',
    fontSize: 16,
    textAlign: 'center',
  },
  buttonIcon: 
  {
    marginLeft: 5,
  },


});

export { primaryButtonStyles, secondaryButtonStyles };
