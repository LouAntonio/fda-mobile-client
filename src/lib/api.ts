import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { API_URL } from '@env';
import { useAuthStore } from '../store/authStore';
import { refreshTokens } from '../services/auth';

export const api = axios.create({
	baseURL: API_URL,
	timeout: 15000,
	headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
	const token = useAuthStore.getState().accessToken;
	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
	}
	return config;
});

let isRefreshing = false;
let failedQueue: Array<{
	resolve: (token: string) => void;
	reject: (error: unknown) => void;
}> = [];

function processQueue(error: unknown, token: string | null = null) {
	failedQueue.forEach((prom) => {
		if (error) {
			prom.reject(error);
		} else {
			prom.resolve(token!);
		}
	});
	failedQueue = [];
}

api.interceptors.response.use(
	(response) => {
		if (
			response.data &&
			'success' in response.data &&
			'data' in response.data
		) {
			response.data = response.data.data ?? response.data;
		}
		return response;
	},
	async (error: AxiosError) => {
		const originalRequest = error.config as InternalAxiosRequestConfig & {
			_retry?: boolean;
		};

		if (error.response?.status === 401 && !originalRequest._retry) {
			const { refreshToken } = useAuthStore.getState();
			if (!refreshToken) {
				useAuthStore.getState().logout();
				return Promise.reject(error);
			}

			if (isRefreshing) {
				return new Promise<string>((resolve, reject) => {
					failedQueue.push({ resolve, reject });
				}).then((token) => {
					originalRequest.headers.Authorization = `Bearer ${token}`;
					return api(originalRequest);
				});
			}

			originalRequest._retry = true;
			isRefreshing = true;

			try {
				const { data } = await refreshTokens(refreshToken);
				const tokens = data as unknown as {
					accessToken: string;
					refreshToken: string;
				};
				useAuthStore
					.getState()
					.setTokens(tokens.accessToken, tokens.refreshToken);
				processQueue(null, tokens.accessToken);
				originalRequest.headers.Authorization = `Bearer ${tokens.accessToken}`;
				return api(originalRequest);
			} catch (refreshError) {
				processQueue(refreshError, null);
				useAuthStore.getState().logout();
				return Promise.reject(refreshError);
			} finally {
				isRefreshing = false;
			}
		}

		return Promise.reject(error);
	},
);
