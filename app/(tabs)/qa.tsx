import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useRouter } from 'expo-router';
import React from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const SAMPLE = [
  { id: '1', q: 'How to train my puppy to sit?', a: 'Start with treats...' },
  { id: '2', q: 'What vaccine schedule for puppies?', a: 'Follow vet guidance...' },
];

export default function QAList() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}> 
      <View style={{ padding: 12 }}>
        <Text style={[styles.heading, { color: colors.text }]}>Q&A</Text>
        <FlatList data={SAMPLE} keyExtractor={i => i.id} renderItem={({ item }) => (
          <TouchableOpacity style={[styles.card, { backgroundColor: colors.background }]} onPress={() => router.push('/ask-question' as any)}>
            <Text style={{ color: colors.text, fontWeight: '700' }}>{item.q}</Text>
            <Text style={{ color: colors.icon, marginTop: 6 }}>{item.a}</Text>
          </TouchableOpacity>
        )} contentContainerStyle={{ paddingBottom: 80 }} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  heading: { fontSize: 18, fontWeight: '700', marginBottom: 12 },
  card: { padding: 12, borderRadius: 12, marginBottom: 10, elevation: 1 },
});
