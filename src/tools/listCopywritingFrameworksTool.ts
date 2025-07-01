import { z } from "zod";
import type { CopywritingService } from "../services/copywritingService.js";

export const listCopywritingFrameworksToolDefinition = {
	title: "List Copywriting Frameworks",
	description:
		"Get a list of available copywriting frameworks and their descriptions for a specific social media network",
	inputSchema: {
		network: z
			.string()
			.describe(
				"Social media network (twitter, instagram, linkedin, tiktok, youtube, facebook)",
			),
	},
};

export const listCopywritingFrameworksHandler =
	(copywritingService: CopywritingService) =>
	async ({ network }: { network: string }) => {
		try {
			const responseText = copywritingService.formatFrameworksList(network);

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
						text: `Error reading copywriting frameworks: ${error instanceof Error ? error.message : "Unknown error"}`,
					},
				],
				isError: true,
			};
		}
	};
