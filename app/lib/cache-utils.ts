const CACHE_EXPIRY = 5 * 60 * 1000;

export function setCache<T>(key: string, data: T): void {
  try {
    const cacheItem = {
      data,
      timestamp: Date.now(),
    };
    localStorage.setItem(`cache_${key}`, JSON.stringify(cacheItem));
  } catch (error) {
    console.error("Nepavyko išsaugoti duomenų į cache:", error);
  }
}

export function getCache<T>(key: string): T | null {
  try {
    const cachedData = localStorage.getItem(`cache_${key}`);
    if (!cachedData) return null;

    const { data, timestamp } = JSON.parse(cachedData);
    const isExpired = Date.now() - timestamp > CACHE_EXPIRY;

    if (isExpired) {
      localStorage.removeItem(`cache_${key}`);
      return null;
    }

    return data as T;
  } catch (error) {
    console.error("Nepavyko gauti duomenų iš cache:", error);
    return null;
  }
}

export function clearCache(key?: string): void {
  try {
    if (key) {
      localStorage.removeItem(`cache_${key}`);
    } else {
      Object.keys(localStorage).forEach((storageKey) => {
        if (storageKey.startsWith("cache_")) {
          localStorage.removeItem(storageKey);
        }
      });
    }
  } catch (error) {
    console.error("Nepavyko išvalyti cache:", error);
  }
}
