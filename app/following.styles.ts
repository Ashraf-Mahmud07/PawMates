import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginTop: 8,
  },
  backCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#7a4de8",
    alignItems: "center",
    justifyContent: "center",
  },
  title: { marginLeft: 8 },

  searchContainer: {
    marginTop: 12,
    backgroundColor: "#f3f3f3",
    height: 52,
    borderRadius: 26,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  searchInput: {
    marginLeft: 12,
    color: "#7a4de8",
    fontSize: 18,
    flex: 1,
    padding: 0,
  },

  segmentRowTabs: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 18,
    paddingHorizontal: 2,
  },
  segmentTab: { paddingVertical: 8, paddingHorizontal: 12 },
  segmentLabel: { fontSize: 16, color: "#000" },
  segmentActiveText: {
    color: "#7a4de8",
    fontWeight: "700",
    borderBottomWidth: 3,
    borderBottomColor: "#7a4de8",
    paddingBottom: 8,
  },

  sectionHeader: { marginTop: 18, backgroundColor: "#f6f6f6", padding: 12 },
  sectionTitle: { fontSize: 16, fontWeight: "700" },

  listItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  avatarsRow: { flexDirection: "row", alignItems: "center", width: 84 },
  avatarWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 3,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
  avatar: { width: "100%", height: "100%" },
  profileName: { marginLeft: 12, flex: 1, color: "#3a294b" },
});
