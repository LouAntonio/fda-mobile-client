import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColors } from '../hooks/useThemeColors';

interface GoogleButtonProps {
	onPress: () => void;
	label?: string;
}

export default function GoogleButton({
	onPress,
	label = 'Continuar com Google',
}: GoogleButtonProps) {
	const { isDark } = useThemeColors();

	return (
		<TouchableOpacity
			activeOpacity={0.7}
			onPress={onPress}
			style={[
				styles.container,
				isDark ? styles.containerDark : styles.containerLight,
			]}
			className="w-full rounded-2xl items-center flex-row justify-center px-4"
		>
			<View className="mr-3">
				<Ionicons
					name="logo-google"
					size={24}
					color={isDark ? '#FFFFFF' : '#4285F4'}
				/>
			</View>
			<Text
				className="text-base font-extrabold"
				style={[
					styles.label,
					isDark ? styles.labelDark : styles.labelLight,
				]}
			>
				{label}
			</Text>
		</TouchableOpacity>
	);
}

const styles = StyleSheet.create({
	container: {
		borderWidth: 1,
		height: 58,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 4 },
		shadowRadius: 10,
		elevation: 3,
	},
	containerLight: {
		backgroundColor: '#FFFFFF',
		borderColor: '#F0F0F0',
		shadowOpacity: 0.08,
	},
	containerDark: {
		backgroundColor: '#1F1F1F',
		borderColor: '#333333',
		shadowOpacity: 0.3,
	},
	label: {
		letterSpacing: 0.3,
	},
	labelLight: {
		color: '#1A1A1A',
	},
	labelDark: {
		color: '#FFFFFF',
	},
});
