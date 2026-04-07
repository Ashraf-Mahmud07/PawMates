import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import React from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';

const STORIES = [
  { id: 's1', text: 'We adopted Luna last month and she is thriving!' },
  { id: 's2', text: 'Fostered a litter of kittens over the weekend.' },
];

export default function Stories() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]} contentContainerStyle={{ padding: 12 }}>
      <Text style={[styles.heading, { color: colors.text }]}>Stories</Text>
      {STORIES.map(s => (
        <View key={s.id} style={[styles.card, { backgroundColor: colors.background }]}>
          <Image source={{ uri: 'https://placekitten.com/400/200' }} style={styles.cover} />
          <Text style={{ color: colors.text, marginTop: 8 }}>{s.text}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  heading: { fontSize: 18, fontWeight: '700', marginBottom: 12 },
  card: { borderRadius: 12, overflow: 'hidden', marginBottom: 12 },
  cover: { width: '100%', height: 140 },
});
