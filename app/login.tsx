import { saveToken, saveUser } from '@/services/auth.service';
import { connectSocket } from '@/services/chat.service';
import Constants from 'expo-constants';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Button, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, View } from 'react-native';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const [loginLoading, setLoginLoading] = useState(false);

  const submit = async () => {
    setError(null);
    try {
      setLoginLoading(true);
      const url = `${'http://192.168.10.152:5000'}/api/auth/login`;
      console.log('Login API called with url=', url);
      const r = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const res: any = await r.json();
      if (!r.ok) {
        const msg = res?.message || res?.error || `Login failed (${r.status})`;
        throw new Error(msg);
      }
      // save token/user
      if (res?.token) await saveToken(res.token);
      if (res?.user) await saveUser(res.user);
      console.log('Login success:', res);
      // connect socket after login
      try {
        const extra: any = (Constants as any).expoConfig?.extra ?? (Constants as any).manifest?.extra ?? {};
        const url = (extra?.chatUrl as string) || (process.env.CHAT_API_URL as string) || '';
        const token = res?.token;
        if (url && token) connectSocket(url, token);
      } catch { }
      router.replace('/');
    } catch (err: any) {
      const msg = err?.message ?? 'Login failed';
      console.error('Login error:', err);
      setError(msg);
    } finally {
      setLoginLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }} keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 70}>
      <View style={styles.container}>
        <Text style={styles.title}>Login</Text>
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <TextInput placeholder="Email" value={email} onChangeText={setEmail} style={styles.input} keyboardType="email-address" autoCapitalize="none" />
        <TextInput placeholder="Password" value={password} onChangeText={setPassword} style={styles.input} secureTextEntry />
        <Button title={`${loginLoading ? 'Logging in...' : 'Login'}`} onPress={submit} />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, justifyContent: 'center' },
  input: { borderWidth: 1, borderColor: '#ddd', padding: 10, borderRadius: 8, marginBottom: 12 },
  title: { fontSize: 20, fontWeight: '700', marginBottom: 12 },
  error: { color: '#d9534f', marginBottom: 8 },
});
