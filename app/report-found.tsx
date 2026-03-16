import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Stack, useRouter } from 'expo-router';
import React from 'react';
import { Image, Pressable, ScrollView, TextInput, TouchableOpacity, View } from 'react-native';
import { styles } from './report-found.styles';

export default function ReportFound() {
    const router = useRouter();

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
                        <ThemedText type="subtitle" style={styles.headerTitle}>Report a Found Pet</ThemedText>
                        <ThemedText style={styles.headerSubtitle}>Help reunite a found pet with its owner.</ThemedText>
                    </View>
                </View>

                <View style={styles.infoBox}>
                    <ThemedText style={styles.infoText}>Take clear photos and note the exact location. If the pet has a collar or tag, include those details. Keep the pet safe until the owner is found.</ThemedText>
                </View>

                <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>Photos of the Found Pet</ThemedText>
                <TouchableOpacity style={styles.photoPlaceholder} activeOpacity={0.8}>
                    <ThemedText style={styles.photoIcon}>📷</ThemedText>
                    <ThemedText style={styles.photoLabel}>Add</ThemedText>
                </TouchableOpacity>
                <ThemedText style={styles.photoHint}>Add clear photos showing identifying features</ThemedText>

                <ThemedText type="defaultSemiBold" style={styles.fieldLabel}>Species</ThemedText>
                <TouchableOpacity style={styles.selectInput}><ThemedText style={styles.selectText}>Select species</ThemedText></TouchableOpacity>

                <ThemedText type="defaultSemiBold" style={styles.fieldLabel}>Breed</ThemedText>
                <TextInput placeholder="e.g. Tabby, Mixed breed..." style={styles.input} />

                <ThemedText type="defaultSemiBold" style={styles.fieldLabel}>Color / Markings</ThemedText>
                <TextInput placeholder="e.g. Orange with white patches" style={styles.input} />

                <ThemedText type="defaultSemiBold" style={styles.fieldLabel}>Condition</ThemedText>
                <TouchableOpacity style={styles.selectInput}><ThemedText style={styles.selectText}>Select condition</ThemedText></TouchableOpacity>

                <ThemedText type="defaultSemiBold" style={styles.fieldLabel}>Where Was the Pet Found?</ThemedText>
                <TextInput placeholder="e.g. Near Uttara Sector 7, Road 15" style={styles.input} />

                <View style={styles.rowInputs}>
                    <TextInput placeholder="mm/dd/yyyy" style={[styles.input, styles.smallInput]} />
                    <TextInput placeholder="--:-- --" style={[styles.input, styles.smallInput]} />
                </View>

                <ThemedText style={styles.mapHint}>Tap to pin the location on map (coming soon)</ThemedText>
                <View style={styles.mapPlaceholder}><ThemedText>Map preview</ThemedText></View>

                <ThemedText type="defaultSemiBold" style={styles.fieldLabel}>Additional Details</ThemedText>
                <TextInput placeholder="Describe the pet's behavior, any collar/tags, and how you found them..." style={[styles.input, styles.multiline]} multiline />

                <ThemedText type="defaultSemiBold" style={styles.fieldLabel}>Current Situation</ThemedText>
                <TouchableOpacity style={styles.selectInput}><ThemedText style={styles.selectText}>Where is the pet now?</ThemedText></TouchableOpacity>

                <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>Your Contact Information</ThemedText>
                <TextInput placeholder="Your Name" style={styles.input} />
                <TextInput placeholder="Phone Number" style={styles.input} keyboardType="phone-pad" />
                <TextInput placeholder="Your Email" style={styles.input} keyboardType="email-address" />

                <TouchableOpacity style={styles.submitButton} activeOpacity={0.9}>
                    <ThemedText style={styles.submitButtonText}>✈ Submit Found Pet Report</ThemedText>
                </TouchableOpacity>

            </ScrollView>
        </ThemedView>
    );
}
