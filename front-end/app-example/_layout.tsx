
import * as SplashScreen from 'expo-splash-screen';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { GluestackUIProvider } from "@gluestack-ui/themed";
import { useColorScheme } from '@/hooks/useColorScheme';
import { useEffect } from 'react';
import { useFonts } from 'expo-font';
import { config } from '@gluestack-ui/config';
import { Stack } from 'expo-router';
import 'react-native-reanimated';
import 'global.css';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() 
{
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    Inter: require('../assets/fonts/Inter.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) 
  {
    return null;
  }

  return (
    <GluestackUIProvider config={config}><ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
      </ThemeProvider></GluestackUIProvider>
  );
}
