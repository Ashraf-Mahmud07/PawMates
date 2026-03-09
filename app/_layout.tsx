import { ReloadProvider } from '@/components/reload-context';
import { SideDrawerProvider } from '@/components/side-drawer-context';
import { Colors } from '@/constants/theme';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

import { useColorScheme } from '@/hooks/use-color-scheme';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <SafeAreaProvider>
        <SafeAreaView
          edges={["top"]}
          style={{ flex: 1, backgroundColor: Colors[colorScheme ?? 'light'].background }}>
          <ReloadProvider>
            <SideDrawerProvider>
            <Stack>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
            </Stack>
            <StatusBar style="auto" />
            </SideDrawerProvider>
          </ReloadProvider>
        </SafeAreaView>
      </SafeAreaProvider>
    </ThemeProvider>
  );
}
