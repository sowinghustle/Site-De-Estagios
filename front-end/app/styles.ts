import { StyleSheet, Dimensions } from 'react-native';
const { width, height } = Dimensions.get('window');

// Tela de index
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F5F5F5',
    flex: 1,
    flexDirection: 'row',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  innerContainer: {
    width: width * 1.0,
  },
  link: {
    color: '#B11116',
    fontSize: 17,
    marginVertical: 10,
    textAlign: 'center',
    borderColor: '#B11116',
    borderBottomWidth: 1,
  },
  
  header: {
    fontSize: 24,        // Tamanho maior do texto, como um título
    fontWeight: '500',   // Peso da fonte para um visual mais forte
    textAlign: 'center', // Alinhando o texto ao centro
    marginVertical: 20,  // Espaçamento acima e abaixo
    color: 'black',      // Cor do título
  },
});

// =============================================================================

const signin = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerContainer: {
    backgroundColor: 'transparent',
    width: '50%',
  },
  header: {
    fontSize: 24,
    fontWeight: 500,
    textAlign: 'center',
    marginBottom: 20,
  },
  divider: {
    height: 10,
    backgroundColor: '#E0E0E0',
    marginVertical: 10,
  },
  linkForgotPassword: {
    textAlign: 'left',
    fontSize: 17,
    fontWeight: 400,
    marginVertical: 10,
  },
  linkText: {
    textAlign: 'center',
    fontSize: 17,
    fontWeight: 400,
    marginVertical: 10,
  },
  logoImage: {
    marginBottom: 10,
    alignSelf: 'center',
  },
  viewCheckBox: {
    flexDirection: 'row', 
    alignItems: 'center',
    paddingLeft: 0,
  },
});

// =============================================================================

const signup = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerContainer: {
    backgroundColor: 'transparent',
    width: '50%',
  },
  header: {
    fontSize: 24,
    fontWeight: 500,
    textAlign: 'center',
    marginBottom: 20,
  },
  divider: {
    height: 10,
    backgroundColor: '#E0E0E0',
    marginVertical: 10,
  },
  linkForgotPassword: {
    textAlign: 'left',
    fontSize: 17,
    fontWeight: 400,
    marginVertical: 10,
  },
  linkText: {
    textAlign: 'center',
    fontSize: 17,
    fontWeight: 400,
    marginVertical: 10,
  },
  logoImage: {
    marginBottom: 10,
    alignSelf: 'center',
  },
  viewCheckBox: {
    flexDirection: 'row', 
    alignItems: 'center',
    paddingLeft: 0,
  },
});

export { styles, signin, signup };
