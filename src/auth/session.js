// src/auth/session.js
import AsyncStorage from '@react-native-async-storage/async-storage';
const GUEST_KEY = '@prox:guest_session';

export async function startGuestSession() {
  const guest = { id: `guest-${Date.now()}`, guest: true };
  await AsyncStorage.setItem(GUEST_KEY, JSON.stringify(guest));
  return guest;
}

export async function getGuestSession() {
  const raw = await AsyncStorage.getItem(GUEST_KEY);
  return raw ? JSON.parse(raw) : null;
}

export async function endGuestSession() {
  await AsyncStorage.removeItem(GUEST_KEY);
}
