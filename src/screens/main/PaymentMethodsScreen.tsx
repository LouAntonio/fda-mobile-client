import React, { useState } from 'react';
import {
	View,
	Text,
	ScrollView,
	TouchableOpacity,
	Modal,
	Pressable,
	Platform,
	KeyboardAvoidingView,
	TouchableWithoutFeedback,
	Keyboard,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, {
	FadeInDown,
	FadeInRight,
	FadeInUp,
} from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import { useThemeColors } from '../../hooks/useThemeColors';
import Input from '../../components/Input';
import Button from '../../components/Button';

const INITIAL_METHODS: Array<{
	id: string;
	type: string;
	label: string;
	icon: 'cash-outline' | 'phone';
	details: string;
	isDefault: boolean;
	isRemovable: boolean;
}> = [
	{
		id: 'cash',
		type: 'cash',
		label: 'Dinheiro',
		icon: 'cash-outline' as const,
		details: 'Pagamento com Dinheiro vivo',
		isDefault: true,
		isRemovable: false,
	},
];

export default function PaymentMethodsScreen() {
	const navigation = useNavigation();
	const { themeColors, isDark } = useThemeColors();
	const [methods, setMethods] = useState(INITIAL_METHODS);
	const [showAddModal, setShowAddModal] = useState(false);
	const [newPhone, setNewPhone] = useState('');

	const handleAdd = () => {
		if (!newPhone) return;
		const formattedPhone = newPhone.startsWith('+244')
			? newPhone
			: `+244 ${newPhone}`;

		setMethods([
			...methods,
			{
				id: String(Date.now()),
				type: 'multicaixa',
				label: 'Multicaixa Express',
				icon: 'phone' as const,
				details: formattedPhone,
				isDefault: false,
				isRemovable: true,
			},
		]);
		setNewPhone('');
		setShowAddModal(false);
	};

	const handleDelete = (id: string) => {
		setMethods(methods.filter((m) => m.id !== id));
	};

	const hasMulticaixa = methods.some((m) => m.type === 'multicaixa');

	return (
		<SafeAreaView
			className="flex-1"
			style={{ backgroundColor: themeColors.background }}
		>
			{/* Header */}
			<View className="flex-row items-center justify-between px-5 pt-2 pb-4">
				<TouchableOpacity
					onPress={() => navigation.goBack()}
					className="w-11 h-11 items-center justify-center rounded-full bg-black/5 dark:bg-white/10"
					activeOpacity={0.7}
				>
					<Ionicons
						name="chevron-back"
						size={24}
						color={themeColors.text}
					/>
				</TouchableOpacity>
				<Text
					className="text-xl font-bold tracking-tight"
					style={{ color: themeColors.text }}
				>
					Métodos de Pagamento
				</Text>
				<View className="w-11 h-11 items-center justify-center rounded-full bg-black/5 dark:bg-white/10">
					<Ionicons
						name="wallet-outline"
						size={22}
						color={themeColors.text}
					/>
				</View>
			</View>

			<ScrollView
				contentContainerClassName="px-5 pb-10 pt-4"
				showsVerticalScrollIndicator={false}
			>
				{/* Section Title */}
				<Animated.View
					entering={FadeInDown.duration(400)}
					className="mb-6"
				>
					<Text
						className="text-sm font-bold uppercase tracking-widest"
						style={{ color: themeColors.secondary }}
					>
						Métodos de Pagamento
					</Text>
				</Animated.View>

				{/* Cards */}
				<View className="gap-5">
					{methods.map((method, index) => (
						<Animated.View
							key={method.id}
							entering={FadeInRight.duration(500).delay(
								index * 100,
							)}
						>
							{method.type === 'multicaixa' ? (
								/* Premium Multicaixa Express Card */
								<View
									className="relative w-full rounded-[32px] overflow-hidden shadow-2xl"
									// eslint-disable-next-line react-native/no-inline-styles
									style={{
										backgroundColor: '#1A1C1E',
										elevation: 8,
									}}
								>
									{/* Decorative shapes */}
									<View className="absolute -right-12 -top-12 w-48 h-48 rounded-full bg-white/5" />
									<View className="absolute -left-12 -bottom-12 w-40 h-40 rounded-full bg-white/5" />
									<View
										className="absolute right-10 bottom-5 w-20 h-20 rounded-full"
										// eslint-disable-next-line react-native/no-inline-styles
										style={{
											backgroundColor:
												themeColors.primary,
											opacity: 0.1,
										}}
									/>

									<View className="p-7 h-56 justify-between">
										<View className="flex-row justify-between items-start">
											<View className="w-14 h-14 items-center justify-center rounded-2xl bg-white/5 border border-white/10">
												<MaterialCommunityIcons
													name="bank"
													size={32}
													color={themeColors.primary}
												/>
											</View>
											<View className="flex-row items-center">
												{method.isRemovable && (
													<TouchableOpacity
														onPress={() =>
															handleDelete(
																method.id,
															)
														}
														className="w-11 h-11 items-center justify-center rounded-full bg-red-500/10 border border-red-500/20"
														activeOpacity={0.7}
													>
														<Ionicons
															name="trash-outline"
															size={20}
															color="#EF4444"
														/>
													</TouchableOpacity>
												)}
											</View>
										</View>

										<View>
											<Text className="text-white/40 text-[10px] uppercase tracking-[2px] font-black mb-1">
												{method.label}
											</Text>
											<Text className="text-white text-2xl font-mono tracking-[4px] mb-6">
												{method.details}
											</Text>

											<View className="flex-row justify-between items-center">
												<View className="flex-row items-center gap-2 px-3 py-1.5 rounded-full" />
												<View className="opacity-40">
													<MaterialCommunityIcons
														name="check-decagram"
														size={24}
														color={
															themeColors.primary
														}
													/>
												</View>
											</View>
										</View>
									</View>
								</View>
							) : (
								/* Premium Cash Card */
								<View
									className="relative w-full rounded-[32px] overflow-hidden shadow-2xl"
									// eslint-disable-next-line react-native/no-inline-styles
									style={{
										backgroundColor: isDark
											? '#0D1F17'
											: '#F0F9F4',
										elevation: 4,
									}}
								>
									{/* Decorative background pattern */}
									<View className="absolute -right-8 -bottom-8 w-40 h-40 rounded-full bg-green-500/5" />
									<View className="absolute left-10 top-5 w-16 h-16 rounded-full bg-green-500/5" />

									<View className="p-7 h-52 justify-between">
										<View className="flex-row justify-between items-start">
											<View className="w-14 h-14 items-center justify-center rounded-2xl bg-green-500/10 border border-green-500/20">
												<MaterialCommunityIcons
													name="cash-multiple"
													size={32}
													color="#22C55E"
												/>
											</View>
											{method.isDefault && (
												<View className="bg-green-500/20 px-3 py-1.5 rounded-full border border-green-500/30">
													<Text className="text-[10px] font-black text-green-600 dark:text-green-400 uppercase tracking-wider">
														Padrão
													</Text>
												</View>
											)}
										</View>

										<View>
											<Text
												className={`${isDark ? 'text-white/40' : 'text-gray-500'} text-[10px] uppercase tracking-[2px] font-black mb-1`}
											>
												{method.label}
											</Text>
											<Text
												className={`${isDark ? 'text-white' : 'text-gray-900'} text-2xl font-bold tracking-tight mb-4`}
											>
												Pagamento em Cash
											</Text>

											<View className="flex-row items-center gap-2">
												<Ionicons
													name="information-circle-outline"
													size={16}
													color={
														isDark
															? '#22C55E'
															: '#166534'
													}
												/>
												<Text
													className={`${isDark ? 'text-green-400/80' : 'text-green-700/80'} font-medium text-xs`}
												>
													{method.details}
												</Text>
											</View>
										</View>
									</View>
								</View>
							)}
						</Animated.View>
					))}
				</View>

				{/* Add New Method Button */}
				{!hasMulticaixa && (
					<Animated.View
						entering={FadeInUp.duration(600).delay(200)}
						className="mt-8"
					>
						<TouchableOpacity
							onPress={() => setShowAddModal(true)}
							className={`p-6 rounded-3xl border-2 border-dashed ${isDark ? 'border-gray-700 bg-[#1A1A1A]/50' : 'border-gray-300 bg-gray-50'}`}
							activeOpacity={0.6}
						>
							<View className="flex-row items-center justify-center gap-4">
								<View
									className="w-12 h-12 rounded-full items-center justify-center"
									style={{
										backgroundColor: themeColors.primary,
									}}
								>
									<Ionicons
										name="add"
										size={28}
										color="#000"
									/>
								</View>
								<View>
									<Text
										className="text-base font-bold"
										style={{ color: themeColors.text }}
									>
										Adicionar Multicaixa
									</Text>
									<Text
										className="text-sm"
										style={{ color: themeColors.secondary }}
									>
										Associe seu número Express
									</Text>
								</View>
							</View>
						</TouchableOpacity>
					</Animated.View>
				)}

				<Animated.View
					entering={FadeInUp.duration(600).delay(400)}
					className="mt-10 items-center px-4"
				>
					<MaterialCommunityIcons
						name="shield-check"
						size={32}
						color={themeColors.secondary}
						className="mb-2"
					/>
					<Text
						className="text-center text-sm"
						style={{ color: themeColors.secondary }}
					>
						Os seus dados estão protegidos. Não partilhamos as suas
						informações.
					</Text>
				</Animated.View>
			</ScrollView>

			{/* Add Multicaixa Modal */}
			<Modal
				visible={showAddModal}
				animationType="fade"
				transparent
				onRequestClose={() => setShowAddModal(false)}
			>
				<KeyboardAvoidingView
					behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
					className="flex-1 justify-end"
				>
					<Pressable
						className="absolute inset-0 bg-black/60"
						onPress={() => setShowAddModal(false)}
					/>
					<Animated.View
						entering={FadeInDown.duration(400).springify()}
					>
						<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
							<View
								className={`rounded-t-[40px] px-6 pt-4 pb-10 ${isDark ? 'bg-[#1C1C1E]' : 'bg-white shadow-2xl'}`}
							>
								{/* Handle */}
								<View className="w-12 h-1.5 bg-gray-300 dark:bg-gray-600 rounded-full self-center mb-6" />

								<View className="flex-row items-center justify-between mb-8">
									<View>
										<Text
											className={`text-2xl font-black ${isDark ? 'text-white' : 'text-gray-900'}`}
										>
											Multicaixa Express
										</Text>
										<Text
											className="text-sm mt-1"
											style={{
												color: themeColors.secondary,
											}}
										>
											Insira o número associado
										</Text>
									</View>
									<TouchableOpacity
										onPress={() => setShowAddModal(false)}
										className="w-10 h-10 items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-full"
										activeOpacity={0.6}
									>
										<Ionicons
											name="close"
											size={24}
											color={isDark ? '#FFF' : '#000'}
										/>
									</TouchableOpacity>
								</View>

								<View className="flex-row items-center justify-center mb-8">
									<View
										className="w-24 h-24 rounded-[32px] items-center justify-center shadow-lg"
										// eslint-disable-next-line react-native/no-inline-styles
										style={{
											backgroundColor:
												themeColors.primary,
											shadowColor: themeColors.primary,
											elevation: 10,
										}}
									>
										<MaterialCommunityIcons
											name="cellphone-nfc"
											size={48}
											color="#000"
										/>
									</View>
								</View>

								<View className="mb-6">
									<Input
										label="Número de telefone"
										value={newPhone}
										onChangeText={setNewPhone}
										placeholder="923 456 789"
										keyboardType="phone-pad"
										maxLength={9}
									/>
								</View>

								<Button
									title="Vincular Multicaixa"
									onPress={handleAdd}
								/>
							</View>
						</TouchableWithoutFeedback>
					</Animated.View>
				</KeyboardAvoidingView>
			</Modal>
		</SafeAreaView>
	);
}
