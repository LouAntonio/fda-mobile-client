import { api } from '../lib/api';

export interface Promotion {
	id: string;
	code: string;
	description: string | null;
	discountType: 'PERCENTAGE' | 'FIXED';
	discountValue: number;
	maxDiscount: number | null;
	minTripAmount: number | null;
	startsAt: string | null;
	expiresAt: string | null;
	isActive: boolean;
}

export async function fetchActivePromotions(): Promise<Promotion[]> {
	const { data } = await api.get('/coupons/active');
	return data as Promotion[];
}
