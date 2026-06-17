import { api } from '../lib/api';
import type { ApiResponse, AuthTokens } from '../types/api';

type RegisterParams = {
	name: string;
	surname: string;
	phoneNumber: string;
	password: string;
};

export function registerUser(data: RegisterParams) {
	return api.post<ApiResponse<never>>('/auth/register', data);
}

type LoginParams = { phoneNumber: string; password: string };

export function loginUser(data: LoginParams) {
	return api.post<ApiResponse<AuthTokens>>('/auth/login', data);
}

type ForgotPasswordParams = { email: string };

export function forgotPassword(data: ForgotPasswordParams) {
	return api.post<ApiResponse<never>>('/auth/forgot-password', data);
}

type ResetPasswordParams = { token: string; password: string };

export function resetPassword(data: ResetPasswordParams) {
	return api.post<ApiResponse<never>>('/auth/reset-password', data);
}

export function refreshTokens(refreshToken: string) {
	return api.post<ApiResponse<AuthTokens>>('/auth/refresh', { refreshToken });
}

export function logoutUser(refreshToken: string) {
	return api.post<ApiResponse<never>>('/auth/logout', { refreshToken });
}

export function loginWithGoogle(accessToken: string) {
	return api.post<ApiResponse<AuthTokens>>('/auth/google', { accessToken });
}
