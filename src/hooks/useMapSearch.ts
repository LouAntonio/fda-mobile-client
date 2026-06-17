import { useState, useEffect, useRef } from 'react';
import { geocodeForward } from '../services/map';
import type { MapboxFeature } from '../types/api';

export function useMapSearch() {
	const [query, setQuery] = useState('');
	const [results, setResults] = useState<MapboxFeature[]>([]);
	const [isSearching, setIsSearching] = useState(false);
	const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	useEffect(() => {
		if (timerRef.current) {
			clearTimeout(timerRef.current);
		}

		if (!query.trim()) {
			setResults([]);
			setIsSearching(false);
			return;
		}

		setIsSearching(true);

		timerRef.current = setTimeout(async () => {
			try {
				const features = await geocodeForward(query);
				setResults(features);
			} catch {
				setResults([]);
			} finally {
				setIsSearching(false);
			}
		}, 400);

		return () => {
			if (timerRef.current) {
				clearTimeout(timerRef.current);
			}
		};
	}, [query]);

	return {
		query,
		setQuery,
		results,
		isSearching,
		clearResults: () => {
			setResults([]);
			setQuery('');
		},
	};
}
