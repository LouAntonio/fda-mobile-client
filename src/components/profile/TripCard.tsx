import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export interface TripItem {
	id: string;
	from: string;
	to: string;
	date: string;
	price: string;
	status: string;
	icon: string;
	color: string;
}

interface TripCardProps {
	trip: TripItem;
	onPress?: () => void;
}

export function TripCard({ trip, onPress }: TripCardProps) {
	const statusBgColor = `${trip.color}12`;
	const iconBgColor = `${trip.color}15`;

	return (
		<TouchableOpacity
			className="flex-row items-center bg-white dark:bg-soft-black rounded-2xl p-4 mb-3 active:opacity-70"
			style={styles.card}
			onPress={onPress}
		>
			<View style={[styles.statusIcon, { backgroundColor: iconBgColor }]}>
				<Ionicons
					name={trip.icon as any}
					size={22}
					color={trip.color}
				/>
			</View>

			<View className="flex-1 mr-3">
				<View className="flex-row items-center flex-wrap">
					<Text
						className="text-sm font-bold text-secondary dark:text-off-white"
						numberOfLines={1}
					>
						{trip.from}
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
						{trip.to}
					</Text>
				</View>
				<Text className="text-xs text-gray-400 dark:text-gray-500 mt-1">
					{trip.date}
				</Text>
			</View>

			<View className="items-end">
				<Text className="text-base font-extrabold text-secondary dark:text-off-white mb-2">
					{trip.price}
				</Text>
				<View
					style={[
						styles.statusBadge,
						{ backgroundColor: statusBgColor },
					]}
				>
					<Ionicons
						name={
							trip.status === 'Concluída'
								? 'checkmark-circle'
								: 'close-circle'
						}
						size={12}
						color={trip.color}
					/>
					<Text style={[styles.statusText, { color: trip.color }]}>
						{trip.status}
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
	statusIcon: {
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
