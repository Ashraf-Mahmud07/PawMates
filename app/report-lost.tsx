import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Stack, useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import { Image, Platform, Pressable, ScrollView, TextInput, TouchableOpacity, View } from 'react-native';
import { styles } from './report-lost.styles';

import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';

export default function ReportLost() {
    const router = useRouter();
    const [photos, setPhotos] = useState<string[]>([]);
    const [gender, setGender] = useState<string | null>(null);
    const [date, setDate] = useState<Date | null>(null);
    const [time, setTime] = useState<Date | null>(null);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);
    const [marker, setMarker] = useState<{ latitude: number; longitude: number } | null>({ latitude: 23.80608, longitude: 90.41319 });
    const [urgent, setUrgent] = useState(false);
    const [boost, setBoost] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [suggestions, setSuggestions] = useState<any[]>([]);
    const mapRef = useRef<any>(null);

    const pickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') return;

        const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 0.7 });
        // handle new result shape (assets) or legacy shape (cancelled/uri)
        // @ts-ignore
        if ((result as any).canceled === false && Array.isArray((result as any).assets)) {
            // expo 14+ returns { canceled: false, assets: [{ uri }] }
            // @ts-ignore
            const uri = (result as any).assets[0]?.uri;
            if (uri) setPhotos((p) => [...p, uri]);
            return;
        }
        // legacy
        // @ts-ignore
        if (!(result as any).cancelled && (result as any).uri) {
            // @ts-ignore
            setPhotos((p) => [...p, (result as any).uri]);
        }
    };

    const onMapPress = (e: any) => {
        const { latitude, longitude } = e.nativeEvent.coordinate;
        setMarker({ latitude, longitude });
    };

    const searchLocation = async () => {
        if (!searchQuery) return;
        try {
            const q = encodeURIComponent(searchQuery);
            const url = `https://nominatim.openstreetmap.org/search?q=${q}&format=json&addressdetails=1&limit=6`;
            const res = await fetch(url, { headers: { 'Accept-Language': 'en' } });
            const data = await res.json();
            setSuggestions(Array.isArray(data) ? data : []);
        } catch (err) {
            console.warn('search error', err);
        }
    };

    const chooseSuggestion = (item: any) => {
        const lat = parseFloat(item.lat);
        const lon = parseFloat(item.lon);
        setMarker({ latitude: lat, longitude: lon });
        setSuggestions([]);
        setSearchQuery(item.display_name);
        try {
            mapRef.current?.animateToRegion({ latitude: lat, longitude: lon, latitudeDelta: 0.01, longitudeDelta: 0.01 }, 300);
        } catch {}
    };

    const detectCurrentLocation = async () => {
        try {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') return;
            const pos = await Location.getCurrentPositionAsync({});
            const lat = pos.coords.latitude;
            const lon = pos.coords.longitude;
            setMarker({ latitude: lat, longitude: lon });
            setSearchQuery('');
            setSuggestions([]);
            try {
                mapRef.current?.animateToRegion({ latitude: lat, longitude: lon, latitudeDelta: 0.01, longitudeDelta: 0.01 }, 300);
            } catch {}
        } catch (err) {
            console.warn('location error', err);
        }
    };

    const onChangeDate = (event: any, selected?: Date) => {
        setShowDatePicker(Platform.OS === 'ios');
        if (selected) setDate(selected);
    };

    const onChangeTime = (event: any, selected?: Date) => {
        setShowTimePicker(Platform.OS === 'ios');
        if (selected) setTime(selected);
    };

    return (
        <ThemedView style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />
            <ScrollView contentContainerStyle={styles.content}>
                <Pressable style={styles.backRow} onPress={() => router.back()}>
                    <ThemedText style={styles.backArrow}>‹</ThemedText>
                    <ThemedText style={styles.backText}>Back</ThemedText>
                </Pressable>

                <View style={styles.headerRow}>
                    <View style={styles.iconWrap}>
                        <Image source={require('../assets/images/icon.png')} style={styles.icon} />
                    </View>
                    <View style={styles.headerTextWrap}>
                        <ThemedText type="subtitle" style={styles.headerTitle}>Report a Lost Pet</ThemedText>
                        <ThemedText style={styles.headerSubtitle}>Fill in the details to help find your missing pet.</ThemedText>
                    </View>
                </View>

                <View style={styles.infoBox}>
                    <ThemedText style={styles.infoText}>The sooner you report, the better the chances. Add clear photos and precise last-seen location. Share the listing on social media to increase visibility.</ThemedText>
                </View>

                <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>Recent Photos of Your Pet</ThemedText>
                <View style={styles.photoRow}>
                    {photos.map((uri, idx) => (
                        <Image key={uri + idx} source={{ uri }} style={styles.photoThumb} />
                    ))}
                    <TouchableOpacity style={styles.photoPlaceholder} activeOpacity={0.8} onPress={pickImage}>
                        <ThemedText style={styles.photoIcon}>📷</ThemedText>
                        <ThemedText style={styles.photoLabel}>Add</ThemedText>
                    </TouchableOpacity>
                </View>
                <ThemedText style={styles.photoHint}>Add clear, recent photos showing identifying features</ThemedText>

                <ThemedText type="defaultSemiBold" style={styles.fieldLabel}>Pet Name</ThemedText>
                <TextInput placeholder="e.g. Mimi, Bruno..." style={styles.input} />

                <ThemedText type="defaultSemiBold" style={styles.fieldLabel}>Breed</ThemedText>
                <TextInput placeholder="e.g. Persian, Labrador..." style={styles.input} />

                <ThemedText type="defaultSemiBold" style={styles.fieldLabel}>Age</ThemedText>
                <TextInput placeholder="e.g. 2 years, 6 months..." style={styles.input} />

                <ThemedText type="defaultSemiBold" style={styles.fieldLabel}>Gender</ThemedText>
                <View style={styles.pickerWrap}>
                    <Picker selectedValue={gender ?? ''} onValueChange={(v: string) => setGender(v)}>
                        <Picker.Item label="Select gender" value="" />
                        <Picker.Item label="Male" value="male" />
                        <Picker.Item label="Female" value="female" />
                    </Picker>
                </View>

                <ThemedText type="defaultSemiBold" style={styles.fieldLabel}>Last Seen Location</ThemedText>
                <TextInput placeholder="e.g. Near Mirpur 10 roundabout, beside the mosque" style={styles.input} />

                <View style={styles.rowInputs}>
                    <TouchableOpacity style={[styles.input, styles.smallInput, styles.pickerButton]} onPress={() => setShowDatePicker(true)}>
                        <ThemedText>{date ? date.toLocaleDateString() : 'mm/dd/yyyy'}</ThemedText>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.input, styles.smallInput, styles.pickerButton]} onPress={() => setShowTimePicker(true)}>
                        <ThemedText>{time ? time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:-- --'}</ThemedText>
                    </TouchableOpacity>
                </View>

                <ThemedText style={styles.mapHint}>Tap to pin the location on map</ThemedText>
                <View style={styles.mapSearchRow}>
                    <TextInput placeholder="Search location..." value={searchQuery} onChangeText={setSearchQuery} style={styles.searchInput} />
                    <TouchableOpacity style={styles.searchButton} onPress={searchLocation}>
                        <ThemedText>🔍</ThemedText>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.searchButton} onPress={detectCurrentLocation}>
                        <ThemedText>📍</ThemedText>
                    </TouchableOpacity>
                </View>
                {suggestions.length > 0 && (
                    <View style={styles.suggestionsList}>
                        {suggestions.map((s, i) => (
                            <TouchableOpacity key={s.place_id ?? i} style={styles.suggestionItem} onPress={() => chooseSuggestion(s)}>
                                <ThemedText style={styles.suggestionText}>{s.display_name}</ThemedText>
                            </TouchableOpacity>
                        ))}
                    </View>
                )}
                <View style={styles.mapContainer}>
                    <MapView
                        style={styles.map}
                        provider={PROVIDER_GOOGLE}
                        initialRegion={{ latitude: marker?.latitude ?? 23.80608, longitude: marker?.longitude ?? 90.41319, latitudeDelta: 0.02, longitudeDelta: 0.02 }}
                        onPress={onMapPress}
                        ref={mapRef}
                    >
                        {marker ? <Marker coordinate={marker} /> : null}
                    </MapView>
                </View>
                {marker ? <ThemedText style={styles.coordsText}>{marker.latitude.toFixed(6)}, {marker.longitude.toFixed(6)}</ThemedText> : null}

                <ThemedText type="defaultSemiBold" style={styles.fieldLabel}>Identifying Features</ThemedText>
                <TextInput placeholder="e.g. Blue collar, scar on left paw, cream fur with dark points..." style={[styles.input, styles.multiline]} multiline />

                <ThemedText type="defaultSemiBold" style={styles.fieldLabel}>Reward (optional)</ThemedText>
                <TextInput placeholder="e.g. ৳5,000" style={styles.input} />

                <View style={styles.promoBox}>
                    <TouchableOpacity style={[styles.promoRow, urgent && styles.promoSelected]} onPress={() => setUrgent((v) => !v)}>
                        <ThemedText style={styles.promoRadio}>{urgent ? '✓' : '○'}</ThemedText>
                        <ThemedText style={styles.promoText}>Mark as Urgent (free)</ThemedText>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.promoRow, boost && styles.promoSelected]} onPress={() => setBoost((v) => !v)}>
                        <ThemedText style={styles.promoRadio}>{boost ? '✓' : '○'}</ThemedText>
                        <ThemedText style={styles.promoText}>Boost listing — highlighted + area alerts (৳99/week)</ThemedText>
                    </TouchableOpacity>
                </View>

                <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>Your Contact Information</ThemedText>
                <TextInput placeholder="Your Name" style={styles.input} />
                <TextInput placeholder="Phone Number" style={styles.input} keyboardType="phone-pad" />
                <TextInput placeholder="Your Email" style={styles.input} keyboardType="email-address" />

                {showDatePicker && (
                    <DateTimePicker value={date ?? new Date()} mode="date" display="default" onChange={onChangeDate} />
                )}
                {showTimePicker && (
                    <DateTimePicker value={time ?? new Date()} mode="time" display="default" onChange={onChangeTime} />
                )}

                <TouchableOpacity style={styles.submitButton} activeOpacity={0.9} onPress={() => {
                    const payload = { photos, gender, date: date?.toISOString(), time: time?.toISOString(), location: marker, urgent, boost };
                    // TODO: wire to API
                    console.log('submit lost', payload);
                    router.replace('/' as any);
                }}>
                    <ThemedText style={styles.submitButtonText}>✈ Submit Lost Pet Report</ThemedText>
                </TouchableOpacity>

            </ScrollView>
        </ThemedView>
    );
}
