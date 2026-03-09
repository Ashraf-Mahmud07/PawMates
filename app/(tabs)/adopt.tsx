import { Image } from 'expo-image';
import React, { useMemo, useState } from 'react';
import {
    FlatList,
    Modal,
    SafeAreaView,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function AdoptScreen() {
  const colorScheme = useColorScheme();
  const tint = Colors[colorScheme ?? 'light'].tint;

  const [query, setQuery] = useState('');
  const [type, setType] = useState<'All Pets' | 'Cats' | 'Dogs'>('All Pets');
  const [filterOpen, setFilterOpen] = useState(false);

  // Filter states
  const CITIES = ['All Cities', 'Dhanmondi', 'Banani', 'Gulshan', 'Uttara'];
  const BREEDS = ['All Breeds', 'Persian Cat', 'Golden Retriever', 'Shorthair Cat', 'Beagle'];
  const SIZES = ['Any Size', 'Small', 'Medium', 'Large'];

  const [city, setCity] = useState(CITIES[0]);
  const [breedFilter, setBreedFilter] = useState(BREEDS[0]);
  const [genderFilter, setGenderFilter] = useState<'Any' | 'Male' | 'Female'>('Any');
  const [sizeFilter, setSizeFilter] = useState(SIZES[0]);
  const [childFriendly, setChildFriendly] = useState(false);
  const [vaccinated, setVaccinated] = useState(false);
  const [neutered, setNeutered] = useState(false);
  const [houseTrained, setHouseTrained] = useState(false);

  // Dropdown modal state for selectors
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [dropdownOptions, setDropdownOptions] = useState<string[]>([]);
  const [dropdownTitle, setDropdownTitle] = useState<string>('Select');
  const [dropdownOnSelect, setDropdownOnSelect] = useState<((v: string) => void) | null>(null);

  const openDropdown = (title: string, options: string[], onSelect: (v: string) => void) => {
    setDropdownTitle(title);
    setDropdownOptions(options);
    setDropdownOnSelect(() => onSelect);
    setDropdownVisible(true);
  };

  const PETS = React.useMemo(
    () => [
      {
        id: 'pet1',
        name: 'Mimi',
        breed: 'Persian Cat',
        age: '2 years',
        gender: 'Female',
        location: 'Dhanmondi, Dhaka',
        image: 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?q=80&w=1200',
        tag: 'Adopt Me',
        type: 'Cats',
      },
      {
        id: 'pet2',
        name: 'Buddy',
        breed: 'Golden Retriever',
        age: '3 years',
        gender: 'Male',
        location: 'Banani, Dhaka',
        image: 'https://images.unsplash.com/photo-1507149833265-60c372daea22?q=80&w=1200',
        tag: 'Adopt Me',
        type: 'Dogs',
      },
      {
        id: 'pet3',
        name: 'Luna',
        breed: 'Shorthair Cat',
        age: '1 year',
        gender: 'Female',
        location: 'Gulshan, Dhaka',
        image: 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?q=80&w=1200',
        tag: 'Adopt Me',
        type: 'Cats',
      },
      {
        id: 'pet4',
        name: 'Charlie',
        breed: 'Beagle',
        age: '4 years',
        gender: 'Male',
        location: 'Uttara, Dhaka',
        image: 'https://images.unsplash.com/photo-1543852786-1cf6624b9987?q=80&w=1200',
        tag: 'Adopt Me',
        type: 'Dogs',
      },
    ],
    []
  );

  const filtered = useMemo(() => {
    return PETS.filter((p) => {
      if (type !== 'All Pets' && p.type !== type) return false;
      if (!query) return true;
      const q = query.toLowerCase();
      return (
        p.name.toLowerCase().includes(q) ||
        p.breed.toLowerCase().includes(q) ||
        p.location.toLowerCase().includes(q)
      );
    });
  }, [query, type, PETS]);

  const ListHeader = () => (
    <View style={styles.headerBlock}>
      <ThemedText type="defaultSemiBold" style={styles.title}>Adopt a Pet</ThemedText>
      <ThemedText style={styles.subtitle}>Give a loving home to a furry friend. Every pet here is looking for their forever family.</ThemedText>

      <View style={styles.controlsRow}>
        <View style={styles.searchWrap}>
          <IconSymbol name="magnifyingglass" size={16} color={Colors.light.icon} />
          <TextInput
            placeholder="Search by name or breed..."
            placeholderTextColor="#999"
            value={query}
            onChangeText={setQuery}
            style={styles.searchInput}
          />
        </View>

        <TouchableOpacity
          style={styles.selector}
          onPress={() => setType((t) => (t === 'All Pets' ? 'Cats' : t === 'Cats' ? 'Dogs' : 'All Pets'))}
        >
          <ThemedText>{type}</ThemedText>
          <IconSymbol name="chevron.down" size={16} color={Colors.light.icon} />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={[styles.filterBar, { borderColor: tint }]}
        onPress={() => setFilterOpen((v) => !v)}
      >
        <IconSymbol name="slider.horizontal.3" size={18} color={tint} />
        <ThemedText style={{ color: tint, marginLeft: 8, fontWeight: '600' }}>Filter</ThemedText>
        <IconSymbol name={filterOpen ? 'chevron.up' : 'chevron.down'} size={16} color={tint} />
      </TouchableOpacity>

      {filterOpen && (
        <View style={styles.filterPanel}>
          <View style={styles.filterRow}>
            <TouchableOpacity
              style={styles.filterSelect}
              onPress={() => openDropdown('City', CITIES, (v) => setCity(v))}
            >
              <ThemedText style={{ color: '#444' }}>{city}</ThemedText>
              <IconSymbol name="chevron.down" size={14} color={Colors.light.icon} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.filterSelect}
              onPress={() => openDropdown('Breed', BREEDS, (v) => setBreedFilter(v))}
            >
              <ThemedText style={{ color: '#444' }}>{breedFilter}</ThemedText>
              <IconSymbol name="chevron.down" size={14} color={Colors.light.icon} />
            </TouchableOpacity>
          </View>

          <View style={styles.filterRow}>
            <TouchableOpacity
              style={styles.filterSelect}
              onPress={() => openDropdown('Gender', ['Any', 'Male', 'Female'], (v) => setGenderFilter(v as any))}
            >
              <ThemedText style={{ color: '#444' }}>{genderFilter}</ThemedText>
              <IconSymbol name="chevron.down" size={14} color={Colors.light.icon} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.filterSelect}
              onPress={() => openDropdown('Size', SIZES, (v) => setSizeFilter(v))}
            >
              <ThemedText style={{ color: '#444' }}>{sizeFilter}</ThemedText>
              <IconSymbol name="chevron.down" size={14} color={Colors.light.icon} />
            </TouchableOpacity>
          </View>

          <View style={styles.attributesRow}>
            <TouchableOpacity style={[styles.attr, childFriendly && styles.attrActive]} onPress={() => setChildFriendly((v) => !v)}>
              <ThemedText style={childFriendly ? { color: '#fff' } : { color: '#444' }}>Child Friendly</ThemedText>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.attr, vaccinated && styles.attrActive]} onPress={() => setVaccinated((v) => !v)}>
              <ThemedText style={vaccinated ? { color: '#fff' } : { color: '#444' }}>Vaccinated</ThemedText>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.attr, neutered && styles.attrActive]} onPress={() => setNeutered((v) => !v)}>
              <ThemedText style={neutered ? { color: '#fff' } : { color: '#444' }}>Neutered / Spayed</ThemedText>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.attr, houseTrained && styles.attrActive]} onPress={() => setHouseTrained((v) => !v)}>
              <ThemedText style={houseTrained ? { color: '#fff' } : { color: '#444' }}>House Trained</ThemedText>
            </TouchableOpacity>
          </View>

        </View>
      )}

      <ThemedText style={styles.resultsCount}>{filtered.length} pets found</ThemedText>
    </View>
  );

  return (
    <ThemedView style={styles.container}>
      <FlatList
        data={filtered}
        keyExtractor={(i) => i.id}
        contentContainerStyle={styles.list}
        ListHeaderComponent={ListHeader}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View>
              <Image source={{ uri: item.image }} style={styles.cardImage} />
              <View style={styles.tagPill}>
                <ThemedText style={styles.tagText}>{item.tag}</ThemedText>
              </View>
              <TouchableOpacity style={styles.heartWrap}>
                <IconSymbol name="heart" size={20} color={Colors.light.icon} />
              </TouchableOpacity>
            </View>

            <View style={styles.cardBody}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <ThemedText type="defaultSemiBold" style={styles.petName}>{item.name}</ThemedText>
                <View style={styles.genderBadge}><ThemedText style={styles.genderText}>{item.gender}</ThemedText></View>
              </View>
              <ThemedText style={styles.breed}>{item.breed} · {item.age}</ThemedText>
              <View style={styles.locationRow}>
                <IconSymbol name="mappin" size={14} color={Colors.light.icon} />
                <ThemedText style={styles.locationText}>{item.location}</ThemedText>
              </View>
            </View>
          </View>
        )}
      />
      {/* Dropdown modal for filter selectors */}
      <Modal visible={dropdownVisible} animationType="slide" transparent onRequestClose={() => setDropdownVisible(false)}>
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.35)', justifyContent: 'flex-end' }}>
          <SafeAreaView style={{ backgroundColor: '#fff', maxHeight: '60%', borderTopLeftRadius: 12, borderTopRightRadius: 12 }}>
            <View style={{ padding: 12, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#eee', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <ThemedText type="defaultSemiBold">{dropdownTitle}</ThemedText>
              <TouchableOpacity onPress={() => setDropdownVisible(false)} style={{ padding: 6 }}>
                <ThemedText style={{ color: tint }}>Close</ThemedText>
              </TouchableOpacity>
            </View>

            <FlatList
              data={dropdownOptions}
              keyExtractor={(i) => i}
              style={{ padding: 12 }}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={{ paddingVertical: 12, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#f0f0f0' }}
                  onPress={() => {
                    if (dropdownOnSelect) dropdownOnSelect(item);
                    setDropdownVisible(false);
                  }}
                >
                  <ThemedText style={{ fontSize: 16 }}>{item}</ThemedText>
                </TouchableOpacity>
              )}
            />
          </SafeAreaView>
        </View>
      </Modal>

      <View style={{ height: 60 }} />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerBlock: { padding: 16 },
  title: { fontSize: 20, marginBottom: 6 },
  subtitle: { color: '#666', marginBottom: 12 },
  primaryButton: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 10, borderRadius: 8, alignSelf: 'flex-start', marginBottom: 12 },
  primaryButtonText: { color: '#fff', marginLeft: 8, fontWeight: '600' },
  controlsRow: { flexDirection: 'row', alignItems: 'center' },
  searchWrap: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10, borderWidth: StyleSheet.hairlineWidth, borderColor: '#eee' },
  searchInput: { marginLeft: 8, flex: 1, height: 34 },
  selector: { marginLeft: 12, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 10, borderRadius: 10, borderWidth: StyleSheet.hairlineWidth, borderColor: '#eee' },
  resultsCount: { marginTop: 12, color: '#666' },
  list: { padding: 16, paddingTop: 8 },
  card: { backgroundColor: '#fff', borderRadius: 12, marginBottom: 16, overflow: 'hidden', shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 6, elevation: 2 },
  cardImage: { width: '100%', height: 180 },
  tagPill: { position: 'absolute', top: 12, left: 12, backgroundColor: '#2f9e44', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 16 },
  tagText: { color: '#fff', fontSize: 12, fontWeight: '600' },
  heartWrap: { position: 'absolute', top: 12, right: 12, backgroundColor: 'rgba(255,255,255,0.9)', padding: 8, borderRadius: 18 },
  cardBody: { padding: 12 },
  petName: { fontSize: 16, color: '#222' },
  genderBadge: { backgroundColor: '#f2f2f2', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  genderText: { fontSize: 12, color: '#666' },
  breed: { color: '#777', marginTop: 6 },
  locationRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  locationText: { color: '#999', marginLeft: 6 },
  filterBar: {
    marginTop: 12,
    borderWidth: 2,
    borderRadius: 10,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  filterPanel: {
    marginTop: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#eee',
  },
  filterRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  filterSelect: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#eee',
  },
  attributesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  attr: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#eee',
    marginRight: 8,
  },
  attrActive: {
    // will be adjusted inline using tint from component
    backgroundColor: '#ff8c42',
    borderColor: '#ff8c42',
    color: '#fff',
  },
});
