import { openDB } from 'idb';
import CryptoJS from 'crypto-js';

const DB_NAME = 'PasswordStore';
const STORE_NAME = 'passwords';
// Use a fixed salt value for key derivation (this must remain consistent)
const SALT = CryptoJS.enc.Hex.parse("abcdef0123456789abcdef0123456789");
const SECRET_KEY = CryptoJS.PBKDF2('your-secret-key', SALT, {
    keySize: 256 / 32,
    iterations: 1000,
}).toString();

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
    const db = await openDB(DB_NAME, 1, {
        upgrade(db) {
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                const store = db.createObjectStore(STORE_NAME, { keyPath: 'fingerprint' });
                store.createIndex('fingerprint', 'fingerprint', { unique: true });
            }
        },
    });
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
    const db = await openDB(DB_NAME, 1, {
        upgrade(db) {
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                const store = db.createObjectStore(STORE_NAME, { keyPath: 'fingerprint' });
                store.createIndex('fingerprint', 'fingerprint', { unique: true });
            }
        },
    });
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

// Delete a stored password by timestamp
export const deleteStoredPassword = async (fingerprint: string, timestamp: number) => {
    const db = await openDB(DB_NAME, 1, {
        upgrade(db) {
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                const store = db.createObjectStore(STORE_NAME, { keyPath: 'fingerprint' });
                store.createIndex('fingerprint', 'fingerprint', { unique: true });
            }
        },
    });
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const entry = await store.get(fingerprint);

    if (!entry) return;

    const updatedPasswords = entry.passwords.filter((p: any) => p.timestamp !== timestamp);
    await store.put({ fingerprint, passwords: updatedPasswords });
    await tx.done;
};

// Update a stored password
export const updateStoredPassword = async (fingerprint: string, timestamp: number, newPassword: string) => {
    const db = await openDB(DB_NAME, 1, {
        upgrade(db) {
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                const store = db.createObjectStore(STORE_NAME, { keyPath: 'fingerprint' });
                store.createIndex('fingerprint', 'fingerprint', { unique: true });
            }
        },
    });
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const entry = await store.get(fingerprint);

    if (!entry) return;

    const updatedPasswords = entry.passwords.map((p: any) =>
        p.timestamp === timestamp ? { ...p, password: encrypt(newPassword) } : p
    );

    await store.put({ fingerprint, passwords: updatedPasswords });
    await tx.done;
};
