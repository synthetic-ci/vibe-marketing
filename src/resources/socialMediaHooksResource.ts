import type { HookData } from "../types/hooks.js";

export function createSocialMediaHooksResource(hooksData: HookData) {
	return {
		uri: "vibe://hooks/social-media-hooks",
		metadata: {
			title: "Social Media Hooks",
			description:
				"Comprehensive collection of hooks for various social media platforms organized by network and category",
			mimeType: "application/x-yaml",
		},
		handler: async (uri: URL) => {
			// Reconstruct the YAML content from the loaded data
			let yamlContent = "networks:\n";

			// Add networks
			for (const [networkKey, network] of Object.entries(hooksData.networks)) {
				yamlContent += `  ${networkKey}:\n`;
				yamlContent += `    name: "${network.name}"\n`;
				yamlContent += `    categories:\n`;

				// Add categories for each network
				for (const [categoryKey, category] of Object.entries(
					network.categories,
				)) {
					yamlContent += `      ${categoryKey}:\n`;
					yamlContent += `        name: "${category.name}"\n`;
					yamlContent += `        hooks:\n`;

					// Add hooks
					for (const hook of category.hooks) {
						yamlContent += `          - "${hook}"\n`;
					}
				}
			}

			// Add global categories
			yamlContent += "\ncategories:\n";
			yamlContent += "  global:\n";
			for (const [categoryKey, category] of Object.entries(
				hooksData.categories.global,
			)) {
				yamlContent += `    ${categoryKey}:\n`;
				yamlContent += `      description: "${category.description}"\n`;
				yamlContent += `      keywords: [${category.keywords.map((k: string) => `"${k}"`).join(", ")}]\n`;
			}

			// Add usage tips
			yamlContent += "\nusage_tips:\n";
			for (const [tipKey, tipValue] of Object.entries(hooksData.usage_tips)) {
				yamlContent += `  ${tipKey}: "${tipValue}"\n`;
			}

			return {
				contents: [
					{
						uri: uri.href,
						text: yamlContent,
					},
				],
			};
		},
	};
}
