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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeInRight } from 'react-native-reanimated';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';
import { useThemeColors } from '../../hooks/useThemeColors';

const MOCK_HISTORY = [
	{
		id: '1',
		type: 'Corrida',
		from: 'Rocha Cabine, Luanda',
		to: 'Edifício Kilamba, Marginal',
		date: '28 Abr 2026',
		time: '14:32',
		price: '1.200 Kz',
		status: 'completed',
		driver: 'João M.',
		rating: 5,
	},
	{
		id: '2',
		type: 'Entrega',
		from: 'Belas Shopping',
		to: 'Rua da Samba, Luanda',
		date: '25 Abr 2026',
		time: '09:15',
		price: '800 Kz',
		status: 'completed',
		driver: 'Maria S.',
		rating: 4,
	},
	{
		id: '3',
		type: 'Corrida',
		from: 'Talatona, Luanda',
		to: 'Ilha de Luanda',
		date: '22 Abr 2026',
		time: '18:45',
		price: '2.500 Kz',
		status: 'cancelled',
		driver: 'Pedro A.',
		rating: 0,
	},
	{
		id: '4',
		type: 'Corrida',
		from: 'Aeroporto 4 de Fevereiro',
		to: 'Hotel Epic Sana',
		date: '18 Abr 2026',
		time: '21:10',
		price: '3.200 Kz',
		status: 'completed',
		driver: 'Ana C.',
		rating: 5,
	},
	{
		id: '5',
		type: 'Entrega',
		from: 'Restaurante Nandinha',
		to: 'Rua Major Kanhangulo',
		date: '15 Abr 2026',
		time: '12:30',
		price: '500 Kz',
		status: 'completed',
		driver: 'Carlos D.',
		rating: 4,
	},
];

const MONTH_MAP: Record<string, number> = {
	Jan: 0,
	Fev: 1,
	Mar: 2,
	Abr: 3,
	Mai: 4,
	Jun: 5,
	Jul: 6,
	Ago: 7,
	Set: 8,
	Out: 9,
	Nov: 10,
	Dez: 11,
};

function parseDate(dateStr: string): Date {
	const parts = dateStr.split(' ');
	const day = parseInt(parts[0], 10);
	const month = MONTH_MAP[parts[1]] || 0;
	const year = parseInt(parts[2], 10);
	return new Date(year, month, day);
}

function matchesPeriod(
	dateStr: string,
	period: string,
	start?: string,
	end?: string,
): boolean {
	if (period === 'all') return true;
	const date = parseDate(dateStr);
	const now = new Date();
	const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

	if (period === 'today') {
		return date.getTime() === today.getTime();
	}

	if (period === 'week') {
		const weekAgo = new Date(today);
		weekAgo.setDate(weekAgo.getDate() - 7);
		return date >= weekAgo && date <= today;
	}

	if (period === 'month') {
		const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
		return date >= monthStart && date <= today;
	}

	if (period === 'custom' && start && end) {
		const startDate = parseDate(start);
		const endDate = parseDate(end);

		// Considerar apenas a data para a busca Custom do Date Picker
		const checkDate = new Date(
			date.getFullYear(),
			date.getMonth(),
			date.getDate(),
		);
		const startCheck = new Date(
			startDate.getFullYear(),
			startDate.getMonth(),
			startDate.getDate(),
		);
		const endCheck = new Date(
			endDate.getFullYear(),
			endDate.getMonth(),
			endDate.getDate(),
		);

		return checkDate >= startCheck && checkDate <= endCheck;
	}

	return true;
}

function formatDateStr(d: Date): string {
	const day = d.getDate().toString().padStart(2, '0');
	const months = [
		'Jan',
		'Fev',
		'Mar',
		'Abr',
		'Mai',
		'Jun',
		'Jul',
		'Ago',
		'Set',
		'Out',
		'Nov',
		'Dez',
	];
	const month = months[d.getMonth()];
	const year = d.getFullYear();
	return `${day} ${month} ${year}`;
}

