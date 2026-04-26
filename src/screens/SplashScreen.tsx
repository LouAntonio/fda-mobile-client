import React, { useEffect, useMemo } from 'react';
import { View, Image, Animated } from 'react-native';
import { useThemeColors } from '../hooks/useThemeColors';

import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../types/navigation';

export default function SplashScreen({
	duration = 2500,
}: {
	duration?: number;
}) {
	const navigation =
		useNavigation<
			NativeStackNavigationProp<RootStackParamList, 'Splash'>
		>();
	const fadeAnim = useMemo(() => new Animated.Value(0), []);
	const scaleAnim = useMemo(() => new Animated.Value(0.8), []);

	const { themeColors } = useThemeColors();

	useEffect(() => {
		// Animação de entrada
		Animated.parallel([
			Animated.timing(fadeAnim, {
				toValue: 1,
				duration: 800,
				useNativeDriver: true,
			}),
			Animated.spring(scaleAnim, {
				toValue: 1,
				tension: 50,
				friction: 7,
				useNativeDriver: true,
			}),
		]).start();

		// Timer para finalizar
		const timer = setTimeout(() => {
			Animated.timing(fadeAnim, {
				toValue: 0,
				duration: 1500,
				useNativeDriver: true,
			}).start(() => navigation.replace('Onboarding'));
		}, duration - 400);

		return () => clearTimeout(timer);
	}, [duration, navigation, fadeAnim, scaleAnim]);

	return (
		<View
			className="flex-1 justify-center items-center"
			style={{ backgroundColor: themeColors.background }}
		>
			<Animated.View
				className="items-center justify-center"
				style={{
					opacity: fadeAnim,
					transform: [{ scale: scaleAnim }],
				}}
			>
				<Image
					source={require('../../assets/images/logo.png')}
					className="w-[200px] h-[200px] mb-6 rounded-3xl"
					resizeMode="contain"
				/>

				<Animated.Text
					className="text-[25px] font-bold tracking-wider mb-2"
					style={{ opacity: fadeAnim, color: themeColors.text }}
				>
					Flash Delivery Angola
				</Animated.Text>

				<Animated.Text
					className="text-base tracking-[2px] uppercase mb-10"
					style={{ opacity: fadeAnim, color: themeColors.secondary }}
				>
					Rápido. Seguro. Sempre.
				</Animated.Text>

				<Animated.View className="mt-5" style={{ opacity: fadeAnim }}>
					<View className="flex-row items-center justify-center">
						<View
							className="w-2.5 h-2.5 rounded-full mx-1"
							style={{ backgroundColor: themeColors.primary }}
						/>
						<View
							className="w-2.5 h-2.5 rounded-full mx-1"
							style={{ backgroundColor: themeColors.primary }}
						/>
						<View
							className="w-2.5 h-2.5 rounded-full mx-1"
							style={{ backgroundColor: themeColors.primary }}
						/>
					</View>
				</Animated.View>
			</Animated.View>
		</View>
	);
}
