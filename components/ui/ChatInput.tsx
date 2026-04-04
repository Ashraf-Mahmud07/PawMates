import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import React from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function ChatInput({ value, onChangeText, onSend, placeholder = 'Type a message' }: {
  value: string;
  onChangeText: (t: string) => void;
  onSend: () => void;
  placeholder?: string;
}) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const inputBg = colorScheme === 'dark' ? '#1e1e1e' : '#fff';

  return (
    <View style={[styles.container, { backgroundColor: colors.background }] as any}>
      <TextInput
        style={[styles.input, { backgroundColor: inputBg, color: colors.text } as any]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.icon}
        multiline
      />
      <TouchableOpacity accessibilityRole="button" onPress={onSend} style={[styles.sendButton, { backgroundColor: colors.tint } as any]}>
        <Text style={styles.sendText}>Send</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'flex-end', paddingHorizontal: 12, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: '#e6e6e6' as any },
  input: { flex: 1, minHeight: 40, maxHeight: 140, borderRadius: 20, paddingHorizontal: 14, paddingVertical: 10, fontSize: 15, marginRight: 8 },
  sendButton: { paddingHorizontal: 14, paddingVertical: 10, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  sendText: { color: '#fff', fontWeight: '600' },
});
