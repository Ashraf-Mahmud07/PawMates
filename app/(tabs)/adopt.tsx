import { useReload } from '@/components/reload-context';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
    ActivityIndicator,
    Dimensions,
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

// Small image slider component used in the adopt cards.
function ImageSlider({ images }: { images: string[] }) {
    const width = Dimensions.get('window').width - 32; // account for list padding
    const ref = useRef<FlatList<string> | null>(null);
    const [index, setIndex] = useState(0);

    useEffect(() => {
        if (!images || images.length <= 1) return;
        const id = setInterval(() => {
            const next = (index + 1) % images.length;
            setIndex(next);
            if (ref.current) ref.current.scrollToOffset({ offset: next * width, animated: true });
        }, 3000);
        return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [index, images]);

    if (!images || images.length === 0) return null;
    if (images.length === 1) return <Image source={{ uri: images[0] }} style={styles.cardImage} />;

    return (
        <>
            <FlatList
                ref={ref}
                data={images}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                keyExtractor={(_, i) => String(i)}
                renderItem={({ item }) => <Image source={{ uri: item }} style={[styles.cardImage, { width }]} />}
                onMomentumScrollEnd={(e) => {
                    const x = e.nativeEvent.contentOffset.x || 0;
                    const idx = Math.round(x / width);
                    setIndex(idx);
                }}
            />

            <View style={styles.cardPagerDots} pointerEvents="none">
                {images.map((_, i) => (
                    <View key={i} style={[styles.cardDot, index === i && styles.cardDotActive]} />
                ))}
            </View>
        </>
    );
}

export default function AdoptScreen() {
    const colorScheme = useColorScheme();
    const tint = Colors[colorScheme ?? 'light'].tint;
    const router = useRouter();
    const reload = useReload();

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
            // type filter (Cats / Dogs / All Pets)
            if (type !== 'All Pets' && p.type !== type) return false;

            // city filter (skip if default 'All Cities')
            if (city && city !== CITIES[0]) {
                if (!p.location.toLowerCase().includes(city.toLowerCase())) return false;
            }

            // breed filter
            if (breedFilter && breedFilter !== BREEDS[0]) {
                if (p.breed.toLowerCase() !== breedFilter.toLowerCase()) return false;
            }

            // gender filter
            if (genderFilter && genderFilter !== 'Any') {
                if (p.gender.toLowerCase() !== genderFilter.toLowerCase()) return false;
            }

            // size filter: our local data doesn't include size; skip unless expanded

            // attribute filters (childFriendly, vaccinated, etc.) are not present on dummy data

            // text query
            if (!query) return true;
            const q = query.toLowerCase();
            return (
                p.name.toLowerCase().includes(q) ||
                p.breed.toLowerCase().includes(q) ||
                p.location.toLowerCase().includes(q)
            );
        });
    }, [query, type, city, breedFilter, genderFilter]);

    // Pagination (page-wise). Simulate page loads locally by slicing the filtered array.
    const PAGE_SIZE = 8;
    const [page, setPage] = useState(1);
    const [loadingMore, setLoadingMore] = useState(false);
    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    const displayed = useMemo(() => filtered.slice(0, page * PAGE_SIZE), [filtered, page]);

    const loadMore = () => {
        if (loadingMore) return;
        if (page >= totalPages) return;
        setLoadingMore(true);
        // simulate small async load; replace with real fetch if needed
        setTimeout(() => {
            setPage((p) => p + 1);
            setLoadingMore(false);
        }, 350);
    };

    const ListHeader = () => (
        <View style={styles.headerBlock}>
            <ThemedText type="defaultSemiBold" style={styles.title}>Adopt a Pet</ThemedText>
            <ThemedText style={styles.subtitle}>Find your new companion — simplified view for mobile.</ThemedText>

            <View style={[styles.controlsRow, { marginTop: 8 }]}>
                <View style={styles.searchWrap}>
                    <IconSymbol name="magnifyingglass" size={16} color={Colors.light.icon} />
                    <TextInput
                        placeholder="Search by name or breed..."
                        placeholderTextColor="#999"
                        value={searchText}
                        onChangeText={(t) => { setSearchText(t); setPage(1); }}
                        blurOnSubmit={false}
                        returnKeyType="search"
                        onSubmitEditing={() => { setQuery(searchText); setPage(1); }}
                        style={styles.searchInput}
                    />
                </View>

                <TouchableOpacity
                    style={[styles.primaryButton, { backgroundColor: tint }]}
                    onPress={() => setFilterOpen(true)}
                >
                    <IconSymbol name="slider.horizontal.3" size={18} color="#fff" />
                    <ThemedText style={styles.primaryButtonText}>Filters</ThemedText>
                </TouchableOpacity>
            </View>

            <ThemedText style={styles.resultsCount}>{filtered.length} pets found</ThemedText>
        </View>
    );

    const ListFooter = () => {
        if (displayed.length === 0) return null;
        if (loadingMore) return (
            <View style={{ padding: 12, alignItems: 'center' }}>
                <ActivityIndicator />
            </View>
        );
        if (displayed.length < filtered.length) return (
            <View style={{ padding: 12, alignItems: 'center' }}>
                <TouchableOpacity onPress={loadMore} style={{ paddingHorizontal: 16, paddingVertical: 10, backgroundColor: tint, borderRadius: 8 }}>
                    <ThemedText style={{ color: '#fff', fontWeight: '600' }}>Load more</ThemedText>
                </TouchableOpacity>
            </View>
        );
        return (
            <View style={{ height: 32 }} />
        );
    };

    return (
        <ThemedView style={styles.container}>
            <FlatList
                data={displayed}
                keyExtractor={(i) => i.id}
                contentContainerStyle={styles.list}
                ListHeaderComponent={ListHeader}
                ListFooterComponent={ListFooter}
                keyboardShouldPersistTaps="always"
                keyboardDismissMode="none"
                removeClippedSubviews={false}
                refreshing={reload.refreshing}
                onRefresh={() => { setPage(1); reload.triggerRefresh(); }}
                onEndReached={() => loadMore()}
                onEndReachedThreshold={0.5}
                renderItem={({ item }) => (
                    <TouchableOpacity style={styles.card} onPress={() => router.push(`/pet/${item.id}` as any)}>
                        <View>
                            {/* Image slider: supports item.images (string[]) or fallback to item.image */}
                            <ImageSlider images={((item as any).images && Array.isArray((item as any).images) ? (item as any).images : [item.image])} />
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
            {/* Filters modal (simplified mobile UI) */}
            <Modal visible={filterOpen} animationType="slide" transparent onRequestClose={() => setFilterOpen(false)}>
                <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.35)', justifyContent: 'flex-end' }}>
                    <SafeAreaView style={{ backgroundColor: '#fff', maxHeight: '80%', borderTopLeftRadius: 12, borderTopRightRadius: 12 }}>
                        <View style={{ padding: 12, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#eee', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                            <ThemedText type="defaultSemiBold">Filters</ThemedText>
                            <TouchableOpacity onPress={() => setFilterOpen(false)} style={{ padding: 6 }}>
                                <ThemedText style={{ color: tint }}>Close</ThemedText>
                            </TouchableOpacity>
                        </View>

                        <View style={{ padding: 12 }}>
                            <View style={styles.filterRow}>
                                <TouchableOpacity style={styles.filterSelect} onPress={() => openDropdown('City', CITIES, (v) => setCity(v))}>
                                    <ThemedText style={{ color: '#444' }}>{city}</ThemedText>
                                    <IconSymbol name="chevron.down" size={14} color={Colors.light.icon} />
                                </TouchableOpacity>

                                <TouchableOpacity style={styles.filterSelect} onPress={() => openDropdown('Breed', BREEDS, (v) => setBreedFilter(v))}>
                                    <ThemedText style={{ color: '#444' }}>{breedFilter}</ThemedText>
                                    <IconSymbol name="chevron.down" size={14} color={Colors.light.icon} />
                                </TouchableOpacity>
                            </View>

                            <View style={styles.filterRow}>
                                <TouchableOpacity style={styles.filterSelect} onPress={() => openDropdown('Gender', ['Any', 'Male', 'Female'], (v) => setGenderFilter(v as any))}>
                                    <ThemedText style={{ color: '#444' }}>{genderFilter}</ThemedText>
                                    <IconSymbol name="chevron.down" size={14} color={Colors.light.icon} />
                                </TouchableOpacity>

                                <TouchableOpacity style={styles.filterSelect} onPress={() => openDropdown('Size', SIZES, (v) => setSizeFilter(v))}>
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

                            <View style={{ marginTop: 12, flexDirection: 'row', justifyContent: 'flex-end', gap: 8 }}>
                                <TouchableOpacity onPress={() => { setCity(CITIES[0]); setBreedFilter(BREEDS[0]); setGenderFilter('Any'); setSizeFilter(SIZES[0]); setChildFriendly(false); setVaccinated(false); setNeutered(false); setHouseTrained(false); }} style={{ padding: 10 }}>
                                    <ThemedText>Reset</ThemedText>
                                </TouchableOpacity>

                                <TouchableOpacity onPress={() => { setFilterOpen(false); setPage(1); }} style={{ paddingHorizontal: 14, paddingVertical: 10, backgroundColor: tint, borderRadius: 8 }}>
                                    <ThemedText style={{ color: '#fff', fontWeight: '600' }}>Apply</ThemedText>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </SafeAreaView>
                </View>
            </Modal>
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


