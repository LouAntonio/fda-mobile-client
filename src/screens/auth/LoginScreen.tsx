import React, { useState } from 'react';
import {
	View,
	Text,
	TouchableOpacity,
	ScrollView,
	SafeAreaView,
	Image,
	StyleSheet,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import Animated, { FadeInUp, FadeInDown } from 'react-native-reanimated';
import { AuthStackParamList } from '../../types/navigation';
import { useThemeColors } from '../../hooks/useThemeColors';
import Input from '../../components/Input';
import Button from '../../components/Button';
import GoogleButton from '../../components/GoogleButton';

type LoginNavigationProp = NativeStackNavigationProp<
	AuthStackParamList,
	'Login'
>;

export default function LoginScreen() {
	const navigation = useNavigation<LoginNavigationProp>();
	const { themeColors } = useThemeColors();
	const [phone, setPhone] = useState('');
	const [password, setPassword] = useState('');

	const handleLogin = () => {
		// handle auth logic soon
	};

	return (
		<SafeAreaView
			style={[
				styles.safeArea,
				{ backgroundColor: themeColors.background },
			]}
		>
			<ScrollView
				contentContainerStyle={styles.scrollContent}
				keyboardShouldPersistTaps="handled"
				showsVerticalScrollIndicator={false}
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
						className="text-4xl font-black mb-2 tracking-tighter"
						style={{ color: themeColors.text }}
					>
						LOGIN
					</Text>
					<Text
						className="text-lg font-medium text-center px-4"
						style={[
							styles.subtitle,
							{ color: themeColors.secondary },
						]}
					>
						Bem-vindo de volta! Faça login para continuar.
					</Text>
				</Animated.View>

				<Animated.View entering={FadeInUp.duration(800).delay(400)}>
					<Input
						label="Telefone"
						placeholder="9XX XXX XXX"
						value={phone}
						onChangeText={setPhone}
						keyboardType="phone-pad"
						autoCapitalize="none"
						leftIcon="call-outline"
					/>

					<Input
						label="Senha"
						placeholder="Sua senha secreta"
						value={password}
						onChangeText={setPassword}
						isPassword
						leftIcon="lock-closed-outline"
					/>

					<TouchableOpacity
						onPress={() => navigation.navigate('ForgotPassword')}
						className="self-end mb-8"
						activeOpacity={0.6}
					>
						<Text
							style={[
								styles.forgotPassword,
								{ color: themeColors.primary },
							]}
						>
							ESQUECEU A SENHA?
						</Text>
					</TouchableOpacity>

					<Button
						title="Entrar na conta"
						onPress={handleLogin}
						className="mb-8"
					/>

					<View className="flex-row items-center mb-8">
						<View
							className="flex-1 h-[1px]"
							style={[
								styles.dividerLine,
								{ backgroundColor: themeColors.border },
							]}
						/>
						<Text
							className="mx-6 text-xs font-bold tracking-widest"
							style={[
								styles.dividerText,
								{ color: themeColors.secondary },
							]}
						>
							OU CONTINUE COM
						</Text>
						<View
							className="flex-1 h-[1px]"
							style={[
								styles.dividerLine,
								{ backgroundColor: themeColors.border },
							]}
						/>
					</View>

					<GoogleButton
						onPress={() => console.log('Google login')}
						label="Google"
					/>
				</Animated.View>

				<Animated.View
					entering={FadeInUp.duration(800).delay(600)}
					className="flex-row items-center justify-center mt-12 mb-6"
				>
					<Text
						style={[
							styles.footerText,
							{ color: themeColors.secondary },
						]}
					>
						Novo por aqui?{' '}
					</Text>
					<TouchableOpacity
						onPress={() => navigation.navigate('Register')}
					>
						<Text
							style={[
								styles.footerLink,
								{ color: themeColors.primary },
							]}
						>
							CRIAR CONTA AGORA
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
		width: 120,
		height: 120,
		resizeMode: 'contain',
	},
	subtitle: {
		opacity: 0.8,
	},
	forgotPassword: {
		fontWeight: '800',
		fontSize: 13,
	},
	dividerLine: {
		opacity: 0.3,
	},
	dividerText: {
		opacity: 0.5,
	},
	footerText: {
		fontWeight: '500',
	},
	footerLink: {
		fontWeight: '900',
	},
});
