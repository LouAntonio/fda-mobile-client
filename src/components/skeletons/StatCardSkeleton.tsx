import React from 'react';
import { View } from 'react-native';
import { SkeletonBox } from './SkeletonBox';

export function StatCardSkeleton() {
	return (
		<View className="bg-white dark:bg-soft-black rounded-2xl p-4 m-1"
			style={{
				elevation: 3,
				shadowColor: '#000',
				shadowOffset: { width: 0, height: 2 },
				shadowOpacity: 0.06,
				shadowRadius: 8,
				borderWidth: 1,
				borderColor: 'rgba(0,0,0,0.04)',
			}}
		>
			<SkeletonBox width={48} height={48} borderRadius={16} />
			<SkeletonBox width={60} height={24} borderRadius={6} style={{ marginTop: 12 }} />
			<SkeletonBox width={40} height={12} borderRadius={6} style={{ marginTop: 8 }} />
		</View>
	);
}

export function StatCardGridSkeleton() {
	return (
		<View className="flex-row flex-wrap justify-between -mx-1">
			<View className="w-[48%]">
				<StatCardSkeleton />
			</View>
			<View className="w-[48%]">
				<StatCardSkeleton />
			</View>
			<View className="w-[48%]">
				<StatCardSkeleton />
			</View>
			<View className="w-[48%]">
				<StatCardSkeleton />
			</View>
		</View>
	);
}
