import { Link, Stack } from 'expo-router';
import { StyleSheet, View, Image } from 'react-native'; 

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

import logo from '@images/logo2.png';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: () => (
            <View style={styles.headerTitleContainer}>
              <Image source={logo} style={styles.logo} />
              <ThemedText type="title" style={{ color: '#fff' }}>
                EstagioHUB
              </ThemedText>
            </View>
          ),
          headerTintColor: '#FFFFFF',
          headerStyle: { backgroundColor: '#666666' },
        }}
      />
      <ThemedView style={styles.container}>
        <ThemedText type="title">Parece que essa tela não existe.</ThemedText>
        <Link href="/" style={styles.link}>
          <ThemedText style={styles.linkText} type="link">
            Voltar para o EstagioHUB
          </ThemedText>
        </Link>
      </ThemedView>
    </>
  );
}

const styles = StyleSheet.create({
  container: 
  {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  link: 
  {
    marginTop: 15,
    paddingVertical: 15,
  },
  linkText: 
  {
    color: "#B11116",
    fontSize: 18, 
  },
  headerTitleContainer: 
  {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: 
  {
    width: 40,
    height: 40,
    marginRight: 8,
    resizeMode: 'contain',
  },
});
