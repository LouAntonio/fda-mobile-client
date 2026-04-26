import React, { useState } from 'react';
import {
	Text,
	SafeAreaView,
	Alert,
	Image,
	ScrollView,
	StyleSheet,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import Animated, { FadeInUp, FadeInDown } from 'react-native-reanimated';
import { AuthStackParamList } from '../../types/navigation';
import { useThemeColors } from '../../hooks/useThemeColors';
import Input from '../../components/Input';
import Button from '../../components/Button';

type ResetPasswordNavigationProp = NativeStackNavigationProp<
	AuthStackParamList,
	'ResetPassword'
>;

export default function ResetPasswordScreen() {
	const navigation = useNavigation<ResetPasswordNavigationProp>();
	const { themeColors } = useThemeColors();

	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');

	const handleReset = () => {
		if (password.length < 6) {
			Alert.alert('Erro', 'A senha deve ter pelo menos 6 caracteres.');
			return;
		}
		if (password !== confirmPassword) {
			Alert.alert('Erro', 'As senhas não coincidem.');
			return;
		}
		// logic to reset password soon
		Alert.alert('Sucesso', 'Sua senha foi atualizada com sucesso!');
		navigation.navigate('Login');
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
						style={{ color: themeColors.text }}
					>
						NOVA SENHA
					</Text>
					<Text
						className="text-base text-center px-4"
						style={[
							styles.description,
							{ color: themeColors.secondary },
						]}
					>
						Crie uma nova senha segura para o seu acesso.
					</Text>
				</Animated.View>

				<Animated.View entering={FadeInUp.duration(800).delay(400)}>
					<Input
						label="Nova Senha"
						placeholder="Digite a nova senha"
						value={password}
						onChangeText={setPassword}
						isPassword
						leftIcon="lock-closed-outline"
					/>

					<Input
						label="Confirmar Senha"
						placeholder="Confirme a nova senha"
						value={confirmPassword}
						onChangeText={setConfirmPassword}
						isPassword
						leftIcon="lock-closed-outline"
					/>

					<Button
						title="Atualizar Senha"
						onPress={handleReset}
						className="mt-4 mb-8"
					/>
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
});
