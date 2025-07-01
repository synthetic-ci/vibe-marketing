import type { HookData } from "@lib-types/hooks.js";
import { z } from "zod";
import type { NetworkFormatter } from "../formatters/networkFormatter.js";

export const getNetworkCategoriesToolDefinition = {
	title: "Get Network Categories",
	description:
		"Get all available categories for a specific social media network",
	inputSchema: {
		network: z
			.string()
			.describe(
				"Social media network name (twitter, instagram, linkedin, tiktok, youtube)",
			),
	},
};

export const getNetworkCategoriesHandler =
	(hooksData: HookData, networkFormatter: NetworkFormatter) =>
	async ({ network }: { network: string }) => {
		try {
			const networkKey = network.toLowerCase();
			const networkData = hooksData.networks[networkKey];

			if (!networkData) {
				const availableNetworks = Object.keys(hooksData.networks).join(", ");
				return {
					content: [
						{
							type: "text" as const,
							text: `Network "${network}" not found. Available networks: ${availableNetworks}`,
						},
					],
					isError: true,
				};
			}

			const categories = Object.entries(networkData.categories).map(
				([key, category]) => ({
					key,
					name: category.name,
					hookCount: category.hooks.length,
				}),
			);

			const responseText = networkFormatter.formatNetworkCategories(
				networkData.name,
				categories,
			);

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
						text: `Error reading network categories: ${error instanceof Error ? error.message : "Unknown error"}`,
					},
				],
				isError: true,
			};
		}
	};
