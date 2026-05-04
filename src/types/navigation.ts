import { NavigatorScreenParams } from '@react-navigation/native';

export type AuthStackParamList = {
	Login: undefined;
	Register: undefined;
	ForgotPassword: undefined;
	VerifyOTP: { phone: string };
	ResetPassword: { phone: string; otp: string };
};

export type MainStackParamList = {
	Home: undefined;
	Profile: undefined;
	History: undefined;
	Addresses: undefined;
	PaymentMethods: undefined;
	Promotions: undefined;
	Info: undefined;
	Contact: undefined;
	Settings: undefined;
};

export type RootStackParamList = {
	Splash: undefined;
	Onboarding: undefined;
	Auth: NavigatorScreenParams<AuthStackParamList>;
	Main: NavigatorScreenParams<MainStackParamList>;
};
