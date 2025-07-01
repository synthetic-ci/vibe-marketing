import { z } from "zod";
import type { TruncatedTextFormatter } from "../formatters/textFormatter.js";
import {
	type ContentType,
	getTextBeforeFold,
	type SocialPlatform,
} from "../textUtils.js";

export const getTextBeforeFoldToolDefinition = {
	title: "Get Text Before Fold",
	description:
		"Truncate text to fit within the 'before fold' character limits for each social media platform for previewing purposes",
	inputSchema: {
		text: z.string().describe("The text content to truncate"),
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

export const getTextBeforeFoldHandler =
	(truncatedTextFormatter: TruncatedTextFormatter) =>
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
			const truncatedText = getTextBeforeFold(text, platform, contentType);

			const responseText = truncatedTextFormatter.formatTruncatedText(
				truncatedText,
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
						text: `Error truncating text: ${error instanceof Error ? error.message : "Unknown error"}`,
					},
				],
				isError: true,
			};
		}
	};
