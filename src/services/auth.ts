import { api } from '../lib/api';
import type { User } from '../store/authStore';

type RegisterResponse = {
	user: User;
};

type RegisterParams = {
	name: string;
	surname: string;
	phoneNumber: string;
	password: string;
};

export function registerUser(data: RegisterParams) {
	return api.post<RegisterResponse>('/auth/register/phone', data);
}

type LoginParams = {
	phoneNumber: string;
	password: string;
};

type LoginResponse = {
	user: User;
	token: string;
};

export function loginUser(data: LoginParams) {
	return api.post<LoginResponse>('/auth/login/phone', data);
}

type ForgotPasswordParams = {
	phoneNumber: string;
};

type ForgotPasswordResponse = {
	message: string;
};

type ResetPasswordParams = {
	otp: string;
	newPassword: string;
	phoneNumber: string;
};

type ResetPasswordResponse = {
	message: string;
};

export function forgotPassword(data: ForgotPasswordParams) {
	return api.post<ForgotPasswordResponse>('/auth/forgot-password', data);
}

export function resetPassword(data: ResetPasswordParams) {
	return api.post<ResetPasswordResponse>('/auth/reset-password', data);
}
