import { useReload } from '@/components/reload-context';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { FlatList, RefreshControl, Image as RNImage, TouchableOpacity, View } from 'react-native';
import { styles } from './lost.styles';

type Post = {
  id: string;
  status: 'Lost' | 'Found';
  name: string;
  breed?: string;
  age?: string;
  location?: string;
  date?: string;
  sightings?: number;
  reward?: string;
  image: string;
};

const DATA: Post[] = [
  {
    id: '1',
    status: 'Lost',
    name: 'Whiskers',
    breed: 'Siamese Cat',
    age: '3 years',
    location: 'Mirpur, Dhaka',
    date: 'Feb 15, 2026',
    sightings: 3,
    reward: '৳5,000',
    image: 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?w=800&auto=format&fit=crop&q=60',
  },
  {
    id: '2',
    status: 'Lost',
    name: 'Luna',
    breed: 'Calico Cat',
    age: '1 year',
    location: 'Banani, Dhaka',
    date: 'Feb 12, 2026',
    sightings: 1,
    image: 'https://images.unsplash.com/photo-1519121783530-7b3b7e4f9b3f?w=800&auto=format&fit=crop&q=60',
  },
  {
    id: '3',
    status: 'Found',
    name: 'Unknown Kitten',
    breed: 'White Kitten',
    age: '~3 months',
    location: 'Mirpur 10, Dhaka',
    date: 'Feb 21, 2026',
    sightings: 0,
    image: 'https://images.unsplash.com/photo-1517423440428-a5a00ad493e8?w=800&auto=format&fit=crop&q=60',
  },
  {
    id: '4',
    status: 'Lost',
    name: 'Ginger',
    breed: 'Orange Tabby',
    age: '4 years',
    location: 'Mohammadpur, Dhaka',
    date: 'Feb 20, 2026',
    sightings: 2,
    image: 'https://images.unsplash.com/photo-1543852786-1cf6624b9987?w=800&auto=format&fit=crop&q=60',
  },
  {
    id: '5',
    status: 'Lost',
    name: 'Tuffy',
    breed: 'Pomeranian',
    age: '3 years',
    location: 'Agrabad, Chittagong',
    date: 'Feb 19, 2026',
    sightings: 2,
    reward: '৳10,000',
    image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&auto=format&fit=crop&q=60',
  },
];

export default function Lost() {
  const [tab, setTab] = useState<'Lost' | 'Found'>('Lost');
  const { refreshing, triggerRefresh } = useReload();
  const router = useRouter();

  const items = useMemo(() => DATA.filter((d) => d.status === tab), [tab]);

  const renderCard = ({ item }: { item: Post }) => (
    <View style={styles.card}>
      <View style={styles.imageWrap}>
        <RNImage source={{ uri: item.image }} style={styles.cardImage} />
        <View style={[styles.pill, item.status === 'Lost' ? styles.pillLost : styles.pillFound]}>
          <ThemedText type="defaultSemiBold" style={styles.pillText}>{item.status}</ThemedText>
        </View>
        {item.reward ? (
          <View style={styles.rewardPill}><ThemedText type="defaultSemiBold" style={styles.rewardText}>Reward: {item.reward}</ThemedText></View>
        ) : null}
      </View>

      <View style={styles.cardBody}>
        <ThemedText type="defaultSemiBold" style={styles.cardTitle}>{item.name}</ThemedText>
        <ThemedText style={styles.cardMeta}>{item.breed} · {item.age}</ThemedText>

        <View style={styles.cardFooter}>
          <View style={styles.locationRow}>
            <ThemedText style={styles.locationEmoji}>📍</ThemedText>
            <ThemedText style={styles.cardSmall}>{item.location}</ThemedText>
          </View>
          <ThemedText style={styles.cardSmall}>{item.date} · {item.sightings} sightings</ThemedText>
        </View>
      </View>
    </View>
  );

  return (
    <ThemedView style={styles.container}>
      {/* Header is rendered as the FlatList header so it scrolls with the content */}
      <FlatList
        data={items}
        keyExtractor={(i) => i.id}
        renderItem={renderCard}
        contentContainerStyle={styles.list}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={triggerRefresh} />}
        ListHeaderComponent={() => (
          <>
            <View style={styles.headerTop}>
              <ThemedText type="subtitle" style={styles.headerTitle}>Lost & Found</ThemedText>
              <ThemedText style={styles.headerSubtitle}>Help reunite lost pets with their families. Report a missing or found pet.</ThemedText>

              <View style={{ height: 12 }} />
              <View style={styles.actionsRow}>
                <TouchableOpacity style={[styles.actionButton, styles.btnLost]} activeOpacity={0.9} onPress={() => router.push('/report-lost')}>
                  <ThemedText style={styles.actionEmoji}>⚠️</ThemedText>
                  <ThemedText type="defaultSemiBold" style={styles.actionText}>Report Lost</ThemedText>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.actionButton, styles.btnFound]} activeOpacity={0.9} onPress={() => router.push('/report-found')}>
                  <ThemedText style={styles.actionEmoji}>🔎</ThemedText>
                  <ThemedText type="defaultSemiBold" style={styles.actionText}>Report Found</ThemedText>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.segmentRow}>
              <TouchableOpacity style={[styles.segment, tab === 'Lost' && styles.segmentActive]} onPress={() => setTab('Lost')}>
                <ThemedText type={tab === 'Lost' ? 'defaultSemiBold' : 'default'} style={styles.segmentText}>Lost ({DATA.filter(d => d.status === 'Lost').length})</ThemedText>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.segment, tab === 'Found' && styles.segmentActive]} onPress={() => setTab('Found')}>
                <ThemedText type={tab === 'Found' ? 'defaultSemiBold' : 'default'} style={styles.segmentText}>Found ({DATA.filter(d => d.status === 'Found').length})</ThemedText>
              </TouchableOpacity>
            </View>
          </>
        )}
      />
    </ThemedView>
  );
}
