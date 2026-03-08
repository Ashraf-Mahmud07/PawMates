import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Stack, useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { FlatList, Image, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

const PROFILES = [
  {
    id: '1',
    name: 'Tony & Robin',
    avatar1:
      'https://images.unsplash.com/photo-1517423440428-a5a00ad493e8?q=80&w=400&auto=format&fit=crop&s=1',
    avatar2:
      'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?q=80&w=400&auto=format&fit=crop&s=1',
    following: true,
  },
  {
    id: '2',
    name: 'Winnie',
    avatar1:
      'https://images.unsplash.com/photo-1507149833265-60c372daea22?q=80&w=400&auto=format&fit=crop&s=1',
    avatar2:
      'https://images.unsplash.com/photo-1543852786-1cf6624b9987?q=80&w=400&auto=format&fit=crop&s=1',
    following: false,
  },
  {
    id: '3',
    name: 'Copito',
    avatar1:
      'https://images.unsplash.com/photo-1546182990-dffeafbe841d?q=80&w=400&auto=format&fit=crop&s=1',
    avatar2:
      'https://images.unsplash.com/photo-1543852786-1cf6624b9987?q=80&w=400&auto=format&fit=crop&s=1',
    following: true,
  },
  {
    id: '4',
    name: 'Luna & Max',
    avatar1:
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=400&auto=format&fit=crop&s=1',
    avatar2:
      'https://images.unsplash.com/photo-1537151625747-768eb6cf92b6?q=80&w=400&auto=format&fit=crop&s=1',
    following: true,
  },
  {
    id: '5',
    name: 'Bella',
    avatar1:
      'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=400&auto=format&fit=crop&s=1',
    avatar2:
      'https://images.unsplash.com/photo-1508672019048-805c876b67e2?q=80&w=400&auto=format&fit=crop&s=1',
    following: false,
  },
  {
    id: '6',
    name: 'Charlie & Milo',
    avatar1:
      'https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?q=80&w=400&auto=format&fit=crop&s=1',
    avatar2:
      'https://images.unsplash.com/photo-1525253086316-d0c936c814f8?q=80&w=400&auto=format&fit=crop&s=1',
    following: true,
  },
  {
    id: '7',
    name: 'Daisy',
    avatar1:
      'https://images.unsplash.com/photo-1528756514091-dee8e4d3b5d3?q=80&w=400&auto=format&fit=crop&s=1',
    avatar2:
      'https://images.unsplash.com/photo-1507149833265-60c372daea22?q=80&w=400&auto=format&fit=crop&s=1',
    following: false,
  },
  {
    id: '8',
    name: 'Rocky',
    avatar1:
      'https://images.unsplash.com/photo-1507149830-3a6dc2f0cf6a?q=80&w=400&auto=format&fit=crop&s=1',
    avatar2:
      'https://images.unsplash.com/photo-1517423440428-a5a00ad493e8?q=80&w=400&auto=format&fit=crop&s=1',
    following: true,
  },
];

export default function FollowingScreen() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'followers' | 'following'>('following');

  

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return PROFILES.filter((p) => {
      const matchesTab = activeTab === 'following' ? p.following : !p.following;
      const matchesQuery = q.length === 0 ? true : p.name.toLowerCase().includes(q);
      return matchesTab && matchesQuery;
    });
  }, [query, activeTab]);

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.headerRow}>
        <TouchableOpacity style={styles.backCircle} onPress={() => router.back()}>
          <IconSymbol name="chevron.right" size={22} color="#fff" style={{ transform: [{ rotate: '180deg' }] }} />
        </TouchableOpacity>
        <ThemedText type="title" style={styles.title}>Following</ThemedText>
      </View>

      <View style={styles.searchContainer}>
        <IconSymbol name="line.horizontal.3" size={20} color="#7a4de8" />
        <TextInput
          placeholder="Search"
          placeholderTextColor="#7a4de8"
          style={styles.searchInput}
          value={query}
          onChangeText={setQuery}
        />
      </View>

      <View style={styles.segmentRowTabs}>
        <TouchableOpacity style={styles.segmentTab} onPress={() => setActiveTab('followers')}>
          <ThemedText style={[styles.segmentLabel, activeTab === 'followers' ? styles.segmentActiveText : undefined]}>Followers</ThemedText>
        </TouchableOpacity>

        <TouchableOpacity style={styles.segmentTab} onPress={() => setActiveTab('following')}>
          <ThemedText style={[styles.segmentLabel, activeTab === 'following' ? styles.segmentActiveText : undefined]}>Following</ThemedText>
        </TouchableOpacity>
      </View>

      <View style={styles.sectionHeader}>
        <ThemedText style={styles.sectionTitle}>Profiles ({filtered.length})</ThemedText>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(i) => i.id}
        renderItem={({ item }) => (
          <View style={styles.listItem}>
            <View style={styles.avatarsRow}>
              <View style={[styles.avatarWrap, { borderColor: '#7a4de8' }]}>
                <Image source={{ uri: item.avatar1 }} style={styles.avatar} />
              </View>
              <View style={[styles.avatarWrap, { borderColor: '#f3a33b', marginLeft: -14 }]}>
                <Image source={{ uri: item.avatar2 }} style={styles.avatar} />
              </View>
            </View>

            <ThemedText type="defaultSemiBold" style={styles.profileName}>{item.name}</ThemedText>

            <TouchableOpacity>
              <IconSymbol name="ellipsis" size={20} color="#7a4de8" />
            </TouchableOpacity>
          </View>
        )}
        ItemSeparatorComponent={() => <View style={{ height: 1, backgroundColor: '#eee' }} />}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 8 },
  backCircle: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#7a4de8', alignItems: 'center', justifyContent: 'center' },
  title: { marginLeft: 8 },

  searchContainer: {
    marginTop: 12,
    backgroundColor: '#f3f3f3',
    height: 52,
    borderRadius: 26,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchInput: {
    marginLeft: 12,
    color: '#7a4de8',
    fontSize: 18,
    flex: 1,
    padding: 0,
  },

  segmentRowTabs: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 18,
    paddingHorizontal: 2,
  },
  segmentTab: { paddingVertical: 8, paddingHorizontal: 12 },
  segmentLabel: { fontSize: 16, color: '#000' },
  segmentActiveText: { color: '#7a4de8', fontWeight: '700', borderBottomWidth: 3, borderBottomColor: '#7a4de8', paddingBottom: 8 },

  sectionHeader: { marginTop: 18, backgroundColor: '#f6f6f6', padding: 12 },
  sectionTitle: { fontSize: 16, fontWeight: '700' },

  listItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#eee' },
  avatarsRow: { flexDirection: 'row', alignItems: 'center', width: 84 },
  avatarWrap: { width: 44, height: 44, borderRadius: 22, borderWidth: 3, overflow: 'hidden', alignItems: 'center', justifyContent: 'center' },
  avatar: { width: '100%', height: '100%' },
  profileName: { marginLeft: 12, flex: 1, color: '#3a294b' },
});
