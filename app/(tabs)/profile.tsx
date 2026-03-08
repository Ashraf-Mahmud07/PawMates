import { useSideDrawer } from '@/components/side-drawer-context';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

export default function ProfileScreen() {
  const { openDrawer } = useSideDrawer();
  return (
    <ThemedView style={styles.container}>
      <View style={styles.headerRow}>
        <TouchableOpacity style={styles.iconButton} onPress={() => openDrawer()}>
          <IconSymbol name="line.horizontal.3" size={28} color="#7a4de8" />
        </TouchableOpacity>
        <ThemedText type="title">Profile</ThemedText>
        <View style={{ width: 44 }} />
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 8 },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 },
  iconButton: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
});
