import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  // page
  container: { flex: 1, padding: 16, backgroundColor: "#FBF9F7" },
  headerTop: { marginBottom: 12 },
  headerSubtitle: { color: "#7a7a7a", marginBottom: 12, lineHeight: 20 },

  // CTAs
  actionsRow: { flexDirection: "row", gap: 8 },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 14,
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  btnLost: { backgroundColor: "#FF6B5A" },
  btnFound: { backgroundColor: "#2DBE8C" },
  actionText: { color: "#fff", marginLeft: 10, fontWeight: "700" },
  actionEmoji: { fontSize: 16, color: "#fff" },

  // tabs
  segmentRow: {
    flexDirection: "row",
    marginVertical: 14,
    backgroundColor: "transparent",
  },
  segment: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "transparent",
    marginRight: 8,
    backgroundColor: "rgba(255,255,255,0.6)",
  },
  segmentActive: { backgroundColor: "#fff", borderColor: "rgba(0,0,0,0.06)" },
  segmentText: { color: "#7a7a7a" },
  segmentTextActive: { color: "#FF7A59", fontWeight: "800" },

  // list
  list: { paddingBottom: 100 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 8,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 5,
  },
  imageWrap: { position: "relative", backgroundColor: "#eee" },
  cardImage: { width: "100%", height: 200 },

  // badges
  pill: {
    position: "absolute",
    left: 12,
    top: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 18,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  pillText: { color: "#fff", fontWeight: "800" },
  pillLost: { backgroundColor: "#FF6B5A" },
  pillFound: { backgroundColor: "#FFB86B" },
  rewardPill: {
    position: "absolute",
    right: 12,
    bottom: 12,
    backgroundColor: "#FFB86B",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 18,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  rewardText: { color: "#fff", fontWeight: "700" },

  // body
  cardBody: { padding: 16 },
  cardTitle: { fontSize: 18, marginBottom: 6, fontWeight: "800" },
  cardMeta: { color: "#8a8a8a", marginBottom: 10 },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  locationRow: { flexDirection: "row", alignItems: "center" },
  locationEmoji: { marginRight: 8 },
  cardSmall: { color: "#9a9a9a", fontSize: 13 },
});
