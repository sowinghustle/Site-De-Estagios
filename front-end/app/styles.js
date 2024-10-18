import { StyleSheet } from 'react-native';

// Tela de index
const styles = StyleSheet.create({
  container: 
  {
    backgroundColor: '#F5F5F5',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerContainer: 
  {
    width: '80%',
  },
  link: 
  {
    color: '#B11116',
    fontSize: 18,
    marginVertical: 10,
    textAlign: 'center',
  },
});

// =============================================================================

const signin = StyleSheet.create({
  innerContainer: 
  {
    backgroundColor: '#000',
  },
  header: 
  {
    fontSize: 24,
    fontWeight: 500,
    textAlign: 'center',
    marginBottom: 20,
  },
  divider: 
  {
    height: 10,
    backgroundColor: '#E0E0E0',
    marginVertical: 10,
  },
  linkForgotPassword: 
  {
    
    textAlign: 'left',
    fontSize: 19,
    fontWeight: 400,
    marginVertical: 10,
  },
  linkText: 
  {
    textAlign: 'center',
    fontSize: 19,
    fontWeight: 400,
    marginVertical: 10,
  },
  logoImage: 
  {
    marginBottom: 10,
    alignSelf: 'center',
  },
});

export { styles, signin };
