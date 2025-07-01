import { completable } from "@modelcontextprotocol/sdk/server/completable.js";
import { z } from "zod";
import type { HookData } from "../types/hooks.js";

export function findSocialMediaHooksPrompt(hooksData: HookData) {
	return {
		name: "find-social-media-hooks",
		definition: {
			title: "Find Social Media Hooks",
			description:
				"Guide for finding effective social media hooks by network and category",
			argsSchema: {
				network: completable(z.string(), (value = "") => {
					// Get available networks from hooksData
					const networks = Object.keys(hooksData.networks);
					return networks.filter((n) =>
						n.toLowerCase().startsWith(value.toLowerCase()),
					);
				}),
				category: completable(z.string(), (value = "", context) => {
					// Get categories based on selected network
					const selectedNetwork = context?.arguments?.network;
					let categories: string[] = [];

					// Add global categories
					if (hooksData.categories?.global) {
						categories = Object.keys(hooksData.categories.global);
					}

					// If a network is selected, add network-specific categories
					if (selectedNetwork && hooksData.networks[selectedNetwork]) {
						const networkCategories = Object.keys(
							hooksData.networks[selectedNetwork].categories,
						);
						// Merge and deduplicate categories
						categories = [...new Set([...categories, ...networkCategories])];
					}

					// Filter based on user input
					return categories.filter((c) =>
						c.toLowerCase().startsWith(value.toLowerCase()),
					);
				}),
				context: z.string(),
			},
		},
		handler: ({
			network,
			category,
			context,
		}: {
			network: string;
			category: string;
			context: string;
		}) => ({
			messages: [
				{
					role: "user" as const,
					content: {
						type: "text" as const,
						text: `I need help finding effective social media hooks${network ? ` for ${network}` : ""}${category ? ` in the ${category} category` : ""}.

${context ? `Context: ${context}\n` : ""}
Please use the find-hooks tool to search for relevant hooks${network || category ? " with these parameters:" : "."} ${network ? `network="${network}"` : ""} ${category ? `category="${category}"` : ""}

Consider:

1. **Network-specific hooks**: Different platforms have different engagement patterns
   - Twitter: Brief, punchy hooks that encourage retweets
   - Instagram: Visual-first hooks that stop the scroll
   - LinkedIn: Professional, value-driven hooks
   - TikTok: Trendy, attention-grabbing hooks
   - YouTube: Curiosity-driven hooks for video content

2. **Category considerations**:
   - Engagement: Focus on interaction and community
   - Educational: Lead with value and learning
   - Promotional: Balance selling with value
   - Storytelling: Create emotional connections

3. **Best practices**:
   - Start with the most compelling part
   - Use pattern interrupts
   - Create curiosity gaps
   - Promise clear value
   - Match the platform's tone

Please find hooks that match these criteria and explain how to adapt them for maximum impact.`,
					},
				},
			],
		}),
	};
}
