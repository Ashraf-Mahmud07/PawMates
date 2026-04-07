import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { API_BASE } from '@/services/api';
import { getToken } from '@/services/auth.service';
import Constants from 'expo-constants';
import { useRouter } from 'expo-router';
import React from 'react';
import { ActivityIndicator, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function BlogList() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [posts, setPosts] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState<boolean>(false);

  const fetchPosts = React.useCallback(async () => {
    setLoading(true);
    try {
      const token = await getToken();
      const base = (API_BASE || '').replace(/\/$/, '') || (() => {
        const extra: any = (Constants as any).expoConfig?.extra ?? (Constants as any).manifest?.extra ?? {};
        return (extra?.chatApiUrl as string) || (extra?.chatUrl as string) || (process.env.CHAT_API_URL as string) || '';
      })();
      const url = base.replace(/\/$/, '').replace(/\/api\/?$/, '') + '/api/blogs';
      console.log('Fetching blogs URL:', url);
      const r = await fetch(url, { headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) } });
      const ct = r.headers.get('content-type') || '';
      const body = ct.includes('application/json') ? await r.json() : [];
      if (r.ok && Array.isArray(body)) setPosts(body);
      else setPosts([]);
    } catch (err) {
      console.error('Failed to fetch blogs', err);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => { fetchPosts(); }, [fetchPosts]);

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity style={[styles.card, { backgroundColor: colors.background }]} onPress={() => router.push({ pathname: '/blog/[id]', params: { id: item.id ?? item._id } } as any)}>
      {item.cover && <Image source={{ uri: item.cover }} style={styles.cover} />}
      <View style={styles.cardBody}>
        <Text style={[styles.tag, { color: colors.tint }]}>{item.category ?? 'General'}</Text>
        <Text style={[styles.title, { color: colors.text }]} numberOfLines={2}>{item.title}</Text>
        {item.excerpt ? <Text style={[styles.excerpt, { color: colors.icon }]} numberOfLines={2}>{item.excerpt}</Text> : null}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.headerRow}>
        <ThemedText type="defaultSemiBold" style={{ fontSize: 20 }}>Community</ThemedText>
        <TouchableOpacity style={styles.newBtn} onPress={() => router.push('/blog/create' as any)}>
          <IconSymbol name="plus" size={18} color="#fff" />
          <Text style={styles.newBtnText}>New Post</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator style={{ marginTop: 24 }} />
      ) : (
        <FlatList data={posts} keyExtractor={p => p.id ?? p._id} renderItem={renderItem} contentContainerStyle={{ padding: 12 }} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 12 },
  newBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f07a2f', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8 },
  newBtnText: { color: '#fff', fontWeight: '700', marginLeft: 8 },
  card: { borderRadius: 12, overflow: 'hidden', marginBottom: 12, elevation: 1 },
  cover: { width: '100%', height: 140 },
  cardBody: { padding: 12 },
  tag: { fontWeight: '700', marginBottom: 6 },
  title: { fontSize: 16, fontWeight: '700' },
  excerpt: { marginTop: 8, fontSize: 14 },
});
