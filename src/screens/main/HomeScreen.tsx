import React, { useState, useMemo } from 'react';
import {
	View,
	Text,
	TouchableOpacity,
	Image,
	StyleSheet,
	ScrollView,
	TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import Animated, { FadeInDown, FadeInRight } from 'react-native-reanimated';
import { useThemeColors } from '../../hooks/useThemeColors';
import { useAuthStore } from '../../store/authStore';
import { useMapSearch } from '../../hooks/useMapSearch';
import { useMapRoute } from '../../hooks/useMapRoute';
import MapView from '../../components/MapView';
import SideMenu from '../../components/SideMenu';

export default function HomeScreen() {
	const navigation = useNavigation<any>();
	const { themeColors, isDark } = useThemeColors();
	const user = useAuthStore((state) => state.user);
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [showMap, setShowMap] = useState(false);
	const [selectedDest, setSelectedDest] = useState<{
		longitude: number;
		latitude: number;
		name: string;
	} | null>(null);

	const { query, setQuery, results, isSearching, clearResults } =
		useMapSearch();
	const { route, clearRoute } =
		useMapRoute();

	const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

	const cardBgStyle = useMemo(
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
			latitude: -8.8399,
			longitude: 13.2344,
		},
		{
			id: '2',
			title: 'Trabalho',
			address: 'Edifício Kilamba, Marginal',
			icon: 'briefcase',
			latitude: -8.8147,
			longitude: 13.2306,
		},
		{
			id: '3',
			title: 'Belas Shopping',
			address: 'Talatona, Luanda',
			icon: 'cart',
			latitude: -8.9107,
			longitude: 13.2038,
		},
	];

	const handleSelectDestination = (
		longitude: number,
		latitude: number,
		name: string,
	) => {
		setSelectedDest({ longitude, latitude, name });
		setShowMap(true);
		setQuery(name);
		clearResults();

		if (route) {
			clearRoute();
		}
	};

	const handleSearchResult = (item: {
		center: [number, number];
		place_name: string;
	}) => {
		handleSelectDestination(item.center[0], item.center[1] as number, item.place_name);
	};

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
				userName={user?.name || 'Usuário'}
			/>

			<View
				style={[
					styles.header,
					{
						borderBottomColor: themeColors.border,
						backgroundColor: themeColors.background,
					},
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

			{showMap ? (
				<View style={styles.mapContainer}>
					<View style={styles.mapHeader}>
						<TouchableOpacity
							onPress={() => {
								setShowMap(false);
								clearRoute();
							}}
							style={styles.mapBackButton}
						>
							<Ionicons name="arrow-back" size={24} color="#000" />
						</TouchableOpacity>
						<Text style={styles.mapTitle} numberOfLines={1}>
							{selectedDest?.name || 'Destino'}
						</Text>
					</View>
					<MapView
						style={styles.map}
						initialRegion={
							selectedDest
								? {
										latitude: selectedDest.latitude,
										longitude: selectedDest.longitude,
										latitudeDelta: 0.02,
										longitudeDelta: 0.02,
									}
								: undefined
						}
						markers={
							selectedDest
								? [
										{
											id: 'dest',
											latitude: selectedDest.latitude,
											longitude: selectedDest.longitude,
											title: selectedDest.name,
										},
									]
								: []
						}
						routeCoords={
							route?.geometry.coordinates.map(
								([lng, lat]) => ({
									latitude: lat,
									longitude: lng,
								}),
							) ?? []
						}
					/>
					{route && (
						<View style={styles.routeInfo}>
							<Text style={styles.routeInfoText}>
								{(route.distance / 1000).toFixed(1)} km ·{' '}
								{Math.round(route.duration / 60)} min
							</Text>
						</View>
					)}
				</View>
			) : (
				<ScrollView
					contentContainerStyle={styles.scrollContent}
					showsVerticalScrollIndicator={false}
				>
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
							Olá, {user?.name?.split(' ')[0] || 'Usuário'}
						</Text>
						<Text
							style={[
								styles.mainTitle,
								{ color: themeColors.text },
							]}
						>
							Para onde vamos?
						</Text>

						<View
							style={[
								styles.searchBar,
								{
									backgroundColor: isDark
										? '#1A1A1A'
										: '#FFFFFF',
								},
							]}
						>
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
								value={query}
								onChangeText={setQuery}
							/>
							{isSearching && (
								<Text style={styles.searchingText}>
									Buscando...
								</Text>
							)}
						</View>

						{results.length > 0 && (
							<View
								style={[
									styles.searchResults,
									{
										backgroundColor: isDark
											? '#1A1A1A'
											: '#FFFFFF',
									},
								]}
							>
								{results.map((item) => (
									<TouchableOpacity
										key={item.id}
										style={styles.searchResultItem}
										onPress={() => handleSearchResult(item)}
									>
										<Ionicons
											name="location-outline"
											size={18}
											color={themeColors.primary}
										/>
										<Text
											style={[
												styles.searchResultText,
												{ color: themeColors.text },
											]}
											numberOfLines={2}
										>
											{item.place_name}
										</Text>
									</TouchableOpacity>
								))}
							</View>
						)}
					</Animated.View>

					<View style={styles.cardsContainer}>
						<Animated.View
							entering={FadeInRight.duration(800).delay(300)}
						>
							<TouchableOpacity
								style={[styles.serviceCard, cardBgStyle]}
								activeOpacity={0.8}
								onPress={() =>
									navigation.navigate('TripRequest', {
										serviceType: 'RIDE',
									})
								}
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
								onPress={() =>
									navigation.navigate('TripRequest', {
										serviceType: 'DELIVERY',
									})
								}
							>
								<View
									style={[
										styles.iconCircle,
										{ backgroundColor: themeColors.primary },
									]}
								>
									<Ionicons
										name="cube"
										size={32}
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
						</View>

						{recentDestinations.map((item) => (
							<TouchableOpacity
								key={item.id}
								style={styles.recentItem}
								activeOpacity={0.6}
								onPress={() =>
									handleSelectDestination(
										item.longitude,
										item.latitude,
										item.address,
									)
								}
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
			)}
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
		borderBottomWidth: 0.5,
		elevation: 2,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.05,
		shadowRadius: 3,
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
		fontSize: 22,
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
		zIndex: 20,
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
	searchingText: {
		fontSize: 12,
		color: '#9CA3AF',
		marginRight: 8,
	},
	searchResults: {
		borderRadius: 16,
		marginTop: 8,
		elevation: 6,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.1,
		shadowRadius: 8,
		maxHeight: 250,
		overflow: 'hidden',
		zIndex: 30,
	},
	searchResultItem: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingVertical: 14,
		paddingHorizontal: 16,
		borderBottomWidth: 0.5,
		borderBottomColor: 'rgba(150,150,150,0.15)',
		gap: 12,
	},
	searchResultText: {
		fontSize: 14,
		fontWeight: '500',
		flex: 1,
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
	mapContainer: {
		flex: 1,
	},
	mapHeader: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingHorizontal: 16,
		paddingVertical: 12,
		gap: 12,
		backgroundColor: '#FFD700',
	},
	mapBackButton: {
		width: 36,
		height: 36,
		borderRadius: 18,
		backgroundColor: 'rgba(0,0,0,0.1)',
		justifyContent: 'center',
		alignItems: 'center',
	},
	mapTitle: {
		fontSize: 16,
		fontWeight: '700',
		color: '#231F20',
		flex: 1,
	},
	map: {
		flex: 1,
		width: '100%',
		height: '100%',
	},
	routeInfo: {
		position: 'absolute',
		bottom: 30,
		left: 20,
		right: 20,
		backgroundColor: '#231F20',
		borderRadius: 16,
		padding: 16,
		alignItems: 'center',
	},
	routeInfoText: {
		color: '#FFD700',
		fontSize: 16,
		fontWeight: '700',
	},
});