export default function HistoryScreen() {
	const navigation = useNavigation();
	const { themeColors, isDark } = useThemeColors();

	const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
	const [statusFilter, setStatusFilter] = useState<
		'all' | 'completed' | 'cancelled'
	>('all');
	const [typeFilter, setTypeFilter] = useState<'all' | 'Corrida' | 'Entrega'>(
		'all',
	);
	const [periodFilter, setPeriodFilter] = useState<
		'all' | 'today' | 'week' | 'month' | 'custom'
	>('all');

	const [customStart, setCustomStart] = useState('');
	const [customEnd, setCustomEnd] = useState('');

	const [showStartPicker, setShowStartPicker] = useState(false);
	const [showEndPicker, setShowEndPicker] = useState(false);

	const initialStartDate = customStart ? parseDate(customStart) : new Date();
	const initialEndDate = customEnd ? parseDate(customEnd) : new Date();

	const filtered = useMemo(() => {
		return MOCK_HISTORY.filter((item) => {
			const statusMatch =
				statusFilter === 'all' || item.status === statusFilter;
			const typeMatch = typeFilter === 'all' || item.type === typeFilter;
			const periodMatch = matchesPeriod(
				item.date,
				periodFilter,
				customStart,
				customEnd,
			);
			return statusMatch && typeMatch && periodMatch;
		});
	}, [statusFilter, typeFilter, periodFilter, customStart, customEnd]);

	return (
		<SafeAreaView
			className="flex-1"
			style={{ backgroundColor: themeColors.background }}
		>
			{/* Header */}
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
			>
				{filtered.length === 0 ? (
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
					filtered.map((item, index) => {
						const isCompleted = item.status === 'completed';
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
								>
									{/* Card Header */}
									<View className="flex-row items-center justify-between mb-4">
										<View className="flex-row items-center bg-black/5 dark:bg-white/10 px-3 py-1.5 rounded-lg gap-2">
											<Ionicons
												name={
													item.type === 'Corrida'
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
												{item.type}
											</Text>
										</View>
										<View
											className={`flex-row items-center px-3 py-1.5 rounded-lg gap-2 ${isCompleted ? 'bg-green-500/10' : 'bg-red-500/10'}`}
										>
											<View
												className={`w-2 h-2 rounded-full ${isCompleted ? 'bg-green-500' : 'bg-red-500'}`}
											/>
											<Text
												className={`text-xs font-bold ${isCompleted ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}
											>
												{isCompleted
													? 'Concluído'
													: 'Cancelado'}
											</Text>
										</View>
									</View>

									{/* Route Layout */}
									<View className="mb-5 pl-1">
										<View className="flex-row items-start">
											<View className="w-4 items-center mr-3 mt-1">
												<View className="w-2.5 h-2.5 rounded-full bg-blue-500" />
												<View className="w-0.5 h-5 bg-gray-200 dark:bg-gray-700 my-1 rounded-full" />
												<View
													className={`w-2.5 h-2.5 rounded-full ${isCompleted ? 'bg-primary' : 'bg-red-500'}`}
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
													{item.from}
												</Text>
												<Text
													className="text-sm font-medium tracking-tight"
													style={{
														color: themeColors.text,
													}}
													numberOfLines={1}
												>
													{item.to}
												</Text>
											</View>
										</View>
									</View>

									{/* Card Footer */}
									<View className="flex-row justify-between items-end border-t border-gray-100 dark:border-gray-800 pt-3">
										<View>
											<Text className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-1">
												{item.driver}
											</Text>
											<View className="flex-row items-center gap-2">
												<Text className="text-xs font-medium text-gray-500 dark:text-gray-400">
													{item.date} • {item.time}
												</Text>
												{item.rating > 0 && (
													<View className="flex-row items-center gap-1 ml-1 bg-yellow-500/10 px-1.5 py-0.5 rounded-full">
														<Ionicons
															name="star"
															size={10}
															color="#EAB308"
														/>
														<Text className="text-[10px] font-bold text-yellow-600 dark:text-yellow-500">
															{item.rating}.0
														</Text>
													</View>
												)}
											</View>
										</View>
										<Text
											className="text-lg font-black tracking-tighter"
											style={{ color: themeColors.text }}
										>
											{item.price}
										</Text>
									</View>
								</TouchableOpacity>
							</Animated.View>
						);
					})
				)}
			</ScrollView>

			{/* Filter Modal */}
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
						// eslint-disable-next-line react-native/no-inline-styles
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
							{/* Status */}
							<Text
								className={`text-sm font-bold uppercase tracking-wider mb-3 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}
							>
								Status
							</Text>
							<View className="flex-row flex-wrap gap-2 mb-6">
								{(
									['all', 'completed', 'cancelled'] as const
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
													: f === 'completed'
														? 'Concluídos'
														: 'Cancelados'}
											</Text>
										</TouchableOpacity>
									);
								})}
							</View>

							{/* Type */}
							<Text
								className={`text-sm font-bold uppercase tracking-wider mb-3 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}
							>
								Tipo de Viagem
							</Text>
							<View className="flex-row flex-wrap gap-2 mb-6">
								{(['all', 'Corrida', 'Entrega'] as const).map(
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
													{f === 'all' ? 'Todos' : f}
												</Text>
											</TouchableOpacity>
										);
									},
								)}
							</View>

							{/* Period */}
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

							{/* Custom Date Range Inputs */}
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
													{customStart ||
														'Selecionar...'}
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
													value={initialStartDate}
													mode="date"
													display="default"
													onValueChange={(
														event,
														selectedDate,
													) => {
														setShowStartPicker(
															Platform.OS ===
																'ios',
														);
														if (selectedDate)
															setCustomStart(
																formatDateStr(
																	selectedDate,
																),
															);
													}}
													onDismiss={() =>
														setShowStartPicker(
															false,
														)
													}
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
													{customEnd ||
														'Selecionar...'}
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
													value={initialEndDate}
													mode="date"
													display="default"
													onValueChange={(
														event,
														selectedDate,
													) => {
														setShowEndPicker(
															Platform.OS ===
																'ios',
														);
														if (selectedDate)
															setCustomEnd(
																formatDateStr(
																	selectedDate,
																),
															);
													}}
													onDismiss={() =>
														setShowEndPicker(false)
													}
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
									setCustomStart('');
									setCustomEnd('');
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
