"use client";

export default function useStorage() {
  /**
   * Parses a JSON string into an object of type T, with error handling for invalid or undefined JSON.
   * @template T The type of the object to be returned.
   * @param {string | null} value - The JSON string to be parsed.
   * @returns {T | undefined} The parsed object of type T, or undefined if parsing fails.
   */
  const parseJSON = <T>(value: string | null): T | undefined => {
    try {
      return value === "undefined" ? undefined : JSON.parse(value ?? "");
    } catch {
      return undefined;
    }
  };

  /**
   * Stores a value in sessionStorage under the specified key.
   * @template T The type of the value to be stored.
   * @param {string} key - The key under which the value will be stored.
   * @param {T} value - The value to store in sessionStorage.
   */
  const setSessionStorage = <T>(key: string, value: T): void => {
    if (typeof window !== "undefined") {
      window.sessionStorage.setItem(key, JSON.stringify(value));
    }
  };

  /**
   * Stores a value in localStorage under the specified key.
   * @template T The type of the value to be stored.
   * @param {string} key - The key under which the value will be stored.
   * @param {T} value - The value to store in localStorage.
   */
  const setLocalStorage = <T>(key: string, value: T): void => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(key, JSON.stringify(value));
    }
  };

  /**
   * Retrieves and parses a value from sessionStorage by its key.
   * @template T The expected type of the returned value.
   * @param {string} key - The key of the value to retrieve.
   * @returns {T | null} The parsed value from sessionStorage, or null if the key does not exist.
   */
  const getSessionStorage = <T>(key: string): T | null => {
    if (typeof window !== "undefined") {
      const value = window.sessionStorage.getItem(key);
      try {
        if (value) {
          return parseJSON(value);
        }
        return value as unknown as T;
      } finally {
      }
      return value as unknown as T;
    }
    return null;
  };

  /**
   * Retrieves and parses a value from localStorage by its key.
   * @template T The expected type of the returned value.
   * @param {string} key - The key of the value to retrieve.
   * @returns {T | null} The parsed value from localStorage, or null if the key does not exist.
   */
  const getLocalStorage = <T>(key: string): T | null => {
    if (typeof window !== "undefined") {
      const value = window.localStorage.getItem(key);
      try {
        if (value) {
          return parseJSON(value);
        }
        return value as unknown as T;
      } finally {
      }
      return value as unknown as T;
    }
    return null;
  };

  /**
   * Removes an item from sessionStorage by its key.
   * @param {string} key - The key of the item to remove.
   */
  const removeSessionStorage = (key: string): void => {
    if (typeof window !== "undefined") {
      window.sessionStorage.removeItem(key);
    }
  };

  /**
   * Removes an item from localStorage by its key.
   * @param {string} key - The key of the item to remove.
   */
  const removeLocalStorage = (key: string): void => {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(key);
    }
  };

  /**
   * Clears all items from sessionStorage.
   */
  const clearAllSessionStorage = (): void => {
    if (typeof window !== "undefined") {
      window.sessionStorage.clear();
    }
  };

  /**
   * Clears all items from localStorage.
   */
  const clearAllLocalStorage = (): void => {
    if (typeof window !== "undefined") {
      window.localStorage.clear();
    }
  };

  return {
    setLocalStorage,
    setSessionStorage,
    getSessionStorage,
    getLocalStorage,
    removeSessionStorage,
    removeLocalStorage,
    clearAllSessionStorage,
    clearAllLocalStorage,
  };
}
