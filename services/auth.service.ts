import * as SecureStore from "expo-secure-store";
import { API_BASE } from "./api";

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
  const url = `${API_BASE}/api/auth/register`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });
  if (!res.ok) {
    let errorBody = "";
    try {
      errorBody = await res.text();
    } catch {}
    throw new Error(`Register failed: ${res.status} ${errorBody}`);
  }
  const body = await res.json();
  if (body?.token) await saveToken(body.token);
  if (body?.user) await saveUser(body.user);
  return body;
}

export async function login(email: string, password: string) {
  console.log("Login API called with API_BASE=", email, password, API_BASE);
  if (!API_BASE)
    throw new Error(
      "API base URL is not configured. Set expo.extra.chatApiUrl or CHAT_API_URL environment variable.",
    );
  const url = `${API_BASE}/api/auth/login`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) {
    let errorBody = "";
    try {
      errorBody = await res.text();
    } catch {}
    throw new Error(`Login failed: ${res.status} ${errorBody}`);
  }
  const body = await res.json();
  if (body?.token) await saveToken(body.token);
  if (body?.user) await saveUser(body.user);
  return body;
}

export default {
  register,
  login,
  getToken,
  saveToken,
  clearToken,
  getUser,
};
