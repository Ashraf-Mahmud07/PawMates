import { Tabs } from 'expo-router';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

function TabIcon({ name, focused, color, size }: { name: any; focused: boolean; color: string; size?: number }) {
  const iconSize = focused ? (size ?? 30) : (size ?? 24);
  return (
    <View style={styles.iconContainer} accessible accessibilityRole="button">
      <IconSymbol name={name} size={iconSize} color={color} />
      {focused ? <View style={[styles.igIndicator, { backgroundColor: color }]} /> : null}
    </View>
  );
}

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarButton: HapticTab,
        tabBarStyle: {
          position: 'absolute',
          left: 12,
          right: 12,
          bottom: 12,
          backgroundColor: colors.background,
          borderRadius: 40,
          height: 64,
          paddingTop: 8,
          paddingBottom: Math.max(12, insets.bottom),
          shadowColor: '#000',
          shadowOpacity: 0.06,
          shadowRadius: 8,
          shadowOffset: { width: 0, height: 6 },
          elevation: 6,
        },
      }}>

      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name="house.fill" focused={!!focused} color={focused ? colors.tint : colors.icon} />
          ),
        }}
      />

      <Tabs.Screen
        name="adopt"
        options={{
          title: 'Adopt',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name="heart.fill" focused={!!focused} color={focused ? colors.tint : colors.icon} />
          ),
        }}
      />
      <Tabs.Screen
        name="lost"
        options={{
          title: 'Lost & Found',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name="magnifyingglass" focused={!!focused} color={focused ? colors.tint : colors.icon} />
          ),
        }}
      />
      <Tabs.Screen
        name="meet"
        options={{
          title: 'Meet',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name="sportscourt" focused={!!focused} color={focused ? colors.tint : colors.icon} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name="person.crop.circle" focused={!!focused} color={focused ? colors.tint : colors.icon} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  igIndicator: {
    marginTop: 6,
    height: 3,
    width: 30,
    borderRadius: 2,
  },
});
