import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { API_BASE } from '@/services/api';
import { getToken } from '@/services/auth.service';
import Constants from 'expo-constants';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function BlogDetail() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [post, setPost] = React.useState<any>(null);
  const [loading, setLoading] = React.useState<boolean>(false);

  const fetchPost = React.useCallback(async () => {
    if (!id) return;
    setLoading(true);
    try {
      const token = await getToken();
      const base = (API_BASE || '').replace(/\/$/, '') || (() => {
        const extra: any = (Constants as any).expoConfig?.extra ?? (Constants as any).manifest?.extra ?? {};
        return (extra?.chatApiUrl as string) || (extra?.chatUrl as string) || (process.env.CHAT_API_URL as string) || '';
      })();
      const url = base.replace(/\/$/, '').replace(/\/api\/?$/, '') + `/api/blogs/${id}`;
      const r = await fetch(url, { headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) } });
      const ct = r.headers.get('content-type') || '';
      const body = ct.includes('application/json') ? await r.json() : null;
      if (r.ok) setPost(body);
      else setPost(null);
    } catch (err) {
      console.error('Failed to fetch blog', err);
      setPost(null);
    } finally { setLoading(false); }
  }, [id]);

  React.useEffect(() => { fetchPost(); }, [fetchPost]);

  if (loading) return <ActivityIndicator style={{ marginTop: 24 }} />;
  if (!post) return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={{ color: colors.text, padding: 12 }}>Post not found.</Text>
    </View>
  );

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}> 
      <View style={{ padding: 12 }}>
        <TouchableOpacity onPress={() => router.back()}><Text style={{ color: colors.tint }}>← Back</Text></TouchableOpacity>
        <Text style={[styles.title, { color: colors.text }]}>{post.title}</Text>
        <Text style={{ color: colors.icon, marginBottom: 8 }}>{post.authorName ?? 'Author'} • {new Date(post.createdAt ?? post.created_at ?? Date.now()).toLocaleDateString()}</Text>
        {post.cover ? <Image source={{ uri: post.cover }} style={styles.cover} /> : null}
        <Text style={[styles.content, { color: colors.text }]}>{post.content ?? post.body ?? ''}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  title: { fontSize: 20, fontWeight: '700', marginTop: 8, marginBottom: 6 },
  cover: { width: '100%', height: 200, borderRadius: 8, marginVertical: 12 },
  content: { fontSize: 16, lineHeight: 22, marginTop: 12 },
});
