import type { TrendingResponse } from "../types/trending.js";

export interface TrendingContentOptions {
	networks?: string;
	limit?: number;
}

export class TrendingContentService {
	private readonly baseUrl = "https://hyperfeeds.xyz/api/trending";

	/**
	 * Fetch trending content from the HyperFeed API
	 */
	async fetchTrendingContent(
		options: TrendingContentOptions = {},
	): Promise<TrendingResponse> {
		const { networks = "twitter", limit } = options;

		// Build the API URL
		let apiUrl = `${this.baseUrl}?networks=${encodeURIComponent(networks)}`;
		if (limit) {
			apiUrl += `&limit=${limit}`;
		}

		// Make the API request
		const response = await fetch(apiUrl);

		if (!response.ok) {
			throw new Error(
				`Failed to fetch trending content: ${response.status} ${response.statusText}`,
			);
		}

		return (await response.json()) as TrendingResponse;
	}
}
