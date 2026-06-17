import React, { useState } from 'react';
import {
	View,
	Text,
	ScrollView,
	StyleSheet,
	TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInRight } from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import { useThemeColors } from '../../hooks/useThemeColors';

const MOCK_PROMOTIONS = [
	{
		id: '1',
		title: 'Primeira Viagem',
		description: 'Até 500 Kz de desconto na sua primeira corrida',
		code: 'FLASH2026',
		discount: '500 Kz',
		expiry: '30 Jun 2026',
		active: true,
		type: 'ride',
	},
	{
		id: '2',
		title: 'Entrega 10',
		description: 'Envie encomendas com 10% de desconto',
		code: 'ENTREGA10',
		discount: '10%',
		expiry: '15 Mai 2026',
		active: true,
		type: 'delivery',
	},
	{
		id: '3',
		title: '20% Off Sexta',
		description: 'Desconto toda sexta-feira nas corridas',
		code: 'SEXTA20',
		discount: '20%',
		expiry: '31 Dez 2026',
		active: true,
		type: 'ride',
	},
	{
		id: '4',
		title: 'Bem-vindo!',
		description: '300 Kz de bônus para novos usuários',
		code: 'BEMVINDO',
		discount: '300 Kz',
		expiry: '01 Jan 2026',
		active: false,
		type: 'ride',
	},
];

