import React, { useState, useMemo } from 'react';
import {
	View,
	Text,
	TouchableOpacity,
	SafeAreaView,
	Image,
	StyleSheet,
	ScrollView,
	TextInput,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeInRight } from 'react-native-reanimated';
import { useThemeColors } from '../../hooks/useThemeColors';
import SideMenu from '../../components/SideMenu';

// const { width } = Dimensions.get('window'); // Not used currently

export default function HomeScreen() {
	const { themeColors, isDark } = useThemeColors();
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [destination, setDestination] = useState('');

	const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

	const cardBgStyle = useMemo(
		() => ({
			backgroundColor: isDark ? '#1A1A1A' : '#FFFFFF',
		}),
		[isDark],
	);

	const searchBarBgStyle = useMemo(
		() => ({
			backgroundColor: isDark ? '#1A1A1A' : '#FFFFFF',
		}),
		[isDark],
	);

	const recentDestinations = [
		{
			id: '1',
			title: 'Casa',
			address: 'Rocha Cabine, Luanda',
			icon: 'home',
		},
		{
			id: '2',
			title: 'Trabalho',
			address: 'Edifício Kilamba, Marginal',
			icon: 'briefcase',
		},
		{
			id: '3',
			title: 'Belas Shopping',
			address: 'Talatona, Luanda',
			icon: 'cart',
		},
	];

	return (
		<SafeAreaView
			style={[
				styles.container,
				{ backgroundColor: themeColors.background },
			]}
		>
			<SideMenu
				isOpen={isMenuOpen}
				onClose={toggleMenu}
				userName="Lourenço António"
			/>

			{/* Header */}
			<View
				style={[
					styles.header,
					{ borderBottomColor: themeColors.border },
				]}
			>
				<Image
					source={require('../../../assets/images/logo.png')}
					style={styles.logo}
				/>
				<TouchableOpacity
					onPress={toggleMenu}
					style={styles.menuButton}
					activeOpacity={0.7}
				>
					<Ionicons
						name="menu-outline"
						size={32}
						color={themeColors.text}
					/>
				</TouchableOpacity>
			</View>

			<ScrollView
				contentContainerStyle={styles.scrollContent}
				showsVerticalScrollIndicator={false}
			>
				{/* Welcome & Search Bar */}
				<Animated.View
					entering={FadeInDown.duration(800).delay(100)}
					style={styles.welcomeSection}
				>
					<Text
						style={[
							styles.welcomeText,
							{ color: themeColors.secondary },
						]}
					>
						Olá, Lourenço
					</Text>
					<Text
						style={[styles.mainTitle, { color: themeColors.text }]}
					>
						Para onde vamos?
					</Text>

					<View style={[styles.searchBar, searchBarBgStyle]}>
						<View
							style={[
								styles.searchIconContainer,
								{ backgroundColor: themeColors.primary },
							]}
						>
							<Ionicons name="search" size={20} color="#000" />
						</View>
						<TextInput
							style={[
								styles.searchText,
								{ color: themeColors.text },
							]}
							placeholder="Insira o destino..."
							placeholderTextColor={themeColors.secondary}
							value={destination}
							onChangeText={setDestination}
						/>
						<View
							style={[
								styles.searchDivider,
								{ backgroundColor: themeColors.border },
							]}
						/>
						<TouchableOpacity activeOpacity={0.7}>
							<Ionicons
								name="time-outline"
								size={20}
								color={themeColors.secondary}
							/>
						</TouchableOpacity>
					</View>
				</Animated.View>

				{/* Service Cards */}
				<View style={styles.cardsContainer}>
					<Animated.View
						entering={FadeInRight.duration(800).delay(300)}
					>
						<TouchableOpacity
							style={[styles.serviceCard, cardBgStyle]}
							activeOpacity={0.8}
						>
							<View
								style={[
									styles.iconCircle,
									{ backgroundColor: themeColors.primary },
								]}
							>
								<MaterialCommunityIcons
									name="moped"
									size={36}
									color="#000"
								/>
							</View>
							<View>
								<Text
									style={[
										styles.cardTitle,
										{ color: themeColors.text },
									]}
								>
									Corrida
								</Text>
								<Text
									style={[
										styles.cardDesc,
										{ color: themeColors.secondary },
									]}
								>
									Viagens rápidas
								</Text>
							</View>
							<View
								style={[
									styles.cardBadge,
									{ backgroundColor: themeColors.primary },
								]}
							>
								<Ionicons
									name="arrow-forward"
									size={14}
									color="#000"
								/>
							</View>
						</TouchableOpacity>
					</Animated.View>

					<Animated.View
						entering={FadeInRight.duration(800).delay(500)}
					>
						<TouchableOpacity
							style={[styles.serviceCard, cardBgStyle]}
							activeOpacity={0.8}
						>
							<View
								style={[
									styles.iconCircle,
									{ backgroundColor: themeColors.primary },
								]}
							>
								<Ionicons name="cube" size={32} color="#000" />
							</View>
							<View>
								<Text
									style={[
										styles.cardTitle,
										{ color: themeColors.text },
									]}
								>
									Entrega
								</Text>
								<Text
									style={[
										styles.cardDesc,
										{ color: themeColors.secondary },
									]}
								>
									Mande encomendas
								</Text>
							</View>
							<View
								style={[
									styles.cardBadge,
									{ backgroundColor: themeColors.primary },
								]}
							>
								<Ionicons
									name="arrow-forward"
									size={14}
									color="#000"
								/>
							</View>
						</TouchableOpacity>
					</Animated.View>
				</View>

				{/* Recent Destinations */}
				<Animated.View
					entering={FadeInDown.duration(800).delay(700)}
					style={styles.recentContainer}
				>
					<View style={styles.sectionHeader}>
						<Text
							style={[
								styles.sectionTitle,
								{ color: themeColors.text },
							]}
						>
							Locais recentes
						</Text>
						<TouchableOpacity>
							<Text
								style={[
									styles.viewAllText,
									{ color: themeColors.primary },
								]}
							>
								Ver tudo
							</Text>
						</TouchableOpacity>
					</View>

					{recentDestinations.map((item) => (
						<TouchableOpacity
							key={item.id}
							style={styles.recentItem}
							activeOpacity={0.6}
						>
							<View
								style={[
									styles.recentIcon,
									{
										backgroundColor:
											themeColors.border + '30',
									},
								]}
							>
								<Ionicons
									name={item.icon as any}
									size={22}
									color={themeColors.text}
								/>
							</View>
							<View style={styles.recentInfo}>
								<Text
									style={[
										styles.recentTitle,
										{ color: themeColors.text },
									]}
								>
									{item.title}
								</Text>
								<Text
									style={[
										styles.recentAddress,
										{ color: themeColors.secondary },
									]}
									numberOfLines={1}
								>
									{item.address}
								</Text>
							</View>
							<Ionicons
								name="chevron-forward"
								size={20}
								color={themeColors.border}
							/>
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
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingHorizontal: 20,
		paddingVertical: 12,
		borderBottomWidth: 1,
		elevation: 4,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		zIndex: 10,
	},
	logo: {
		width: 45,
		height: 45,
		borderRadius: 12,
		resizeMode: 'cover',
	},
	menuButton: {
		width: 45,
		height: 45,
		justifyContent: 'center',
		alignItems: 'center',
	},
	scrollContent: {
		paddingBottom: 40,
	},
	welcomeSection: {
		paddingHorizontal: 20,
		paddingTop: 10,
		marginBottom: 30,
	},
	welcomeText: {
		fontSize: 16,
		fontWeight: '700',
		marginBottom: 4,
	},
	mainTitle: {
		fontSize: 32,
		fontWeight: '900',
		letterSpacing: -1,
		marginBottom: 20,
	},
	searchBar: {
		flexDirection: 'row',
		alignItems: 'center',
		padding: 12,
		borderRadius: 22,
		height: 64,
		elevation: 8,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 10 },
		shadowOpacity: 0.08,
		shadowRadius: 20,
		borderWidth: 1,
		borderColor: 'rgba(150,150,150,0.1)',
	},
	searchIconContainer: {
		width: 40,
		height: 40,
		borderRadius: 12,
		justifyContent: 'center',
		alignItems: 'center',
		marginRight: 15,
	},
	searchText: {
		flex: 1,
		fontSize: 16,
		fontWeight: '600',
	},
	searchDivider: {
		width: 1,
		height: 24,
		marginHorizontal: 15,
		opacity: 0.2,
	},
	cardsContainer: {
		paddingHorizontal: 20,
		marginBottom: 35,
		gap: 15,
	},
	serviceCard: {
		flexDirection: 'row',
		alignItems: 'center',
		padding: 22,
		borderRadius: 30,
		elevation: 6,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 8 },
		shadowOpacity: 0.06,
		shadowRadius: 16,
		borderWidth: 1,
		borderColor: 'rgba(150,150,150,0.08)',
	},
	iconCircle: {
		width: 60,
		height: 60,
		borderRadius: 22,
		justifyContent: 'center',
		alignItems: 'center',
		marginRight: 20,
		elevation: 4,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.1,
		shadowRadius: 6,
	},
	cardTitle: {
		fontSize: 20,
		fontWeight: '800',
		marginBottom: 2,
	},
	cardDesc: {
		fontSize: 13,
		fontWeight: '500',
		opacity: 0.7,
	},
	cardBadge: {
		marginLeft: 'auto',
		width: 28,
		height: 28,
		borderRadius: 14,
		justifyContent: 'center',
		alignItems: 'center',
	},
	recentContainer: {
		paddingHorizontal: 20,
	},
	sectionHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: 20,
	},
	sectionTitle: {
		fontSize: 22,
		fontWeight: '900',
	},
	recentItem: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: 18,
		backgroundColor: 'transparent',
	},
	recentIcon: {
		width: 52,
		height: 52,
		borderRadius: 18,
		justifyContent: 'center',
		alignItems: 'center',
		marginRight: 16,
		borderWidth: 1,
		borderColor: 'rgba(150,150,150,0.05)',
	},
	recentInfo: {
		flex: 1,
	},
	recentTitle: {
		fontSize: 17,
		fontWeight: '700',
		marginBottom: 2,
	},
	recentAddress: {
		fontSize: 14,
		fontWeight: '400',
		opacity: 0.6,
	},
	viewAllText: {
		fontWeight: '700',
	},
});
