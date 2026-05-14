import { create } from 'zustand';

export type User = {
	id: string;
	name: string;
	surname: string;
	phoneNumber: string;
	email?: string | null;
	emailVerified?: boolean;
	phoneNumberVerified?: boolean;
	image?: string | null;
	role: string;
	emergencyContactName?: string | null;
	emergencyContactPhone?: string | null;
	createdAt?: string;
	updatedAt?: string;
};

type AuthState = {
	user: User | null;
	token: string | null;
	isAuthenticated: boolean;
	setAuth: (user: User, token: string) => void;
	logout: () => void;
};

export const useAuthStore = create<AuthState>()((set) => ({
	user: null,
	token: null,
	isAuthenticated: false,

	setAuth: (user, token) => set({ user, token, isAuthenticated: true }),

	logout: () => set({ user: null, token: null, isAuthenticated: false }),
}));
