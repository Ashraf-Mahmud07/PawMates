import { PETS } from '@/app/(tabs)/adopt.data';
import { useReload } from '@/components/reload-context';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Image } from 'expo-image';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, Dimensions, FlatList, RefreshControl, ScrollView, TextInput, TouchableOpacity, View } from 'react-native';
import Toast from 'react-native-toast-message';
// Toast is mounted at app root (app/_layout.tsx)
import { styles } from './pet.styles';

export default function PetDetails() {
    const router = useRouter();
    const params = useLocalSearchParams() as { id?: string };
    const id = params?.id ?? PETS[0].id;

    const pet = useMemo(() => PETS.find((p) => p.id === id) || PETS[0], [id]);

    const { refreshing, triggerRefresh } = useReload();
    const [submitting, setSubmitting] = useState(false);
    const scrollRef = useRef<ScrollView | null>(null);
    const [adoptY, setAdoptY] = useState<number>(0);

    const [fav, setFav] = useState(false);
    const [imageIndex, setImageIndex] = useState(0);
    const flatRef = useRef<FlatList<string> | null>(null);

    const imgs = useMemo(() => ((pet as any).images && Array.isArray((pet as any).images) ? (pet as any).images : [pet.image]), [pet]);
    const width = Dimensions.get('window').width;

    // autoplay images in details view
    useEffect(() => {
        if (!imgs || imgs.length <= 1) return;
        const id = setInterval(() => {
            setImageIndex((prev) => {
                const next = (prev + 1) % imgs.length;
                if (flatRef.current) {
                    try {
                        flatRef.current.scrollToOffset({ offset: next * width, animated: true });
                    } catch {}
                }
                return next;
            });
        }, 3000);
        return () => clearInterval(id);
    }, [imgs, width]);

    // reset index when pet changes
    useEffect(() => {
        setImageIndex(0);
        if (flatRef.current) flatRef.current.scrollToOffset({ offset: 0, animated: false });
    }, [pet]);

    // form
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [message, setMessage] = useState('');

    const submitApp = () => {
        if (!name || !email) {
            Toast.show({ type: 'error', text1: 'Missing fields', text2: 'Please enter your name and email.', theme: 'dark' });
            return;
        }
        // optimistic UX: show success immediately and simulate network
        setSubmitting(true);
        Toast.show({ type: 'success', text1: 'Application sent', text2: `Thanks ${name}! We received your application for ${pet.name}.`, theme: 'dark' });
        setTimeout(() => {
            setName('');
            setEmail('');
            setPhone('');
            setMessage('');
            setSubmitting(false);
        }, 900);
    };

    return (
        <ThemedView style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />

            <View style={styles.headerRow}>
                <TouchableOpacity style={styles.backCircle} onPress={() => router.back()}>
                    <IconSymbol name="chevron.right" size={24} color="#666" style={{ transform: [{ rotate: '180deg' }] }} />
                </TouchableOpacity>
                <ThemedText>Back</ThemedText>
            </View>

            <ScrollView
                ref={scrollRef}
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={triggerRefresh} />}
            >
                <View style={styles.imageWrap}>
                    {/* support multiple images: pet.images (string[]) or fallback to pet.image */}
                    {(() => {
                        const imgs: string[] = (pet as any).images && Array.isArray((pet as any).images) ? (pet as any).images : [pet.image];
                        const width = Dimensions.get('window').width - 32;
                        return (
                            <>
                                <FlatList
                                    ref={flatRef}
                                    data={imgs}
                                    horizontal
                                    pagingEnabled
                                    showsHorizontalScrollIndicator={false}
                                    keyExtractor={(_, idx) => String(idx)}
                                    renderItem={({ item }) => (
                                        <Image source={{ uri: item }} style={[styles.image, { width }]} />
                                    )}
                                    onMomentumScrollEnd={(e) => {
                                        const x = e.nativeEvent.contentOffset.x || 0;
                                        const idx = Math.round(x / width);
                                        setImageIndex(idx);
                                    }}
                                />

                                <View style={styles.pagerDots} pointerEvents="none">
                                    {imgs.map((_, i) => (
                                        <View key={i} style={[styles.dot, imageIndex === i && styles.dotActive]} />
                                    ))}
                                </View>
                            </>
                        );
                    })()}

                    <View style={styles.badgeWrap}>
                        <ThemedText style={styles.badge}>{pet.tag}</ThemedText>
                    </View>

                    <TouchableOpacity style={styles.favBtn} onPress={() => setFav((v) => !v)}>
                        <IconSymbol name={fav ? 'heart.fill' : 'heart'} size={20} color={fav ? '#e0245e' : '#666'} />
                    </TouchableOpacity>
                </View>

                <ThemedText type="title" style={styles.petName}>{pet.name}</ThemedText>

                <View style={styles.cardGrid}>
                    <View style={styles.attrCardNew}>
                        <View style={styles.attrIconCircle}><ThemedText style={styles.attrIcon}>🐾</ThemedText></View>
                        <View style={styles.attrMeta}>
                            <ThemedText style={styles.attrLabelSmall}>Breed</ThemedText>
                            <ThemedText type="defaultSemiBold" style={styles.attrValue}>{pet.breed}</ThemedText>
                        </View>
                    </View>

                    <View style={styles.attrCardNew}>
                        <View style={styles.attrIconCircle}><ThemedText style={styles.attrIcon}>⏳</ThemedText></View>
                        <View style={styles.attrMeta}>
                            <ThemedText style={styles.attrLabelSmall}>Age</ThemedText>
                            <ThemedText type="defaultSemiBold" style={styles.attrValue}>{pet.age}</ThemedText>
                        </View>
                    </View>

                    <View style={styles.attrCardNew}>
                        <View style={styles.attrIconCircle}><ThemedText style={styles.attrIcon}>{pet.gender === 'Male' ? '♂️' : '♀️'}</ThemedText></View>
                        <View style={styles.attrMeta}>
                            <ThemedText style={styles.attrLabelSmall}>Gender</ThemedText>
                            <ThemedText type="defaultSemiBold" style={styles.attrValue}>{pet.gender}</ThemedText>
                        </View>
                    </View>

                    <View style={styles.attrCardNew}>
                        <View style={styles.attrIconCircle}><ThemedText style={styles.attrIcon}>📍</ThemedText></View>
                        <View style={styles.attrMeta}>
                            <ThemedText style={styles.attrLabelSmall}>Location</ThemedText>
                            <ThemedText type="defaultSemiBold" style={styles.attrValue}>{pet.location}</ThemedText>
                        </View>
                    </View>
                </View>

                <View style={styles.section}>
                    <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>About {pet.name}</ThemedText>
                    <ThemedText style={styles.aboutText}>
                        {pet.name} is a friendly {pet.breed.toLowerCase()} who enjoys cuddles and sunny windows. Fully vaccinated and litter trained. A loving companion for families and individuals alike.
                    </ThemedText>
                </View>

                <View style={[styles.section, styles.sectionCard]} onLayout={(e) => setAdoptY(e.nativeEvent.layout.y)}>
                    <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>Adopt This Pet</ThemedText>
                    <ThemedText style={{ color: '#666', marginBottom: 8 }}>Quick apply — we&apos;ll review your application and get back to you within 48 hours.</ThemedText>

                    <TextInput placeholder="Your Name" placeholderTextColor="#999" style={styles.input} value={name} onChangeText={setName} />
                    <TextInput placeholder="Your Email" placeholderTextColor="#999" style={styles.input} value={email} onChangeText={setEmail} keyboardType="email-address" />
                    <TextInput placeholder="Phone Number" placeholderTextColor="#999" style={styles.input} value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
                    <TextInput placeholder="Message" placeholderTextColor="#999" style={[styles.input, styles.textarea]} value={message} onChangeText={setMessage} multiline />

                    <TouchableOpacity style={styles.submitBtn} onPress={submitApp} accessibilityRole="button">
                        {submitting ? <ActivityIndicator color="#fff" /> : <><IconSymbol name="paperplane" size={16} color="#fff" /><ThemedText style={[styles.submitText, { marginLeft: 8 }]}> Apply now</ThemedText></>}
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
                                    <View style={styles.moreBadgePill}>
                                        <ThemedText style={styles.moreBadgeText}>{item.gender}</ThemedText>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        )}
                        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
                    />
                </View>

                <View style={{ height: 60 }} />
            </ScrollView>
            {/* Sticky CTA bar */}
            <View style={styles.ctaBar} pointerEvents="box-none">
                <TouchableOpacity
                    style={[styles.ctaButton, submitting && styles.ctaButtonDisabled]}
                    onPress={() => {
                        if (name && email) {
                            submitApp();
                        } else {
                            // scroll to the Adopt This Pet section
                            if (scrollRef.current) {
                                scrollRef.current.scrollTo({ y: adoptY - 36, animated: true });
                            }
                        }
                    }}
                >
                    {submitting ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <ThemedText style={{ color: '#fff', fontWeight: '700' }}>Apply to Adopt</ThemedText>
                    )}
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.ctaSecondary]}
                    onPress={() => setFav((v) => !v)}
                >
                    {/* <IconSymbol name={fav ? 'heart.fill' : 'heart'} size={18} color="#fff" /> */}
                    <IconSymbol name={fav ? 'heart.fill' : 'heart'} size={20} color={fav ? '#e0245e' : '#fff'} />
                </TouchableOpacity>
            </View>
            {/* Toast mounted at app root (app/_layout.tsx) */}
        </ThemedView>
    );
}
