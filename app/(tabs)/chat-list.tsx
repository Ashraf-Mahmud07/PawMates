import { useSideDrawer } from '@/components/side-drawer-context';
import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useGetConversationsQuery } from '@/services/rtkApi';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { styles as indexStyles } from './index.styles';


type Conversation = {
  id: string;
  user: { id: string; name: string; avatar?: string };
  lastMessage: string;
  lastTimestamp: string;
  unread: number;
};

// const SAMPLE: Conversation[] = [
//   { id: 'c1', user: { id: 'u1', name: 'Alex Johnson' }, lastMessage: 'I found a little tabby near the store', lastTimestamp: new Date().toISOString(), unread: 2 },
//   { id: 'c2', user: { id: 'u2', name: 'Priya Shah' }, lastMessage: 'Thanks — that helped a lot!', lastTimestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(), unread: 0 },
//   { id: 'c3', user: { id: 'u3', name: 'Sam K.' }, lastMessage: "Let's meet tomorrow", lastTimestamp: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(), unread: 5 },
//   { id: 'c4', user: { id: 'u4', name: 'Dallas Kelso' }, lastMessage: 'See you tomorrow', lastTimestamp: new Date(Date.now() - 1500 * 60 * 60 * 6).toISOString(), unread: 3 },
// ];

export default function ChatListScreen({ data }: { data?: Conversation[] }) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [list, setList] = useState<Conversation[]>(data ?? []);
  const tint = Colors[colorScheme ?? 'light'].tint;
  const { openDrawer } = useSideDrawer();

  const { data: fetched, isLoading, isError, refetch } = useGetConversationsQuery();
  React.useEffect(() => {
    if (Array.isArray(fetched)) setList(fetched);
  }, [fetched]);

  // useEffect(() => {
  //   fetch("https://jsonplaceholder.typicode.com/posts/1")
  //     .then(res => res.json())
  //     .then(data => console.log(data))
  //     .catch(err => console.log(err));
  // }, []);


  const renderRow = ({ item }: { item: Conversation }) => {
    const initials = item.user.name
      .split(' ')
      .map(s => s[0])
      .slice(0, 2)
      .join('');

    return (
      <TouchableOpacity
        style={[styles.card, { backgroundColor: colorScheme === 'dark' ? '#111' : '#fff' }]}
        onPress={() =>
          router.push({
            pathname: '/chat',
            params: { conversationId: item.id, userId: item.user.id, userName: item.user.name },
          })
        }
        activeOpacity={0.8}
      >
        <View style={styles.avatarWrapper}>
          {item.user.avatar ? (
            <Image source={{ uri: item.user.avatar }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarInitial}>{initials}</Text>
            </View>
          )}

          {/* Online indicator */}
          <View style={styles.onlineDot} />
        </View>

        <View style={styles.body}>
          <View style={styles.topRow}>
            <Text style={[styles.name, { color: colors.text }]}>
              {item.user.name}
            </Text>

            <Text style={[styles.time, { color: colors.icon }]}>
              {formatTime(item.lastTimestamp)}
            </Text>
          </View>

          <View style={styles.bottomRow}>
            <Text
              style={[styles.message, { color: colorScheme === 'dark' ? '#bbb' : '#666' }]}
              numberOfLines={1}
            >
              {item.lastMessage}
            </Text>

            {item.unread > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{item.unread}</Text>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.background,
          paddingBottom: Math.max(insets.bottom, 12),
        },
      ]}
    >
      <View style={indexStyles.headerInstagram}>
        <TouchableOpacity style={indexStyles.iconButton} onPress={() => openDrawer()}>
          <IconSymbol name="line.horizontal.3" size={26} color={tint} />
        </TouchableOpacity>

        <View style={indexStyles.logoContainer}>
          <ThemedText type="defaultSemiBold" style={indexStyles.logo}>Chats</ThemedText>
        </View>

        <View style={indexStyles.iconButton} />
      </View>

      {/* Loading state */}
      {isLoading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={tint} />
          <Text style={[styles.loadingText, { color: colors.icon, marginTop: 12 }]}>Loading conversations…</Text>
        </View>
      ) : isError ? (
        <View style={styles.centered}>
          <Text style={[styles.emptyTitle, { color: colors.text }]}>Unable to load conversations</Text>
          <Text style={[styles.emptySubtitle, { color: colors.icon, marginTop: 6 }]}>There was a problem fetching your conversations. Check your connection and try again.</Text>
          <TouchableOpacity style={[styles.retryButton, { backgroundColor: tint }]} onPress={() => refetch()}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : /* Empty / not found state */ (list.length === 0) ? (
        <View style={styles.centered}>
          <IconSymbol name="bubble.left" size={48} color={tint} />
          <Text style={[styles.emptyTitle, { color: colors.text, marginTop: 12 }]}>No conversations yet</Text>
          <Text style={[styles.emptySubtitle, { color: colors.icon, marginTop: 6 }]}>Start a new chat or ask someone to message you.</Text>
          <TouchableOpacity style={[styles.retryButton, { backgroundColor: tint }]} onPress={() => refetch()}>
            <Text style={styles.retryText}>Refresh</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={list}
          keyExtractor={i => i.id}
          renderItem={renderRow}
          contentContainerStyle={{ padding: 12 }}
        />
      )}
      <View style={{ height: 60 }} />
    </View>
  );
}

function formatTime(iso?: string) {
  if (!iso) return '';
  try {
    return new Date(iso).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return iso;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },

  loadingText: {
    fontSize: 14,
    opacity: 0.9,
  },

  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
  },

  emptySubtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginHorizontal: 12,
  },

  retryButton: {
    marginTop: 12,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
  },

  retryText: {
    color: '#fff',
    fontWeight: '700',
  },

  card: {
    flexDirection: 'row',
    padding: 14,
    borderRadius: 14,
    marginBottom: 10,
    alignItems: 'center',
    elevation: 2,
  },

  avatarWrapper: {
    position: 'relative',
    marginRight: 12,
  },

  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },

  avatarPlaceholder: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#ff8a65',
    alignItems: 'center',
    justifyContent: 'center',
  },

  avatarInitial: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 18,
  },

  onlineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#4CAF50',
    position: 'absolute',
    bottom: 0,
    right: 0,
    borderWidth: 2,
    borderColor: '#fff',
  },

  body: {
    flex: 1,
  },

  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  name: {
    fontSize: 16,
    fontWeight: '700',
  },

  time: {
    fontSize: 12,
  },

  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
    alignItems: 'center',
  },

  message: {
    flex: 1,
    fontSize: 14,
    marginRight: 10,
  },

  badge: {
    backgroundColor: '#ff3b30',
    minWidth: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },

  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
});