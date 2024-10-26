import { StyleSheet } from 'react-native';

// Tela de index
const styles = StyleSheet.create({
  container: 
  {
    backgroundColor: '#F5F5F5',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    fontFamily: 'Inter',
  },
  innerContainer: 
  {
    width: '80%',
  },
  link: 
  {
    color: '#B11116',
    fontSize: 17,
    marginVertical: 10,
    textAlign: 'center',
    borderColor: '#B11116',
    borderBottomWidth: 1,
  },
});

// =============================================================================

const signin = StyleSheet.create({
  container: 
  {
    backgroundColor: '#fff',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerContainer: 
  {
    backgroundColor: 'transparent',
    width: '50%',
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
    fontSize: 17,
    fontWeight: 400,
    marginVertical: 10,
  },
  linkText: 
  {
    textAlign: 'center',
    fontSize: 17,
    fontWeight: 400,
    marginVertical: 10,
  },
  logoImage: 
  {
    marginBottom: 10,
    alignSelf: 'center',
  },
  viewCheckBox:
  {
    flexDirection: 'row', 
    alignItems: 'center',
    paddingLeft: 0,
  },
});

// =============================================================================

const signup = StyleSheet.create({
  container: 
  {
    backgroundColor: '#fff',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerContainer: 
  {
    backgroundColor: 'transparent',
    width: '50%',
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
    fontSize: 17,
    fontWeight: 400,
    marginVertical: 10,
  },
  linkText: 
  {
    textAlign: 'center',
    fontSize: 17,
    fontWeight: 400,
    marginVertical: 10,
  },
  logoImage: 
  {
    marginBottom: 10,
    alignSelf: 'center',
  },
  viewCheckBox:
  {
    flexDirection: 'row', 
    alignItems: 'center',
    paddingLeft: 0,
  },
});

export { styles, signin, signup };
