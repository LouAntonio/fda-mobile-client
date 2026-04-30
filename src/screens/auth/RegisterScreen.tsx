import React, { useState } from 'react';
import {
	View,
	Text,
	TouchableOpacity,
	ScrollView,
	KeyboardAvoidingView,
	Platform,
	Alert,
	Image,
	StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import Animated, { FadeInUp, FadeInDown } from 'react-native-reanimated';
import { AuthStackParamList } from '../../types/navigation';
import { useThemeColors } from '../../hooks/useThemeColors';
import Input from '../../components/Input';
import Button from '../../components/Button';
import GoogleButton from '../../components/GoogleButton';

type RegisterNavigationProp = NativeStackNavigationProp<
	AuthStackParamList,
	'Register'
>;

export default function RegisterScreen() {
	const navigation = useNavigation<RegisterNavigationProp>();
	const { themeColors } = useThemeColors();

	const [firstName, setFirstName] = useState('');
	const [lastName, setLastName] = useState('');
	const [phone, setPhone] = useState('');
	const [password, setPassword] = useState('');

	const handleRegister = () => {
		if (!firstName || !lastName || !phone || !password) {
			Alert.alert('Erro', 'Por favor, preencha todos os campos.');
			return;
		}
		// handle auth logic soon
	};

	return (
		<SafeAreaView
			style={[
				styles.safeArea,
				{ backgroundColor: themeColors.background },
			]}
		>
			<KeyboardAvoidingView
				behavior={Platform.OS === 'ios' ? 'padding' : undefined}
				style={styles.keyboardView}
			>
				<ScrollView
					contentContainerStyle={styles.scrollContent}
					keyboardShouldPersistTaps="handled"
					showsVerticalScrollIndicator={false}
				>
					<Animated.View
						entering={FadeInDown.duration(800).delay(200)}
						className="items-center mb-8"
					>
						<Image
							source={require('../../../assets/images/logo.png')}
							style={styles.logo}
							className="mb-4 rounded-3xl"
						/>
						<Text
							className="text-3xl font-black mb-2 text-center tracking-tighter"
							style={{ color: themeColors.text }}
						>
							CADASTRO
						</Text>
						<Text
							className="text-base text-center px-6"
							style={[
								styles.subtitle,
								{ color: themeColors.secondary },
							]}
						>
							Crie uma conta e peça uma corrida ou mande uma
							encomenda
						</Text>
					</Animated.View>

					<Animated.View entering={FadeInUp.duration(800).delay(400)}>
						<View className="flex-row gap-x-4">
							<View className="flex-1">
								<Input
									label="Nome"
									placeholder="Ex: João"
									value={firstName}
									onChangeText={setFirstName}
									leftIcon="person-outline"
								/>
							</View>
							<View className="flex-1">
								<Input
									label="Sobrenome"
									placeholder="Ex: Silva"
									value={lastName}
									onChangeText={setLastName}
									leftIcon="person-outline"
								/>
							</View>
						</View>

						<Input
							label="Telefone"
							placeholder="9XX XXX XXX"
							value={phone}
							onChangeText={setPhone}
							keyboardType="phone-pad"
							leftIcon="call-outline"
						/>

						<Input
							label="Senha"
							placeholder="Crie sua senha"
							value={password}
							onChangeText={setPassword}
							isPassword
							leftIcon="lock-closed-outline"
						/>

						<Button
							title="Criar minha conta"
							onPress={handleRegister}
							className="mt-4 mb-8"
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
								OU USE
							</Text>
							<View
								className="flex-1 h-[1px]"
								style={[
									styles.dividerLine,
									{ backgroundColor: themeColors.border },
								]}
							/>
						</View>

						<GoogleButton onPress={() => {}} />

						<View className="flex-row items-center justify-center mt-12 mb-6">
							<Text
								style={[
									styles.footerText,
									{ color: themeColors.secondary },
								]}
							>
								Já tem conta?{' '}
							</Text>
							<TouchableOpacity
								onPress={() => navigation.goBack()}
							>
								<Text
									style={[
										styles.footerLink,
										{ color: themeColors.primary },
									]}
								>
									ENTRAR AGORA
								</Text>
							</TouchableOpacity>
						</View>
					</Animated.View>
				</ScrollView>
			</KeyboardAvoidingView>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	safeArea: {
		flex: 1,
	},
	keyboardView: {
		flex: 1,
	},
	scrollContent: {
		flexGrow: 1,
		padding: 24,
		justifyContent: 'center',
	},
	logo: {
		width: 80,
		height: 80,
		resizeMode: 'contain',
	},
	subtitle: {
		opacity: 0.8,
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
