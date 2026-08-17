"use client";

export function getStoredData<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const stored = localStorage.getItem(key);
    if (stored) return JSON.parse(stored);
  } catch {}
  return fallback;
}

export function setStoredData<T>(key: string, data: T): void {
  localStorage.setItem(key, JSON.stringify(data));
}
