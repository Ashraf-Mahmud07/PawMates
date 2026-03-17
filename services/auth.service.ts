import * as SecureStore from "expo-secure-store";
import client, { API_BASE } from "./api";

const TOKEN_KEY = "pawmates_token";
const USER_KEY = "pawmates_user";

let _tokenCache: string | null = null;
let _userCache: any = null;

export async function saveToken(token: string) {
  _tokenCache = token;
  await SecureStore.setItemAsync(TOKEN_KEY, token);
}

export async function getToken(): Promise<string | null> {
  if (_tokenCache) return _tokenCache;
  try {
    const t = await SecureStore.getItemAsync(TOKEN_KEY);
    _tokenCache = t;
    return t;
  } catch {
    return null;
  }
}

export async function clearToken() {
  _tokenCache = null;
  _userCache = null;
  await SecureStore.deleteItemAsync(TOKEN_KEY);
  await SecureStore.deleteItemAsync(USER_KEY);
}

export async function saveUser(user: any) {
  _userCache = user;
  try {
    await SecureStore.setItemAsync(USER_KEY, JSON.stringify(user));
  } catch {
    // ignore
  }
}

export async function getUser() {
  if (_userCache) return _userCache;
  try {
    const s = await SecureStore.getItemAsync(USER_KEY);
    if (!s) return null;
    _userCache = JSON.parse(s);
    return _userCache;
  } catch {
    return null;
  }
}

// Auth requests (use raw fetch so we avoid axios interceptor circularity)
export async function register(name: string, email: string, password: string) {
  if (!API_BASE)
    throw new Error(
      "API base URL is not configured. Set expo.extra.chatApiUrl or CHAT_API_URL environment variable.",
    );
  try {
    const res = await client.post("/api/auth/register", {
      name,
      email,
      password,
    });
    const body = res.data;
    if (body?.token) await saveToken(body.token);
    if (body?.user) await saveUser(body.user);
    return body;
  } catch (err: any) {
    const server =
      err?.response?.data ?? err?.response?.statusText ?? err?.message;
    console.error("Register error", { err, response: err?.response });
    throw new Error(`Register failed: ${server}`);
  }
}

export async function login(email: string, password: string) {
  console.log("Login API called with API_BASE=", API_BASE);
  if (!API_BASE)
    throw new Error(
      "API base URL is not configured. Set expo.extra.chatApiUrl or CHAT_API_URL environment variable.",
    );
  try {
    const res = await client.post("/api/auth/login", { email, password });
    const body = res.data;
    if (body?.token) await saveToken(body.token);
    if (body?.user) await saveUser(body.user);
    return body;
  } catch (err: any) {
    const server =
      err?.response?.data ?? err?.response?.statusText ?? err?.message;
    console.error("Login error", { err, response: err?.response });
    throw new Error(`Login failed: ${server}`);
  }
}

export default {
  register,
  login,
  getToken,
  saveToken,
  clearToken,
  getUser,
};
