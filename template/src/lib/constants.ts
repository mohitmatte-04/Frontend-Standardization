/**
 * Application-wide constants
 */

export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || 'My Next.js App';
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

export const ROUTES = {
    HOME: '/',
    LOGIN: '/login',
    REGISTER: '/register',
    DASHBOARD: '/dashboard',
    PROFILE: '/profile',
    SETTINGS: '/settings',
} as const;

export const API_ENDPOINTS = {
    HEALTH: '/api/health',
    AUTH: {
        LOGIN: '/api/auth/signin',
        LOGOUT: '/api/auth/signout',
        REGISTER: '/api/auth/signup',
    },
    USERS: {
        GET_ALL: '/api/users',
        GET_BY_ID: (id: string) => `/api/users/${id}`,
    },
} as const;

export const QUERY_KEYS = {
    USERS: 'users',
    USER: 'user',
    AUTH: 'auth',
} as const;
