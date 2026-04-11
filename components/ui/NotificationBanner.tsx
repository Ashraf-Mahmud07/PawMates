import { onInAppNotification } from '@/services/notification.service';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function NotificationBanner() {
  const [notification, setNotification] = useState<any | null>(null);
  const [visible, setVisible] = useState(false);
  const translate = useRef(new Animated.Value(-80)).current;
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const hide = () => {
    Animated.timing(translate, {
      toValue: -120,
      duration: 300,
      useNativeDriver: true,
    }).start(() => setVisible(false));
  };

  const show = (n: any) => {
    // clear any existing timer
    if (timerRef.current) clearTimeout(timerRef.current);

    // reset position before showing new notification
    translate.setValue(-120);
    setNotification(n);
    setVisible(true);

    Animated.timing(translate, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();

    timerRef.current = setTimeout(hide, 4000);
  };

  useEffect(() => {
    const unsub = onInAppNotification(show);
    return () => {
      unsub();
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  if (!visible || !notification) return null;

  const onPress = () => {
    hide();
    const { conversationId, userId, userName } = notification.data || {};
    if (conversationId) {
      router.push(
        `/chat?conversationId=${conversationId}&userId=${userId ?? ''}&userName=${encodeURIComponent(userName ?? '')}`
      );
    }
  };

  return (
    <Animated.View
      pointerEvents="box-none"
      style={[
        styles.wrapper,
        { transform: [{ translateY: translate }], paddingTop: insets.top + 8 },
      ]}
    >
      <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.9}>
        <View style={styles.body}>
          <Text style={styles.title}>{notification.title ?? 'Notification'}</Text>
          {notification.body ? (
            <Text style={styles.message} numberOfLines={2}>{notification.body}</Text>
          ) : null}
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    left: 12,
    right: 12,
    top: 0,
    zIndex: 9999,
  },
  container: {
    backgroundColor: '#111',
    borderRadius: 10,
    padding: 12,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 8,
  },
  body: {},
  title: { color: '#fff', fontWeight: '700', marginBottom: 4 },
  message: { color: '#eee', fontSize: 13 },
});