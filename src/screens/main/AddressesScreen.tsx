import React, { useState, useCallback } from 'react';
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
	ActivityIndicator,
	RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeInRight } from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import { useThemeColors } from '../../hooks/useThemeColors';
import { useAddresses } from '../../hooks/useAddresses';
import { AddressListSkeleton } from '../../components/skeletons/AddressSkeleton';
import Input from '../../components/Input';
import Button from '../../components/Button';
import type { AddressLabel } from '../../types/api';

const LABEL_OPTIONS: { label: string; value: AddressLabel; icon: string }[] = [
	{ label: 'Casa', value: 'HOME', icon: 'home' },
	{ label: 'Trabalho', value: 'WORK', icon: 'briefcase' },
	{ label: 'Outro', value: 'OTHER', icon: 'location-outline' },
];

export default function AddressesScreen() {
	const navigation = useNavigation();
	const { themeColors, isDark } = useThemeColors();
	const {
		addresses,
		isLoading,
		refetch,
		createAddress,
		isCreating,
		deleteAddress,
	} = useAddresses();

	const [isRefreshing, setIsRefreshing] = useState(false);
	const [showAddModal, setShowAddModal] = useState(false);

	const handleRefresh = useCallback(async () => {
		setIsRefreshing(true);
		await refetch();
		setIsRefreshing(false);
	}, [refetch]);
	const [newLabel, setNewLabel] = useState('');
	const [newAddress, setNewAddress] = useState('');
	const [selectedLabel, setSelectedLabel] = useState<AddressLabel>('OTHER');

	const handleAdd = () => {
		if (!newLabel || !newAddress) return;
		createAddress(
			{
				label: selectedLabel,
				customLabel: selectedLabel === 'OTHER' ? newLabel : undefined,
				address: newAddress,
				lat: -8.8399,
				lng: 13.2344,
			},
			{
				onSuccess: () => {
					setNewLabel('');
					setNewAddress('');
					setSelectedLabel('OTHER');
					setShowAddModal(false);
				},
			},
		);
	};

	const handleDelete = (id: string) => {
		deleteAddress(id);
	};

	const iconForLabel = (label: AddressLabel) => {
		const found = LABEL_OPTIONS.find((o) => o.value === label);
		return found?.icon || 'location-outline';
	};

	return (
		<SafeAreaView
			className="flex-1"
			style={{ backgroundColor: themeColors.background }}
		>
			<View
				className="flex-row items-center justify-between px-5 py-3 border-b-2"
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

			{isLoading ? (
				<AddressListSkeleton />
			) : (
				<ScrollView
					contentContainerClassName="px-5 pb-10 pt-5"
					showsVerticalScrollIndicator={false}
					refreshControl={
						<RefreshControl
							refreshing={isRefreshing}
							onRefresh={handleRefresh}
						/>
					}
				>
					{addresses.length === 0 ? (
						<View className="items-center py-20">
							<Ionicons
								name="location-outline"
								size={48}
								color="#9CA3AF"
							/>
							<Text className="text-gray-400 mt-3 text-base">
								Nenhum endereço salvo
							</Text>
						</View>
					) : (
						addresses.map((item, index) => (
							<Animated.View
								key={item.id}
								entering={FadeInRight.duration(500).delay(
									index * 100,
								)}
							>
								<TouchableOpacity
									className={`p-5 rounded-2xl mb-3 border ${isDark ? 'border-[#262626] bg-[#171717]' : 'border-gray-200 bg-white'}`}
									activeOpacity={0.7}
								>
									<View className="flex-row items-center justify-between">
										<View className="flex-row items-center flex-1 pr-4 gap-3">
											<View
												className={`w-10 h-10 rounded-xl items-center justify-center ${isDark ? 'bg-yellow-500/10' : 'bg-yellow-50'}`}
											>
												<Ionicons
													name={
														iconForLabel(
															item.label,
														) as any
													}
													size={20}
													color={themeColors.primary}
												/>
											</View>
											<View className="flex-1">
												<Text
													className="text-lg font-extrabold tracking-tight mb-1"
													style={{
														color: themeColors.text,
													}}
												>
													{item.customLabel ||
														item.label}
												</Text>
												<Text
													className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}
													numberOfLines={2}
												>
													{item.address}
												</Text>
											</View>
										</View>
										<TouchableOpacity
											onPress={() =>
												handleDelete(item.id)
											}
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
						))
					)}

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
			)}

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

							<Text className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-3">
								Tipo de endereço
							</Text>
							<View className="flex-row gap-3 mb-5">
								{LABEL_OPTIONS.map((opt) => (
									<TouchableOpacity
										key={opt.value}
										onPress={() =>
											setSelectedLabel(opt.value)
										}
										className={`flex-1 flex-row items-center justify-center py-3 px-2 rounded-xl gap-1 ${
											selectedLabel === opt.value
												? 'bg-primary'
												: isDark
													? 'bg-[#262626]'
													: 'bg-gray-100'
										}`}
										activeOpacity={0.7}
									>
										<Ionicons
											name={opt.icon as any}
											size={16}
											color={
												selectedLabel === opt.value
													? '#231F20'
													: themeColors.secondary
											}
										/>
										<Text
											className={`text-xs font-bold ${
												selectedLabel === opt.value
													? 'text-secondary'
													: 'text-gray-500 dark:text-gray-400'
											}`}
										>
											{opt.label}
										</Text>
									</TouchableOpacity>
								))}
							</View>

							<Input
								label={
									selectedLabel === 'OTHER'
										? 'Nome personalizado'
										: 'Nome do local'
								}
								value={newLabel}
								onChangeText={setNewLabel}
								placeholder="Ex: Casa, Trabalho"
							/>
							<Input
								label="Endereço completo"
								value={newAddress}
								onChangeText={setNewAddress}
								placeholder="Ex: Rocha Cabine, Luanda"
							/>
							<Button
								title="Adicionar"
								onPress={handleAdd}
								loading={isCreating}
							/>
						</View>
					</TouchableWithoutFeedback>
				</KeyboardAvoidingView>
			</Modal>
		</SafeAreaView>
	);
}
