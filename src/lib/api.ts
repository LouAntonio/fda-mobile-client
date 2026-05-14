import axios from 'axios';
import { API_URL } from '@env';
import { useAuthStore } from '../store/authStore';

export const api = axios.create({
	baseURL: API_URL,
	timeout: 15000,
	headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
	const token = useAuthStore.getState().token;
	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
	}
	return config;
});
