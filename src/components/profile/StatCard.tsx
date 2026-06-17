import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export interface StatItem {
	id: string;
	label: string;
	value: string;
	icon: string;
	color: string;
	bgColor: string;
}

interface StatCardProps {
	stat: StatItem;
}

export function StatCard({ stat }: StatCardProps) {
	return (
		<View
			className="bg-white dark:bg-soft-black rounded-2xl p-4 m-1"
			style={styles.card}
		>
			<View style={styles.iconContainer}>
				<Ionicons
					name={stat.icon as any}
					size={24}
					color={stat.color}
				/>
			</View>
			<Text className="text-xl font-extrabold text-secondary dark:text-off-white mt-2 tracking-tight">
				{stat.value}
			</Text>
			<Text className="text-xs text-gray-500 dark:text-gray-400 mt-1 font-medium">
				{stat.label}
			</Text>
		</View>
	);
}

const styles = StyleSheet.create({
	card: {
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.06,
		shadowRadius: 8,
		elevation: 3,
		borderWidth: 1,
		borderColor: 'rgba(0,0,0,0.04)',
	},
	iconContainer: {
		width: 48,
		height: 48,
		borderRadius: 16,
		justifyContent: 'center',
		alignItems: 'center',
	},
});
