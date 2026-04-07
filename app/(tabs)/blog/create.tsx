import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { API_BASE } from '@/services/api';
import { getToken } from '@/services/auth.service';
import Constants from 'expo-constants';
import { useRouter } from 'expo-router';
import React from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function BlogCreate() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [title, setTitle] = React.useState('');
  const [category, setCategory] = React.useState('General');
  const [excerpt, setExcerpt] = React.useState('');
  const [content, setContent] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const submit = async () => {
    setLoading(true);
    try {
      const token = await getToken();
      const base = (API_BASE || '').replace(/\/$/, '') || (() => {
        const extra: any = (Constants as any).expoConfig?.extra ?? (Constants as any).manifest?.extra ?? {};
        return (extra?.chatApiUrl as string) || (extra?.chatUrl as string) || (process.env.CHAT_API_URL as string) || '';
      })();
      const url = base.replace(/\/$/, '').replace(/\/api\/?$/, '') + '/api/blogs';
      const body = { title, category, excerpt, content };
      const r = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) }, body: JSON.stringify(body) });
      const ct = r.headers.get('content-type') || '';
      const res = ct.includes('application/json') ? await r.json() : null;
      if (!r.ok) throw res || new Error('Create failed');
      // navigate to created post
      const postId = res?.id ?? res?._id ?? null;
      router.push({ pathname: '/blog/[id]', params: { id: postId } } as any);
    } catch (err) {
      console.error('Failed to create post', err);
    } finally { setLoading(false); }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}> 
      <View style={{ padding: 12 }}>
        <TouchableOpacity onPress={() => router.back()}><Text style={{ color: colors.tint }}>← Back</Text></TouchableOpacity>
        <Text style={[styles.heading, { color: colors.text }]}>Write a Blog Post</Text>
        {(() => {
          const inputBg = colorScheme === 'dark' ? '#222' : '#fff';
          return (
            <>
              <TextInput placeholder="Title" value={title} onChangeText={setTitle} style={[styles.input, { backgroundColor: inputBg }]} />
              <TextInput placeholder="Category" value={category} onChangeText={setCategory} style={[styles.input, { backgroundColor: inputBg }]} />
              <TextInput placeholder="Excerpt" value={excerpt} onChangeText={setExcerpt} style={[styles.textarea, { backgroundColor: inputBg }]} multiline numberOfLines={3} />
              <TextInput placeholder="Content" value={content} onChangeText={setContent} style={[styles.textarea, { backgroundColor: inputBg }]} multiline numberOfLines={8} />
            </>
          );
        })()}

        <TouchableOpacity style={[styles.publish, { backgroundColor: '#f07a2f' }]} onPress={submit} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={{ color: '#fff', fontWeight: '700' }}>Publish Post</Text>}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  heading: { fontSize: 18, fontWeight: '700', marginTop: 8, marginBottom: 12 },
  input: { padding: 12, borderRadius: 8, marginBottom: 10 },
  textarea: { padding: 12, borderRadius: 8, marginBottom: 10, minHeight: 80 },
  publish: { padding: 14, borderRadius: 10, alignItems: 'center', marginTop: 8 },
});
