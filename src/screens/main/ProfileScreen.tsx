import React, { useCallback } from 'react';
import {
	View,
	Text,
	ScrollView,
	TouchableOpacity,
	Alert,
	RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Animated, {
	FadeInDown,
	FadeInUp,
	FadeIn,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '../../store/authStore';
import { ProfileHeader } from '../../components/profile/ProfileHeader';
import { StatCard } from '../../components/profile/StatCard';
import { TripCard, TripItem } from '../../components/profile/TripCard';
import { fetchProfile, fetchTrips, type ProfileStats } from '../../api/profile';

export default function ProfileScreen() {
	const navigation = useNavigation();
	const logout = useAuthStore((state) => state.logout);

	const profileQuery = useQuery({
		queryKey: ['profile'],
		queryFn: fetchProfile,
	});

	const tripsQuery = useQuery({
		queryKey: ['profile', 'trips'],
		queryFn: () => fetchTrips(1, 10),
	});

	const handleLogout = () => {
		Alert.alert('Sair da Conta', 'Tem certeza que deseja sair?', [
			{
				text: 'Cancelar',
				style: 'cancel',
			},
			{
				text: 'Sair',
				style: 'destructive',
				onPress: () => {
					logout();
					(navigation as any).reset({
						index: 0,
						routes: [{ name: 'Auth' }],
					});
				},
			},
		]);
	};

	const onRefresh = useCallback(() => {
		profileQuery.refetch();
		tripsQuery.refetch();
	}, [profileQuery, tripsQuery]);

	const isLoading = profileQuery.isLoading || tripsQuery.isLoading;
	const error = profileQuery.error || tripsQuery.error;
	const user = profileQuery.data?.user;
	const stats: ProfileStats | undefined = profileQuery.data?.stats;

	const trips: TripItem[] = (tripsQuery.data?.trips ?? []).map((t) => ({
		...t,
		totalPrice: Number(t.totalPrice),
	})) as TripItem[];

	const statCards = stats
		? [
				{
					id: '1',
					label: 'Viagens',
					value: String(stats.totalTrips),
					icon: 'bicycle',
					color: '#FFD700',
					bgColor: '#FFF9E0',
				},
				{
					id: '2',
					label: 'Distância',
					value: `${stats.totalDistanceKm.toFixed(0)} km`,
					icon: 'location-sharp',
					color: '#10B981',
					bgColor: '#E8FDF5',
				},
				{
					id: '3',
					label: 'Tempo',
					value: formatDuration(stats.totalDurationMin),
					icon: 'time-sharp',
					color: '#3B82F6',
					bgColor: '#EBF5FF',
				},
				{
					id: '4',
					label: 'Total Gasto',
					value: `${stats.totalSpent.toLocaleString('pt-AO')} Kz`,
					icon: 'wallet-sharp',
					color: '#8B5CF6',
					bgColor: '#F3EEFF',
				},
			]
		: [];

	return (
		<SafeAreaView className="flex-1 bg-off-white dark:bg-[#090909]">
			<View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-800">
				<TouchableOpacity
					className="p-2"
					onPress={() => navigation.goBack()}
					activeOpacity={0.7}
				>
					<Ionicons name="chevron-back" size={28} color="#231F20" />
				</TouchableOpacity>
				<Text className="text-lg font-bold text-secondary dark:text-off-white">
					Meu Perfil
				</Text>
				<View className="w-8" />
			</View>

			<ScrollView
				className="px-4 pb-10"
				showsVerticalScrollIndicator={false}
				refreshControl={
					<RefreshControl
						refreshing={isLoading}
						onRefresh={onRefresh}
					/>
				}
			>
				{error ? (
					<View className="mt-10 items-center">
						<Ionicons
							name="cloud-offline-outline"
							size={48}
							color="#9CA3AF"
						/>
						<Text className="text-gray-400 dark:text-gray-500 mt-3">
							Erro ao carregar perfil
						</Text>
						<TouchableOpacity
							onPress={onRefresh}
							className="mt-4 bg-primary px-6 py-2 rounded-full"
							activeOpacity={0.7}
						>
							<Text className="font-bold text-secondary">
								Tentar novamente
							</Text>
						</TouchableOpacity>
					</View>
				) : (
					<>
						<Animated.View
							entering={FadeInDown.duration(600)}
							className="mt-5 mb-2"
						>
							<ProfileHeader
								name={user?.name || 'Usuário'}
								surname={user?.surname || ''}
								phoneNumber={
									user?.phoneNumber || '+244 --- --- ---'
								}
								email={user?.email}
								image={user?.image}
								phoneNumberVerified={user?.phoneNumberVerified}
								emailVerified={user?.emailVerified}
								onEditPress={() => {}}
							/>
						</Animated.View>

						<Animated.View
							entering={FadeInDown.duration(600).delay(150)}
							className="mt-6"
						>
							<Text className="text-xl font-extrabold text-secondary dark:text-off-white mb-4 tracking-tight">
								Estatísticas
							</Text>
							<View className="flex-row flex-wrap justify-between -mx-1">
								{statCards.map((s, index) => (
									<Animated.View
										key={s.id}
										entering={FadeInUp.duration(500).delay(
											200 + index * 100,
										)}
										className="w-[48%]"
									>
										<StatCard stat={s} />
									</Animated.View>
								))}
							</View>
						</Animated.View>

						<Animated.View
							entering={FadeInDown.duration(600).delay(300)}
							className="mt-6"
						>
							<View className="flex-row justify-between items-center mb-4">
								<Text className="text-xl font-extrabold text-secondary dark:text-off-white tracking-tight">
									Viagens Recentes
								</Text>
								<TouchableOpacity
									activeOpacity={0.7}
									className="py-1"
								>
									<Text className="text-sm font-bold text-primary">
										Ver todos
									</Text>
								</TouchableOpacity>
							</View>

							{trips.length === 0 ? (
								<View className="bg-white dark:bg-soft-black rounded-2xl p-8 items-center">
									<Ionicons
										name="car-outline"
										size={40}
										color="#9CA3AF"
									/>
									<Text className="text-gray-400 dark:text-gray-500 mt-3 text-center">
										Nenhuma viagem ainda
									</Text>
								</View>
							) : (
								trips.map((trip, index) => (
									<Animated.View
										key={trip.id}
										entering={FadeInUp.duration(500).delay(
											350 + index * 80,
										)}
									>
										<TripCard trip={trip} />
									</Animated.View>
								))
							)}
						</Animated.View>

						{(user?.emergencyContactName ||
							user?.emergencyContactPhone) && (
							<Animated.View
								entering={FadeInDown.duration(600).delay(450)}
								className="mt-6"
							>
								<Text className="text-xl font-extrabold text-secondary dark:text-off-white mb-4 tracking-tight">
									Contato de Emergência
								</Text>
								<View className="bg-white dark:bg-soft-black rounded-2xl p-5 shadow-sm">
									{user?.emergencyContactName && (
										<View className="flex-row items-center mb-2">
											<Ionicons
												name="person-outline"
												size={18}
												color="#6B7280"
											/>
											<Text className="text-base font-semibold text-secondary dark:text-off-white ml-3">
												{user.emergencyContactName}
											</Text>
										</View>
									)}
									{user?.emergencyContactPhone && (
										<View className="flex-row items-center">
											<Ionicons
												name="call-outline"
												size={18}
												color="#6B7280"
											/>
											<Text className="text-base text-gray-500 dark:text-gray-400 ml-3">
												{user.emergencyContactPhone}
											</Text>
										</View>
									)}
								</View>
							</Animated.View>
						)}

						<Animated.View
							entering={FadeInDown.duration(600).delay(500)}
							className="mt-8"
						>
							<TouchableOpacity
								className="flex-row items-center justify-center bg-white dark:bg-soft-black py-4 px-6 rounded-2xl shadow-sm active:opacity-70"
								onPress={handleLogout}
								activeOpacity={0.7}
							>
								<Ionicons
									name="log-out-outline"
									size={22}
									color="#ED1C24"
								/>
								<Text className="ml-3 text-base font-bold text-red-500">
									Sair da Conta
								</Text>
							</TouchableOpacity>
						</Animated.View>

						<Animated.View
							entering={FadeIn.duration(600).delay(550)}
							className="mt-8 mb-4 items-center"
						>
							<Text className="text-sm text-gray-400">
								Flash Delivery Angola v1.0.0
							</Text>
						</Animated.View>
					</>
				)}
			</ScrollView>
		</SafeAreaView>
	);
}

function formatDuration(minutes: number): string {
	const h = Math.floor(minutes / 60);
	const m = Math.round(minutes % 60);
	if (h > 0) return `${h}h ${m}m`;
	return `${m}m`;
}
