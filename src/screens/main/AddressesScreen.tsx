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
	Keyboard,
	TouchableWithoutFeedback,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeInRight } from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import { useThemeColors } from '../../hooks/useThemeColors';
import Input from '../../components/Input';
import Button from '../../components/Button';

const MOCK_ADDRESSES = [
	{
		id: '1',
		label: 'Casa',
		address: 'Rocha Cabine, Luanda',
		icon: 'home',
		isDefault: true,
	},
	{
		id: '2',
		label: 'Trabalho',
		address: 'Edifício Kilamba, Marginal',
		icon: 'briefcase',
		isDefault: false,
	},
	{
		id: '3',
		label: 'Ginásio',
		address: 'Rua Major Kanhangulo, Luanda',
		icon: 'barbell-outline',
		isDefault: false,
	},
];

export default function AddressesScreen() {
	const navigation = useNavigation();
	const { themeColors, isDark } = useThemeColors();
	const [addresses, setAddresses] = useState(MOCK_ADDRESSES);
	const [showAddModal, setShowAddModal] = useState(false);
	const [newLabel, setNewLabel] = useState('');
	const [newAddress, setNewAddress] = useState('');

	const handleAdd = () => {
		if (!newLabel || !newAddress) return;
		setAddresses([
			...addresses,
			{
				id: String(Date.now()),
				label: newLabel,
				address: newAddress,
				icon: 'location-outline',
				isDefault: false,
			},
		]);
		setNewLabel('');
		setNewAddress('');
		setShowAddModal(false);
	};

	const handleDelete = (id: string) => {
		setAddresses(addresses.filter((a) => a.id !== id));
	};

	return (
		<SafeAreaView
			className="flex-1"
			style={{ backgroundColor: themeColors.background }}
		>
			<View
				className="flex-row items-center justify-between px-5 py-3 border-b-2"
				// eslint-disable-next-line react-native/no-inline-styles
				style={{ borderBottomColor: isDark ? '#262626' : '#F3F4F6' }}
			>
				<TouchableOpacity
					onPress={() => navigation.goBack()}
					className="w-10 h-10 items-center justify-center rounded-full bg-black/5 dark:bg-white/10"
					activeOpacity={0.7}
				>
					<Ionicons
						name="chevron-back"
						size={22}
						color={themeColors.text}
					/>
				</TouchableOpacity>
				<Text
					className="text-xl font-bold tracking-tight"
					style={{ color: themeColors.text }}
				>
					Endereços
				</Text>
				<TouchableOpacity
					onPress={() => setShowAddModal(true)}
					className="w-10 h-10 items-center justify-center rounded-full bg-black/5 dark:bg-white/10"
					activeOpacity={0.7}
				>
					<Ionicons
						name="add"
						size={24}
						color={themeColors.primary}
					/>
				</TouchableOpacity>
			</View>

			<ScrollView
				contentContainerClassName="px-5 pb-10 pt-5"
				showsVerticalScrollIndicator={false}
			>
				{addresses.map((item, index) => (
					<Animated.View
						key={item.id}
						entering={FadeInRight.duration(500).delay(index * 100)}
					>
						<TouchableOpacity
							className={`p-5 rounded-2xl mb-3 border ${isDark ? 'border-[#262626] bg-[#171717]' : 'border-gray-200 bg-white'}`}
							activeOpacity={0.7}
						>
							<View className="flex-row items-center justify-between">
								<View className="flex-1 pr-4">
									<Text
										className="text-lg font-extrabold tracking-tight mb-1"
										style={{ color: themeColors.text }}
									>
										{item.label}
									</Text>
									<Text
										className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}
										numberOfLines={2}
									>
										{item.address}
									</Text>
								</View>
								<TouchableOpacity
									onPress={() => handleDelete(item.id)}
									className={`p-2.5 rounded-full ${isDark ? 'bg-red-500/10' : 'bg-red-50'}`}
									activeOpacity={0.6}
								>
									<Ionicons
										name="trash-outline"
										size={20}
										color="#EF4444"
									/>
								</TouchableOpacity>
							</View>
						</TouchableOpacity>
					</Animated.View>
				))}

				<Animated.View entering={FadeInDown.duration(600)}>
					<TouchableOpacity
						onPress={() => setShowAddModal(true)}
						className="flex-row items-center justify-center py-5 gap-2"
						activeOpacity={0.6}
					>
						<Ionicons
							name="add-circle-outline"
							size={24}
							color={themeColors.primary}
						/>
						<Text
							className="text-base font-bold"
							style={{ color: themeColors.primary }}
						>
							Adicionar novo endereço
						</Text>
					</TouchableOpacity>
				</Animated.View>
			</ScrollView>

			<Modal
				visible={showAddModal}
				animationType="slide"
				transparent
				onRequestClose={() => setShowAddModal(false)}
			>
				<KeyboardAvoidingView
					behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
					className="flex-1 justify-end"
				>
					<Pressable
						className="absolute inset-0 bg-black/50"
						onPress={() => setShowAddModal(false)}
					/>
					<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
						<View
							className={`rounded-t-3xl p-6 pb-10 ${isDark ? 'bg-[#121212]' : 'bg-white'}`}
						>
							<View className="flex-row items-center justify-between mb-6">
								<Text
									className={`text-2xl font-black ${isDark ? 'text-white' : 'text-gray-900'}`}
								>
									Novo Endereço
								</Text>
								<TouchableOpacity
									onPress={() => setShowAddModal(false)}
									className="w-8 h-8 items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-full"
									activeOpacity={0.6}
								>
									<Ionicons
										name="close"
										size={20}
										color={isDark ? '#FFF' : '#000'}
									/>
								</TouchableOpacity>
							</View>
							<Input
								label="Nome (ex: Casa, Trabalho)"
								value={newLabel}
								onChangeText={setNewLabel}
								placeholder="Ex: Casa"
							/>
							<Input
								label="Endereço completo"
								value={newAddress}
								onChangeText={setNewAddress}
								placeholder="Ex: Rocha Cabine, Luanda"
							/>
							<Button title="Adicionar" onPress={handleAdd} />
						</View>
					</TouchableWithoutFeedback>
				</KeyboardAvoidingView>
			</Modal>
		</SafeAreaView>
	);
}
