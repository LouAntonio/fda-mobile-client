import React, { useState } from 'react';
import {
	Text,
	TouchableOpacity,
	Alert,
	Image,
	ScrollView,
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

type ForgotPasswordNavigationProp = NativeStackNavigationProp<
	AuthStackParamList,
	'ForgotPassword'
>;

export default function ForgotPasswordScreen() {
	const navigation = useNavigation<ForgotPasswordNavigationProp>();
	const { themeColors } = useThemeColors();

	const [phone, setPhone] = useState('');

	const handleSendOTP = () => {
		if (!phone) {
			Alert.alert('Erro', 'Por favor, insira o seu número de telefone.');
			return;
		}
		// logic to send OTP soon
		Alert.alert('Sucesso', 'Código OTP enviado para o seu telefone.');
		navigation.navigate('VerifyOTP', { phone });
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
						RECUPERAR ACESSO
					</Text>
					<Text
						className="text-base text-center px-4"
						style={[
							styles.description,
							{ color: themeColors.secondary },
						]}
					>
						Informe o seu número de telefone para receber um código
						de verificação (OTP).
					</Text>
				</Animated.View>

				<Animated.View entering={FadeInUp.duration(800).delay(400)}>
					<Input
						label="Telefone"
						placeholder="9XX XXX XXX"
						value={phone}
						onChangeText={setPhone}
						keyboardType="phone-pad"
						leftIcon="call-outline"
					/>

					<Button
						title="Enviar Código OTP"
						onPress={handleSendOTP}
						className="mt-4 mb-8"
					/>

					<TouchableOpacity
						onPress={() => navigation.goBack()}
						className="items-center py-4"
						activeOpacity={0.6}
					>
						<Text
							style={[
								styles.backText,
								{ color: themeColors.primary },
							]}
						>
							VOLTAR PARA LOGIN
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
	backText: {
		fontWeight: '900',
		letterSpacing: 1,
	},
});
