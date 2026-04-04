import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';

export default function TypingIndicator({ visible = false, side = 'left' }: { visible?: boolean; side?: 'left' | 'right' }) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const dot1 = useRef(new Animated.Value(0.3)).current;
  const dot2 = useRef(new Animated.Value(0.3)).current;
  const dot3 = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    if (!visible) {
      dot1.setValue(0.3);
      dot2.setValue(0.3);
      dot3.setValue(0.3);
      return;
    }

    const a1 = Animated.loop(
      Animated.sequence([
        Animated.timing(dot1, { toValue: 1, duration: 400, useNativeDriver: true }),
        Animated.timing(dot1, { toValue: 0.3, duration: 400, useNativeDriver: true }),
      ])
    );
    const a2 = Animated.loop(
      Animated.sequence([
        Animated.delay(150),
        Animated.timing(dot2, { toValue: 1, duration: 400, useNativeDriver: true }),
        Animated.timing(dot2, { toValue: 0.3, duration: 400, useNativeDriver: true }),
      ])
    );
    const a3 = Animated.loop(
      Animated.sequence([
        Animated.delay(300),
        Animated.timing(dot3, { toValue: 1, duration: 400, useNativeDriver: true }),
        Animated.timing(dot3, { toValue: 0.3, duration: 400, useNativeDriver: true }),
      ])
    );

    a1.start();
    a2.start();
    a3.start();

    return () => {
      a1.stop();
      a2.stop();
      a3.stop();
    };
  }, [visible, dot1, dot2, dot3]);

  if (!visible) return null;

  const isRight = side === 'right';
  const bubbleStyle = [styles.bubble, { backgroundColor: isRight ? colors.tint : (colorScheme === 'dark' ? '#1f1f1f' : '#f1f1f1') } as any, isRight ? styles.bubbleRight : styles.bubbleLeft];

  return (
    <View style={[styles.container, isRight ? { alignItems: 'flex-end' } : { alignItems: 'flex-start' }]}>
      <View style={bubbleStyle}>
        <Animated.View style={[styles.dot, { opacity: dot1, backgroundColor: isRight ? '#fff' : '#6b6b6b' }]} />
        <Animated.View style={[styles.dot, { opacity: dot2, backgroundColor: isRight ? '#fff' : '#6b6b6b' }]} />
        <Animated.View style={[styles.dot, { opacity: dot3, backgroundColor: isRight ? '#fff' : '#6b6b6b' }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: 12, paddingVertical: 6 },
  bubble: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 18,
    maxWidth: '60%',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  bubbleLeft: {
    borderBottomLeftRadius: 4,
  },
  bubbleRight: {
    borderBottomRightRadius: 4,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    marginHorizontal: 3,
  },
});
