import { useSideDrawer } from '@/components/side-drawer-context';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { getToken } from '@/services/auth.service';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function ProfileScreen() {
  const { openDrawer } = useSideDrawer();
  const router = useRouter();

  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const t = await getToken();
        if (mounted) setIsLoggedIn(!!t);
      } catch {
        if (mounted) setIsLoggedIn(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);
  return (
    <ThemedView style={styles.container}>
      <View style={styles.headerRow}>
        <TouchableOpacity style={styles.iconButton} onPress={() => openDrawer()}>
          <IconSymbol name="line.horizontal.3" size={28} color="#7a4de8" />
        </TouchableOpacity>
        <ThemedText type="title">Profile</ThemedText>

        {/* Right area: when not logged in show Login / Sign up links */}
        {!isLoggedIn ? (
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <TouchableOpacity onPress={() => router.push('/login')} style={{ marginRight: 8 }}>
              <Text style={{ color: '#7a4de8', fontWeight: '600' }}>Login</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push('/register')}>
              <Text style={{ color: '#7a4de8', fontWeight: '600' }}>Sign up</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={{ width: 44 }} />
        )}
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 8 },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 },
  iconButton: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
});
