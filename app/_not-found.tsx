import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { ActivityIndicator, Image, View } from 'react-native';

export default function NotFound() {
  const router = useRouter();

  useEffect(() => {
    // Replace unmatched route with home to avoid "unmatched route" screens on production
    // Casting to any because the project enables typedRoutes and the generated
    // route types can be strict; this is a safe fallback redirect to the root.
    const t = setTimeout(() => router.replace('/' as any), 350);
    return () => clearTimeout(t);
  }, [router]);

  return (
    <ThemedView style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <View style={{ alignItems: 'center' }}>
        {/* App icon from assets */}
        <Image source={require('../assets/images/icon.png')} style={{ width: 84, height: 84, borderRadius: 18, marginBottom: 12 }} />
        <ActivityIndicator />
        <ThemedText style={{ marginTop: 12 }}>Route not found — returning home…</ThemedText>
      </View>
    </ThemedView>
  );
}
