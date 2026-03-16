import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export type Message = {
  id: string;
  text: string;
  timestamp?: string;
  senderId: 'me' | 'other';
};

export default function MessageBubble({ message }: { message: Message }) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const isMe = message.senderId === 'me';

  return (
    <View style={[styles.row, isMe ? styles.right : styles.left]}>
      <View
        style={[
          styles.bubble,
          isMe ? styles.bubbleRight : styles.bubbleLeft,
          (isMe ? { backgroundColor: colors.tint } : { backgroundColor: colorScheme === 'dark' ? '#1f1f1f' : '#fff' }) as any,
        ]}
      >
        <Text style={[styles.text, { color: isMe ? '#fff' : colors.text }]}>{message.text}</Text>
        <View style={styles.rowMeta}>
          <Text style={[styles.time, { color: isMe ? 'rgba(255,255,255,0.85)' : 'rgba(0,0,0,0.45)' }]}>{formatTime(message.timestamp)}</Text>
          {isMe ? (
            <MaterialIcons name="done-all" size={14} color={colorScheme === 'dark' ? 'rgba(255,255,255,0.85)' : '#fff'} style={{ marginLeft: 6 }} />
          ) : null}
        </View>
      </View>
    </View>
  );
}

function formatTime(iso?: string) {
  if (!iso) return '';
  try {
    const d = new Date(iso);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } catch {
    return iso;
  }
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', marginVertical: 6 },
  left: { justifyContent: 'flex-start' },
  right: { justifyContent: 'flex-end' },
  bubble: {
    maxWidth: '78%',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  bubbleLeft: { borderBottomLeftRadius: 4, borderBottomRightRadius: 16 },
  bubbleRight: { borderBottomRightRadius: 4, borderBottomLeftRadius: 16 },
  text: { fontSize: 15, lineHeight: 20, marginBottom: 6 },
  time: { fontSize: 11, textAlign: 'right' },
  rowMeta: { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' },
});
