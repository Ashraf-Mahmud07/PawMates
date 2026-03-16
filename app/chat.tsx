// themed-text not required here
import ChatInput from '@/components/ui/ChatInput';
import { IconSymbol } from '@/components/ui/icon-symbol';
import MessageBubble from '@/components/ui/MessageBubble';
import TypingIndicator from '@/components/ui/TypingIndicator';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { emitMessage, listenMessages } from '@/services/chat.service';
import { MaterialIcons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { FlatList, KeyboardAvoidingView, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// useSafeAreaInsets not needed here; ChatInput handles safe area internally

type Message = {
  id: string;
  text: string;
  timestamp: string; // ISO
  senderId: 'me' | 'other';
};

export default function ChatScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  // safe area inset currently unused; ChatInput handles its own spacing

  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', text: 'Hey there! Have you seen a tabby near the park?', timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(), senderId: 'other' },
    { id: '2', text: 'Not yet — I will keep an eye out.', timestamp: new Date(Date.now() - 1000 * 60 * 50).toISOString(), senderId: 'me' },
    { id: '3', text: "Thanks — I'll share a photo if I spot anything.", timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(), senderId: 'other' },
  ]);

  const flatListRef = useRef<FlatList>(null);
  const params = useLocalSearchParams();
  const conversationId = (params?.conversationId as string) ?? '';
  const userName = (params?.userName as string) ?? '';
  const insets = { top: Platform.OS === 'ios' ? 44 : 16 } as any;

  useEffect(() => {
    // register socket message listener
    const unsub = listenMessages((incoming: any) => {
      if (!incoming) return;
      if (conversationId && incoming.conversationId && incoming.conversationId !== conversationId) return;
      const newMsg: Message = {
        id: incoming.id ?? Date.now().toString(),
        text: incoming.text,
        timestamp: incoming.timestamp ?? new Date().toISOString(),
        senderId: incoming.senderId === 'me' ? 'me' : 'other',
      };
      setMessages(prev => [...prev, newMsg]);
    });
    return unsub;
  }, [conversationId]);

  // If conversationId changes, optionally seed messages for demo purpose
  useEffect(() => {
    if (!conversationId) return;
    // simple demo: replace messages with a sample for this conversation
    const seeded: Message[] = [
      { id: `${conversationId}-1`, text: `Welcome to conversation ${conversationId}`, timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), senderId: 'other' },
      { id: `${conversationId}-2`, text: 'This is a demo thread. Say hi!', timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(), senderId: 'me' },
    ];
    setMessages(seeded);
  }, [conversationId]);

  useEffect(() => {
    // scroll to end when messages change
    // small timeout lets layout finish
    const t = setTimeout(() => {
      try {
        // scrollToEnd exists on the underlying scroll responder
        (flatListRef.current as any)?.scrollToEnd?.({ animated: true });
      } catch {
        // ignore
      }
    }, 100);
    return () => clearTimeout(t);
  }, [messages]);

  const sendMessage = () => {
    if (!input.trim()) return;
    const newMsg: Message = {
      id: Date.now().toString(),
      text: input.trim(),
      timestamp: new Date().toISOString(),
      senderId: 'me',
    };
    setMessages(prev => [...prev, newMsg]);
    // emit via chat service for future socket hookup
    try {
      emitMessage(conversationId ?? 'default', newMsg.text);
    } catch {
      // ignore if socket not connected
    }
    setInput('');
  };

  // submit via ChatInput's send button; inline submit handler removed

  const renderMessage = ({ item }: { item: Message }) => {
    return <MessageBubble message={item} />;
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={[styles.header, { paddingTop: insets.top, backgroundColor: colors.background }]}>
        <View style={styles.headerLeftRow}>
          <TouchableOpacity onPress={() => router.back()} style={styles.headerBack}>
            <IconSymbol name="chevron.right" size={24} color={colors.icon} style={{ transform: [{ rotate: '180deg' }] }} />
          </TouchableOpacity>
          <View style={styles.headerAvatar}>{userName ? <Text style={styles.headerInitial}>{userName[0]}</Text> : null}</View>
          <View style={{ marginLeft: 10 }}>
            <Text style={[styles.headerTitle, { color: colors.text }]} numberOfLines={1}>{userName || 'Chat'}</Text>
            <Text style={[styles.headerSubtitle, { color: colors.icon }]}>last seen today at 12:34</Text>
          </View>
        </View>

        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.iconButton} onPress={() => {}}>
            <MaterialIcons name="videocam" size={22} color={colors.icon} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton} onPress={() => {}}>
            <MaterialIcons name="call" size={20} color={colors.icon} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton} onPress={() => {}}>
            <IconSymbol name="ellipsis" size={20} color={colors.icon} />
          </TouchableOpacity>
        </View>
      </View>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }} keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 70}>
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={item => item.id}
          renderItem={renderMessage}
          contentContainerStyle={{ padding: 12, paddingBottom: 16 }}
        />

        <TypingIndicator visible={false} />
        <ChatInput value={input} onChangeText={setInput} onSend={sendMessage} />
      </KeyboardAvoidingView>
      <View style={{ height: 10 }} />
    </View>
  );
}

// formatTime moved to MessageBubble component

const styles = StyleSheet.create({
  container: { flex: 1 },
  messageRow: { flexDirection: 'row', marginVertical: 6 },
  messageRowLeft: { justifyContent: 'flex-start' },
  messageRowRight: { justifyContent: 'flex-end' },
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
  bubbleLeft: {
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 16,
  },
  bubbleRight: {
    borderBottomRightRadius: 4,
    borderBottomLeftRadius: 16,
  },
  messageText: { fontSize: 15, lineHeight: 20, marginBottom: 6 },
  timestamp: { fontSize: 11, textAlign: 'right' },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#e6e6e6',
  },
  input: {
    flex: 1,
    minHeight: 40,
    maxHeight: 140,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 15,
    marginRight: 8,
  },
  sendButton: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendText: { color: '#fff', fontWeight: '600' },
  header: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e6e6e6',
  },
  headerLeftRow: { flexDirection: 'row', alignItems: 'center' },
  headerBack: { padding: 6, marginRight: 6 },
  headerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#cfcfcf',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerInitial: { color: '#fff', fontWeight: '700' },
  headerTitle: { fontSize: 16, fontWeight: '600' },
  headerSubtitle: { fontSize: 12, marginTop: 2 },
  headerActions: { flexDirection: 'row', alignItems: 'center' },
  iconButton: { padding: 8, marginLeft: 6 },
});
