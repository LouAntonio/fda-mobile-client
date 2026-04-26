import { NavigatorScreenParams } from '@react-navigation/native';

export type AuthStackParamList = {
	Login: undefined;
	Register: undefined;
	ForgotPassword: undefined;
	VerifyOTP: { phone: string };
	ResetPassword: { phone: string; otp: string };
};

export type RootStackParamList = {
	Splash: undefined;
	Onboarding: undefined;
	Auth: NavigatorScreenParams<AuthStackParamList>;
	Main: undefined;
};
