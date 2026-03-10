import { useReload } from '@/components/reload-context';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
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
import { BREEDS, CITIES, PETS, SIZES } from './adopt.data';
import { styles } from './adopt.styles';

export default function AdoptScreen() {
    const colorScheme = useColorScheme();
    const tint = Colors[colorScheme ?? 'light'].tint;
    const router = useRouter();

    const [query, setQuery] = useState('');
    // transient input value for immediate UI response; `query` will be updated after debounce
    const [searchText, setSearchText] = useState('');
    const [type, setType] = useState<'All Pets' | 'Cats' | 'Dogs'>('All Pets');
    const [filterOpen, setFilterOpen] = useState(false);

    // Filter states moved to `adopt.data.ts`

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

    // PETS are imported from adopt.data.ts

    // debounce: update `query` 800ms after user stops typing
    useEffect(() => {
        const t = setTimeout(() => setQuery(searchText), 800);
        return () => clearTimeout(t);
    }, [searchText]);

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
    }, [query, type]);

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
                        value={searchText}
                        onChangeText={setSearchText}
                        blurOnSubmit={false}
                        returnKeyType="search"
                        onSubmitEditing={() => setQuery(searchText)}
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
                keyboardShouldPersistTaps="always"
                keyboardDismissMode="none"
                removeClippedSubviews={false}
                refreshing={useReload().refreshing}
                onRefresh={useReload().triggerRefresh}
                renderItem={({ item }) => (
                    <TouchableOpacity style={styles.card} onPress={() => router.push(`/pet/${item.id}` as any)}>
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
                    </TouchableOpacity>
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


