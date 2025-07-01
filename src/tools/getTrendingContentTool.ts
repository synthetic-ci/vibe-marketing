import { z } from "zod";
import type { TrendingContentFormatter } from "../formatters/trendingContentFormatter.js";
import type { TrendingContentService } from "../services/trendingContentService.js";

export const getTrendingContentToolDefinition = {
	title: "Get Trending Social Content",
	description: "Fetch trending social media content from the HyperFeed API",
	inputSchema: {
		networks: z
			.string()
			.optional()
			.default("twitter")
			.describe(
				"Social media networks to get trending content from (e.g., 'twitter' and 'reddit')",
			),
		limit: z
			.number()
			.optional()
			.describe("Maximum number of trending items to return"),
	},
};

export const getTrendingContentHandler =
	(
		trendingContentService: TrendingContentService,
		trendingContentFormatter: TrendingContentFormatter,
	) =>
	async ({
		networks = "twitter",
		limit,
	}: {
		networks?: string;
		limit?: number;
	}) => {
		try {
			// Fetch trending content using the service
			const data = await trendingContentService.fetchTrendingContent({
				networks,
				limit,
			});

			// Format the response using the formatter service
			const responseText =
				trendingContentFormatter.formatTrendingResponse(data);

			return {
				content: [
					{
						type: "text" as const,
						text: responseText,
					},
				],
			};
		} catch (error) {
			return {
				content: [
					{
						type: "text" as const,
						text: `Error fetching trending content: ${error instanceof Error ? error.message : "Unknown error"}`,
					},
				],
				isError: true,
			};
		}
	};
