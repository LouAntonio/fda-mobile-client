import React from 'react';
import {
	View,
	Text,
	ScrollView,
	StyleSheet,
	TouchableOpacity,
	Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import { useThemeColors } from '../../hooks/useThemeColors';

const userStats = [
	{ label: 'Viagens', value: '47', icon: 'bicycle-outline' },
	{ label: 'Distância', value: '312 km', icon: 'navigate-outline' },
	{ label: 'Tempo', value: '18h 23m', icon: 'timer-outline' },
	{ label: 'Economia', value: '2.450 Kz', icon: 'cash-outline' },
];

const recentTrips = [
	{
		id: '1',
		title: 'Casa → Trabalho',
		date: '28 Abr 2026',
		price: '1.200 Kz',
		status: 'Concluída',
		icon: 'checkmark-circle',
		color: '#10B981',
	},
	{
		id: '2',
		title: 'Belas Shopping → Talatona',
		date: '25 Abr 2026',
		price: '800 Kz',
		status: 'Concluída',
		icon: 'checkmark-circle',
		color: '#10B981',
	},
	{
		id: '3',
		title: 'Rocha → Marginal',
		date: '20 Abr 2026',
		price: '600 Kz',
		status: 'Cancelada',
		icon: 'close-circle',
		color: '#ED1C24',
	},
];

export default function ProfileScreen() {
	const navigation = useNavigation();
	const { themeColors, isDark } = useThemeColors();

	const cardBgStyle = {
		backgroundColor: isDark ? '#1A1A1A' : '#FFFFFF',
	};

	return (
		<SafeAreaView
			style={[
				styles.container,
				{ backgroundColor: themeColors.background },
			]}
		>
			{/* Header */}
			<View
				style={[
					styles.header,
					{ borderBottomColor: themeColors.border },
				]}
			>
				<TouchableOpacity
					onPress={() => navigation.goBack()}
					style={styles.backButton}
					activeOpacity={0.7}
				>
					<Ionicons
						name="chevron-back"
						size={28}
						color={themeColors.text}
					/>
				</TouchableOpacity>
				<Text style={[styles.headerTitle, { color: themeColors.text }]}>
					Meu Perfil
				</Text>
				<View style={styles.placeholder} />
			</View>

			<ScrollView
				contentContainerStyle={styles.scrollContent}
				showsVerticalScrollIndicator={false}
			>
				{/* Profile Card */}
				<Animated.View
					entering={FadeInDown.duration(600)}
					style={styles.profileCard}
				>
					<View style={styles.avatarWrapper}>
						<Image
							source={require('../../../assets/images/logo.png')}
							style={styles.avatar}
						/>
					</View>
					<Text style={[styles.name, { color: themeColors.text }]}>
						Lourenço António
					</Text>
					<Text
						style={[styles.email, { color: themeColors.secondary }]}
					>
						lourenco@email.com
					</Text>
					<Text
						style={[styles.phone, { color: themeColors.secondary }]}
					>
						+244 923 456 789
					</Text>
				</Animated.View>

				{/* Stats Grid */}
				<Animated.View
					entering={FadeInDown.duration(600).delay(150)}
					style={styles.statsContainer}
				>
					{userStats.map((stat, index) => (
						<Animated.View
							key={stat.label}
							entering={FadeInUp.duration(500).delay(
								200 + index * 80,
							)}
						>
							<View style={[styles.statCard, cardBgStyle]}>
								<Ionicons
									name={stat.icon as any}
									size={24}
									color={themeColors.primary}
								/>
								<Text
									style={[
										styles.statValue,
										{ color: themeColors.text },
									]}
								>
									{stat.value}
								</Text>
								<Text
									style={[
										styles.statLabel,
										{ color: themeColors.secondary },
									]}
								>
									{stat.label}
								</Text>
							</View>
						</Animated.View>
					))}
				</Animated.View>

				{/* Recent Trips */}
				<Animated.View
					entering={FadeInDown.duration(600).delay(500)}
					style={styles.tripsSection}
				>
					<Text
						style={[
							styles.sectionTitle,
							{ color: themeColors.text },
						]}
					>
						Viagens Recentes
					</Text>
					{recentTrips.map((trip) => (
						<TouchableOpacity
							key={trip.id}
							style={[styles.tripCard, cardBgStyle]}
							activeOpacity={0.7}
						>
							<View
								style={[
									styles.tripIconBg,
									{ backgroundColor: trip.color + '15' },
								]}
							>
								<Ionicons
									name={trip.icon as any}
									size={22}
									color={trip.color}
								/>
							</View>
							<View style={styles.tripInfo}>
								<Text
									style={[
										styles.tripTitle,
										{ color: themeColors.text },
									]}
								>
									{trip.title}
								</Text>
								<Text
									style={[
										styles.tripDate,
										{ color: themeColors.secondary },
									]}
								>
									{trip.date}
								</Text>
							</View>
							<View style={styles.tripRight}>
								<Text
									style={[
										styles.tripPrice,
										{ color: themeColors.text },
									]}
								>
									{trip.price}
								</Text>
								<Text
									style={[
										styles.tripStatus,
										{ color: trip.color },
									]}
								>
									{trip.status}
								</Text>
							</View>
						</TouchableOpacity>
					))}
				</Animated.View>
			</ScrollView>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	header: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingHorizontal: 20,
		paddingVertical: 12,
		borderBottomWidth: 0.5,
	},
	backButton: {
		width: 40,
		height: 40,
		justifyContent: 'center',
		alignItems: 'center',
	},
	headerTitle: {
		fontSize: 20,
		fontWeight: '900',
	},
	placeholder: {
		width: 40,
	},
	scrollContent: {
		paddingBottom: 40,
	},
	profileCard: {
		alignItems: 'center',
		paddingVertical: 30,
	},
	avatarWrapper: {
		borderRadius: 40,
		overflow: 'hidden',
		elevation: 8,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.15,
		shadowRadius: 8,
		marginBottom: 16,
	},
	avatar: {
		width: 80,
		height: 80,
		borderRadius: 40,
		resizeMode: 'cover',
	},
	name: {
		fontSize: 24,
		fontWeight: '900',
		letterSpacing: -0.5,
		marginBottom: 4,
	},
	email: {
		fontSize: 14,
		fontWeight: '500',
		marginBottom: 2,
	},
	phone: {
		fontSize: 14,
		fontWeight: '500',
	},
	statsContainer: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		paddingHorizontal: 16,
		gap: 12,
		marginBottom: 30,
	},
	statCard: {
		width: '47%',
		padding: 18,
		borderRadius: 20,
		alignItems: 'center',
		elevation: 3,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.06,
		shadowRadius: 8,
	},
	statValue: {
		fontSize: 20,
		fontWeight: '900',
		marginTop: 8,
	},
	statLabel: {
		fontSize: 12,
		fontWeight: '600',
		marginTop: 2,
	},
	tripsSection: {
		paddingHorizontal: 20,
	},
	sectionTitle: {
		fontSize: 20,
		fontWeight: '900',
		marginBottom: 16,
	},
	tripCard: {
		flexDirection: 'row',
		alignItems: 'center',
		padding: 16,
		borderRadius: 18,
		marginBottom: 12,
		elevation: 2,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.04,
		shadowRadius: 6,
	},
	tripIconBg: {
		width: 42,
		height: 42,
		borderRadius: 14,
		justifyContent: 'center',
		alignItems: 'center',
		marginRight: 14,
	},
	tripInfo: {
		flex: 1,
	},
	tripTitle: {
		fontSize: 15,
		fontWeight: '700',
	},
	tripDate: {
		fontSize: 12,
		fontWeight: '500',
		opacity: 0.6,
	},
	tripRight: {
		alignItems: 'flex-end',
	},
	tripPrice: {
		fontSize: 14,
		fontWeight: '800',
	},
	tripStatus: {
		fontSize: 11,
		fontWeight: '700',
	},
});
