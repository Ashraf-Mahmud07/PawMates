import { Platform, StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    gap: 8,
  },
  headerInstagram: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  logoContainer: {
    flex: 1,
    alignItems: "center",
  },
  logo: {
    fontSize: 20,
    letterSpacing: 1,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  composer: {
    flex: 1,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  composerText: {
    color: "#999",
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  storiesWrap: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#eee",
    paddingVertical: 10,
  },
  stories: {
    paddingHorizontal: 12,
    alignItems: "center",
  },
  storyItem: {
    width: 72,
    alignItems: "center",
    marginRight: 12,
  },
  storyImage: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: "#ffbb00",
  },
  storyName: {
    marginTop: 6,
    fontSize: 12,
    width: 70,
    textAlign: "center",
  },
  feed: {
    paddingHorizontal: 12,
    paddingBottom: 20,
  },
  card: {
    borderRadius: 12,
    padding: 12,
    backgroundColor: "#fff",
    marginBottom: 12,
    // basic shadow
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
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
    color: "#4b2c83",
  },
  subtitle: {
    color: "#6b6b6b",
  },
  postImage: {
    width: "100%",
    height: 260,
    borderRadius: 6,
    marginBottom: 5,
    backgroundColor: "#ddd",
  },
  likes: {
    fontWeight: "600",
    marginTop: 6,
  },
  caption: {
    marginTop: 6,
    color: "#4b2c83",
  },
  time: {
    marginTop: 2,
    color: "#9aa0a6",
    fontSize: 12,
  },
  actionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  actionsRowInstagram: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  actionLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  actionLeftRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  actionIcon: {
    padding: 4,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  actionCount: {
    marginLeft: 6,
    fontSize: 13,
    color: "#444",
  },
  seeMore: {
    marginTop: 6,
  },
  seeMoreText: {
    fontSize: 13,
    fontWeight: "600",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  modalContainer: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    height: "75%",
    paddingBottom: Platform.OS === "ios" ? 24 : 12,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#eee",
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
    color: "#4b2c83",
  },
  commentText: {
    color: "#333",
  },
  commentRow: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  commentAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  commentMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  commentTime: {
    color: "#9aa0a6",
    fontSize: 12,
  },
  commentReply: {
    color: "#888",
    marginTop: 6,
  },
  commentRight: {
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8,
  },
  commentHeartCount: {
    fontSize: 12,
    color: "#888",
    marginTop: 4,
  },
  inputRow: {
    flexDirection: "row",
    padding: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#eee",
    alignItems: "center",
  },
  input: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: "#f2f2f2",
    marginRight: 8,
  },
  sendButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
});
