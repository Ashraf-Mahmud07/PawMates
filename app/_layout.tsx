import { ReloadProvider } from '@/components/reload-context';
import { SideDrawerProvider } from '@/components/side-drawer-context';
import NotificationBanner from '@/components/ui/NotificationBanner';
import { Colors } from '@/constants/theme';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import 'react-native-reanimated';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { getToken } from '@/services/auth.service';
import { connectSocket, disconnectSocket } from '@/services/chat.service';
import store from '@/store/store';
import Constants from 'expo-constants';
import React, { useEffect } from 'react';
import { Provider } from 'react-redux';

// Small invisible connector component: reads CHAT URL from app config or env
function SocketConnector() {
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        // expo constants shape differs by SDK; check both expoConfig and manifest
        const extra: any = (Constants as any).expoConfig?.extra ?? (Constants as any).manifest?.extra ?? {};
        const url = (extra?.chatUrl as string) || (process.env.CHAT_API_URL as string) || '';
        const token = await getToken();
        if (mounted && url) {
          connectSocket(url, token ?? undefined);
        }
      } catch {
        // ignore - best effort
      }
    })();
    return () => {
      try {
        disconnectSocket();
      } catch {
        // ignore
      }
    };
  }, []);

  return null;
}

export const unstable_settings = {
  // The anchor must reference an existing layout file. Use the group's layout
  // path so the router can resolve nested layouts during static export.
  anchor: '(tabs)/_layout',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  const toastConfig = {
    success: ({ text1, text2 }: any) => (
      <View style={[styles.toastContainer, styles.toastWithBar]}>
        <View style={[styles.toastBar, { backgroundColor: '#1d9d74' }]} />
        <View style={styles.toastBody}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <MaterialIcons name="check-circle" size={20} color="#1d9d74" style={styles.toastIcon} />
            <View style={{ flex: 1 }}>
              <Text style={styles.toastTitle}>{text1}</Text>
              {text2 ? <Text style={styles.toastMessage}>{text2}</Text> : null}
            </View>
          </View>
        </View>
      </View>
    ),
    error: ({ text1, text2 }: any) => (
      <View style={[styles.toastContainer, styles.toastWithBar]}>
        <View style={[styles.toastBar, { backgroundColor: '#d9534f' }]} />
        <View style={styles.toastBody}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <MaterialIcons name="error" size={20} color="#d9534f" style={styles.toastIcon} />
            <View style={{ flex: 1 }}>
              <Text style={styles.toastTitle}>{text1}</Text>
              {text2 ? <Text style={styles.toastMessage}>{text2}</Text> : null}
            </View>
          </View>
        </View>
      </View>
    ),
    warning: ({ text1, text2 }: any) => (
      <View style={[styles.toastContainer, styles.toastWithBar]}>
        <View style={[styles.toastBar, { backgroundColor: '#f0ad4e' }]} />
        <View style={styles.toastBody}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <MaterialIcons name="warning" size={20} color="#f0ad4e" style={styles.toastIcon} />
            <View style={{ flex: 1 }}>
              <Text style={styles.toastTitle}>{text1}</Text>
              {text2 ? <Text style={styles.toastMessage}>{text2}</Text> : null}
            </View>
          </View>
        </View>
      </View>
    ),
  };

  const styles = StyleSheet.create({
    toastContainer: {
      backgroundColor: '#111',
      padding: 0,
      borderRadius: 8,
      minWidth: 300,
      shadowColor: '#000',
      shadowOpacity: 0.4,
      shadowRadius: 8,
      elevation: 8,
    },
    toastWithBar: {
      flexDirection: 'row',
      alignItems: 'stretch',
      overflow: 'hidden',
    },
    toastBar: {
      width: 6,
    },
    toastBody: {
      paddingHorizontal: 14,
      paddingVertical: 10,
      flex: 1,
    },
    toastError: {
      backgroundColor: '#2b1b1b',
    },
    toastTitle: {
      color: '#fff',
      fontWeight: '700',
      marginBottom: 2,
    },
    toastMessage: {
      color: '#eee',
      fontSize: 13,
    },
    toastIcon: {
      marginRight: 10,
    },
  });

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <SafeAreaProvider>
        <SafeAreaView
          edges={["top"]}
          style={{ flex: 1, backgroundColor: Colors[colorScheme ?? 'light'].background }}>
          {/* Connect the socket on app start if CHAT_API_URL is provided in app config or env. */}
          {/* Preferred: set CHAT_API_URL in app.json -> expo.extra.chatUrl or via EAS secrets. */}
          {/** Connect/disconnect lifecycle */}
          <SocketConnector />
          <Provider store={store}>
            <ReloadProvider>
              <SideDrawerProvider>
              <Stack>
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
              </Stack>
              <NotificationBanner />
              <Toast config={toastConfig} />
              <StatusBar style="auto" />
              </SideDrawerProvider>
            </ReloadProvider>
          </Provider>
        </SafeAreaView>
      </SafeAreaProvider>
    </ThemeProvider>
  );
}
