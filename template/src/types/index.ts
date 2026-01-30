/**
 * Common TypeScript types and interfaces
 */

export interface User {
    id: string;
    name: string;
    email: string;
    image?: string;
    role: 'user' | 'admin';
    createdAt: Date;
    updatedAt: Date;
}

export interface ApiResponse<T> {
    data: T;
    message?: string;
    success: boolean;
}

export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
}

export interface ApiError {
    message: string;
    status: number;
    errors?: Record<string, string[]>;
}
