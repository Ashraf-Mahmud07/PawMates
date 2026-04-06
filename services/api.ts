import axios from "axios";
import Constants from "expo-constants";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

function deriveBase() {
  try {
    const extra: any =
      (Constants as any).expoConfig?.extra ??
      (Constants as any).manifest?.extra ??
      {};
    const apiUrl =
      extra?.chatApiUrl || extra?.chatUrl || process.env.CHAT_API_URL;
    if (!apiUrl) return "";
    // if websocket URL provided, convert ws/wss -> http(s)
    let normalized = apiUrl
      .replace(/^ws:/i, "http:")
      .replace(/^wss:/i, "https:")
      .replace(/\/$/, "");

    // Developer convenience: when API points to localhost, mobile emulators
    // cannot reach host machine via 'localhost'. Remap to emulator host.
    try {
      const urlObj = new URL(normalized);
      const host = urlObj.hostname;
      if (
        (host === "localhost" || host === "127.0.0.1") &&
        Platform.OS === "android"
      ) {
        // Android emulator (AVD) maps 10.0.2.2 to host loopback
        urlObj.hostname = "192.168.10.152";
        normalized = urlObj.toString().replace(/\/$/, "");
        console.log(
          `api: remapped localhost -> ${normalized} for Android emulator`,
        );
      }
    } catch {
      // ignore URL parse errors and return normalized
    }

    return normalized;
  } catch {
    return "";
  }
}

export const API_BASE = deriveBase();

console.log("API_BASE derived as ->", API_BASE);

const client = axios.create({
  baseURL: API_BASE || undefined,
  headers: { "Content-Type": "application/json" },
});

// attach auth header before requests
client.interceptors.request.use(async (config) => {
  try {
    const token = await SecureStore.getItemAsync("pawmates_token");
    if (token && config.headers) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
  } catch {
    // ignore
  }
  return config;
});

export default client;
