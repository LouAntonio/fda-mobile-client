import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Animated, {
	FadeInDown,
	FadeInUp,
	FadeIn,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { ProfileHeader } from '../../components/profile/ProfileHeader';
import { StatCard } from '../../components/profile/StatCard';
import { TripCard } from '../../components/profile/TripCard';

const userStats = [
	{
		id: '1',
		label: 'Viagens',
		value: '47',
		icon: 'bicycle',
		color: '#FFD700',
		bgColor: '#FFF9E0',
	},
	{
		id: '2',
		label: 'Distância',
		value: '312 km',
		icon: 'location-sharp',
		color: '#10B981',
		bgColor: '#E8FDF5',
	},
	{
		id: '3',
		label: 'Tempo',
		value: '18h 23m',
		icon: 'time-sharp',
		color: '#3B82F6',
		bgColor: '#EBF5FF',
	},
	{
		id: '4',
		label: 'Economia (cupões)',
		value: '2.450 Kz',
		icon: 'wallet-sharp',
		color: '#8B5CF6',
		bgColor: '#F3EEFF',
	},
];

const recentTrips = [
	{
		id: '1',
		from: 'Casa',
		to: 'Trabalho',
		date: '28 Abr 2026',
		price: '1.200 Kz',
		status: 'Concluída',
		icon: 'checkmark-circle',
		color: '#10B981',
	},
	{
		id: '2',
		from: 'Belas Shopping',
		to: 'Talatona',
		date: '25 Abr 2026',
		price: '800 Kz',
		status: 'Concluída',
		icon: 'checkmark-circle',
		color: '#10B981',
	},
	{
		id: '3',
		from: 'Rocha',
		to: 'Marginal',
		date: '20 Abr 2026',
		price: '600 Kz',
		status: 'Cancelada',
		icon: 'close-circle',
		color: '#ED1C24',
	},
];

export default function ProfileScreen() {
	const navigation = useNavigation();

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
					(navigation as any).reset({
						index: 0,
						routes: [{ name: 'Auth' }],
					});
				},
			},
		]);
	};

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
			>
				<Animated.View
					entering={FadeInDown.duration(600)}
					className="mt-5 mb-2"
				>
					<ProfileHeader
						userName="Lourenço António"
						email="lourenco@email.com"
						phone="+244 923 456 789"
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
						{userStats.map((stat, index) => (
							<Animated.View
								key={stat.id}
								entering={FadeInUp.duration(500).delay(
									200 + index * 100,
								)}
								className="w-[48%]"
							>
								<StatCard stat={stat} />
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
						<TouchableOpacity activeOpacity={0.7} className="py-1">
							<Text className="text-sm font-bold text-primary">
								Ver todos
							</Text>
						</TouchableOpacity>
					</View>

					{recentTrips.map((trip, index) => (
						<Animated.View
							key={trip.id}
							entering={FadeInUp.duration(500).delay(
								350 + index * 80,
							)}
						>
							<TripCard trip={trip} />
						</Animated.View>
					))}
				</Animated.View>

				<Animated.View
					entering={FadeInDown.duration(600).delay(450)}
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
			</ScrollView>
		</SafeAreaView>
	);
}
