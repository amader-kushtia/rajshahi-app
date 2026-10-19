import { PostItem } from '../types';

const DB_NAME = 'rajshahi_connect_db';
const DB_VERSION = 1;
const POSTS_STORE = 'posts';

let dbPromise: Promise<IDBDatabase> | null = null;

function getDB(): Promise<IDBDatabase> {
  if (dbPromise) return dbPromise;
  if (typeof window === 'undefined' || !window.indexedDB) {
    return Promise.reject(new Error('IndexedDB not supported'));
  }

  dbPromise = new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(POSTS_STORE)) {
        const store = db.createObjectStore(POSTS_STORE, { keyPath: 'id' });
        store.createIndex('category', 'category', { unique: false });
        store.createIndex('createdAt', 'createdAt', { unique: false });
      }
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = () => {
      reject(request.error);
    };
  });

  return dbPromise;
}

/**
 * Retrieve all posts stored in IndexedDB
 */
export async function idbGetAllPosts(): Promise<PostItem[]> {
  try {
    const db = await getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(POSTS_STORE, 'readonly');
      const store = tx.objectStore(POSTS_STORE);
      const request = store.getAll();

      request.onsuccess = () => {
        resolve((request.result as PostItem[]) || []);
      };
      request.onerror = () => {
        reject(request.error);
      };
    });
  } catch (err) {
    console.warn('IndexedDB idbGetAllPosts error:', err);
    return [];
  }
}

/**
 * Batch save posts into IndexedDB
 */
export async function idbSavePosts(posts: PostItem[]): Promise<void> {
  try {
    const db = await getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(POSTS_STORE, 'readwrite');
      const store = tx.objectStore(POSTS_STORE);

      posts.forEach(post => {
        store.put(post);
      });

      tx.oncomplete = () => {
        resolve();
      };
      tx.onerror = () => {
        reject(tx.error);
      };
    });
  } catch (err) {
    console.warn('IndexedDB idbSavePosts error:', err);
  }
}

/**
 * Put a single post into IndexedDB
 */
export async function idbPutPost(post: PostItem): Promise<void> {
  try {
    const db = await getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(POSTS_STORE, 'readwrite');
      const store = tx.objectStore(POSTS_STORE);
      store.put(post);

      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch (err) {
    console.warn('IndexedDB idbPutPost error:', err);
  }
}

/**
 * Delete a post from IndexedDB by id
 */
export async function idbDeletePost(postId: string): Promise<void> {
  try {
    const db = await getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(POSTS_STORE, 'readwrite');
      const store = tx.objectStore(POSTS_STORE);
      store.delete(postId);

      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch (err) {
    console.warn('IndexedDB idbDeletePost error:', err);
  }
}

/**
 * Clear all posts from IndexedDB
 */
export async function idbClearPosts(): Promise<void> {
  try {
    const db = await getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(POSTS_STORE, 'readwrite');
      const store = tx.objectStore(POSTS_STORE);
      store.clear();

      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch (err) {
    console.warn('IndexedDB idbClearPosts error:', err);
  }
}
