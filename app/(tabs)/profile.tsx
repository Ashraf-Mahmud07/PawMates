import { useSideDrawer } from '@/components/side-drawer-context';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { clearToken, getToken, getUser, saveUser } from '@/services/auth.service';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function ProfileScreen() {
  const { openDrawer } = useSideDrawer();
  const router = useRouter();

  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [user, setUser] = useState<any>(null);
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editLocation, setEditLocation] = useState('');
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const t = await getToken();
        if (mounted) setIsLoggedIn(!!t);
      } catch {
        if (mounted) setIsLoggedIn(false);
      }
      try {
        const u = await getUser();
        if (mounted) setUser(u);
        if (mounted && u) {
          setEditName(u.name ?? '');
          setEditEmail(u.email ?? '');
          setEditPhone(u.phone ?? '');
          setEditLocation(u.location ?? '');
        }
      } catch {
        if (mounted) setUser(null);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);
  const initials = (name?: string) => {
    const n = name || user?.name || '';
    const parts = n.trim().split(' ');
    if (parts.length === 0) return '';
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  };

  const stats = {
    adoption: user?.stats?.adoptionPosts ?? 2,
    lost: user?.stats?.lostFound ?? 1,
    blog: user?.stats?.blogPosts ?? 1,
    qa: user?.stats?.qa ?? 1,
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.headerRow}>
        <TouchableOpacity style={styles.iconButton} onPress={() => openDrawer()}>
          <IconSymbol name="line.horizontal.3" size={28} color="#7a4de8" />
        </TouchableOpacity>
        <ThemedText type="title">Profile</ThemedText>

        {/* Right area: when not logged in show Login / Sign up links */}
        {!isLoggedIn ? (
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <TouchableOpacity onPress={() => router.push('/login')} style={{ marginRight: 8 }}>
              <Text style={{ color: '#7a4de8', fontWeight: '600' }}>Login</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push('/register')}>
              <Text style={{ color: '#7a4de8', fontWeight: '600' }}>Sign up</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity onPress={async () => {
            try {
              await clearToken();
              setIsLoggedIn(false);
              setUser(null);
            } catch {
              setIsLoggedIn(false);
              setUser(null);
            }
          }} style={{ paddingHorizontal: 8 }}>
            <Text style={{ color: '#d9534f', fontWeight: '700' }}>Logout</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.card}>
        {editing ? (
          <View>
            <TextInput value={editName} onChangeText={setEditName} placeholder="Name" style={styles.inputInline} />
            <TextInput value={editEmail} onChangeText={setEditEmail} placeholder="Email" style={styles.inputInline} keyboardType="email-address" autoCapitalize="none" />
            <TextInput value={editPhone} onChangeText={setEditPhone} placeholder="Phone" style={styles.inputInline} keyboardType="phone-pad" />
            <TextInput value={editLocation} onChangeText={setEditLocation} placeholder="Location" style={styles.inputInline} />

            <View style={{ flexDirection: 'row', marginTop: 12 }}>
              <TouchableOpacity style={styles.saveButton} onPress={async () => {
                try {
                  const updated = { ...user, name: editName, email: editEmail, phone: editPhone, location: editLocation } as any;
                  await saveUser(updated);
                  setUser(updated);
                } catch {
                  // ignore
                } finally {
                  setEditing(false);
                }
              }}>
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.cancelButton} onPress={() => {
                // reset edits
                setEditName(user?.name ?? '');
                setEditEmail(user?.email ?? '');
                setEditPhone(user?.phone ?? '');
                setEditLocation(user?.location ?? '');
                setEditing(false);
              }}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <>
            <View style={styles.cardRow}>
              <View style={styles.avatar}>{user ? <Text style={styles.avatarText}>{initials(user.name)}</Text> : <IconSymbol name="person" size={28} color="#fff" />}</View>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={styles.name}>{user?.name ?? 'Rahim Uddin'}</Text>
                <Text style={styles.sub}>{user?.email ?? 'rahim@example.com'} · +880 1712-345678</Text>
                <Text style={styles.sub}>{user?.location ?? 'Dhanmondi, Dhaka'} · Joined January 2026</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.editButton} onPress={() => setEditing(true)}>
              <IconSymbol name="pencil" size={16} color="#7a4de8" />
              <Text style={styles.editText}>  Edit Profile</Text>
            </TouchableOpacity>
          </>
        )}
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <IconSymbol name="heart" size={20} color="#ff6b6b" />
          <Text style={styles.statNum}>{stats.adoption}</Text>
          <Text style={styles.statLabel}>Adoption Posts</Text>
        </View>
        <View style={styles.statBox}>
          <IconSymbol name="mappin" size={20} color="#e96055" />
          <Text style={styles.statNum}>{stats.lost}</Text>
          <Text style={styles.statLabel}>Lost & Found</Text>
        </View>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <IconSymbol name="doc.text" size={20} color="#2b8aef" />
          <Text style={styles.statNum}>{stats.blog}</Text>
          <Text style={styles.statLabel}>Blog Posts</Text>
        </View>
        <View style={styles.statBox}>
          <IconSymbol name="bubble.left.and.bubble.right.fill" size={20} color="#7a4de8" />
          <Text style={styles.statNum}>{stats.qa}</Text>
          <Text style={styles.statLabel}>Q&A</Text>
        </View>
      </View>

      <Text style={{ marginTop: 18, marginBottom: 8, fontSize: 18, fontWeight: '700' }}>Quick Actions</Text>

      <View style={styles.actionsRow}>
        <TouchableOpacity style={styles.actionButton} onPress={() => router.push('/adopt' as any)}>
          <IconSymbol name="pawprint.fill" size={20} color="#7a4de8" />
          <Text style={styles.actionLabel}>Post Adoption</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={() => router.push('/report-lost' as any)}>
          <IconSymbol name="magnifyingglass" size={20} color="#7a4de8" />
          <Text style={styles.actionLabel}>Report Lost</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.actionsRow}>
        <TouchableOpacity style={styles.actionButton} onPress={() => router.push('/write-blog' as any)}>
          <IconSymbol name="book" size={20} color="#7a4de8" />
          <Text style={styles.actionLabel}>Write Blog</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={() => router.push('/ask-question' as any)}>
          <IconSymbol name="bubble.left" size={20} color="#7a4de8" />
          <Text style={styles.actionLabel}>Ask Question</Text>
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 8 },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 },
  iconButton: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginTop: 12, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  cardRow: { flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 64, height: 64, borderRadius: 32, backgroundColor: '#f3e8ff', alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: '#7a4de8', fontWeight: '700', fontSize: 20 },
  name: { fontSize: 18, fontWeight: '700', marginBottom: 4 },
  sub: { color: '#666', marginBottom: 2 },
  editButton: { marginTop: 12, alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#eee', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8, backgroundColor: '#faf8ff' },
  editText: { color: '#7a4de8', fontWeight: '600' },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 },
  statBox: { flex: 1, backgroundColor: '#fff', borderRadius: 12, padding: 12, marginRight: 8, alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOpacity: 0.03, shadowRadius: 6, elevation: 1 },
  statNum: { fontSize: 20, fontWeight: '700', marginBottom: 6 },
  statLabel: { color: '#666', textAlign: 'center' },
  actionsRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 },
  actionButton: { flex: 1, backgroundColor: '#fff', borderRadius: 12, padding: 16, alignItems: 'center', justifyContent: 'center', marginRight: 8, shadowColor: '#000', shadowOpacity: 0.03, shadowRadius: 6, elevation: 1 },
  actionLabel: { marginTop: 8, color: '#444', fontWeight: '600' },
  inputInline: { borderWidth: 1, borderColor: '#eee', padding: 10, borderRadius: 8, backgroundColor: '#fff', marginBottom: 8 },
  saveButton: { flex: 1, backgroundColor: '#f08a2a', borderRadius: 8, paddingVertical: 10, alignItems: 'center', marginRight: 8 },
  saveButtonText: { color: '#fff', fontWeight: '700' },
  cancelButton: { flex: 1, backgroundColor: '#fff', borderRadius: 8, paddingVertical: 10, alignItems: 'center', borderWidth: 1, borderColor: '#eee' },
  cancelButtonText: { color: '#333', fontWeight: '600' },
});
