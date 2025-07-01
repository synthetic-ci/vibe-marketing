import { z } from "zod";
import type { TrendingContentFormatter } from "../formatters/trendingContentFormatter.js";
import type { TrendingContentService } from "../services/trendingContentService.js";
import { validateHyperFeedApiKey } from "../utils/index.js";

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
		apiKey?: string,
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
				apiKey,
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

// Create a wrapper for the trending content handler that includes JWT validation
export const createValidatedTrendingContentHandler = (
	trendingContentService: TrendingContentService,
	trendingContentFormatter: TrendingContentFormatter,
	apiKey?: string,
) => {
	return async (request: unknown) => {
		console.log("get-trending-content tool called with request:", request);

		if (!apiKey) {
			console.log("No HyperFeed API key provided");
			throw new Error(
				"HyperFeed API key is required to use the get-trending-content tool. " +
					"Please create an API key at https://app.hyperfeed.ai and update your Smithery profile with the newly created API key.",
			);
		}

		console.log("Validating API key...");
		const isValidKey = await validateHyperFeedApiKey(apiKey);
		if (!isValidKey) {
			console.error("JWT validation failed - throwing error");
			throw new Error(
				"The provided API key is invalid. " +
					"Please create an API key at https://app.hyperfeed.ai and update your Smithery profile with the newly created API key.",
			);
		}

		console.log("JWT validation successful - calling original handler");
		return getTrendingContentHandler(
			trendingContentService,
			trendingContentFormatter,
			apiKey,
		)(request as { networks?: string; limit?: number });
	};
};
