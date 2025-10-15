import type { HistoryItem } from '../App';

export interface User {
    username: string;
    password: string; // In a real app, this should be a hash
}

const USERS_KEY = 'photoBlenderUsers';
const SESSION_KEY = 'photoBlenderSession';

// --- User Management ---

function getUsers(): User[] {
    try {
        const usersJson = localStorage.getItem(USERS_KEY);
        return usersJson ? JSON.parse(usersJson) : [];
    } catch (e) {
        return [];
    }
}

function saveUsers(users: User[]): void {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function register(username: string, password: string): User {
    const users = getUsers();
    const existingUser = users.find(u => u.username.toLowerCase() === username.toLowerCase());
    if (existingUser) {
        throw new Error('Username already exists. Please choose another one.');
    }
    if (password.length < 4) {
        throw new Error('Password must be at least 4 characters long.');
    }
    const newUser: User = { username, password };
    saveUsers([...users, newUser]);
    return newUser;
}

export function login(username: string, password: string): User {
    const users = getUsers();
    const user = users.find(u => u.username.toLowerCase() === username.toLowerCase());
    if (!user || user.password !== password) {
        throw new Error('Invalid username or password.');
    }
    // Use sessionStorage to keep user logged in for the session
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(user));
    return user;
}

export function logout(): void {
    sessionStorage.removeItem(SESSION_KEY);
}

export function getCurrentUser(): User | null {
    try {
        const userJson = sessionStorage.getItem(SESSION_KEY);
        return userJson ? JSON.parse(userJson) : null;
    } catch (e) {
        return null;
    }
}

// --- History Management ---

function getHistoryKey(username: string): string {
    return `photoBlenderHistory_${username}`;
}

export function getUserHistory(username: string): HistoryItem[] {
    try {
        const historyJson = localStorage.getItem(getHistoryKey(username));
        return historyJson ? JSON.parse(historyJson) : [];
    } catch (e) {
        return [];
    }
}

export function saveUserHistory(username: string, history: HistoryItem[]): void {
    try {
        localStorage.setItem(getHistoryKey(username), JSON.stringify(history));
    } catch (e) {
        console.error("Failed to save history to localStorage", e);
    }
}
