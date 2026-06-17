import React, { useState, useEffect } from 'react';
import {
	View,
	Text,
	TouchableOpacity,
	ScrollView,
	TextInput,
	Alert,
	ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useThemeColors } from '../../hooks/useThemeColors';
import { useEstimateTrip, useRequestTrip } from '../../hooks/useTrips';
import { useMapSearch } from '../../hooks/useMapSearch';
import { useMapRoute } from '../../hooks/useMapRoute';
import MapView from '../../components/MapView';
import type { MainStackParamList } from '../../types/navigation';
import type { PaymentMethod } from '../../types/api';

const PAYMENT_METHODS: { key: PaymentMethod; label: string; icon: string }[] = [
	{ key: 'CASH', label: 'Dinheiro', icon: 'cash-outline' },
	{ key: 'MCX_EXPRESS', label: 'MCX Express', icon: 'card-outline' },
	{ key: 'UNITEL_MONEY', label: 'Unitel Money', icon: 'phone-portrait-outline' },
];

export default function TripRequestScreen() {
	const navigation = useNavigation<any>();
	const route = useRoute<RouteProp<MainStackParamList, 'TripRequest'>>();
	const { themeColors, isDark } = useThemeColors();
	const { serviceType, pickupLat, pickupLng, pickupAddress: initialPickup } = route.params;

	const [selectedDropoff, setSelectedDropoff] = useState<{
		latitude: number;
		longitude: number;
		name: string;
	} | null>(null);
	const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('CASH');
	const [couponCode, setCouponCode] = useState('');
	const [pickupReference, setPickupReference] = useState('');
	const [dropoffReference, setDropoffReference] = useState('');

	const { query: dropoffQuery, setQuery: setDropoffQuery, results, isSearching, clearResults } = useMapSearch();
	const { route: mapRoute, fetchRoute } = useMapRoute();
	const estimateMutation = useEstimateTrip();
	const requestMutation = useRequestTrip();

	const userLat = pickupLat ?? -8.8399;
	const userLng = pickupLng ?? 13.2344;
	const userAddress = initialPickup ?? 'Local atual';

	const estimate = estimateMutation.data;

	useEffect(() => {
		if (selectedDropoff) {
			fetchRoute([userLng, userLat], [selectedDropoff.longitude, selectedDropoff.latitude]);
			estimateMutation.mutate({
				serviceType,
				pickupCoords: { lat: userLat, lng: userLng },
				dropoffCoords: { lat: selectedDropoff.latitude, lng: selectedDropoff.longitude },
				vehicleType: 'MOTO',
			});
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selectedDropoff]);

	const handleSearchResult = (item: { center: [number, number]; place_name: string }) => {
		setSelectedDropoff({
			latitude: item.center[1],
			longitude: item.center[0],
			name: item.place_name,
		});
		setDropoffQuery(item.place_name);
		clearResults();
	};

	const handleRequest = () => {
		if (!selectedDropoff) {
			Alert.alert('Atenção', 'Selecione um destino');
			return;
		}

		requestMutation.mutate(
			{
				serviceType,
				pickupCoords: { lat: userLat, lng: userLng },
				dropoffCoords: { lat: selectedDropoff.latitude, lng: selectedDropoff.longitude },
				pickupAddress: userAddress,
				dropoffAddress: selectedDropoff.name,
				pickupReference: pickupReference || undefined,
				dropoffReference: dropoffReference || undefined,
				paymentMethod,
				vehicleType: 'MOTO',
				couponCode: couponCode || undefined,
			},
			{
				onSuccess: (trip) => {
					navigation.replace('ActiveTrip', { tripId: trip.id });
				},
			},
		);
	};

	return (
		<SafeAreaView className="flex-1" style={{ backgroundColor: themeColors.background }}>
			<View className="flex-row items-center px-4 py-3" style={{ backgroundColor: themeColors.background }}>
				<TouchableOpacity
					onPress={() => navigation.goBack()}
					className="w-10 h-10 items-center justify-center rounded-full bg-black/5 dark:bg-white/10"
				>
					<Ionicons name="chevron-back" size={22} color={themeColors.text} />
				</TouchableOpacity>
				<Text className="flex-1 text-lg font-bold ml-3" style={{ color: themeColors.text }}>
					{serviceType === 'RIDE' ? 'Corrida' : 'Entrega'}
				</Text>
			</View>

			<ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
				{/* Destination Input */}
				<Animated.View entering={FadeInDown.duration(400)} className="mb-4">
					<Text className="text-xs font-bold uppercase tracking-wider mb-2 text-gray-500">
						Destino
					</Text>
					<View className="flex-row items-center px-4 py-3 rounded-2xl border"
						style={{
							backgroundColor: isDark ? '#1A1A1A' : '#F9FAFB',
							borderColor: isDark ? '#333' : '#E5E7EB',
						}}
					>
						<Ionicons name="location-outline" size={20} color={themeColors.primary} />
						<TextInput
							className="flex-1 ml-3 text-base font-semibold"
							style={{ color: themeColors.text }}
							placeholder="Para onde vai?"
							placeholderTextColor="#9CA3AF"
							value={dropoffQuery}
							onChangeText={setDropoffQuery}
						/>
						{isSearching && <ActivityIndicator size="small" />}
					</View>
					{results.length > 0 && (
						<View className="mt-2 rounded-2xl overflow-hidden border"
							style={{
								backgroundColor: isDark ? '#1A1A1A' : '#FFF',
								borderColor: isDark ? '#333' : '#E5E7EB',
							}}
						>
							{results.map((item) => (
								<TouchableOpacity
									key={item.id}
									className="flex-row items-center px-4 py-3 border-b"
									style={{ borderColor: isDark ? '#333' : '#F3F4F6' }}
									onPress={() => handleSearchResult(item)}
								>
									<Ionicons name="location" size={16} color={themeColors.primary} />
									<Text className="flex-1 ml-3 text-sm font-medium" style={{ color: themeColors.text }} numberOfLines={2}>
										{item.place_name}
									</Text>
								</TouchableOpacity>
							))}
						</View>
					)}
				</Animated.View>

				{/* Map Preview */}
				{selectedDropoff && mapRoute && (
					<Animated.View entering={FadeInUp.duration(400)} className="h-44 rounded-2xl overflow-hidden mb-4">
						<MapView
							style={{ flex: 1 }}
							initialRegion={{
								latitude: (userLat + selectedDropoff.latitude) / 2,
								longitude: (userLng + selectedDropoff.longitude) / 2,
								latitudeDelta: 0.05,
								longitudeDelta: 0.05,
							}}
							markers={[
								{ id: 'pickup', latitude: userLat, longitude: userLng, title: 'Origem' },
								{ id: 'dropoff', latitude: selectedDropoff.latitude, longitude: selectedDropoff.longitude, title: selectedDropoff.name },
							]}
							routeCoords={mapRoute.geometry.coordinates.map(([lng, lat]) => ({
								latitude: lat,
								longitude: lng,
							}))}
						/>
					</Animated.View>
				)}

				{/* References */}
				<Animated.View entering={FadeInDown.duration(400).delay(100)} className="mb-4">
					<TextInput
						className="px-4 py-3 rounded-2xl border mb-3 text-base"
						style={{
							backgroundColor: isDark ? '#1A1A1A' : '#F9FAFB',
							borderColor: isDark ? '#333' : '#E5E7EB',
							color: themeColors.text,
						}}
						placeholder="Ponto de referência (origem)"
						placeholderTextColor="#9CA3AF"
						value={pickupReference}
						onChangeText={setPickupReference}
					/>
					<TextInput
						className="px-4 py-3 rounded-2xl border text-base"
						style={{
							backgroundColor: isDark ? '#1A1A1A' : '#F9FAFB',
							borderColor: isDark ? '#333' : '#E5E7EB',
							color: themeColors.text,
						}}
						placeholder="Ponto de referência (destino)"
						placeholderTextColor="#9CA3AF"
						value={dropoffReference}
						onChangeText={setDropoffReference}
					/>
				</Animated.View>

				{/* Coupon */}
				<Animated.View entering={FadeInDown.duration(400).delay(200)} className="mb-4">
					<TextInput
						className="px-4 py-3 rounded-2xl border text-base"
						style={{
							backgroundColor: isDark ? '#1A1A1A' : '#F9FAFB',
							borderColor: isDark ? '#333' : '#E5E7EB',
							color: themeColors.text,
						}}
						placeholder="Cupom de desconto (opcional)"
						placeholderTextColor="#9CA3AF"
						value={couponCode}
						onChangeText={setCouponCode}
					/>
				</Animated.View>

				{/* Estimate */}
				{estimateMutation.isPending && (
					<View className="items-center py-4">
						<ActivityIndicator size="large" color={themeColors.primary} />
						<Text className="text-sm text-gray-500 mt-2">Calculando preço...</Text>
					</View>
				)}
				{estimate && (
					<Animated.View entering={FadeInDown.duration(400).delay(300)}
						className="mb-4 p-4 rounded-2xl border"
						style={{
							backgroundColor: isDark ? '#1A1A1A' : '#F9FAFB',
							borderColor: isDark ? '#333' : '#E5E7EB',
						}}
					>
						<View className="flex-row justify-between mb-2">
							<Text className="text-sm text-gray-500">{estimate.estimatedDistanceKm.toFixed(1)} km</Text>
							<Text className="text-sm text-gray-500">{estimate.estimatedDurationMin} min</Text>
						</View>
						<View className="flex-row justify-between items-center border-t pt-2"
							style={{ borderColor: isDark ? '#333' : '#E5E7EB' }}
						>
							<Text className="text-base font-bold" style={{ color: themeColors.text }}>
								Total
							</Text>
							<Text className="text-2xl font-black" style={{ color: themeColors.primary }}>
								{estimate.totalPrice.toLocaleString('pt-AO')} Kz
							</Text>
						</View>
						{estimate.discountAmount > 0 && (
							<Text className="text-xs text-green-500 mt-1">
								Desconto: -{estimate.discountAmount.toLocaleString('pt-AO')} Kz
							</Text>
						)}
					</Animated.View>
				)}

				{/* Payment Method */}
				<Animated.View entering={FadeInDown.duration(400).delay(400)} className="mb-6">
					<Text className="text-xs font-bold uppercase tracking-wider mb-3 text-gray-500">
						Método de Pagamento
					</Text>
					{PAYMENT_METHODS.map((pm) => {
						const active = paymentMethod === pm.key;
						return (
							<TouchableOpacity
								key={pm.key}
								className="flex-row items-center px-4 py-3.5 rounded-2xl mb-2 border"
								style={{
									backgroundColor: active
										? isDark ? '#2A2A2A' : '#FFF9E0'
										: isDark ? '#1A1A1A' : '#F9FAFB',
									borderColor: active ? themeColors.primary : isDark ? '#333' : '#E5E7EB',
								}}
								onPress={() => setPaymentMethod(pm.key)}
							>
								<Ionicons name={pm.icon as any} size={22} color={active ? themeColors.primary : '#9CA3AF'} />
								<Text
									className={`flex-1 ml-3 text-base font-semibold ${
										active ? 'text-primary' : 'text-gray-500'
									}`}
									style={{ color: active ? themeColors.primary : themeColors.text }}
								>
									{pm.label}
								</Text>
								{active && (
									<Ionicons name="checkmark-circle" size={22} color={themeColors.primary} />
								)}
							</TouchableOpacity>
						);
					})}
				</Animated.View>
			</ScrollView>

			{/* Request Button */}
			<View className="px-4 pb-6 pt-2 border-t"
				style={{
					backgroundColor: themeColors.background,
					borderColor: isDark ? '#333' : '#E5E7EB',
				}}
			>
				<TouchableOpacity
					className="py-4 rounded-2xl items-center"
					style={{ backgroundColor: themeColors.primary, opacity: selectedDropoff ? 1 : 0.5 }}
					onPress={handleRequest}
					disabled={!selectedDropoff || requestMutation.isPending}
				>
					{requestMutation.isPending ? (
						<ActivityIndicator color="#000" />
					) : (
						<Text className="text-lg font-black text-secondary">
							Solicitar {serviceType === 'RIDE' ? 'Corrida' : 'Entrega'}
						</Text>
					)}
				</TouchableOpacity>
			</View>
		</SafeAreaView>
	);
}
