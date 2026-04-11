import { styles } from '@/components/styles/chat.style';
import ChatInput from '@/components/ui/ChatInput';
import { IconSymbol } from '@/components/ui/icon-symbol.ios';
import MessageBubble from '@/components/ui/MessageBubble';
import TypingIndicator from '@/components/ui/TypingIndicator';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { listenMessages } from '@/services/chat.service';
import { useGetMessagesQuery, useSendMessageMutation } from '@/services/rtkApi';
import { Message } from '@/types/chat.type';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { FlatList, KeyboardAvoidingView, Platform, Text, TouchableOpacity, View } from 'react-native';


export default function ChatScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [input, setInput] = useState('');
  const flatListRef = useRef<FlatList>(null);
  const params = useLocalSearchParams();
  const conversationId = (params?.conversationId as string) ?? '';
  const userName = (params?.userName as string) ?? '';
  const insets = { top: Platform.OS === 'ios' ? 44 : 16 } as any;
  const [currentUserId, setCurrentUserId] = useState<string>('');


  const { data: messageData } = useGetMessagesQuery(conversationId, {
    skip: !conversationId,
  });

  const [socketMessages, setSocketMessages] = useState<Message[]>([]);

  // Combine RTK + socket messages, deduplicated by _id
  const messages = React.useMemo(() => {
    const map = new Map<string, Message>();
    const safe = (arr: any) => (Array.isArray(arr) ? arr : []);
    const fetchedMessages = Array.isArray(messageData)
      ? messageData
      : (messageData as any)?.messages ?? [];

    [...safe(fetchedMessages), ...safe(socketMessages)].forEach(m => {
      if (m?._id) map.set(m._id, m);
    });

    return Array.from(map.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [messageData, socketMessages]);


  const [sendMessageApi] = useSendMessageMutation();

  useEffect(() => {
    const unsub = listenMessages((incoming: any) => {
      if (!incoming || incoming.conversationId !== conversationId) return;

      const newMsg: Message = {
        _id: incoming._id,
        senderId: incoming.senderId,
        receiverId: incoming.receiverId,
        conversationId: incoming.conversationId,
        message: incoming.message,
        messageType: incoming.messageType,
        isRead: false,
        createdAt: incoming.createdAt ?? new Date().toISOString(),
        updatedAt: incoming.updatedAt ?? new Date().toISOString(),
        __v: 0,
      };

      setSocketMessages(prev => [...prev, newMsg]);
    });

    return unsub;
  }, [conversationId]);

  useEffect(() => {
    (async () => {
      const { getUser } = await import('@/services/auth.service');
      const user = await getUser();
      setCurrentUserId(user?._id ?? user?.id);
    })();
  }, []);

  const handleSendMessage = async () => {
    if (!input.trim()) return;
    const text = input.trim();
    setInput('');

    try {
      await sendMessageApi({
        receiverId: params?.userId as string,
        message: text,
        messageType: 'text',
        conversationId,
      }).unwrap();
    } catch (err) {
      console.error('Send failed', err);
    }
  };

  const renderMessage = ({ item }: { item: Message }) => (
    <MessageBubble message={item} currentUserId={currentUserId} />
  );

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
          <TouchableOpacity style={styles.iconButton} onPress={() => { }}>
            <MaterialIcons name="videocam" size={22} color={colors.icon} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton} onPress={() => { }}>
            <MaterialIcons name="call" size={20} color={colors.icon} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton} onPress={() => { }}>
            <IconSymbol name="ellipsis" size={20} color={colors.icon} />
          </TouchableOpacity>
        </View>
      </View>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }} keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 70}>
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item, index) => item?._id ?? String(index)}
          renderItem={renderMessage}
          contentContainerStyle={{ padding: 12, paddingBottom: 16 }}
          inverted
        />

        <TypingIndicator visible={false} />
        <ChatInput value={input} onChangeText={setInput} onSend={handleSendMessage} />
      </KeyboardAvoidingView>
      <View style={{ height: 10 }} />
    </View>
  );
}

