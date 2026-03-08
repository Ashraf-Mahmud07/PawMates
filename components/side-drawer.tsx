import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef } from 'react';
import { Animated, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function SideDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const colorScheme = useColorScheme();
  const tint = Colors[colorScheme ?? 'light'].tint;
  const router = useRouter();
  const translateX = useRef(new Animated.Value(-1)).current; // -1 -> closed, 0 -> open

  useEffect(() => {
    Animated.timing(translateX, {
      toValue: open ? 0 : -1,
      duration: 260,
      useNativeDriver: true,
    }).start();
  }, [open, translateX]);

  // drawer width: 78% of screen width approximated by 320 px on narrow screens; we'll use 280 px
  const DRAWER_WIDTH = 300;

  const translateInterpolate = translateX.interpolate({
    inputRange: [-1, 0],
    outputRange: [-DRAWER_WIDTH, 0],
  });

  return (
    <>
      {/* overlay */}
      {open ? (
        <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose} />
      ) : null}

      <Animated.View
        pointerEvents={open ? 'auto' : 'none'}
        style={[
          styles.drawer,
          {
            width: DRAWER_WIDTH,
            transform: [{ translateX: translateInterpolate }],
            backgroundColor: Colors[colorScheme ?? 'light'].background,
          },
        ]}>
        <View style={styles.headerRow}>
          <TouchableOpacity style={[styles.backCircle, { backgroundColor: tint }]} onPress={onClose}>
            <IconSymbol name="chevron.right" size={18} color="#fff" style={{ transform: [{ rotate: '180deg' }] }} />
          </TouchableOpacity>
        </View>

        <View style={styles.profilesRow}>
          <View style={[styles.avatarWrap, { borderColor: tint }]}> 
            <Image source={{ uri: 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?q=80&w=400&auto=format&fit=crop&s=1' }} style={styles.avatar} />
          </View>
          <View style={[styles.avatarWrap, { borderColor: '#f3a33b', marginLeft: -12 }]}> 
            <Image source={{ uri: 'https://images.unsplash.com/photo-1517423440428-a5a00ad493e8?q=80&w=400&auto=format&fit=crop&s=1' }} style={styles.avatar} />
          </View>
        </View>

        <View style={styles.titleRow}>
          <Text style={[styles.titleText, { color: tint }]}>Minu</Text>
          <Text style={[styles.titleText, { color: '#f3a33b' }]}> & Ashraful</Text>
        </View>

        <View style={styles.divider} />

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => {
            onClose();
            router.push('/following');
          }}>
          <IconSymbol name="pawprint.fill" size={26} color={tint} />
          <ThemedText style={styles.menuLabel}>Followers</ThemedText>
        </TouchableOpacity>

        <View style={styles.divider} />

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => {
            onClose();
            router.push('/settings');
          }}>
          <IconSymbol name="gearshape.fill" size={26} color={tint} />
          <ThemedText style={styles.menuLabel}>Settings</ThemedText>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => {
            onClose();
            router.push('/help');
          }}>
          <IconSymbol name="questionmark.circle.fill" size={26} color={tint} />
          <ThemedText style={styles.menuLabel}>Help</ThemedText>
        </TouchableOpacity>

        <View style={{ flex: 1 }} />
      </Animated.View>
    </>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.25)',
  },
  drawer: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    paddingTop: 40,
    paddingHorizontal: 20,
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginBottom: 12,
  },
  backCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profilesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
    marginBottom: 10,
  },
  avatarWrap: {
    width: 88,
    height: 88,
    borderRadius: 44,
    borderWidth: 3,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 12,
  },
  titleText: {
    fontSize: 26,
    fontWeight: '700',
  },
  divider: {
    height: 1,
    backgroundColor: '#e6e6e6',
    marginVertical: 12,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
  },
  menuLabel: {
    fontSize: 18,
    marginLeft: 8,
  },
});
