import { z } from "zod";
import type { ContentValidationService } from "../services/contentValidationService.js";
import type { ContentType, SocialPlatform } from "../textUtils.js";

export const validateContentBeforeFoldToolDefinition = {
	title: "Validate Content Before Fold",
	description:
		"Check if content meets the before-fold character and line limits for each social media platform",
	inputSchema: {
		text: z.string().describe("The text content to validate"),
		platform: z
			.enum([
				"twitter",
				"instagram",
				"facebook",
				"tiktok",
				"linkedin",
				"youtube",
			])
			.describe("Social media platform"),
		contentType: z
			.enum(["title", "description", "post"])
			.optional()
			.default("post")
			.describe(
				"Content type (only relevant for YouTube: 'title' or 'description')",
			),
	},
};

export const validateContentBeforeFoldHandler =
	(contentValidationService: ContentValidationService) =>
	async ({
		text,
		platform,
		contentType = "post",
	}: {
		text: string;
		platform: SocialPlatform;
		contentType?: ContentType;
	}) => {
		try {
			const validationResult =
				contentValidationService.validateContentBeforeFold(
					text,
					platform,
					contentType,
				);
			const responseText = contentValidationService.formatValidationResult(
				validationResult,
				platform,
				contentType,
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
						text: `Error validating content: ${error instanceof Error ? error.message : "Unknown error"}`,
					},
				],
				isError: true,
			};
		}
	};
