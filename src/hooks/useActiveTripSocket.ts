import { useEffect, useRef, useCallback } from 'react';
import { useAuthStore } from '../store/authStore';
import {
	connectSocket,
	disconnectSocket,
	joinTripRoom,
	leaveTripRoom,
	getSocket,
} from '../lib/socket';
import { useQueryClient } from '@tanstack/react-query';
import { tripKeys } from '../lib/queryKeys';

interface UseActiveTripSocketOptions {
	tripId: string | undefined;
	enabled?: boolean;
}

export function useActiveTripSocket({
	tripId,
	enabled = true,
}: UseActiveTripSocketOptions) {
	const accessToken = useAuthStore((state) => state.accessToken);
	const queryClient = useQueryClient();
	const isConnected = useRef(false);

	const connect = useCallback(() => {
		if (!accessToken || isConnected.current) return;
		connectSocket(accessToken);
		isConnected.current = true;
	}, [accessToken]);

	const disconnect = useCallback(() => {
		disconnectSocket();
		isConnected.current = false;
	}, []);

	useEffect(() => {
		if (!enabled || !tripId || !accessToken) return;

		connect();
		const socket = getSocket();
		if (!socket) return;

		joinTripRoom(tripId);

		const handleStatus = () => {
			queryClient.invalidateQueries({ queryKey: tripKeys.detail(tripId) });
		};

		const handleDriverAssigned = () => {
			queryClient.invalidateQueries({ queryKey: tripKeys.detail(tripId) });
		};

		const handleLocation = () => {
			queryClient.invalidateQueries({ queryKey: tripKeys.detail(tripId) });
		};

		const handleDeliveryStatus = () => {
			queryClient.invalidateQueries({ queryKey: tripKeys.detail(tripId) });
		};

		const handlePaymentUpdate = () => {
			queryClient.invalidateQueries({ queryKey: tripKeys.detail(tripId) });
		};

		socket.on('trip:status', handleStatus);
		socket.on('trip:driver_assigned', handleDriverAssigned);
		socket.on('trip:location', handleLocation);
		socket.on('trip:delivery_status', handleDeliveryStatus);
		socket.on('trip:payment_update', handlePaymentUpdate);

		return () => {
			leaveTripRoom(tripId);
			socket.off('trip:status', handleStatus);
			socket.off('trip:driver_assigned', handleDriverAssigned);
			socket.off('trip:location', handleLocation);
			socket.off('trip:delivery_status', handleDeliveryStatus);
			socket.off('trip:payment_update', handlePaymentUpdate);
			disconnect();
		};
	}, [tripId, enabled, accessToken, connect, disconnect, queryClient]);

	return { connect, disconnect };
}
