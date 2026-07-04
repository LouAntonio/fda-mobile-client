import React from 'react';
import { View } from 'react-native';
import { SkeletonBox } from './SkeletonBox';

export function AddressSkeleton() {
	return (
		<View className="flex-row items-center mb-5">
			<SkeletonBox width={52} height={52} borderRadius={18} style={{ marginRight: 16 }} />
			<View className="flex-1 gap-1.5">
				<SkeletonBox width="40%" height={16} borderRadius={6} />
				<SkeletonBox width="70%" height={14} borderRadius={6} />
			</View>
			<SkeletonBox width={20} height={20} borderRadius={10} />
		</View>
	);
}

export function AddressListSkeleton() {
	return (
		<View className="mt-4">
			<AddressSkeleton />
			<AddressSkeleton />
			<AddressSkeleton />
			<AddressSkeleton />
		</View>
	);
}
