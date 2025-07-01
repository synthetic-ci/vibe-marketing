import { z } from "zod";
import type { HookSearchService } from "../services/hookSearchService.js";

export const findHooksToolDefinition = {
	title: "Find Social Media Hooks",
	description: "Find social media hooks by network and/or category",
	inputSchema: {
		network: z
			.string()
			.optional()
			.describe(
				"Social media network (twitter, instagram, linkedin, tiktok, youtube)",
			),
		category: z
			.string()
			.optional()
			.describe(
				"Hook category (engagement, educational, promotional, storytelling, etc.)",
			),
		limit: z
			.number()
			.optional()
			.default(10)
			.describe("Maximum number of hooks to return"),
	},
};

export const findHooksHandler =
	(hookSearchService: HookSearchService) =>
	async ({
		network,
		category,
		limit = 10,
	}: {
		network?: string;
		category?: string;
		limit?: number;
	}) => {
		try {
			const results = hookSearchService.searchHooks({
				network,
				category,
				limit,
			});
			const responseText = hookSearchService.formatResults(results);

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
						text: `Error reading hooks data: ${error instanceof Error ? error.message : "Unknown error"}`,
					},
				],
				isError: true,
			};
		}
	};
