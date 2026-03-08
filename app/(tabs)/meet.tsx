import { useSideDrawer } from '@/components/side-drawer-context';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Stack } from 'expo-router';
import React from 'react';
import { Image, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

const MEET_PROFILES = [
  {
    id: 'm1',
    name: 'kaliya',
    gender: 'Male',
    age: '3 yrs',
    image:
      'https://images.unsplash.com/photo-1508672019048-805c876b67e2?q=80&w=1200&auto=format&fit=crop&s=1',
    avatar: 'https://images.unsplash.com/photo-1546182990-dffeafbe841d?q=80&w=400&auto=format&fit=crop&s=1',
    distance: '1.9 km',
  },
  {
    id: 'm2',
    name: 'Dior',
    gender: 'Male',
    age: '1 year',
    image:
      'https://images.unsplash.com/photo-1517423440428-a5a00ad493e8?q=80&w=1200&auto=format&fit=crop&s=1',
    avatar: 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?q=80&w=400&auto=format&fit=crop&s=1',
    distance: '3.2 km',
  },
  {
    id: 'm3',
    name: 'khadok',
    gender: 'Female',
    age: '2 yrs',
    image:
      'https://images.unsplash.com/photo-1525253086316-d0c936c814f8?q=80&w=1200&auto=format&fit=crop&s=1',
    avatar: 'https://images.unsplash.com/photo-1507149833265-60c372daea22?q=80&w=400&auto=format&fit=crop&s=1',
    distance: '0.9 km',
  },
];

export default function MeetScreen() {
  const { openDrawer } = useSideDrawer();
  return (
    <ThemedView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.headerRow}>
        <TouchableOpacity style={styles.iconButton} onPress={() => openDrawer()}>
          <IconSymbol name="line.horizontal.3" size={28} color="#7a4de8" />
        </TouchableOpacity>

        <ThemedText type="title" style={styles.headerTitle}>Near Me</ThemedText>

        <TouchableOpacity style={styles.iconButton}>
          <IconSymbol name="slider.horizontal.3" size={22} color="#7a4de8" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {MEET_PROFILES.map((p) => (
          <View key={p.id} style={styles.card}>
            <View style={styles.cardHeaderRow}>
              <ThemedText type="title" style={styles.cardTitle}>{p.name}</ThemedText>

              <View style={styles.pillsRow}>
                <View style={styles.pill}>
                  <ThemedText style={styles.pillText}>{p.gender}</ThemedText>
                </View>
                <View style={[styles.pill, { marginLeft: 8 }]}>
                  <ThemedText style={styles.pillText}>{p.age}</ThemedText>
                </View>
              </View>
            </View>

            <View style={styles.imageWrap}>
              <Image source={{ uri: p.image }} style={styles.image} resizeMode="cover" />
            </View>

            <View style={styles.rowBottom}>
              <View style={styles.avatarWrapOuter}>
                <Image source={{ uri: p.avatar }} style={styles.smallAvatar} />
              </View>

              <View style={{ marginLeft: 12, flex: 1 }}>
                <ThemedText type="defaultSemiBold" style={styles.nameText}>{p.name}</ThemedText>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2 }}>
                  <View style={styles.locationDot} />
                  <ThemedText style={styles.distanceText}> {p.distance} away</ThemedText>
                </View>
              </View>

              <TouchableOpacity>
                <IconSymbol name="ellipsis" size={20} color="#7a4de8" />
              </TouchableOpacity>
            </View>
          </View>
        ))}

        <View style={{ height: 80 }} />
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 8 },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 },
  iconButton: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { textAlign: 'center', fontSize: 22 },

  scroll: { paddingTop: 12, paddingBottom: 28 },
  card: { backgroundColor: '#f6f6f9', borderRadius: 20, padding: 12, marginBottom: 20 },
  cardHeaderRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  cardTitle: { fontSize: 22, marginLeft: 4 },
  pillsRow: { flexDirection: 'row', alignItems: 'center' },
  pill: { backgroundColor: '#efe8ff', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 18 },
  pillText: { color: '#7a4de8', fontWeight: '700' },

  imageWrap: { marginTop: 12, borderRadius: 14, overflow: 'hidden', backgroundColor: '#ddd' },
  image: { width: '100%', height: 260 },

  rowBottom: { flexDirection: 'row', alignItems: 'center', marginTop: 12 },
  avatarWrapOuter: { width: 44, height: 44, borderRadius: 22, overflow: 'hidden', borderWidth: 3, borderColor: '#fff', backgroundColor: '#fff', elevation: 2, shadowColor: '#000' },
  smallAvatar: { width: '100%', height: '100%' },
  nameText: { color: '#3a294b' },
  distanceText: { color: '#7a4de8', fontSize: 13 },
  locationDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#7a4de8', marginRight: 6 },
});

