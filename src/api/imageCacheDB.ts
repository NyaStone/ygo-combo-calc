// Simple IndexedDB wrapper for image base64 caching
const DB_NAME = 'imageBase64CacheDB';
const STORE_NAME = 'images';
const DB_VERSION = 1;

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}


// Hash function using SHA-256, returns a hex string
async function hashSrc(src: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(src);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Get a cached image as a base64 string.
 * @param src Image URL
 * @returns Base64 string or null if not found
 */
export async function getCachedBase64(src: string): Promise<string | null> {
  const db = await openDB();
  const key = await hashSrc(src);
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const req = store.get(key);
    req.onsuccess = () => resolve(req.result ?? null);
    req.onerror = () => reject(req.error);
  });
}


/**
 * Set a cached image as a base64 string.
 * @param src Image URL
 * @param base64 Base64 string
 * @returns Promise that resolves when the operation is complete
 */
export async function setCachedBase64(src: string, base64: string): Promise<void> {
  const db = await openDB();
  const key = await hashSrc(src);
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const req = store.put(base64, key);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}