export default function PromotionsScreen() {
	const navigation = useNavigation();
	const { themeColors, isDark } = useThemeColors();
	const [showExpired, setShowExpired] = useState(false);
	const [activeFilter, setActiveFilter] = useState<
		'all' | 'ride' | 'delivery'
	>('all');

	const filters = [
		{ id: 'all', label: 'Todos', icon: 'layers-outline' },
		{ id: 'ride', label: 'Corridas', icon: 'car-outline' },
		{ id: 'delivery', label: 'Entregas', icon: 'cube-outline' },
	];

	const cardBgStyle = {
		backgroundColor: isDark ? '#1A1A1A' : '#FFFFFF',
	};

	const filteredPromos = MOCK_PROMOTIONS.filter((p) => {
		if (activeFilter === 'all') return true;
		return p.type === activeFilter;
	});

	const activePromos = filteredPromos.filter((p) => p.active);
	const expiredPromos = filteredPromos.filter((p) => !p.active);

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
					Promoções
				</Text>
				<View style={styles.placeholder} />
			</View>

			<View>
				<ScrollView
					horizontal
					showsHorizontalScrollIndicator={false}
					contentContainerStyle={styles.filterContainer}
				>
					{filters.map((filter) => {
						const isActive = activeFilter === filter.id;
						return (
							<TouchableOpacity
								key={filter.id}
								onPress={() =>
									setActiveFilter(
										filter.id as
											| 'all'
											| 'ride'
											| 'delivery',
									)
								}
								style={[
									styles.filterPill,
									isActive
										? {
												backgroundColor:
													themeColors.primary,
											}
										: // eslint-disable-next-line react-native/no-inline-styles
											{
												backgroundColor: isDark
													? '#1A1A1A'
													: '#FFFFFF',
												borderWidth: 1,
												borderColor: themeColors.border,
											},
								]}
								activeOpacity={0.7}
							>
								<Ionicons
									name={filter.icon as any}
									size={18}
									color={
										isActive
											? '#000'
											: themeColors.text + '80'
									}
								/>
								<Text
									style={[
										styles.filterLabel,
										// eslint-disable-next-line react-native/no-inline-styles
										{
											color: isActive
												? '#000'
												: themeColors.text,
										},
									]}
								>
									{filter.label}
								</Text>
							</TouchableOpacity>
						);
					})}
				</ScrollView>
			</View>

			<ScrollView
				contentContainerStyle={styles.scrollContent}
				showsVerticalScrollIndicator={false}
			>
				{/* Active Promos */}
				<Text
					style={[styles.sectionTitle, { color: themeColors.text }]}
				>
					Ativas ({activePromos.length})
				</Text>

				{activePromos.map((promo, index) => (
					<Animated.View
						key={promo.id}
						entering={FadeInRight.duration(500).delay(index * 100)}
					>
						<View style={[styles.promoCard, cardBgStyle]}>
							<View style={styles.promoAccent} />
							<View style={styles.promoContent}>
								<View style={styles.promoHeader}>
									<View style={styles.typeBadge}>
										<Ionicons
											name={
												promo.type === 'ride'
													? 'car'
													: 'cube'
											}
											size={16}
											color={themeColors.primary}
										/>
										<Text
											style={[
												styles.typeText,
												{ color: themeColors.text },
											]}
										>
											{promo.type === 'ride'
												? 'Corrida'
												: 'Entrega'}
										</Text>
									</View>
									<TouchableOpacity
										style={[
											styles.copyButton,
											{
												backgroundColor:
													themeColors.primary + '15',
											},
										]}
										activeOpacity={0.6}
									>
										<Ionicons
											name="copy-outline"
											size={18}
											color={themeColors.primary}
										/>
									</TouchableOpacity>
								</View>

								<View style={styles.promoMain}>
									<View
										style={[
											styles.discountBadge,
											{
												backgroundColor:
													themeColors.primary,
											},
										]}
									>
										<Text style={styles.discountText}>
											{promo.discount}
										</Text>
									</View>
									<View style={styles.titleContainer}>
										<Text
											style={[
												styles.promoTitle,
												{ color: themeColors.text },
											]}
										>
											{promo.title}
										</Text>
										<Text
											numberOfLines={2}
											style={[
												styles.promoDesc,
												{
													color:
														themeColors.text + '99',
												},
											]}
										>
											{promo.description}
										</Text>
									</View>
								</View>
								<View style={styles.promoFooter}>
									<View
										style={[
											styles.codeContainer,
											{
												backgroundColor:
													themeColors.primary + '15',
											},
										]}
									>
										<Text
											style={[
												styles.codeText,
												{ color: themeColors.primary },
											]}
										>
											{promo.code}
										</Text>
									</View>
									<Text
										style={[
											styles.expiryText,
											{ color: themeColors.secondary },
										]}
									>
										Expira: {promo.expiry}
									</Text>
								</View>
							</View>
						</View>
					</Animated.View>
				))}

				{activePromos.length === 0 && (
					<View style={styles.emptyState}>
						<Ionicons
							name="ticket-outline"
							size={64}
							color={themeColors.border}
						/>
						<Text
							style={[
								styles.emptyText,
								{ color: themeColors.text + '80' },
							]}
						>
							Nenhuma promoção ativa para esta categoria
						</Text>
					</View>
				)}

				{/* Expired Toggle */}
				{expiredPromos.length > 0 && (
					<TouchableOpacity
						style={styles.expiredToggle}
						onPress={() => setShowExpired(!showExpired)}
						activeOpacity={0.6}
					>
						<Text
							style={[
								styles.expiredToggleText,
								{ color: themeColors.primary },
							]}
						>
							{showExpired ? 'Ocultar' : 'Ver'} promocões
							expiradas ({expiredPromos.length})
						</Text>
						<Ionicons
							name={showExpired ? 'chevron-up' : 'chevron-down'}
							size={20}
							color={themeColors.primary}
						/>
					</TouchableOpacity>
				)}

				{/* Expired Promos */}
				{showExpired &&
					expiredPromos.map((promo, index) => (
						<Animated.View
							key={promo.id}
							entering={FadeInRight.duration(500).delay(
								index * 100,
							)}
						>
							<View
								style={[
									styles.promoCard,
									styles.expiredCard,
									cardBgStyle,
								]}
							>
								<View style={styles.promoContent}>
									<Text
										style={[
											styles.promoTitle,
											styles.expiredTitle,
											{ color: themeColors.secondary },
										]}
									>
										{promo.title}
									</Text>
									<Text
										style={[
											styles.promoDesc,
											{ color: themeColors.secondary },
										]}
									>
										{promo.code} · Expirou em {promo.expiry}
									</Text>
								</View>
							</View>
						</Animated.View>
					))}
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
		paddingHorizontal: 20,
		paddingBottom: 40,
		paddingTop: 10,
	},
	filterContainer: {
		paddingHorizontal: 20,
		paddingVertical: 16,
		gap: 10,
	},
	filterPill: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingHorizontal: 16,
		paddingVertical: 10,
		borderRadius: 25,
		gap: 8,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.05,
		shadowRadius: 4,
		elevation: 2,
	},
	filterLabel: {
		fontSize: 14,
		fontWeight: '700',
	},
	sectionTitle: {
		fontSize: 18,
		fontWeight: '800',
		marginBottom: 16,
		marginTop: 10,
	},
	promoCard: {
		borderRadius: 24,
		marginBottom: 16,
		overflow: 'hidden',
		elevation: 4,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 6 },
		shadowOpacity: 0.08,
		shadowRadius: 12,
	},
	promoAccent: {
		position: 'absolute',
		left: 0,
		top: 0,
		bottom: 0,
		width: 5,
		backgroundColor: '#FFD700',
	},
	promoContent: {
		padding: 20,
	},
	promoHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: 16,
	},
	typeBadge: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 6,
		backgroundColor: 'rgba(128, 128, 128, 0.1)',
		paddingHorizontal: 10,
		paddingVertical: 5,
		borderRadius: 8,
	},
	typeText: {
		fontSize: 12,
		fontWeight: '700',
		textTransform: 'uppercase',
		letterSpacing: 0.5,
	},
	promoMain: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 16,
		marginBottom: 20,
	},
	discountBadge: {
		width: 65,
		height: 65,
		borderRadius: 18,
		justifyContent: 'center',
		alignItems: 'center',
		shadowColor: '#FFD700',
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.3,
		shadowRadius: 8,
		elevation: 5,
	},
	discountText: {
		color: '#000',
		fontSize: 15,
		fontWeight: '900',
		textAlign: 'center',
	},
	titleContainer: {
		flex: 1,
	},
	copyButton: {
		width: 36,
		height: 36,
		borderRadius: 12,
		justifyContent: 'center',
		alignItems: 'center',
	},
	promoTitle: {
		fontSize: 18,
		fontWeight: '900',
		marginBottom: 4,
		letterSpacing: -0.3,
	},
	promoDesc: {
		fontSize: 13,
		lineHeight: 18,
		fontWeight: '500',
	},
	promoFooter: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingTop: 16,
		borderTopWidth: StyleSheet.hairlineWidth,
		borderTopColor: 'rgba(128, 128, 128, 0.2)',
	},
	codeContainer: {
		paddingHorizontal: 12,
		paddingVertical: 8,
		borderRadius: 10,
		borderStyle: 'dashed',
		borderWidth: 1.5,
		borderColor: '#FFD700',
	},
	codeText: {
		fontSize: 13,
		fontWeight: '900',
		letterSpacing: 1.5,
	},
	expiryText: {
		fontSize: 12,
		fontWeight: '600',
		opacity: 0.6,
	},
	expiredToggle: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		paddingVertical: 24,
		gap: 8,
	},
	expiredToggleText: {
		fontSize: 14,
		fontWeight: '700',
	},
	expiredCard: {
		opacity: 0.6,
	},
	expiredTitle: {
		textDecorationLine: 'line-through',
	},
	emptyState: {
		alignItems: 'center',
		justifyContent: 'center',
		paddingVertical: 60,
		gap: 16,
	},
	emptyText: {
		fontSize: 15,
		fontWeight: '500',
		textAlign: 'center',
	},
});
