import { PETS } from '@/app/(tabs)/adopt.data';
import { useReload } from '@/components/reload-context';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Image } from 'expo-image';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { Alert, FlatList, RefreshControl, ScrollView, TextInput, TouchableOpacity, View } from 'react-native';
import { styles } from './pet.styles';

export default function PetDetails() {
  const router = useRouter();
  const params = useLocalSearchParams() as { id?: string };
  const id = params?.id ?? PETS[0].id;

  const pet = useMemo(() => PETS.find((p) => p.id === id) || PETS[0], [id]);

  const { refreshing, triggerRefresh } = useReload();

  const [fav, setFav] = useState(false);

  // form
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');

  const submitApp = () => {
    if (!name || !email) {
      Alert.alert('Missing fields', 'Please enter your name and email.');
      return;
    }
    // simulate submit
    Alert.alert('Application sent', `Thanks ${name}! We received your application for ${pet.name}.`);
    setName('');
    setEmail('');
    setPhone('');
    setMessage('');
  };

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={triggerRefresh} />}
      >
        <View style={styles.imageWrap}>
          <Image source={{ uri: pet.image }} style={styles.image} />

          <View style={styles.badgeWrap}>
            <ThemedText style={styles.badge}>{pet.tag}</ThemedText>
          </View>

          <TouchableOpacity style={styles.favBtn} onPress={() => setFav((v) => !v)}>
            <IconSymbol name={fav ? 'heart.fill' : 'heart'} size={20} color={fav ? '#e0245e' : '#666'} />
          </TouchableOpacity>
        </View>

        <ThemedText type="title" style={styles.petName}>{pet.name}</ThemedText>

        <View style={styles.cardGrid}>
          <View style={styles.attrCard}>
            <ThemedText style={styles.attrLabel}>Breed</ThemedText>
            <ThemedText type="defaultSemiBold">{pet.breed}</ThemedText>
          </View>

          <View style={styles.attrCard}>
            <ThemedText style={styles.attrLabel}>Age</ThemedText>
            <ThemedText type="defaultSemiBold">{pet.age}</ThemedText>
          </View>

          <View style={styles.attrCard}>
            <ThemedText style={styles.attrLabel}>Gender</ThemedText>
            <ThemedText type="defaultSemiBold">{pet.gender}</ThemedText>
          </View>

          <View style={styles.attrCard}>
            <ThemedText style={styles.attrLabel}>Location</ThemedText>
            <ThemedText type="defaultSemiBold">{pet.location}</ThemedText>
          </View>
        </View>

        <View style={styles.section}>
          <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>About {pet.name}</ThemedText>
          <ThemedText style={styles.aboutText}>
            {pet.name} is a friendly {pet.breed.toLowerCase()} who enjoys cuddles and sunny windows. Fully vaccinated and litter trained. A loving companion for families and individuals alike.
          </ThemedText>
        </View>

        <View style={styles.section}>
          <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>Adopt This Pet</ThemedText>

          <TextInput placeholder="Your Name" placeholderTextColor="#999" style={styles.input} value={name} onChangeText={setName} />
          <TextInput placeholder="Your Email" placeholderTextColor="#999" style={styles.input} value={email} onChangeText={setEmail} keyboardType="email-address" />
          <TextInput placeholder="Phone Number" placeholderTextColor="#999" style={styles.input} value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
          <TextInput placeholder="Message" placeholderTextColor="#999" style={[styles.input, styles.textarea]} value={message} onChangeText={setMessage} multiline />

          <TouchableOpacity style={styles.submitBtn} onPress={submitApp} accessibilityRole="button">
            <IconSymbol name="paperplane" size={18} color="#fff" />
            <ThemedText style={styles.submitText}>  Submit Application</ThemedText>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>More Pets to Explore</ThemedText>

          <FlatList
            data={PETS.filter((p) => p.id !== pet.id)}
            keyExtractor={(i) => i.id}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.moreCard} onPress={() => router.push(`/pet/${item.id}` as any)}>
                <Image source={{ uri: item.image }} style={styles.moreImage} />
                <View style={styles.moreMeta}>
                  <ThemedText type="defaultSemiBold">{item.name}</ThemedText>
                  <ThemedText style={styles.moreSub}>{item.breed} · {item.age}</ThemedText>
                </View>
                <View style={styles.moreBadgeWrap}>
                  <ThemedText style={styles.moreBadge}>{item.gender}</ThemedText>
                </View>
              </TouchableOpacity>
            )}
            ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
          />
        </View>

        <View style={{ height: 60 }} />
      </ScrollView>
    </ThemedView>
  );
}
