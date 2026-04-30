import React, { useState, useRef, useMemo } from 'react';
import {
	View,
	Text,
	TouchableOpacity,
	Alert,
	Image,
	ScrollView,
	TextInput,
	Pressable,
	StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import Animated, { FadeInUp, FadeInDown } from 'react-native-reanimated';
import { AuthStackParamList } from '../../types/navigation';
import { useThemeColors } from '../../hooks/useThemeColors';
import Button from '../../components/Button';

type VerifyOTPNavigationProp = NativeStackNavigationProp<
	AuthStackParamList,
	'VerifyOTP'
>;
type VerifyOTPRouteProp = RouteProp<AuthStackParamList, 'VerifyOTP'>;

export default function VerifyOTPScreen() {
	const navigation = useNavigation<VerifyOTPNavigationProp>();
	const route = useRoute<VerifyOTPRouteProp>();
	const { phone } = route.params;
	const { themeColors, isDark } = useThemeColors();

	const [otp, setOtp] = useState('');
	const inputRef = useRef<TextInput>(null);

	const handleVerify = () => {
		if (otp.length < 6) {
			Alert.alert('Erro', 'Por favor, insira o código de 6 dígitos.');
			return;
		}
		// logic to verify OTP soon
		navigation.navigate('ResetPassword', { phone, otp });
	};

	const safeAreaStyle = useMemo(
		() => ({ backgroundColor: themeColors.background }),
		[themeColors.background],
	);

	const textStyle = useMemo(
		() => ({ color: themeColors.text }),
		[themeColors.text],
	);

	const secondaryTextStyle = useMemo(
		() => ({ color: themeColors.secondary }),
		[themeColors.secondary],
	);

	const primaryTextStyle = useMemo(
		() => ({ color: themeColors.primary }),
		[themeColors.primary],
	);

	const renderOtpBoxes = () => {
		const boxes = [];
		for (let i = 0; i < 6; i++) {
			const char = otp[i] || '';
			const isFocused = otp.length === i;

			const dynamicBoxStyle = {
				borderColor: isFocused
					? themeColors.primary
					: char
						? themeColors.primary
						: themeColors.border,
				backgroundColor: isDark ? '#121212' : '#F5F5F5',
			};

			boxes.push(
				<View
					key={i}
					className="w-12 h-16 border-2 rounded-xl items-center justify-center mx-1"
					style={[
						styles.otpBox,
						dynamicBoxStyle,
						isFocused ? styles.fullOpacity : styles.dimmedOpacity,
					]}
				>
					<Text className="text-2xl font-black" style={textStyle}>
						{char}
					</Text>
				</View>,
			);
		}
		return boxes;
	};

	return (
		<SafeAreaView style={[styles.safeArea, safeAreaStyle]}>
			<ScrollView
				contentContainerStyle={styles.scrollContent}
				keyboardShouldPersistTaps="handled"
			>
				<Animated.View
					entering={FadeInDown.duration(800).delay(200)}
					className="items-center mb-10"
				>
					<Image
						source={require('../../../assets/images/logo.png')}
						style={styles.logo}
						className="mb-6 rounded-3xl"
					/>
					<Text
						className="text-3xl font-black mb-4 text-center tracking-tighter"
						style={textStyle}
					>
						VERIFICAR CÓDIGO
					</Text>
					<Text
						className="text-base text-center px-4"
						style={[styles.description, secondaryTextStyle]}
					>
						Enviamos um código de verificação para o número {phone}.
						Insira-o abaixo para continuar.
					</Text>
				</Animated.View>

				<Animated.View entering={FadeInUp.duration(800).delay(400)}>
					<Pressable
						onPress={() => inputRef.current?.focus()}
						className="flex-row justify-center mb-10"
					>
						{renderOtpBoxes()}
					</Pressable>

					<TextInput
						ref={inputRef}
						value={otp}
						onChangeText={(text) => {
							if (text.length <= 6) setOtp(text);
						}}
						keyboardType="number-pad"
						maxLength={6}
						style={styles.hiddenInput}
					/>

					<Button
						title="Verificar Código"
						onPress={handleVerify}
						className="mt-4 mb-8"
					/>

					<TouchableOpacity
						onPress={() =>
							Alert.alert('Sucesso', 'Novo código enviado.')
						}
						className="items-center py-2"
						activeOpacity={0.6}
					>
						<Text style={[styles.resendText, secondaryTextStyle]}>
							Não recebeu o código?{' '}
							<Text style={[styles.resendLink, primaryTextStyle]}>
								REENVIAR
							</Text>
						</Text>
					</TouchableOpacity>

					<TouchableOpacity
						onPress={() => navigation.goBack()}
						className="items-center py-6"
						activeOpacity={0.6}
					>
						<Text style={[styles.backText, primaryTextStyle]}>
							VOLTAR
						</Text>
					</TouchableOpacity>
				</Animated.View>
			</ScrollView>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	safeArea: {
		flex: 1,
	},
	scrollContent: {
		flexGrow: 1,
		padding: 24,
		justifyContent: 'center',
	},
	logo: {
		width: 100,
		height: 100,
		resizeMode: 'contain',
	},
	description: {
		lineHeight: 22,
		opacity: 0.8,
	},
	otpBox: {
		// Base styles are handled by tailwind classes in the View
	},
	fullOpacity: {
		opacity: 1,
	},
	dimmedOpacity: {
		opacity: 0.8,
	},
	hiddenInput: {
		opacity: 0,
		height: 0,
		width: 0,
		position: 'absolute',
	},
	resendText: {
		fontWeight: '600',
	},
	resendLink: {
		fontWeight: '900',
	},
	backText: {
		fontWeight: '900',
		letterSpacing: 1,
	},
});
