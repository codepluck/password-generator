import { openDB } from 'idb';
import CryptoJS from 'crypto-js';

const DB_NAME = 'PasswordStore';
const STORE_NAME = 'passwords';
const SECRET_KEY = CryptoJS.PBKDF2('your-secret-key', CryptoJS.lib.WordArray.random(16), {
    keySize: 256 / 32,
    iterations: 1000,
}).toString();

// Initialize IndexedDB
const initDB = async () => {
    return openDB(DB_NAME, 1, {
        upgrade(db) {
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                const store = db.createObjectStore(STORE_NAME, { keyPath: 'fingerprint' });
                store.createIndex('fingerprint', 'fingerprint', { unique: true });
            }
        }
    });
};

// Encrypt password with integrity check
const encrypt = (password: string): string => {
    const encrypted = CryptoJS.AES.encrypt(password, SECRET_KEY).toString();
    const hash = CryptoJS.HmacSHA256(encrypted, SECRET_KEY).toString();
    return `${hash}:${encrypted}`;
};

// Decrypt password with integrity verification
const decrypt = (encrypted: string): string | null => {
    const [hash, data] = encrypted.split(':');
    if (!hash || !data) return null;
    const validHash = CryptoJS.HmacSHA256(data, SECRET_KEY).toString();
    if (validHash !== hash) return null; // Integrity check failed
    return CryptoJS.AES.decrypt(data, SECRET_KEY).toString(CryptoJS.enc.Utf8);
};

// Store password in IndexedDB
export const storePassword = async (fingerprint: string | null, password: string) => {
    if (!fingerprint) return;
    const db = await initDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);

    const encryptedPassword = encrypt(password);
    const entry = await store.get(fingerprint);
    const passwords = entry ? entry.passwords : [];

    // Keep only the last 5 passwords, removing the oldest if needed
    if (passwords.length >= 5) passwords.pop();
    passwords.unshift({ timestamp: Date.now(), password: encryptedPassword });

    await store.put({ fingerprint, passwords });
    await tx.done;
};

// Fetch stored passwords
export const fetchPasswords = async (fingerprint: string) => {
    const db = await initDB();
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const entry = await store.get(fingerprint);
    await tx.done;

    if (!entry) return [];

    return entry.passwords.map((p: any) => ({
        timestamp: new Date(p.timestamp),
        password: decrypt(p.password) || 'Decryption Error',
    }));
};
