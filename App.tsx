import './global.css';
import React, { useState, useEffect } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './src/lib/queryClient';
import { StatusBar } from 'expo-status-bar';
import { Appearance, Platform, View, Text } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useThemeStore } from './src/store/themeStore';
import { useThemeColors } from './src/hooks/useThemeColors';

import SplashScreen from './src/screens/SplashScreen';
import OnboardingScreen from './src/screens/OnboardingScreen';

type AppState = 'splash' | 'onboarding' | 'main';

export default function App() {
	const { theme } = useThemeStore();
	const { isDark } = useThemeColors();
	const [appState, setAppState] = useState<AppState>('splash');

	// Sincronizar a preferência do utilizador com a Appearance API
	useEffect(() => {
		if (theme === 'system') {
			Appearance.setColorScheme(null); // seguir o sistema
		} else {
			Appearance.setColorScheme(theme); // forçar light/dark
		}
	}, [theme]);

	return (
		<QueryClientProvider client={queryClient}>
			<SafeAreaProvider>
				<StatusBar
					style={isDark ? 'light' : 'dark'}
					backgroundColor={
						Platform.OS === 'android' ? '#8F7657' : undefined
					}
				/>
				<SafeAreaView className="flex-1 bg-off-white dark:bg-soft-black">
					{appState === 'splash' && (
						<SplashScreen
							onFinish={() => setAppState('onboarding')}
						/>
					)}
					{appState === 'onboarding' && (
						<OnboardingScreen
							onFinish={() => setAppState('main')}
						/>
					)}
					{appState === 'main' && (
						<View className="flex-1 items-center justify-center">
							<Text className="text-xl text-black dark:text-white">
								Autenticação (Login/OTP) virá aqui
							</Text>
						</View>
					)}
				</SafeAreaView>
			</SafeAreaProvider>
		</QueryClientProvider>
	);
}
