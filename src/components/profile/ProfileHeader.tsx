import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ProfileHeaderProps {
	userName: string;
	email: string;
	phone: string;
	onEditPress: () => void;
}

export function ProfileHeader({
	userName,
	email,
	phone,
	onEditPress,
}: ProfileHeaderProps) {
	return (
		<View className="bg-white dark:bg-soft-black rounded-3xl overflow-hidden shadow-lg">
			<View className="h-20 relative" style={styles.gradientBg}>
				<View className="absolute inset-0 opacity-20">
					<View
						className="w-full h-full"
						style={styles.gradientPattern}
					/>
				</View>
			</View>

			<View className="items-center px-5 pb-6 -mt-12">
				<View className="mb-3">
					<Image
						source={require('../../../assets/images/logo.png')}
						className="w-24 h-24 rounded-full border-4 border-white dark:border-soft-black bg-white"
						style={styles.avatarShadow}
					/>
				</View>

				<Text className="text-2xl font-extrabold text-secondary dark:text-off-white tracking-tight">
					{userName}
				</Text>

				<View className="items-center mt-3 space-y-2">
					<View className="flex-row items-center">
						<Ionicons
							name="mail-outline"
							size={14}
							color="#6B7280"
						/>
						<Text className="text-sm text-gray-500 dark:text-gray-400 ml-1.5">
							{email}
						</Text>
					</View>
					<View className="flex-row items-center">
						<Ionicons
							name="call-outline"
							size={14}
							color="#6B7280"
						/>
						<Text className="text-sm text-gray-500 dark:text-gray-400 ml-1.5">
							{phone}
						</Text>
					</View>
				</View>

				<TouchableOpacity
					className="mt-5 flex-row items-center justify-center py-2.5 px-5 rounded-full border border-primary dark:border-primary active:opacity-70"
					style={styles.editButton}
					onPress={onEditPress}
				>
					<Ionicons name="create-outline" size={16} color="#231F20" />
					<Text className="ml-2 text-sm font-bold text-secondary dark:text-off-white">
						Editar Perfil
					</Text>
				</TouchableOpacity>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	gradientBg: {
		backgroundColor: '#FFD700',
	},
	gradientPattern: {
		backgroundColor: '#FFD700',
	},
	avatarShadow: {
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.15,
		shadowRadius: 12,
		elevation: 8,
	},
	editButton: {
		shadowColor: '#FFD700',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.3,
		shadowRadius: 8,
		elevation: 4,
	},
});
