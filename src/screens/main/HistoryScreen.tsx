import React, { useState, useMemo } from 'react';
import {
	View,
	Text,
	ScrollView,
	TouchableOpacity,
	Modal,
	Pressable,
	KeyboardAvoidingView,
	Platform,
	ActivityIndicator,
	RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeInRight } from 'react-native-reanimated';
import DateTimePicker, {
	DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';
import { useThemeColors } from '../../hooks/useThemeColors';
import { useTrips } from '../../hooks/useTrips';
import type { TripStatus, ServiceType } from '../../types/api';

export default function HistoryScreen() {
	const navigation = useNavigation<any>();
	const { themeColors, isDark } = useThemeColors();

	const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
	const [statusFilter, setStatusFilter] = useState<
		'all' | TripStatus
	>('all');
	const [typeFilter, setTypeFilter] = useState<
		'all' | ServiceType
	>('all');
	const [periodFilter, setPeriodFilter] = useState<
		'all' | 'today' | 'week' | 'month' | 'custom'
	>('all');
	const [customStart, setCustomStart] = useState<Date | null>(null);
	const [customEnd, setCustomEnd] = useState<Date | null>(null);
	const [showStartPicker, setShowStartPicker] = useState(false);
	const [showEndPicker, setShowEndPicker] = useState(false);

	const apiFilters = useMemo(() => {
		const filters: Record<string, unknown> = { limit: 50 };
		if (statusFilter !== 'all') filters.status = statusFilter;
		if (typeFilter !== 'all') filters.serviceType = typeFilter;
		if (periodFilter === 'today') {
			const today = new Date();
			today.setHours(0, 0, 0, 0);
			filters.dateFrom = today.toISOString();
		} else if (periodFilter === 'week') {
			const weekAgo = new Date();
			weekAgo.setDate(weekAgo.getDate() - 7);
			filters.dateFrom = weekAgo.toISOString();
		} else if (periodFilter === 'month') {
			const monthAgo = new Date();
			monthAgo.setMonth(monthAgo.getMonth() - 1);
			filters.dateFrom = monthAgo.toISOString();
		} else if (periodFilter === 'custom') {
			if (customStart) filters.dateFrom = customStart.toISOString();
			if (customEnd) {
				const end = new Date(customEnd);
				end.setHours(23, 59, 59, 999);
				filters.dateTo = end.toISOString();
			}
		}
		return filters;
	}, [statusFilter, typeFilter, periodFilter, customStart, customEnd]);

	const {
		data,
		isLoading,
		isFetchingNextPage,
		hasNextPage,
		fetchNextPage,
		refetch,
		isRefetching,
	} = useTrips(apiFilters);

	const allTrips = useMemo(
		() => data?.pages.flatMap((p) => p.trips) ?? [],
		[data],
	);

	const formatDate = (iso: string) => {
		const d = new Date(iso);
		return d.toLocaleDateString('pt-AO', {
			day: '2-digit',
			month: 'short',
			year: 'numeric',
		});
	};

	const formatTime = (iso: string) => {
		const d = new Date(iso);
		return d.toLocaleTimeString('pt-AO', {
			hour: '2-digit',
			minute: '2-digit',
		});
	};

	const getStatusConfig = (status: TripStatus) => {
		const isCompleted = status === 'COMPLETED';
		return {
			isCompleted,
			label: isCompleted ? 'Concluído' : 'Cancelado',
			color: isCompleted ? '#10B981' : '#ED1C24',
			bgColor: isCompleted ? '#10B98115' : '#ED1C2415',
		};
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
					Histórico
				</Text>
				<TouchableOpacity
					onPress={() => setIsFilterModalOpen(true)}
					className="w-10 h-10 items-center justify-center rounded-full bg-primary/10"
					activeOpacity={0.7}
				>
					<Ionicons
						name="options-outline"
						size={22}
						color={themeColors.primary}
					/>
				</TouchableOpacity>
			</View>

			<ScrollView
				contentContainerClassName="px-5 pb-10"
				showsVerticalScrollIndicator={false}
				onMomentumScrollEnd={() => {
					if (hasNextPage && !isFetchingNextPage) {
						fetchNextPage();
					}
				}}
				refreshControl={
					<RefreshControl
						refreshing={isRefetching}
						onRefresh={refetch}
					/>
				}
			>
				{isLoading ? (
					<View className="items-center pt-20">
						<ActivityIndicator size="large" color={themeColors.primary} />
					</View>
				) : allTrips.length === 0 ? (
					<Animated.View
						entering={FadeInDown.duration(600)}
						className="items-center pt-20"
					>
						<Ionicons
							name="document-text-outline"
							size={64}
							color={isDark ? '#404040' : '#D1D5DB'}
						/>
						<Text
							className="text-lg font-bold mt-4"
							style={{ color: themeColors.text }}
						>
							Nenhum resultado
						</Text>
						<Text className="text-sm font-medium mt-2 text-gray-500 dark:text-gray-400">
							Nenhuma viagem encontrada para este filtro.
						</Text>
					</Animated.View>
				) : (
					allTrips.map((item, index) => {
						const cfg = getStatusConfig(item.status);
						return (
							<Animated.View
								key={item.id}
								entering={FadeInRight.duration(500).delay(
									index * 75,
								)}
							>
								<TouchableOpacity
									className={`p-4 rounded-2xl mb-4 border ${isDark ? 'border-gray-800 bg-[#121212]' : 'border-gray-100 bg-white'}`}
									activeOpacity={0.7}
									onPress={() =>
										navigation.navigate('TripDetail', {
											tripId: item.id,
										})
									}
								>
									<View className="flex-row items-center justify-between mb-4">
										<View className="flex-row items-center bg-black/5 dark:bg-white/10 px-3 py-1.5 rounded-lg gap-2">
											<Ionicons
												name={
													item.serviceType === 'RIDE'
														? 'car-outline'
														: 'cube-outline'
												}
												size={16}
												color={themeColors.text}
											/>
											<Text
												className="text-xs font-bold"
												style={{
													color: themeColors.text,
												}}
											>
												{item.serviceType === 'RIDE'
													? 'Corrida'
													: 'Entrega'}
											</Text>
										</View>
										<View
											className={`flex-row items-center px-3 py-1.5 rounded-lg gap-2`}
											style={{ backgroundColor: cfg.bgColor }}
										>
											<View
												className="w-2 h-2 rounded-full"
												style={{ backgroundColor: cfg.color }}
											/>
											<Text
												className="text-xs font-bold"
												style={{ color: cfg.color }}
											>
												{cfg.label}
											</Text>
										</View>
									</View>

									<View className="mb-5 pl-1">
										<View className="flex-row items-start">
											<View className="w-4 items-center mr-3 mt-1">
												<View className="w-2.5 h-2.5 rounded-full bg-blue-500" />
												<View className="w-0.5 h-5 bg-gray-200 dark:bg-gray-700 my-1 rounded-full" />
												<View
													className={`w-2.5 h-2.5 rounded-full ${cfg.isCompleted ? 'bg-primary' : 'bg-red-500'}`}
												/>
											</View>
											<View className="flex-1 gap-3">
												<Text
													className="text-sm font-medium tracking-tight"
													style={{
														color: themeColors.text,
													}}
													numberOfLines={1}
												>
													{item.pickupAddress}
												</Text>
												<Text
													className="text-sm font-medium tracking-tight"
													style={{
														color: themeColors.text,
													}}
													numberOfLines={1}
												>
													{item.dropoffAddress}
												</Text>
											</View>
										</View>
									</View>

									<View className="flex-row justify-between items-end border-t border-gray-100 dark:border-gray-800 pt-3">
										<View>
											{item.driver && (
												<Text className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-1">
													{item.driver.user?.name} {item.driver.user?.surname}
												</Text>
											)}
											<View className="flex-row items-center gap-2">
												<Text className="text-xs font-medium text-gray-500 dark:text-gray-400">
													{formatDate(item.requestedAt)} • {formatTime(item.requestedAt)}
												</Text>
											</View>
										</View>
										<Text
											className="text-lg font-black tracking-tighter"
											style={{ color: themeColors.text }}
										>
											{Number(item.totalPrice).toLocaleString('pt-AO')} Kz
										</Text>
									</View>
								</TouchableOpacity>
							</Animated.View>
						);
					})
				)}

				{isFetchingNextPage && (
					<View className="py-4 items-center">
						<ActivityIndicator color={themeColors.primary} />
					</View>
				)}
			</ScrollView>

			<Modal
				visible={isFilterModalOpen}
				transparent={true}
				animationType="slide"
				onRequestClose={() => setIsFilterModalOpen(false)}
			>
				<KeyboardAvoidingView
					behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
					className="flex-1 justify-end"
				>
					<Pressable
						className="absolute inset-0 bg-black/50"
						onPress={() => setIsFilterModalOpen(false)}
					/>
					<View
						className={`rounded-t-3xl pt-6 pb-10 px-6 ${isDark ? 'bg-[#121212]' : 'bg-white'}`}
						style={{ minHeight: '60%' }}
					>
						<View className="flex-row items-center justify-between mb-6">
							<Text
								className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}
							>
								Filtros
							</Text>
							<TouchableOpacity
								onPress={() => setIsFilterModalOpen(false)}
								className="w-8 h-8 items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-full"
							>
								<Ionicons
									name="close"
									size={20}
									color={isDark ? '#FFF' : '#000'}
								/>
							</TouchableOpacity>
						</View>

						<ScrollView
							showsVerticalScrollIndicator={false}
							contentContainerClassName="pb-10"
						>
							<Text
								className={`text-sm font-bold uppercase tracking-wider mb-3 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}
							>
								Status
							</Text>
							<View className="flex-row flex-wrap gap-2 mb-6">
								{(
									['all', 'COMPLETED', 'CANCELLED'] as const
								).map((f) => {
									const isActive = statusFilter === f;
									return (
										<TouchableOpacity
											key={f}
											className={`px-4 py-2 rounded-full border ${isActive ? 'border-primary bg-primary' : 'border-gray-200 dark:border-gray-800'}`}
											onPress={() => setStatusFilter(f)}
											activeOpacity={0.7}
										>
											<Text
												className={`text-sm font-semibold ${isActive ? 'text-soft-black' : isDark ? 'text-gray-400' : 'text-gray-500'}`}
											>
												{f === 'all'
													? 'Todos'
													: f === 'COMPLETED'
														? 'Concluídos'
														: 'Cancelados'}
											</Text>
										</TouchableOpacity>
									);
								})}
							</View>

							<Text
								className={`text-sm font-bold uppercase tracking-wider mb-3 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}
							>
								Tipo de Viagem
							</Text>
							<View className="flex-row flex-wrap gap-2 mb-6">
								{(['all', 'RIDE', 'DELIVERY'] as const).map(
									(f) => {
										const isActive = typeFilter === f;
										return (
											<TouchableOpacity
												key={f}
												className={`px-4 py-2 rounded-full border ${isActive ? 'border-primary bg-primary' : 'border-gray-200 dark:border-gray-800'}`}
												onPress={() => setTypeFilter(f)}
												activeOpacity={0.7}
											>
												<Text
													className={`text-sm font-semibold ${isActive ? 'text-soft-black' : isDark ? 'text-gray-400' : 'text-gray-500'}`}
												>
													{f === 'all'
														? 'Todos'
														: f === 'RIDE'
															? 'Corrida'
															: 'Entrega'}
												</Text>
											</TouchableOpacity>
										);
									},
								)}
							</View>

							<Text
								className={`text-sm font-bold uppercase tracking-wider mb-3 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}
							>
								Data
							</Text>
							<View className="flex-row flex-wrap gap-2 mb-4">
								{(
									[
										'all',
										'today',
										'week',
										'month',
										'custom',
									] as const
								).map((f) => {
									const isActive = periodFilter === f;
									return (
										<TouchableOpacity
											key={f}
											className={`px-4 py-2 rounded-full border ${isActive ? 'border-primary bg-primary' : 'border-gray-200 dark:border-gray-800'}`}
											onPress={() => setPeriodFilter(f)}
											activeOpacity={0.7}
										>
											<Text
												className={`text-sm font-semibold ${isActive ? 'text-soft-black' : isDark ? 'text-gray-400' : 'text-gray-500'}`}
											>
												{f === 'all'
													? 'Qualquer'
													: f === 'today'
														? 'Hoje'
														: f === 'week'
															? 'Esta semana'
															: f === 'month'
																? 'Este mês'
																: 'Personalizado'}
											</Text>
										</TouchableOpacity>
									);
								})}
							</View>

							{periodFilter === 'custom' && (
								<Animated.View
									entering={FadeInDown.duration(300)}
									className="mb-6"
								>
									<View className="flex-row gap-4">
										<View className="flex-1">
											<Text
												className={`text-xs mb-1.5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}
											>
												Data Inicial
											</Text>
											<TouchableOpacity
												onPress={() =>
													setShowStartPicker(true)
												}
												className={`px-4 py-3.5 flex-row items-center justify-between rounded-xl border ${isDark ? 'border-gray-800 bg-[#1A1A1A]' : 'border-gray-200 bg-gray-50'}`}
												activeOpacity={0.7}
											>
												<Text
													className={
														customStart
															? isDark
																? 'text-white'
																: 'text-black'
															: isDark
																? 'text-gray-500'
																: 'text-gray-400'
													}
												>
													{customStart
														? customStart.toLocaleDateString('pt-AO')
														: 'Selecionar...'}
												</Text>
												<Ionicons
													name="calendar-outline"
													size={16}
													color={
														isDark
															? '#888'
															: '#A0A0A0'
													}
												/>
											</TouchableOpacity>
											{showStartPicker && (
												<DateTimePicker
													value={customStart ?? new Date()}
													mode="date"
													display="default"
													onChange={(
														event: DateTimePickerEvent,
														selectedDate?: Date,
													) => {
														setShowStartPicker(
															Platform.OS ===
																'ios',
														);
														if (selectedDate)
															setCustomStart(
																selectedDate,
															);
													}}
												/>
											)}
										</View>
										<View className="flex-1">
											<Text
												className={`text-xs mb-1.5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}
											>
												Data Final
											</Text>
											<TouchableOpacity
												onPress={() =>
													setShowEndPicker(true)
												}
												className={`px-4 py-3.5 flex-row items-center justify-between rounded-xl border ${isDark ? 'border-gray-800 bg-[#1A1A1A]' : 'border-gray-200 bg-gray-50'}`}
												activeOpacity={0.7}
											>
												<Text
													className={
														customEnd
															? isDark
																? 'text-white'
																: 'text-black'
															: isDark
																? 'text-gray-500'
																: 'text-gray-400'
													}
												>
													{customEnd
														? customEnd.toLocaleDateString('pt-AO')
														: 'Selecionar...'}
												</Text>
												<Ionicons
													name="calendar-outline"
													size={16}
													color={
														isDark
															? '#888'
															: '#A0A0A0'
													}
												/>
											</TouchableOpacity>
											{showEndPicker && (
												<DateTimePicker
													value={customEnd ?? new Date()}
													mode="date"
													display="default"
													onChange={(
														event: DateTimePickerEvent,
														selectedDate?: Date,
													) => {
														setShowEndPicker(
															Platform.OS ===
																'ios',
														);
														if (selectedDate)
															setCustomEnd(
																selectedDate,
															);
													}}
												/>
											)}
										</View>
									</View>
								</Animated.View>
							)}
						</ScrollView>

						<View className="flex-row gap-3 pt-4 border-t border-gray-100 dark:border-gray-900 mt-auto">
							<TouchableOpacity
								className="flex-1 py-3.5 rounded-xl border border-gray-300 dark:border-gray-700 items-center justify-center"
								onPress={() => {
									setStatusFilter('all');
									setTypeFilter('all');
									setPeriodFilter('all');
									setCustomStart(null);
									setCustomEnd(null);
								}}
							>
								<Text
									className={`font-bold ${isDark ? 'text-gray-300' : 'text-gray-600'}`}
								>
									Limpar
								</Text>
							</TouchableOpacity>
							<TouchableOpacity
								className="flex-1 py-3.5 rounded-xl bg-primary items-center justify-center"
								onPress={() => setIsFilterModalOpen(false)}
							>
								<Text className="font-bold text-soft-black">
									Aplicar
								</Text>
							</TouchableOpacity>
						</View>
					</View>
				</KeyboardAvoidingView>
			</Modal>
		</SafeAreaView>
	);
}


