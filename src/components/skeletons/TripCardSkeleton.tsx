import React from 'react';
import { View } from 'react-native';
import { SkeletonBox } from './SkeletonBox';

export function TripCardSkeleton() {
	return (
		<View className="flex-row items-center bg-white dark:bg-soft-black rounded-2xl p-4 mb-3"
			style={{
				elevation: 2,
				shadowColor: '#000',
				shadowOffset: { width: 0, height: 2 },
				shadowOpacity: 0.05,
				shadowRadius: 8,
				borderWidth: 1,
				borderColor: 'rgba(0,0,0,0.04)',
			}}
		>
			<SkeletonBox width={44} height={44} borderRadius={14} style={{ marginRight: 14 }} />
			<View className="flex-1 mr-3">
				<View className="flex-row items-center gap-1.5">
					<SkeletonBox width="35%" height={16} borderRadius={6} />
					<SkeletonBox width={12} height={12} borderRadius={6} />
					<SkeletonBox width="35%" height={16} borderRadius={6} />
				</View>
				<SkeletonBox width="50%" height={12} borderRadius={6} style={{ marginTop: 8 }} />
			</View>
			<View className="items-end gap-2">
				<SkeletonBox width={60} height={18} borderRadius={6} />
				<SkeletonBox width={50} height={22} borderRadius={10} />
			</View>
		</View>
	);
}
