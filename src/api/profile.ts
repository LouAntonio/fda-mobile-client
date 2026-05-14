import { api } from '../lib/api';
import type { User } from '../store/authStore';

export interface TripFromApi {
	id: string;
	status: string;
	serviceType: string;
	pickupAddress: string;
	dropoffAddress: string;
	actualDistanceKm: number | null;
	actualDurationMin: number | null;
	totalPrice: number;
	paymentMethod: string;
	paymentStatus: string;
	requestedAt: string;
	completedAt: string | null;
	cancelledAt: string | null;
}

export interface ProfileStats {
	totalTrips: number;
	totalDistanceKm: number;
	totalDurationMin: number;
	totalSpent: number;
}

export interface ProfileResponse {
	user: User;
	stats: ProfileStats;
}

export interface TripsResponse {
	trips: TripFromApi[];
	total: number;
	page: number;
	limit: number;
}

export async function fetchProfile(): Promise<ProfileResponse> {
	const { data } = await api.get('/profile');
	return data;
}

export async function fetchTrips(page = 1, limit = 10): Promise<TripsResponse> {
	const { data } = await api.get('/profile/trips', {
		params: { page, limit },
	});
	return data;
}
