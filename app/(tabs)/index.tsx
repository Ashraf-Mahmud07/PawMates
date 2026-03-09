import { useSideDrawer } from '@/components/side-drawer-context';
import { Image } from 'expo-image';
import React, { useState } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const tint = Colors[colorScheme ?? 'light'].tint;
  const { openDrawer } = useSideDrawer();

  const [expandedMap, setExpandedMap] = useState<Record<string, boolean>>({});

  const isExpanded = (id: string) => !!expandedMap[id];
  const toggleExpanded = (id: string) => {
    setExpandedMap((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const [likedMap, setLikedMap] = useState<Record<string, boolean>>({});
  const isLiked = (id: string) => !!likedMap[id];
  const toggleLike = (id: string) => {
    setLikedMap((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Comments state and modal control
  const [commentModalVisible, setCommentModalVisible] = useState(false);
  const [activePostId, setActivePostId] = useState<string | null>(null);
  const [commentText, setCommentText] = useState('');

  // Seed some previous comments for demo purposes. These are additional to the `p.comments` count
  const INITIAL_COMMENTS: Record<string, { id: string; name: string; text: string; time: string }[]> = {
    p1: [
      { id: 'c-p1-1', name: 'Alex', text: 'So sweet! Thanks for helping these pups 🐶', time: '3h' },
      { id: 'c-p1-2', name: 'Lina', text: 'This made my day — such a lovely initiative.', time: '1d' },
    ],
    p2: [{ id: 'c-p2-1', name: 'Marco', text: 'Amazing shot!', time: '2h' }],
    p3: [],
    p4: [{ id: 'c-p4-1', name: 'Sara', text: 'I was there too — wonderful community.', time: '2d' }],
    p5: [],
    p6: [{ id: 'c-p6-1', name: 'Tom', text: 'Those streets are beautiful.', time: '4d' }],
  };

  const [commentsMap, setCommentsMap] = useState<Record<string, { id: string; name: string; text: string; time: string }[]>>(INITIAL_COMMENTS);

  const openComments = (postId: string) => {
    setActivePostId(postId);
    // ensure comments array exists
    setCommentsMap((prev) => (prev[postId] ? prev : { ...prev, [postId]: [] }));
    setCommentModalVisible(true);
  };

  const closeComments = () => {
    setCommentModalVisible(false);
    setActivePostId(null);
    setCommentText('');
  };

  const submitComment = () => {
    if (!activePostId || commentText.trim() === '') return;
    const newComment = {
      id: `${Date.now()}-${Math.random()}`,
      name: 'You',
      text: commentText.trim(),
      time: 'now',
    };
    // prepend new comment so it appears at the top
    setCommentsMap((prev) => ({ ...(prev || {}), [activePostId]: [newComment, ...(prev[activePostId] || [])] }));
    setCommentText('');
  };

  const STORIES = [
    { id: 's1', name: 'your story', uri: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=200' },
    { id: 's2', name: 'hania', uri: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200' },
    { id: 's3', name: 'yumi', uri: 'https://images.unsplash.com/photo-1545996124-1b3a44b5f9e4?q=80&w=200' },
    { id: 's4', name: 'monir', uri: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=200' },
    { id: 's5', name: 'amina', uri: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200' },
    { id: 's6', name: 'sam', uri: 'https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?q=80&w=200' },
  ];

  const POSTS = [
    {
      id: 'p1',
      name: 'Winnie',
      handle: 'monir_tanjil59',
      avatar: 'https://images.unsplash.com/photo-1507149833265-60c372daea22?q=80&w=400',
      image: 'https://images.unsplash.com/photo-1543852786-1cf6624b9987?q=80&w=1200',
      likes: 25,
      comments: 4,
      time: '19 hours ago',
      caption:
        "Spent the afternoon volunteering at the local shelter — these pups stole my heart. We set up play yards, distributed food, and found three new families ready to adopt. If you can, swing by this weekend and meet them. #adoptdontshop",
    },
    {
      id: 'p2',
      name: 'Copito',
      handle: 'copito',
      avatar: 'https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?q=80&w=400',
      image: 'https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?q=80&w=1200',
      likes: 12,
      comments: 2,
      time: '2h',
      caption:
        "Throwback to the first beach trip of the season — salt in the fur, wind in the ears, and the biggest smile. We built sandcastles, chased the tide, and met new friends. Can’t wait to go back!",
    },
    {
      id: 'p3',
      name: 'Rocio',
      handle: 'rocio',
      avatar: 'https://images.unsplash.com/photo-1545996124-1b3a44b5f9e4?q=80&w=400',
      image: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?q=80&w=1200',
      likes: 8,
      comments: 0,
      time: '1d',
      caption:
        "A quiet sunrise run this morning — the city still waking up, the soft glow on the park, and the rare moment of peace to reflect on the week. Small rituals, big impact.",
    },
    {
      id: 'p4',
      name: 'Amina',
      handle: 'amina',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=400',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1200',
      likes: 102,
      comments: 14,
      time: '3d',
      caption:
        "We celebrated a community garden opening today — volunteers, kids, and neighbors planted the first beds. It’s amazing what people can do together when they show up. If you’re nearby, come help water on weekends!",
    },
    {
      id: 'p5',
      name: 'Sam',
      handle: 'sam',
      avatar: 'https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?q=80&w=400',
      image: 'https://images.unsplash.com/photo-1504198266285-165c8be1d3f7?q=80&w=1200',
      likes: 3,
      comments: 1,
      time: '5h',
      caption:
        "Late night coding session fueled by coffee and determination. Finally shipped the feature after countless console.logs and small victories. On to the next one.",
    },
    {
      id: 'p6',
      name: 'Nora',
      handle: 'nora',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=400',
      image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=1200',
      likes: 47,
      comments: 9,
      time: '7d',
      caption:
        "Exploring the old town this weekend was a dream — cobblestone streets, hidden cafes, and stories around every corner. Took a thousand photos and left a piece of my heart there.",
    },
  ];

  return (
    <ThemedView style={styles.container}>
      <View style={styles.headerInstagram}>
        <TouchableOpacity style={styles.iconButton} onPress={() => openDrawer()}>
          <IconSymbol name="line.horizontal.3" size={26} color={tint} />
        </TouchableOpacity>

        <View style={styles.logoContainer}>
          <ThemedText type="defaultSemiBold" style={styles.logo}>Pawmates</ThemedText>
        </View>

        <View style={styles.iconButton} />
      </View>

      {/* Stories */}
      <View style={styles.storiesWrap}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.stories}>
          {STORIES.map((s) => (
            <View key={s.id} style={styles.storyItem}>
              <Image source={{ uri: s.uri }} style={styles.storyImage} />
              <ThemedText style={styles.storyName} numberOfLines={1}>{s.name}</ThemedText>
            </View>
          ))}
        </ScrollView>
      </View>

      {/* Feed generated from POSTS */}
      <ScrollView contentContainerStyle={styles.feed} showsVerticalScrollIndicator={false}>
        {POSTS.map((p) => (
          <ThemedView key={p.id} style={styles.card}>
            <View style={styles.cardHeader}>
              <Image source={{ uri: p.avatar }} style={styles.avatar} />
              <View style={{ flex: 1 }}>
                <ThemedText type="defaultSemiBold" style={styles.name}>{p.name}</ThemedText>
                <ThemedText style={styles.subtitle}>{p.handle}</ThemedText>
              </View>
              <TouchableOpacity>
                <IconSymbol name="chevron.right" size={22} color={Colors.light.icon} />
              </TouchableOpacity>
            </View>

            <Image source={{ uri: p.image }} style={styles.postImage} />

            <View style={styles.actionsRowInstagram}>
              <View style={styles.actionLeftRow}>
                <TouchableOpacity
                  style={styles.actionIcon}
                  accessibilityLabel="like"
                  onPress={() => toggleLike(p.id)}
                >
                  <IconSymbol
                    name="heart"
                    size={22}
                    color={isLiked(p.id) ? '#e0245e' : Colors.light.icon}
                  />
                  <ThemedText style={styles.actionCount}>{p.likes + (isLiked(p.id) ? 1 : 0)}</ThemedText>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.actionIcon, { marginLeft: 18 }]}
                  accessibilityLabel="comment"
                  onPress={() => openComments(p.id)}
                >
                  <IconSymbol name="bubble.left" size={22} color={Colors.light.icon} />
                  <ThemedText style={styles.actionCount}>{p.comments + (commentsMap[p.id]?.length || 0)}</ThemedText>
                </TouchableOpacity>
              </View>
            </View>

            <ThemedText
              style={styles.caption}
              numberOfLines={isExpanded(p.id) ? undefined : 2}
            >
              <ThemedText type="defaultSemiBold">{p.handle} </ThemedText>
              {p.caption}
            </ThemedText>

            <TouchableOpacity
              onPress={() => toggleExpanded(p.id)}
              accessibilityRole="button"
              style={styles.seeMore}
            >
              <ThemedText style={[styles.seeMoreText, { color: tint }]}> 
                {isExpanded(p.id) ? 'See less' : 'See more'}
              </ThemedText>
            </TouchableOpacity>

            <ThemedText style={styles.time}>{p.time}</ThemedText>
          </ThemedView>
        ))}
      </ScrollView>

        {/* Comments modal */}
        <Modal
          visible={commentModalVisible}
          animationType="slide"
          transparent
          onRequestClose={closeComments}
        >
          <View style={styles.modalOverlay}>
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              style={styles.modalContainer}
            >
              <View style={styles.modalHeader}>
                <ThemedText type="defaultSemiBold">Comments</ThemedText>
                <TouchableOpacity onPress={closeComments} style={{ padding: 6 }}>
                  <ThemedText style={{ color: tint }}>Close</ThemedText>
                </TouchableOpacity>
              </View>

              <View style={styles.commentsList}>
                <FlatList
                  data={activePostId ? commentsMap[activePostId] || [] : []}
                  extraData={commentsMap}
                  keyExtractor={(item) => item.id}
                  renderItem={({ item }) => {
                    const avatar = POSTS.find((pp) => pp.id === activePostId)?.avatar;
                    return (
                      <View style={styles.commentRow}>
                        <Image source={{ uri: avatar }} style={styles.commentAvatar} />
                        <View style={{ flex: 1 }}>
                          <View style={styles.commentMeta}>
                            <ThemedText type="defaultSemiBold" style={styles.commentAuthor}>{item.name}</ThemedText>
                            <ThemedText style={styles.commentTime}>{item.time}</ThemedText>
                          </View>
                          <ThemedText style={styles.commentText}>{item.text}</ThemedText>
                          <TouchableOpacity>
                            <ThemedText style={styles.commentReply}>Reply</ThemedText>
                          </TouchableOpacity>
                        </View>

                        <View style={styles.commentRight}>
                          <IconSymbol name="heart" size={18} color={Colors.light.icon} />
                          <ThemedText style={styles.commentHeartCount}>0</ThemedText>
                        </View>
                      </View>
                    );
                  }}
                  ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
                  ListEmptyComponent={<ThemedText style={{ color: '#888' }}>No comments yet — be the first!</ThemedText>}
                />
              </View>

              <View style={styles.inputRow}>
                <TextInput
                  value={commentText}
                  onChangeText={setCommentText}
                  placeholder="Add a comment..."
                  placeholderTextColor="#999"
                  style={styles.input}
                />
                <TouchableOpacity
                  onPress={submitComment}
                  style={[styles.sendButton, { backgroundColor: tint }]}
                  accessibilityRole="button"
                >
                  <ThemedText style={{ color: '#fff', fontWeight: '600' }}>Send</ThemedText>
                </TouchableOpacity>
              </View>
            </KeyboardAvoidingView>
          </View>
        </Modal>
        <View style={{ height: 60 }} />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    gap: 8,
  },
  headerInstagram: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  logoContainer: {
    flex: 1,
    alignItems: 'center',
  },
  logo: {
    fontSize: 20,
    letterSpacing: 1,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  composer: {
    flex: 1,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  composerText: {
    color: '#999',
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  storiesWrap: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#eee',
    paddingVertical: 10,
  },
  stories: {
    paddingHorizontal: 12,
    alignItems: 'center',
  },
  storyItem: {
    width: 72,
    alignItems: 'center',
    marginRight: 12,
  },
  storyImage: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: '#ffbb00',
  },
  storyName: {
    marginTop: 6,
    fontSize: 12,
    width: 70,
    textAlign: 'center',
  },
  feed: {
    paddingHorizontal: 12,
    paddingBottom: 20,
  },
  card: {
    borderRadius: 12,
    padding: 12,
    backgroundColor: '#fff',
    marginBottom: 12,
    // basic shadow
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 12,
  },
  name: {
    fontSize: 16,
    color: '#4b2c83',
  },
  subtitle: {
    color: '#6b6b6b',
  },
  postImage: {
    width: '100%',
    height: 260,
    borderRadius: 6,
    marginBottom: 5,
    backgroundColor: '#ddd',
  },
  likes: {
    fontWeight: '600',
    marginTop: 6,
  },
  caption: {
    marginTop: 6,
    color: '#4b2c83',
  },
  time: {
    marginTop: 2,
    color: '#9aa0a6',
    fontSize: 12,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  actionsRowInstagram: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  actionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionLeftRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionIcon: {
    padding: 4,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionCount: {
    marginLeft: 6,
    fontSize: 13,
    color: '#444',
  },
  seeMore: {
    marginTop: 6,
  },
  seeMoreText: {
    fontSize: 13,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    height: '75%',
    paddingBottom: Platform.OS === 'ios' ? 24 : 12,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#eee',
  },
  commentsList: {
    padding: 12,
    flex: 1,
  },
  commentItem: {
    marginBottom: 12,
  },
  commentAuthor: {
    fontSize: 14,
    color: '#4b2c83',
  },
  commentText: {
    color: '#333',
  },
  commentRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  commentAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  commentMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  commentTime: {
    color: '#9aa0a6',
    fontSize: 12,
  },
  commentReply: {
    color: '#888',
    marginTop: 6,
  },
  commentRight: {
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  commentHeartCount: {
    fontSize: 12,
    color: '#888',
    marginTop: 4,
  },
  inputRow: {
    flexDirection: 'row',
    padding: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#eee',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: '#f2f2f2',
    marginRight: 8,
  },
  sendButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
