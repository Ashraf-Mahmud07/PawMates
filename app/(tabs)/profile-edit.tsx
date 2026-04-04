import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { getUser, saveUser } from '@/services/auth.service';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Button, KeyboardAvoidingView, Platform, StyleSheet, TextInput, View } from 'react-native';

export default function ProfileEditScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const u = await getUser();
        if (!mounted) return;
        if (u) {
          setName(u.name ?? '');
          setEmail(u.email ?? '');
          setPhone(u.phone ?? '');
          setLocation(u.location ?? '');
        }
      } catch {
        // ignore
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const save = async () => {
    const updated = { name, email, phone, location } as any;
    try {
      await saveUser(updated);
      router.back();
    } catch {
      // ignore for now
      router.back();
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }} keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 70}>
      <ThemedView style={styles.container}>
        <ThemedText type="title">Edit Profile</ThemedText>

        <View style={styles.form}>
          <TextInput placeholder="Name" value={name} onChangeText={setName} style={styles.input} />
          <TextInput placeholder="Email" value={email} onChangeText={setEmail} style={styles.input} keyboardType="email-address" autoCapitalize="none" />
          <TextInput placeholder="Phone" value={phone} onChangeText={setPhone} style={styles.input} keyboardType="phone-pad" />
          <TextInput placeholder="Location" value={location} onChangeText={setLocation} style={styles.input} />
        </View>

        <View style={styles.actions}>
          <View style={{ flex: 1, marginRight: 8 }}>
            <Button title="Save" onPress={save} />
          </View>
          <View style={{ flex: 1 }}>
            <Button title="Cancel" color="#6c757d" onPress={() => router.back()} />
          </View>
        </View>
      </ThemedView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  form: { marginTop: 16 },
  input: { borderWidth: 1, borderColor: '#eee', padding: 12, borderRadius: 8, marginBottom: 12, backgroundColor: '#fff' },
  actions: { flexDirection: 'row', marginTop: 12 },
});
