import { create } from 'zustand';

export type User = {
	id: string;
	name: string;
	phoneNumber: string;
	role: string;
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
