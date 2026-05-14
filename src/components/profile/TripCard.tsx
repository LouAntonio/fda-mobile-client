import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

export type TripStatus =
	| 'REQUESTED'
	| 'ACCEPTED'
	| 'PICKUP_IN_PROGRESS'
	| 'STARTED'
	| 'COMPLETED'
	| 'CANCELLED';

export type ServiceType = 'RIDE' | 'DELIVERY';

export interface TripItem {
	id: string;
	pickupAddress: string;
	dropoffAddress: string;
	requestedAt: string;
	totalPrice: number;
	status: TripStatus;
	serviceType: ServiceType;
	actualDistanceKm?: number | null;
	actualDurationMin?: number | null;
	paymentMethod?: string;
	completedAt?: string | null;
	cancelledAt?: string | null;
}

interface TripCardProps {
	trip: TripItem;
	onPress?: () => void;
}

const statusConfig: Record<TripStatus, { label: string; color: string }> = {
	REQUESTED: { label: 'Solicitada', color: '#F59E0B' },
	ACCEPTED: { label: 'Aceite', color: '#3B82F6' },
	PICKUP_IN_PROGRESS: { label: 'Busca', color: '#3B82F6' },
	STARTED: { label: 'Em Andamento', color: '#3B82F6' },
	COMPLETED: { label: 'Concluída', color: '#10B981' },
	CANCELLED: { label: 'Cancelada', color: '#ED1C24' },
};

export function TripCard({ trip, onPress }: TripCardProps) {
	const cfg = statusConfig[trip.status];
	const isCompleted = trip.status === 'COMPLETED';
	const statusIcon = isCompleted ? 'checkmark-circle' : 'close-circle';
	const bgColor = `${cfg.color}12`;
	const iconBgColor = `${cfg.color}15`;
	const formattedPrice = new Intl.NumberFormat('pt-AO', {
		style: 'currency',
		currency: 'AOA',
		minimumFractionDigits: 0,
	})
		.format(trip.totalPrice)
		.replace('AOA', 'Kz')
		.trim();

	const serviceIcon =
		trip.serviceType === 'RIDE' ? (
			<MaterialCommunityIcons name="moped" size={18} color={cfg.color} />
		) : (
			<Ionicons name="cube" size={18} color={cfg.color} />
		);

	return (
		<TouchableOpacity
			className="flex-row items-center bg-white dark:bg-soft-black rounded-2xl p-4 mb-3 active:opacity-70"
			style={styles.card}
			onPress={onPress}
		>
			<View
				style={[styles.serviceIcon, { backgroundColor: iconBgColor }]}
			>
				{serviceIcon}
			</View>

			<View className="flex-1 mr-3">
				<View className="flex-row items-center flex-wrap">
					<Text
						className="text-sm font-bold text-secondary dark:text-off-white"
						numberOfLines={1}
					>
						{trip.pickupAddress}
					</Text>
					<View className="flex-row items-center mx-1.5">
						<Ionicons
							name="arrow-forward"
							size={12}
							color="#9CA3AF"
						/>
					</View>
					<Text
						className="text-sm font-bold text-secondary dark:text-off-white"
						numberOfLines={1}
					>
						{trip.dropoffAddress}
					</Text>
				</View>
				<Text className="text-xs text-gray-400 dark:text-gray-500 mt-1">
					{trip.requestedAt}
				</Text>
			</View>

			<View className="items-end">
				<Text className="text-base font-extrabold text-secondary dark:text-off-white mb-2">
					{formattedPrice}
				</Text>
				<View
					style={[styles.statusBadge, { backgroundColor: bgColor }]}
				>
					<Ionicons name={statusIcon} size={12} color={cfg.color} />
					<Text style={[styles.statusText, { color: cfg.color }]}>
						{cfg.label}
					</Text>
				</View>
			</View>
		</TouchableOpacity>
	);
}

const styles = StyleSheet.create({
	card: {
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.05,
		shadowRadius: 8,
		elevation: 2,
		borderWidth: 1,
		borderColor: 'rgba(0,0,0,0.04)',
	},
	serviceIcon: {
		width: 44,
		height: 44,
		borderRadius: 14,
		justifyContent: 'center',
		alignItems: 'center',
		marginRight: 14,
	},
	statusBadge: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingHorizontal: 10,
		paddingVertical: 5,
		borderRadius: 10,
		gap: 4,
	},
	statusText: {
		fontSize: 11,
		fontWeight: '700',
	},
});
