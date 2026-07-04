import React from 'react';
import { View } from 'react-native';
import { SkeletonBox } from './SkeletonBox';

export function ProfileHeaderSkeleton() {
	return (
		<View className="bg-white dark:bg-soft-black rounded-3xl overflow-hidden"
			style={{
				elevation: 4,
				shadowColor: '#000',
				shadowOffset: { width: 0, height: 4 },
				shadowOpacity: 0.1,
				shadowRadius: 12,
			}}
		>
			<SkeletonBox height={80} borderRadius={0} />
			<View className="items-center px-5 pb-6 -mt-12">
				<SkeletonBox width={96} height={96} borderRadius={48} style={{ borderWidth: 4, borderColor: '#FFF' }} />
				<SkeletonBox width={140} height={24} borderRadius={6} style={{ marginTop: 16 }} />
				<View className="items-center mt-3 gap-2">
					<SkeletonBox width={160} height={14} borderRadius={6} />
					<SkeletonBox width={180} height={14} borderRadius={6} />
				</View>
				<SkeletonBox width={120} height={36} borderRadius={18} style={{ marginTop: 20 }} />
			</View>
		</View>
	);
}
