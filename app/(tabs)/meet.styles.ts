import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 8 },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 8,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: { textAlign: "center", fontSize: 22 },

  scroll: { paddingTop: 12, paddingBottom: 28 },
  card: {
    backgroundColor: "#f6f6f9",
    borderRadius: 20,
    padding: 12,
    marginBottom: 20,
  },
  cardHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  cardTitle: { fontSize: 22, marginLeft: 4 },
  pillsRow: { flexDirection: "row", alignItems: "center" },
  pill: {
    backgroundColor: "#efe8ff",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 18,
  },
  pillText: { color: "#7a4de8", fontWeight: "700" },

  imageWrap: {
    marginTop: 12,
    borderRadius: 14,
    overflow: "hidden",
    backgroundColor: "#ddd",
  },
  image: { width: "100%", height: 260 },

  rowBottom: { flexDirection: "row", alignItems: "center", marginTop: 12 },
  avatarWrapOuter: {
    width: 44,
    height: 44,
    borderRadius: 22,
    overflow: "hidden",
    borderWidth: 3,
    borderColor: "#fff",
    backgroundColor: "#fff",
    elevation: 2,
    shadowColor: "#000",
  },
  smallAvatar: { width: "100%", height: "100%" },
  nameText: { color: "#3a294b" },
  distanceText: { color: "#7a4de8", fontSize: 13 },
  locationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#7a4de8",
    marginRight: 6,
  },
});
