import { api } from '../lib/api';

export interface ValidateCouponPayload {
	code: string;
	tripAmount: number;
}

export interface CouponValidationResult {
	valid: boolean;
	discountAmount?: number;
	discountType?: 'PERCENTAGE' | 'FIXED_AMOUNT';
	discountValue?: number;
	couponId?: string;
	reason?: string;
}

export async function validateCoupon(payload: ValidateCouponPayload): Promise<CouponValidationResult> {
	const { data } = await api.post('/coupons/validate', payload);
	return data as CouponValidationResult;
}
