import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  imageWrap: {
    width: "100%",
    borderRadius: 14,
    overflow: "hidden",
    position: "relative",
    marginBottom: 14,
  },
  image: {
    width: "100%",
    height: 300,
    borderRadius: 14,
    backgroundColor: "#ddd",
  },
  badgeWrap: {
    position: "absolute",
    left: 14,
    top: 14,
    backgroundColor: "#1d9d74",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  badge: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 12,
  },
  favBtn: {
    position: "absolute",
    right: 12,
    top: 12,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.9)",
    alignItems: "center",
    justifyContent: "center",
  },
  petName: {
    marginTop: 4,
    marginBottom: 12,
    color: "#222",
  },
  cardGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    justifyContent: "space-between",
  },
  attrCard: {
    width: "48%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
    marginBottom: 12,
  },
  attrLabel: {
    color: "#9aa0a6",
    marginBottom: 6,
    fontSize: 12,
  },
  section: {
    marginTop: 12,
  },
  sectionTitle: {
    marginBottom: 8,
    fontSize: 18,
  },
  aboutText: {
    color: "#444",
    lineHeight: 20,
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginTop: 8,
  },
  textarea: {
    height: 100,
    textAlignVertical: "top",
  },
  submitBtn: {
    marginTop: 12,
    backgroundColor: "#f18b24",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  submitText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  moreCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    overflow: "hidden",
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
  },
  moreImage: {
    width: 120,
    height: 80,
    borderRadius: 8,
    backgroundColor: "#ddd",
  },
  moreMeta: {
    flex: 1,
    paddingHorizontal: 12,
  },
  moreSub: {
    color: "#888",
    marginTop: 6,
  },
  moreBadgeWrap: {
    marginLeft: 8,
  },
  moreBadge: {
    backgroundColor: "#f2f2f2",
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 12,
    color: "#666",
  },
});
