import type { ContentType, SocialPlatform } from "../textUtils.js";

export class TruncatedTextFormatter {
	/**
	 * Format the result of text truncation for before-fold limits
	 */
	formatTruncatedText(
		truncatedText: string,
		platform: SocialPlatform,
		contentType: ContentType = "post",
	): string {
		const platformName = platform.charAt(0).toUpperCase() + platform.slice(1);
		const contentTypeLabel = contentType !== "post" ? ` (${contentType})` : "";

		return `**Truncated Text for ${platformName}${contentTypeLabel}:**\n\n${truncatedText}\n\n**Character Count:** ${truncatedText.length} characters`;
	}
}
