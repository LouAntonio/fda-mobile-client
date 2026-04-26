import React, { useState, useRef } from 'react';
import {
	View,
	Text,
	Dimensions,
	TouchableOpacity,
	StyleSheet,
} from 'react-native';
import Animated, {
	useSharedValue,
	useAnimatedStyle,
	useAnimatedScrollHandler,
	interpolate,
	Extrapolation,
	SharedValue,
} from 'react-native-reanimated';
import { useThemeColors } from '../hooks/useThemeColors';
import { colors } from '../store/colors';

const { width } = Dimensions.get('window');

const SLIDES = [
	{
		id: '1',
		title: 'Moto táxi rápido',
		description:
			'Chegue ao seu destino de forma rápida e segura com os nossos motoristas parceiros.',
		icon: '🛵',
	},
	{
		id: '2',
		title: 'Pedidos simples',
		description:
			'Faça encomendas ou peça para buscar produtos com apenas alguns cliques no app.',
		icon: '📦',
	},
	{
		id: '3',
		title: 'Segurança em 1º lugar',
		description:
			'Motoristas verificados e acompanhamento da viagem em tempo real para sua proteção.',
		icon: '🛡️',
	},
];

const Dot = ({
	index,
	scrollX,
	themeColors,
}: {
	index: number;
	scrollX: SharedValue<number>;
	themeColors: any;
}) => {
	const animatedDotStyle = useAnimatedStyle(() => {
		const inputRange = [
			(index - 1) * width,
			index * width,
			(index + 1) * width,
		];

		const dotWidth = interpolate(
			scrollX.value,
			inputRange,
			[10, 24, 10],
			Extrapolation.CLAMP,
		);

		const opacity = interpolate(
			scrollX.value,
			inputRange,
			[0.4, 1, 0.4],
			Extrapolation.CLAMP,
		);

		return {
			width: dotWidth,
			opacity,
			backgroundColor:
				opacity > 0.7 ? themeColors.primary : themeColors.border,
		};
	});

	return <Animated.View style={[animatedDotStyle, styles.dot]} />;
};

import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../types/navigation';

export default function OnboardingScreen() {
	const navigation =
		useNavigation<
			NativeStackNavigationProp<RootStackParamList, 'Onboarding'>
		>();
	const [currentIndex, setCurrentIndex] = useState(0);
	const flatListRef = useRef<Animated.FlatList<any>>(null);
	const scrollX = useSharedValue(0);

	const { themeColors } = useThemeColors();

	const scrollHandler = useAnimatedScrollHandler({
		onScroll: (event) => {
			scrollX.value = event.contentOffset.x;
		},
	});

	const handleNext = () => {
		if (currentIndex < SLIDES.length - 1) {
			flatListRef.current?.scrollToIndex({
				index: currentIndex + 1,
				animated: true,
			});
		}
	};

	return (
		<View
			className="flex-1"
			style={{ backgroundColor: themeColors.background }}
		>
			{/* Botão Pular */}
			<TouchableOpacity
				className="absolute top-12 right-6 z-10 px-4 py-2"
				onPress={() => navigation.replace('Auth', { screen: 'Login' })}
			>
				<Text
					className="text-base font-bold"
					style={{ color: themeColors.primary }}
				>
					Pular
				</Text>
			</TouchableOpacity>

			<Animated.FlatList
				ref={flatListRef}
				data={SLIDES}
				horizontal
				pagingEnabled
				onScroll={scrollHandler}
				scrollEventThrottle={16}
				bounces={false}
				showsHorizontalScrollIndicator={false}
				onMomentumScrollEnd={(e) => {
					const index = Math.round(
						e.nativeEvent.contentOffset.x / width,
					);
					setCurrentIndex(index);
				}}
				keyExtractor={(item) => item.id}
				renderItem={({ item, index }) => (
					<View
						style={{ width }}
						className="flex-1 items-center justify-center px-8"
					>
						<View
							className="w-40 h-40 rounded-full items-center justify-center mb-10"
							style={{
								backgroundColor: themeColors.card,
								borderColor: themeColors.border,
								...styles.iconCircle,
							}}
						>
							<Text className="text-6xl">{item.icon}</Text>
						</View>

						<Text
							className="text-[28px] font-bold text-center mb-4"
							style={{ color: themeColors.text }}
						>
							{item.title}
						</Text>
						<Text
							className="text-base text-center leading-6"
							style={{ color: themeColors.secondary }}
						>
							{item.description}
						</Text>

						{/* Botões apenas no último slide */}
						{index === SLIDES.length - 1 && (
							<View className="w-full mt-10">
								<TouchableOpacity
									className="w-full py-4 rounded-xl items-center"
									style={{
										backgroundColor: themeColors.primary,
									}}
									onPress={() =>
										navigation.replace('Auth', {
											screen: 'Login',
										})
									}
								>
									<Text
										className="text-lg font-bold"
										style={{ color: colors.light.text }}
									>
										Começar
									</Text>
								</TouchableOpacity>
							</View>
						)}
					</View>
				)}
			/>

			{/* Indicadores de Progresso (Dots) e Botão Próximo */}
			<View className="flex-row justify-between items-center px-8 pb-12 pt-4">
				<View className="flex-row items-center">
					{SLIDES.map((_, i) => (
						<Dot
							key={i}
							index={i}
							scrollX={scrollX}
							themeColors={themeColors}
						/>
					))}
				</View>

				{currentIndex < SLIDES.length - 1 ? (
					<TouchableOpacity
						className="px-6 py-3 rounded-full"
						style={{ backgroundColor: themeColors.primary }}
						onPress={handleNext}
					>
						<Text
							className="font-bold"
							style={{ color: colors.light.text }}
						>
							Próximo
						</Text>
					</TouchableOpacity>
				) : (
					<View className="px-6 py-3 opacity-0">
						<Text>X</Text>
					</View>
				)}
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	dot: {
		height: 10,
		borderRadius: 5,
		marginHorizontal: 4,
	},
	iconCircle: {
		borderWidth: 1,
	},
});
