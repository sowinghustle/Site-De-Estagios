import { StyleSheet } from 'react-native';

// Tela de index
const styles = StyleSheet.create({
  container: 
  {
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
    fontWeight: 'bold',
  },
});

// =============================================================================

const signin = StyleSheet.create({
  header: 
  {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 20,
  },
  divider: 
  {
    height: 10,
    backgroundColor: '#E0E0E0',
    marginVertical: 10,
  },
  forgotPassword: 
  {
    textAlign: 'center',
    marginVertical: 10,
  },
  logoImage: {
    marginBottom: 10,
    alignSelf: 'center',
  },
});

export { styles, signin };
