import { useSideDrawer } from '@/components/side-drawer-context';
import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { API_BASE } from '@/services/api';
import { getToken, getUser } from '@/services/auth.service';
import Constants from 'expo-constants';
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

export default function ChatListScreen({ data }: { data?: Conversation[] }) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [list, setList] = useState<Conversation[]>(data ?? []);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [otherUsers, setOtherUsers] = useState<any[]>([]);
  const [usersLoading, setUsersLoading] = useState<boolean>(false);
  const [creatingConvFor, setCreatingConvFor] = useState<string | null>(null);
  const tint = Colors[colorScheme ?? 'light'].tint;
  const { openDrawer } = useSideDrawer();

  const fetchUsers = React.useCallback(async () => {
    setUsersLoading(true);
    try {
      const token = await getToken();
      const current = await getUser();
      const base = (API_BASE || '').replace(/\/$/, '') || (() => {
        const extra: any = (Constants as any).expoConfig?.extra ?? (Constants as any).manifest?.extra ?? {};
        return (extra?.chatApiUrl as string) || (extra?.chatUrl as string) || (process.env.CHAT_API_URL as string) || '';
      })();
      if (!base) throw new Error('API base URL is not configured (set expo.extra.chatApiUrl or CHAT_API_URL)');
      const baseNormalized = base.replace(/\/$/, '').replace(/\/api\/?$/, '');
      const url = baseNormalized + '/api/users';
      console.log('Fetching users URL:', url);
      const r = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      // parse JSON only when content-type indicates JSON
      const ct = r.headers.get('content-type') || '';
      let body: any = null;
      if (ct.includes('application/json')) {
        try { body = await r.json(); } catch { throw new Error('Invalid JSON response from users endpoint'); }
      } else {
        const text = await r.text();
        if (!r.ok) throw new Error(text || `Fetch users failed (${r.status})`);
        body = [];
      }
      if (!r.ok) throw new Error(body?.message || `Fetch users failed (${r.status})`);
      if (Array.isArray(body)) {
        console.log('Users response length:', body.length);
        console.log('Current user object:', current);
        console.log('Sample user from response:', body[0]);
        // Try common id fields: id, _id, uid, userId
        const currentId = current?.id ?? current?._id ?? current?.uid ?? current?.userId ?? null;
        console.log('Derived currentId used for filtering:', currentId);
        const others = body.filter((u: any) => {
          const uid = u?.id ?? u?._id ?? u?.uid ?? u?.userId ?? null;
          return uid !== currentId;
        });
        console.log('Other users after filtering current user:', others.length);
        setOtherUsers(others);
      } else {
        console.log('Users response was not an array, setting otherUsers to []');
        setOtherUsers([]);
      }
    } catch (err) {
      console.error('Failed to fetch users', err);
      setOtherUsers([]);
    } finally {
      setUsersLoading(false);
    }
  }, []);

  const refetch = React.useCallback(async () => {
    setIsError(false);
    setIsLoading(true);
    try {
      const token = await getToken();
      const base = (API_BASE || '').replace(/\/$/, '') || (() => {
        const extra: any = (Constants as any).expoConfig?.extra ?? (Constants as any).manifest?.extra ?? {};
        return (extra?.chatApiUrl as string) || (extra?.chatUrl as string) || (process.env.CHAT_API_URL as string) || '';
      })();
      if (!base) throw new Error('API base URL is not configured (set expo.extra.chatApiUrl or CHAT_API_URL)');
      const baseNormalized = base.replace(/\/$/, '').replace(/\/api\/?$/, '');
      const url = baseNormalized + '/api/chat/conversations';
      console.log('Fetching conversations URL:', url);
      const r = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      const ct = r.headers.get('content-type') || '';
      let body: any = null;
      if (ct.includes('application/json')) {
        try { body = await r.json(); } catch { throw new Error('Invalid JSON response from conversations endpoint'); }
      } else {
        const text = await r.text();
        if (!r.ok) throw new Error(text || `Fetch failed (${r.status})`);
        body = [];
      }
      if (!r.ok) throw new Error(body?.message || `Fetch failed (${r.status})`);
      if (Array.isArray(body)) setList(body as Conversation[]);
      else setList([]);
      // if empty, fetch users for starting new conversations
      if (!Array.isArray(body) || (Array.isArray(body) && body.length === 0)) {
        // fetch users list (excluding logged-in user)
        console.log('Conversations empty — fetching users to start new conversations');
        await fetchUsers();
      }
      console.log('Conversations response length:', Array.isArray(body) ? body.length : 0);
    } catch (err) {
      console.error('Failed to fetch conversations', err);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  }, [fetchUsers]);



  const createConversation = React.useCallback(async (userId: string, userName?: string) => {
    setCreatingConvFor(userId);
    try {
      const token = await getToken();
      const base = (API_BASE || '').replace(/\/$/, '') || (() => {
        const extra: any = (Constants as any).expoConfig?.extra ?? (Constants as any).manifest?.extra ?? {};
        return (extra?.chatApiUrl as string) || (extra?.chatUrl as string) || (process.env.CHAT_API_URL as string) || '';
      })();
      if (!base) throw new Error('API base URL is not configured (set expo.extra.chatApiUrl or CHAT_API_URL)');
      const baseNormalized = base.replace(/\/$/, '').replace(/\/api\/?$/, '');
      // Try several possible endpoints (some backends expose different routes)
      const tryEndpoints = [
        '/api/chat/conversations',
        '/api/chat/conversation',
        '/api/conversations',
      ];

      let conv: any = null;
      let lastErr: any = null;

      const tryPost = async (endpoint: string, bodyObj: any) => {
        const url = baseNormalized + endpoint;
        console.log('Trying POST', url, bodyObj);
        const r = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify(bodyObj),
        });
        const ct = r.headers.get('content-type') || '';
        let parsed: any = null;
        if (ct.includes('application/json')) {
          try { parsed = await r.json(); } catch { throw new Error('Invalid JSON'); }
        } else {
          parsed = await r.text();
        }
        if (!r.ok) throw parsed || new Error(`Request failed (${r.status})`);
        return parsed;
      };

      // First try the standard conversations endpoints with several common body shapes
      const bodyVariants = [
        { userId },
        { recipientId: userId },
        { participantId: userId },
        { withUserId: userId },
        { members: [userId] },
        { participants: [userId] },
        { to: userId },
      ];

  console.log('Has token for createConversation:', !!token);
  for (const ep of tryEndpoints) {
        for (const bodyVariant of bodyVariants) {
          try {
            const res = await tryPost(ep, bodyVariant);
            if (res) { conv = res; break; }
          } catch (err) {
            console.log('Endpoint', ep, 'with body', bodyVariant, 'failed:', err);
            lastErr = err;
          }
        }
        if (conv) break;
      }

      // Fallback: try creating a conversation by sending an initial message or different bodies to message endpoint
      if (!conv) {
        // Use a non-empty starter message for backends that require a message body to create a conversation
        const starterText = 'Hi — starting a chat';
        const messageBodies = [
          { userId, text: starterText },
          { recipientId: userId, text: starterText },
          { participantId: userId, text: starterText },
          { withUserId: userId, text: starterText },
        ];
        for (const mb of messageBodies) {
          try {
            const res = await tryPost('/api/chat/messages', mb);
            conv = res?.conversation ?? res?.conversationId ?? res;
            if (conv) break;
          } catch (err) {
            console.log('Fallback POST /api/chat/messages with', mb, 'failed:', err);
            lastErr = err;
          }
        }
      }

      if (!conv) throw lastErr || new Error('Create conversation failed');

      // Normalize conversation id from _id, id, conversationId
      const conversationIdResp = conv?.id ?? conv?._id ?? conv?.conversationId ?? conv?._conversationId ?? null;
      if (conversationIdResp) {
        router.push({ pathname: '/chat', params: { conversationId: conversationIdResp, userId, userName } });
      } else {
        // fallback: go to chat with userId only (chat screen will seed)
        router.push({ pathname: '/chat', params: { conversationId: '', userId, userName } } as any);
      }
    } catch (err) {
      console.error('Failed to create conversation', err);
    } finally {
      setCreatingConvFor(null);
    }
  }, [router]);

  React.useEffect(() => {
    // load conversations on mount
    let mounted = true;
    (async () => {
      if (!mounted) return;
      await refetch();
    })();
    return () => { mounted = false; };
  }, [refetch]);

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

          {/* Users list to start new conversation (vertical list) */}
          {usersLoading ? (
            <ActivityIndicator style={{ marginTop: 12 }} />
          ) : otherUsers && otherUsers.length > 0 ? (
            <View style={{ width: '100%', marginTop: 12 }}>
              {otherUsers.map(u => {
                const uid = u?.id ?? u?._id ?? u?.uid ?? u?.userId ?? null;
                return (
                  <TouchableOpacity
                    key={uid ?? u.name}
                    style={[styles.card, { marginBottom: 8 }]}
                    onPress={() => createConversation(uid, u.name)}
                    activeOpacity={0.8}
                  >
                    <View style={styles.avatarWrapper}>
                      {creatingConvFor === uid ? (
                        <ActivityIndicator style={{ width: 56, height: 56 }} />
                      ) : u.avatar ? (
                        <Image source={{ uri: u.avatar }} style={styles.avatar} />
                      ) : (
                        <View style={styles.avatarPlaceholder}>
                          <Text style={styles.avatarInitial}>{(u.name || '').split(' ').map((s: string) => s[0]).slice(0,2).join('')}</Text>
                        </View>
                      )}
                    </View>

                    <View style={styles.body}>
                      <Text style={[styles.name, { color: colors.text }]}>{u.name}</Text>
                      {u.email ? <Text style={{ color: colors.icon, marginTop: 4 }}>{u.email}</Text> : null}
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          ) : null}
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
  usersRow: { marginTop: 16, flexDirection: 'row', flexWrap: 'nowrap' },
  userItem: { width: 80, alignItems: 'center', marginRight: 12 },
  userAvatarSmall: { width: 48, height: 48, borderRadius: 24 },
  userAvatarSmallPlaceholder: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#7a4de8', alignItems: 'center', justifyContent: 'center' },
  userNameSmall: { marginTop: 6, fontSize: 12, textAlign: 'center' },
});